from flask_restful import Resource, reqparse
from flask import request
from .models import UserSubscription, User, SubscriptionPlan
from .extensions import db
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta

class Subscribe(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userID', type=int, required=True, help="User ID is required")
        parser.add_argument('planID', type=int, required=True, help="Plan ID is required")
        data = parser.parse_args()
        
        user_id = data['userID']
        plan_id = data['planID']
        
        # Retrieve user and plan instances
        user = User.query.get(user_id)
        plan = SubscriptionPlan.query.get(plan_id)

        # Check if user and plan exist
        if not user:
            return {"message": "User not found"}, 404
        if not plan:
            return {"message": "Plan not found"}, 404
        
        existing_subscription = UserSubscription.query.filter_by(user_id=user.id, active=True).first()
        if existing_subscription:
            return {"message": "User already has an active subscription"}, 400

        # Calculate expiry date (e.g., one month from now)
        start_date = datetime.utcnow()
        expiry_date = start_date + timedelta(days=30)  # Assuming one month subscription

        # Create a new subscription
        subscription = UserSubscription(
            user_id=user.id,
            plan_id=plan.id,
            start_date=start_date,
            expiry_date=expiry_date,
            active=True
        )
        db.session.add(subscription)
        db.session.commit()

        return {"message": "Success"}, 200

class Unsubscribe(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userID', type=int, required=True, help="User ID is required")
        data = parser.parse_args()
        
        user_id = data['userID']
        
        # Retrieve user instance
        user = User.query.get(user_id)

        # Check if user exists
        if not user:
            return {"message": "User not found"}, 404

        # Check if the user has an active subscription
        subscription = UserSubscription.query.filter_by(user_id=user.id, active=True).first()

        if not subscription:
            return {"message": "User has no active plan"}, 404

        # Deactivate the subscription
        subscription.active = False
        db.session.commit()

        return {"message": "Success"}, 200

    