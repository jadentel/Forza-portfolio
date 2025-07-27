from flask_restful import Resource, reqparse
from flask import request
from .models import User, Session, Friend, FriendRequest, UserSubscription
from .extensions import db
import re

# Get User ID API
class GetUserID(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('sessionID', required=True, help="Session ID is required")
        args = parser.parse_args()

        session = Session.query.filter_by(session_id=args['sessionID']).first()
        if session:
            return {"message": "Success", "userID": str(session.user_id)}, 200
        else:
            return {"message": "Session not found", "userID": ""}, 404
        
# Get User Info API
class UserInfo(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userID', required=True, help="User ID is required")
        data = parser.parse_args()

        user = User.query.filter_by(id=data['userID']).first()
        if not user:
            return {
                "message": "User not found",
                "user": {}
            }, 404

        # Get the user's subscription plan ID
        subscription = UserSubscription.query.filter_by(user_id=user.id).first()
        # Check if subcription is None
        if subscription is not None:
            if subscription.active == True:
                plan_id = subscription.plan_id
            else:
                plan_id = 999
        else:
            plan_id = 999

        # Get the user's friends
        # This is hella jank but its 3am me coding this so ¯\_(ツ)_/¯
        friends = set([f.friend_id for f in Friend.query.filter_by(user_id=user.id).all()]).union(set([f.user_id for f in Friend.query.filter_by(friend_id=user.id).all()]))
        friends = list(friends)
        
        # Get the user's friend requests
        friend_requests = [fr.requester_id for fr in FriendRequest.query.filter_by(requested_id=user.id).all()]

        return {
            "message": "Success",
            "user": {
                "userID": user.id,
                "username": user.username,
                "firstName": user.first_name,
                "lastName": user.last_name,
                "email": user.email,
                "bio": user.bio,
                "planID": plan_id,
                "friends": friends,
                "friendRequests": friend_requests
            }
        }, 201

class SendFriendRequest(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('from', type=int, required=True, help="Sender's user ID is required")
        parser.add_argument('to', type=int, required=True, help="Receiver's user ID is required")
        data = parser.parse_args()
        
        from_user_id = data['from']
        to_user_id = data['to']
        
        # Retrieve user instances
        from_user = User.query.get(from_user_id)
        to_user = User.query.get(to_user_id)

        # Check if both users exist
        if not from_user or not to_user:
            return {"message": "User not found"}, 404

        # Check if a friend request has already been sent
        if from_user.check_friend_request(to_user):
            return {"message": "Request already sent"}, 409

        # Send friend request
        if from_user.send_friend_request(to_user):
            return {"message": "Friend request sent"}, 201
        else:
            return {"message": "Failed to send friend request"}, 500

class AcceptFriendRequest(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('from', type=int, required=True, help="Sender's user ID is required")
        parser.add_argument('to', type=int, required=True, help="Receiver's user ID is required")
        data = parser.parse_args()
        
        from_user_id = data['from']
        to_user_id = data['to']
        
        # Retrieve user instances
        from_user = User.query.get(from_user_id)
        to_user = User.query.get(to_user_id)

        # Check if both users exist
        if not from_user or not to_user:
            return {"message": "User not found"}, 404

        # Check if a friend request exists
        friend_request = FriendRequest.query.filter_by(requester_id=from_user_id, requested_id=to_user_id).first()
        if not friend_request:
            return {"message": "Friend request not found"}, 404

        # Accept friend request
        if to_user.accept_friend_request(friend_request):
            return {"message": "Friend request accepted"}, 201
        else:
            return {"message": "Failed to accept friend request"}, 500

class RemoveFriend(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('from', type=int, required=True, help="Sender's user ID is required")
        parser.add_argument('to', type=int, required=True, help="Receiver's user ID is required")
        data = parser.parse_args()
        
        from_user_id = data['from']
        to_user_id = data['to']
        
        # Retrieve user instances
        from_user = User.query.get(from_user_id)
        to_user = User.query.get(to_user_id)

        # Check if both users exist
        if not from_user or not to_user:
            return {"message": "User not found"}, 404

        # Check if the users are friends
        if not from_user.check_friendship(to_user):
            return {"message": "Users are not friends"}, 400

        # Remove the friendship
        if from_user.remove_friend(to_user):
            return {"message": "Friend removed"}, 201
        else:
            return {"message": "Failed to remove friend"}, 500


class UpdateUserInfo(Resource):
    def post(self):
        # Initialize request parser
        parser = reqparse.RequestParser()
        parser.add_argument('userID', type=int, required=True, help="User ID is required")
        parser.add_argument('newPassword', type=str)
        parser.add_argument('bio', type=str)
        parser.add_argument('firstName', type=str)
        parser.add_argument('lastName', type=str)
        data = parser.parse_args()

        # Extract data from parser
        user_id = data['userID']
        new_password = data['newPassword']
        bio = data['bio'] if 'bio' in data else ''  # Set default value to empty string
        first_name = data['firstName']
        last_name = data['lastName']

        # Retrieve user instance
        user = User.query.get(user_id)

        # Check if user exists
        if not user:
            return {"message": "User not found"}, 404

        # Update user information
        if new_password:
            user.set_password(new_password)
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name

        user.bio = bio

        # Commit changes to the database
        db.session.commit()

        return {"message": "Success"}, 200


class SearchUser(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        # Require the username parameter to search users
        parser.add_argument('username', required=True, help="username parameter is required to search for users")
        data = parser.parse_args()

        # Sanitize the username input
        suser = sanitize_username(data['username'])

        # Search for users with a username that contains the provided string, case insensitive
        users = User.query.filter(User.username.ilike(f"%{suser}%")).all()

        if not users:
            return {"message": "No users found"}, 404

        # Creating a list of dictionaries, each representing a user
        user_list = [{"userID": user.id, "username": user.username, "firstName": user.first_name, "lastName": user.last_name} for user in users]

        return {"message": "Success",
                "users": user_list}, 201

def sanitize_username(input_username):
    # Remove percentage signs and underscores
    return re.sub(r'[%_]', '', input_username)

class RejectRequest(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('from', type=int, required=True, help="Sender's user ID is required")
        parser.add_argument('to', type=int, required=True, help="Receiver's user ID is required")
        data = parser.parse_args()
        
        from_user_id = data['from']
        to_user_id = data['to']
        
        # Retrieve user instances
        from_user = User.query.get(from_user_id)
        to_user = User.query.get(to_user_id)

        # Check if both users exist
        if not from_user or not to_user:
            return {"message": "User not found"}, 404

        # Check if a friend request exists
        friend_request = FriendRequest.query.filter_by(requester_id=from_user_id, requested_id=to_user_id).first()
        if not friend_request:
            return {"message": "Friend request not found"}, 404

        # Reject Friend Request
        if to_user.reject_friend_request(friend_request):
            return {"message": "Friend request rejected"}, 201
        else:
            return {"message": "Failed to reject friend request"}, 500
