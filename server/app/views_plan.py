from flask_restful import Resource, reqparse
from flask import request
from .models import SubscriptionPlan
from .extensions import db
from sqlalchemy.exc import SQLAlchemyError

class CreatePlan(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('planName', required=True, type=str, help="Plan name is required")
        parser.add_argument('monthlyPrice', required=True, type=float, help="Monthly price is required")
        parser.add_argument('weeklyActivities', required=True, type=int, help="Weekly activities count is required")
        parser.add_argument('displayFreeBadge', required=True, type=bool, help="Display free badge boolean is required")
        parser.add_argument('friendsAllowed', required=True, type=bool, help="Friends allowed boolean is required")
        data = parser.parse_args()

        # Validate monthly price cannot be negative
        if data['monthlyPrice'] < 0:
            return {"message": "Monthly price cannot be negative"}, 400
        
        # Validate the weekly activities count
        if data['weeklyActivities'] < 0 and data['weeklyActivities'] != -1:
            return {"message": "Weekly activities count cannot be negative"}, 400
        
        try:
            # Create a new plan
            new_plan = SubscriptionPlan(
                plan_name=data['planName'],
                monthly_price=data['monthlyPrice'],
                weekly_activities=data['weeklyActivities'],
                display_free_badge=data['displayFreeBadge'],
                friends_allowed=data['friendsAllowed']
            )
            db.session.add(new_plan)
            db.session.commit()

            return {"message": "Success"}, 200
        
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"message": "Database error"}, 500
        
class RemovePlan(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('planID', required=True, type=int, help="Plan ID is required")
        data = parser.parse_args()

        # Fetch the plan from the database
        plan = SubscriptionPlan.query.get(data['planID'])
        if not plan:
            return {"message": "Plan not found"}, 404
          
        try:
            db.session.delete(plan)
            db.session.commit()
            return {"message": "Success"}, 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"message": "Failed to delete the plan"}, 500
        
class ListPlanIDs(Resource):
    def get(self):  # Consider using 'get' for RESTful API design
        # Query the database for all plans and extract their IDs
        plans = SubscriptionPlan.query.all()
        plan_ids = [plan.id for plan in plans]

        # Return the response with plan IDs
        return {
            "message": "Success",
            "planIDs": plan_ids
        }, 200
    
class GetPlan(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('planID', required=True, type=int, help="Plan ID is required")
        data = parser.parse_args()

        # Fetch the plan from the database
        plan = SubscriptionPlan.query.get(data['planID'])
        if not plan:
            return {"message": "Plan not found"}, 404

        # Return the plan details
        return {
            "message": "Success",
            "planName": plan.plan_name,
            "monthlyPrice": plan.monthly_price,
            "weeklyActivities": plan.weekly_activities,
            "displayFreeBadge": plan.display_free_badge,
            "friendsAllowed": plan.friends_allowed
        }, 200