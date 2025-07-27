"""
This file contains code that can be potentially used for implementing stripe
"""

from flask_restful import Resource, reqparse
from flask import request
from .models import User, StripeSessions, SubscriptionPlan, UserSubscription
from .extensions import db
from datetime import datetime, timedelta
import stripe
import os

stripe.api_key = os.environ.get("STRIPE_API_KEY")
webhook_secret = os.environ.get("STRIPE_WEBHOOK_KEY")

class Webhook(Resource):
    def post(self):
        # Check for the correct event

        if request.json["object"] == "event" and request.json["type"] == "checkout.session.completed":
            stripe_id = request.json["data"]["object"]["id"]
            stripe_sesh = StripeSessions.query.filter_by(stripe_session=stripe_id).first()
            if stripe_sesh is not None:
                start_date = datetime.utcnow()
                expiry_date = start_date + timedelta(days=30)  # Assuming one month subscription

                subscription = UserSubscription(
                    user_id=stripe_sesh.user_id,
                    plan_id=stripe_sesh.plan_id,
                    start_date=start_date,
                    expiry_date=expiry_date,
                    active=True
                )

                # add the sub to the db
                db.session.add(subscription)
                db.session.commit()

                # delete stripe session
                db.session.delete(stripe_sesh)
                db.session.commit()

        else:
            print("nay")
            return "", 400
            

# This manages /api/stripe/register
# shoulda named it /api/stripe/session but oh well ¯\_(ツ)_/¯
class StripeSessionsEndpoint(Resource):
    def post(self):
        # print(request.data.decode("utf-8"))
        parser = reqparse.RequestParser()
        parser.add_argument('userID', required=True, type=str, help="User ID is required")
        parser.add_argument('planID', required=True, type=str, help="Plan ID is required")
        parser.add_argument('stripePaymentID', required=True, type=str, help="Stripe ID is required")
        data = parser.parse_args()

        # Check user and plan exists
        user_check = User.query.filter_by(id=data["userID"])
        if user_check is None:
            return {"message" : "User not found"}, 404
        
        plan_check = SubscriptionPlan.query.filter_by(id=data["planID"])
        if plan_check is None:
            return {"message" : "User not found"}, 404

        # Try to get existing user and update stripe info
        user = StripeSessions.query.filter_by(user_id=data["userID"]).first()

        if user is None:
            user = StripeSessions(user_id=data["userID"], plan_id=data["planID"], stripe_session=data["stripePaymentID"])
            db.session.add(user)
            db.session.commit()
            return {"message" : "Success"}, 200
        else:
            user.plan_id = data["planID"]
            user.stripe_session = data["stripePaymentID"]
            db.session.commit()
            return {"message" : "Success"}

#Subscription
# class BasicSubscribe(Resource):
#     def post(self):
#         print("basic subscription")
#         parser = reqparse.RequestParser()
#         parser.add_argument('sessionID', required=True, help="Session ID is required")
#         data = parser.parse_args()

#         data = request.json
#         session_id = data.get('sessionID')

#         if not session_id:
#             return {"message": "Session ID is required"}, 400

#         # Get user ID from session
#         session = GetUserId(data["sessionID"])
#         if session is None:
#             return {"message": "Session doesn't exist"}, 404

#         user = User.query.get(session.user_id)

#         # Checks if user already has an active basic subscription
#         existing_subscription = UserSubscription.query.filter_by(user_id=user.id, plan_id=1, active=True).first()
#         if existing_subscription:
#             return {"message": "User already has an active basic subscription"}, 400

#         # Retrieve Stripe customer ID associated with the user
#         customer_id = user.stripe_customer_id

#         if not customer_id:
#             try:
#                 # Create a Stripe customer
#                 stripe_customer = stripe.Customer.create(
#                     email=user.email
#                 )
#                 user.stripe_customer_id = stripe_customer.id
#                 # Commit the change to the database
#                 db.session.commit()
#                 user = User.query.get(user.id)
#                 customer_id = user.stripe_customer_id
#             except stripe.error.StripeError as e:
#                 return {"message": "Stripe Error: {}".format(str(e))}, 500

#         # Now you can proceed with creating the subscription
#         try:
#             # Fetching basic subscription plan
#             subscription = stripe.Subscription.create(
#                 customer=customer_id,
#                 items=[
#                     {
#                         "price": "price_1Os5lnKSKve0FSISXfeY9wIZ",
#                     },
#                 ],
#                 payment_behavior='default_incomplete',
#                 expand=['latest_invoice.payment_intent']
#             )

#             # Calculate expiry date (here assuming a basic subscription lasts for a week)
#             expiry_date = datetime.now() + timedelta(weeks=1)

#             basic_subscription = UserSubscription(
#                 user_id=user.id,
#                 plan_id="price_1Os5lnKSKve0FSISXfeY9wIZ",
#                 subscription_id=subscription.id,
#                 start_date=datetime.now(),
#                 expiry_date=expiry_date,
#                 active=True
#             )
#             db.session.add(basic_subscription)
#             db.session.commit()

#             # Retrieve PaymentIntent status
#             payment_intent_status = subscription.latest_invoice.payment_intent.status

#             return {"message": "Basic subscription created successfully",
#                     "expiry_date": expiry_date.strftime("%Y-%m-%d"),
#                     "customer_id": customer_id,
#                     "subscription_id": subscription.id,
#                     "plan": "basic"}, 200
#         except Exception as e:
#             print("Error:", str(e))
#             return {"message": "Error: {}".format(str(e))}, 500

# class PremiumSubscribe(Resource):
#     def post(self):
#         print("premium subscription")
#         parser = reqparse.RequestParser()
#         parser.add_argument('sessionID', required=True, help="Session ID is required")
#         data = parser.parse_args()

#         # Get user ID from session
#         session = GetUserId(data["sessionID"])
#         if session is None:
#             return {"message": "Session doesn't exist"}, 404

#         user = User.query.get(session.user_id)

#         # Checks if user already has an active premium subscription
#         existing_subscription = UserSubscription.query.filter_by(user_id=user.id, plan_id=2, active=True).first()
#         if existing_subscription:
#             return {"message": "User already has an active premium subscription"}, 400

#         # Retrieve Stripe customer ID associated with the user
#         customer_id = user.stripe_customer_id

#         if not customer_id:
#             try:
#                 # Create a Stripe customer
#                 stripe_customer = stripe.Customer.create(
#                     email=user.email
#                 )
#                 user.stripe_customer_id = stripe_customer.id
#                 # Commit the change to the database
#                 db.session.commit()
#                 user = User.query.get(user.id)
#                 customer_id = user.stripe_customer_id
#             except stripe.error.StripeError as e:
#                 return {"message": "Stripe Error: {}".format(str(e))}, 500

#         # Now you can proceed with creating the subscription
#         try:
#             # Fetching premium subscription plan
#             subscription = stripe.Subscription.create(
#                 customer=customer_id,
#                 items=[
#                     {
#                         "price": "price_1Os5kSKSKve0FSISPih5UWNz",
#                     },
#                 ],
#                 payment_behavior='default_incomplete',
#                 expand=['latest_invoice.payment_intent']
#             )
#             # Calculate expiry date (here assuming a premium subscription lasts for a month)
#             expiry_date = datetime.now() + timedelta(weeks=4)

#             premium_subscription = UserSubscription(
#                 user_id=user.id,
#                 plan_id="price_1Os5kSKSKve0FSISPih5UWNz",
#                 subscription_id=subscription.id,
#                 start_date=datetime.now(),
#                 expiry_date=expiry_date,
#                 active=True
#             )
#             db.session.add(premium_subscription)
#             db.session.commit()

#             # Retrieve PaymentIntent status
#             payment_intent_status = subscription.latest_invoice.payment_intent.status

#             return {"message": "Premium subscription created successfully",
#                     "expiry_date": expiry_date.strftime("%Y-%m-%d"),
#                     "customer_id": customer_id,
#                     "subscription_id": subscription.id,
#                     "plan": "premium"}, 200
#         except Exception as e:
#             print("Error:", str(e))
#             return {"message": "Error: {}".format(str(e))}, 500