from flask_restful import Resource, reqparse
from flask import request
from .models import User, SubscriptionPlan, UserSubscription, Activity, Friend
from .extensions import db
import gpxpy

# Reteives gpx data as string
class GetGpxString(Resource):
    def post(self):
        # Validate input
        parser = reqparse.RequestParser()
        parser.add_argument('userID', type=str, required=True, help='User id is required')
        parser.add_argument('activityIDs', action='append', type=int, required=True, help='Activity id is required')

        data = parser.parse_args()

        activities_data = []
        ids = []

        for activity_id in data['activityIDs']:
            ids.append(activity_id)
            # Retrieve activity by ID
            activity = Activity.query.filter_by(user_id=data["userID"], id=activity_id).first()
            if activity is None:
                activities_data.append({"error" : True, "activityID": activity_id, "gpxData" : ""})
                continue


            activities_data.append({
                "error" : False,
                "activityID": activity_id,
                "gpxData": activity.gpx_data
            })

        return {"message": "Success", "gpxData": activities_data}
    

#Load GPX API
# !!!!!!
class GetActivity(Resource):
    def post(self):
        # Validate input
        parser = reqparse.RequestParser()
        parser.add_argument('userID', type=str, required=True, help='User id is required')
        parser.add_argument('activityID', type=int, required=True, help='Activity id is required')
        data = parser.parse_args()

        # Retrieve activity id of the selected track
        activity = Activity.query.filter_by(id=data["activityID"]).first()

        if activity is None:
            return { "message": "Activity not found", "activity" : {} }, 404
        
        owner = User.query.filter_by(id=activity.user_id).first()
        user = User.query.filter_by(id=data["userID"]).first()

        if user is None or owner is None:
            return { "message": "Activity not found", "activity" : {} }, 404
        
        # Check if the owner is a friend and the activity is public
        if not (activity.user_id == user.id or (owner.check_friendship(user) and activity.public)):
            return { "message": "Activity not found", "activity" : {} }, 404

        ######## PROCESS GPX HERE ###########
        # The only thing i can think of rn is points
        return_data = {
            "activityType" : "run", # Not used currently
            "activityName" : activity.activity_name,
            "createDate"   : None if activity.creation_date is None else activity.creation_date.isoformat(),
            "public"       : activity.public,
            "startTime"    : None if activity.start_time is None else activity.start_time.isoformat(),
            "duration"     : activity.duration,
            "distance"     : activity.distance,

            "route" : {
                "waypoints" : [],
                "tracks" : []
            }
        }

        # Parse gpx
        gpx = gpxpy.parse(activity.gpx_data)

        # Process waypoints for each route
        for waypoint in gpx.waypoints:
            return_data["route"]["waypoints"].append({
                "name": waypoint.name,
                "lat" : waypoint.latitude,
                "lon" : waypoint.longitude
            })

        # Process tracks for each route
        i = 0
        for track in gpx.tracks:
            return_data["route"]["tracks"].append({
                "name"   : track.name,
                "points" : []
            })

            # Iterate over segments in the track
            # Just join the segments into 1
            # if it causes a problem later on we'll change it lol
            for segment in track.segments:
                # Iterate over points in the segment
                for point in segment.points:
                    point_data = {
                        "lat": point.latitude,
                        "lon": point.longitude,
                    }

                    if point.elevation is not None:
                        point_data["elev"] = point.elevation
                    if point.time is not None:
                        point_data["time"] = point.time.isoformat()

                    return_data["route"]["tracks"][i]["points"].append(point_data)
            i += 1

        # Return the map data
        return {"message": "Success", "activity" : return_data}, 200

class ActivityIds(Resource):
    def post(self):
        # validate input
        parser = reqparse.RequestParser()
        parser.add_argument('userID', type=str, required=True, help='Session id is required')
        data = parser.parse_args()

        activities = Activity.query.filter_by(user_id=data["userID"])
        ids = [i.id for i in activities]

        if ids is None:
            print("no ids are currently present")
        else:
            print("ids found!")
            print(ids)
            
        return {"message" : "Success", "activityIDs" : ids}

class Feed(Resource):
    def post(self):
        # validate input
        parser = reqparse.RequestParser()
        parser.add_argument('userID', type=str, required=True, help='Session id is required')
        data = parser.parse_args()

        # Jank time
        user_id = data["userID"]
        friends = set(f.friend_id for f in Friend.query.filter_by(user_id=user_id).all()).union(set(f.user_id for f in Friend.query.filter_by(friend_id=user_id).all()))
        activities = []
        for f in friends:
            friend = User.query.filter_by(id=f).first()
            if friend is None:
                pass


            i = Activity.query.filter_by(user_id=f, public=True).all()
            for b in i:
                activities.append({
                    "userID" : f,
                    "username" : friend.username,
                    "activityID" : b.id
                })
            
        return {"message" : "Success", "activityIDs" : activities}

#Get Upload GPX API
class UploadGPX(Resource):
    def post(self):
        print("Uploading GPX Data")
        parser = reqparse.RequestParser()
        parser.add_argument('userID', type=str, required=True, help='Session id is required')
        parser.add_argument('gpxData', type=str, required=True, help='GPX data is required')
        parser.add_argument('activityName', type=str, required=True, help='Activity name is required')
        parser.add_argument('public', type=bool, required=True, help='Public bool is required')
        data = parser.parse_args()

        gpx_data = data['gpxData']
        user_id = data["userID"]

        try:
            gpx = gpxpy.parse(gpx_data)
        except gpxpy.gpx.GPXException as e:
            return {"message": "Failed to parse GPX data"}, 400

        first_segment = None
        if gpx.tracks:
            if gpx.tracks[0].segments:
                first_segment = gpx.tracks[0].segments[0]
        start_time = first_segment.points[0].time
        end_time = first_segment.points[-1].time
        duration = (end_time - start_time).total_seconds() if start_time else 0.0
        distance = gpx.length_2d() if gpx.tracks else 0.0
        activity = Activity(activity_type="run", creation_date=start_time, 
                             public=data['public'], start_time=start_time, duration=duration, 
                             distance=distance, user_id=user_id, gpx_data=gpx_data,
                             activity_name = data["activityName"])
      
        db.session.add(activity)
      
        # route = Route(gpx_data=gpx_data, activity=activity)
        # db.session.add(route)
      
        db.session.commit()
        return {"message": "GPX uploaded successfully"}, 201
    
class RemoveActivity(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userID', type=str, required=True, help='User id is required')
        parser.add_argument('activityID', type=str, required=True, help='GPX data is required')
        data = parser.parse_args()

        # Find the activity
        activity = Activity.query.filter_by(user_id = data["userID"], id=data["activityID"]).first()
        if activity is None:
            return {"message" : "Activity not found"}, 404
        
        db.session.delete(activity)
        db.session.commit()
        return {"message" : "Success"}, 200
