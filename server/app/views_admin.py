from flask_restful import Resource
from .models import User, SubscriptionPlan, UserSubscription
from .extensions import db

# /api/admin/userdata
class GetUserData(Resource):
    def post(self):
        rows = db.session.query(User).count()
        return {
            "message" : "Success",
            "numRegisteredUsers" : rows
        }, 200

# /api/admin/finance
class GetFinanceData(Resource):
    def post(self):
        data = []
        plans = SubscriptionPlan.query.all()
        for plan in plans:
            # Get number of subscibed users to that plan
            num_users = UserSubscription.query.filter_by(plan_id=plan.id).count()

            # Estimate monthly revenue
            est_monthly = plan.monthly_price * num_users

            data.append({
                "planID" : plan.id,
                "numSubscribers" : num_users,
                "monthlyRevenue" : est_monthly
            })

        return {
            "message" : "Success",
            "data" : data
        }