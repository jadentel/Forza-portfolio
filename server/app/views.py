"""Import necessary libraries"""
from flask import Blueprint, render_template, flash, redirect, url_for, request
import stripe
from .models import  User, SubscriptionPlan, Session, Activity, ActivityType, UserSubscription
from .models import User, SubscriptionPlan, Session, Activity, ActivityType
from .extensions import db, login_manager
from .forms import ActivityForm, RegisterForm, LoginForm
from flask_restful import Api, Resource, reqparse
from datetime import datetime, timedelta
import gpxpy, folium, random, secrets, re

from flask_restful import Api, Resource, reqparse
from datetime import datetime, timedelta
import gpxpy, folium, random, secrets, re

from .views_admin import GetFinanceData, GetUserData
from .views_gpx import GetGpxString, GetActivity, ActivityIds, Feed, UploadGPX, RemoveActivity
from .views_plan import CreatePlan, RemovePlan, ListPlanIDs, GetPlan
from .views_user import GetUserID, UserInfo, UpdateUserInfo, SendFriendRequest, AcceptFriendRequest, RemoveFriend, SearchUser, RejectRequest
from .views_subscription import Subscribe, Unsubscribe
from .views_stripe import Webhook, StripeSessionsEndpoint
import json


# Create a Blueprint
api_bp = Blueprint('api', __name__,)
api = Api(api_bp)

# Gets user id from session id
def GetUserId(sesh_id):
    sesh = Session.query.filter_by(session_id=sesh_id).first()
    return sesh

# This is for debugging in memory database works
# just return us a list of user ids, in app.db there is 1 user
class DebugApi(Resource):
    def get(self):
        # Get user ids
        userNames = User.query.all()
        return [i.username for i in userNames]

api.add_resource(DebugApi, "/debug")

# Register API
class Register(Resource):
    def post(self):
        print("Registering user")
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help="Username is required")
        parser.add_argument('password', required=True, help="Password is required")
        parser.add_argument('confirm_password', required=True, help="Confirm Password cannot be blank")
        parser.add_argument('email', required=True, help="Email cannot be blank")
        parser.add_argument('firstName', required=True, help="First Name cannot be blank")
        parser.add_argument('lastName', required=True, help="Last Name cannot be blank")
        data = parser.parse_args()

        # Email Validation
        if not self.validate_email(data['email']):
            return {"message": "Invalid email format"}, 400
    
        # Check if the password and confirm password match
        if data['password'] != data['confirm_password']:
            return {"message": "Passwords do not match"}, 400

        # Check if a user with the provided email or username already exists
        existing_email = User.query.filter_by(email=data['email']).first() is not None
        existing_username = User.query.filter_by(username=data['username']).first() is not None
        if existing_email or existing_username:
            return {"message": "Email or Username already exists"}, 409

        # Create a new user instance
        user = User(
            username=data['username'], 
            email=data['email'], 
            first_name=data['firstName'],
            last_name=data['lastName'])
        user.set_password(data['password'])

        # Add the user to the database
        db.session.add(user)
        db.session.commit()

        return {"message" : "User created successfully"}, 201

    # Email Validation
    def validate_email(self, email):
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(email_regex, email) is not None

# Login API
class Login(Resource):
    def post(self):
        print("Logging in user")
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help="Username is required")
        parser.add_argument('password', required=True, help="Password is required")
        parser.add_argument('forceLogout', type=bool, required=False, default=False, help="Force logout existing session")
        data = parser.parse_args()

        # Check if the user exists and the password is correct
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            # query sessions table to check if a user is authenticated
            existing_session = Session.query.filter_by(user_id=user.id).first()

            if existing_session:
                if not data['forceLogout']:
                    # User is Logged in and force Logout is not set
                    return {"message": "User already logged in", "sessionID": ""}, 200
                else:
                    # Force logout existing session
                    db.session.delete(existing_session)
                    db.session.commit()

            # Get require field for session
            session_id = secrets.token_hex(16) 
            csrf_token = secrets.token_hex(16)
            expiry_date = datetime.now() + timedelta(days=1) # Set session expiry 1 day
            ip_address = request.remote_addr

            # Create and commit the new session instance
            new_session = Session(
                user_id=user.id, 
                session_id=session_id, 
                csrf_token=csrf_token, 
                expiry_date=expiry_date,
                client=request.headers.get('User-Agent', 'Unknown'),
                ip_address=ip_address
            )
            
            db.session.add(new_session)
            db.session.commit()

            return {"message": "User session created", "sessionID": session_id}, 201
        elif user:
            return {"message": "Password is incorrect", "sessionID": ""}, 401
        else:
            return {"message": "User does not exist", "sessionID": ""}, 404

# Logout User
class Logout(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('sessionID', required=True, help="Session ID is required")
        data = parser.parse_args()

        # Fetch the session using the provided session ID
        session = Session.query.filter_by(session_id=data['sessionID']).first()

        if session:
            # Remove the session from the database to log out the user
            db.session.delete(session)
            db.session.commit()
            return {"message": "Success"}, 200
        else:
            # If no session found, return an error
            return {"message": "Session not found or already logged out"}, 404

# Get CSRF API
class CSRFToken(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('sessionID', required=True, help="Session ID is required")
        data = parser.parse_args()

        # Attempt to find the session by its ID
        session = Session.query.filter_by(session_id=data['sessionID']).first()

        if not session:
            return {"message": "Session doesn't exist", "csrfToken": ""}, 404
        
        # Check if the session is expired
        if session.expiry_date < datetime.utcnow():
            return {"message": "Expired session id", "csrfToken": ""}, 404
        
        # Session is valid and not expired
        return {"message": "Success", "csrfToken": session.csrf_token}, 200

# Add resoruce to API
api.add_resource(StripeSessionsEndpoint, '/stripe/register')
api.add_resource(Webhook, '/stripe/webhook')
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(UserInfo, '/user/info')
api.add_resource(CSRFToken, '/csrf')
api.add_resource(UploadGPX, '/activity/upload')
api.add_resource(ActivityIds, "/activity/ids")
api.add_resource(Feed, "/activity/feed")
api.add_resource(GetActivity, '/activity/get')
api.add_resource(GetGpxString, '/activity/gpx')
api.add_resource(RemoveActivity, '/activity/remove')
api.add_resource(GetFinanceData, '/admin/finance')
api.add_resource(GetUserData, '/admin/userinfo')
api.add_resource(CreatePlan, '/plan/create')
api.add_resource(RemovePlan, '/plan/remove')
api.add_resource(ListPlanIDs, '/plan/ids')
api.add_resource(GetPlan, '/plan/get')
api.add_resource(GetUserID, '/user/id')
api.add_resource(SendFriendRequest, '/user/friend/request')
api.add_resource(AcceptFriendRequest, '/user/friend/accept')
api.add_resource(RemoveFriend, '/user/friend/remove')
api.add_resource(SearchUser, '/user/search')
api.add_resource(Subscribe, '/subscribe')
api.add_resource(Unsubscribe, '/unsubscribe')
api.add_resource(UpdateUserInfo, '/user/update')
api.add_resource(RejectRequest, '/user/friend/reject')
