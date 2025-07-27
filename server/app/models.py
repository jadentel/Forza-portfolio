"""Imports"""
import enum
from werkzeug.security import generate_password_hash, check_password_hash
from .extensions import db

### User Models ###
class User(db.Model):
    """User Model"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    stripe_customer_id = db.Column(db.String(255), unique=True, nullable=True)  # New column for Stripe customer ID

    # Relationships
    activities = db.relationship("Activity", backref="user", lazy="dynamic")  # One-to-many relationship with Activity
    sessions = db.relationship("Session", backref="user", lazy="dynamic")  # One-to-many relationship with Session
    subscriptions = db.relationship("UserSubscription", back_populates="user", lazy="dynamic")
 
    # Password management
    def set_password(self, password):
        """Set the password to hash"""
        self.password_hash = generate_password_hash(password, method="pbkdf2:sha256")

    def check_password(self, password):
        """Check that the password is the stored hash pass"""
        return check_password_hash(self.password_hash, password)
    
    # Friends Management
    def check_friendship(self, user):
        """Check if the user is friends with another user"""
        # Query to check if a friendship exists in either configuration
        return Friend.query.filter(
            ((Friend.user_id == self.id) & (Friend.friend_id == user.id)) | 
            ((Friend.user_id == user.id) & (Friend.friend_id == self.id))
        ).first() is not None
    
    def check_friend_request(self, user):
        """Check if a friend request exists between two users in either direction"""
        return FriendRequest.query.filter(
            ((FriendRequest.requester_id == self.id) & (FriendRequest.requested_id == user.id)) |
            ((FriendRequest.requester_id == user.id) & (FriendRequest.requested_id == self.id))
        ).first() is not None
    
    def send_friend_request(self, user):
        """Send a friend request to another user. If a request from the other user exists, accept it."""
        existing_request = FriendRequest.query.filter_by(requester_id=user.id, requested_id=self.id).first()
        if existing_request:
            # If there is already a request from the other user, automatically accept it
            self.accept_friend_request(existing_request)
            return True
        elif not self.check_friendship(user) and not self.check_friend_request(user):
            # No existing request in either direction and not already friends
            new_request = FriendRequest(requester=self, requested=user)
            db.session.add(new_request)
            db.session.commit()
            return True
        return False
    
    def accept_friend_request(self, friend_request):
        """Accept a friend request"""
        if friend_request.requested_id == self.id:
            # Create a new friendship
            friendship = Friend(user_id=self.id, friend_id=friend_request.requester_id)
            db.session.add(friendship)
            db.session.delete(friend_request)
            db.session.commit()
            return True
        return False
    
    def reject_friend_request(self, friend_request):
        """Reject a friend request"""
        if friend_request.requested_id == self.id:
            db.session.delete(friend_request)
            db.session.commit()
            return True
        return False

    def remove_friend(self, friend):
        """Remove a friend"""
        # Query to find the friendship in either direction
        friendship = Friend.query.filter(
            ((Friend.user_id == self.id) & (Friend.friend_id == friend.id)) |
            ((Friend.user_id == friend.id) & (Friend.friend_id == self.id))
        ).first()
        if friendship:
            db.session.delete(friendship)
            db.session.commit()
            return True
        return False
    
class SubscriptionPlan(db.Model):
    """Plan Model"""
    id = db.Column(db.Integer, primary_key=True)
    plan_name = db.Column(db.String(50), nullable=False)
    monthly_price = db.Column(db.Float, nullable=False)
    weekly_activities = db.Column(db.Integer, nullable=False)
    display_free_badge = db.Column(db.Boolean, nullable=False)
    friends_allowed = db.Column(db.Boolean, nullable=False)

class Session(db.Model):
    """Session Model"""
    id = db.Column(db.Integer, primary_key=True)
    expiry_date = db.Column(db.DateTime, nullable=False)
    client = db.Column(db.String(255), nullable=False)
    ip_address = db.Column(db.String(100), nullable=False)
    session_id = db.Column(db.String(255), nullable=False, unique=True)
    csrf_token = db.Column(db.String(255), nullable=False)

    # Foreign Key
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)  # Link to User model
                    
### Activity Models ##
# Enum for activity types
class ActivityType(enum.Enum):
    """Activity Type"""
    run = "run"
    walk = "walk"

# Activities Model
class Activity(db.Model):
    """Activity Model"""
    id = db.Column(db.Integer, primary_key=True)
    gpx_data = db.Column(db.String, nullable=False, default="")
    activity_name = db.Column(db.String(255), nullable=False, default="")
    activity_type = db.Column(db.Enum(ActivityType), nullable=False)  # Using Enum type here
    creation_date = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)
    public = db.Column(db.Boolean, default=True, nullable=False)
    start_time = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.Float, nullable=True, default = 0.0)
    distance = db.Column(db.Float,nullable=True, default=0.0) 

    # Foreign Key
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)  # Link to User model

# Friend Request Model
class FriendRequest(db.Model):
    """Model for handling friend requests between users"""
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    requested_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    requester = db.relationship('User', foreign_keys=[requester_id], backref=db.backref('sent_requests', lazy='dynamic'))
    requested = db.relationship('User', foreign_keys=[requested_id], backref=db.backref('received_requests', lazy='dynamic'))

# Friends Model
class Friend(db.Model):
    """Model for storing established friendships"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', foreign_keys=[user_id], backref=db.backref('friends', lazy='dynamic'))
    friend = db.relationship('User', foreign_keys=[friend_id], backref=db.backref('friends_with', lazy='dynamic'))

"""
class Subscription(db.Model):
    '''Subscription Model'''
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    subscription_id = db.Column(db.String(255), nullable=False, unique=True)  # Subscription ID from Stripe
    plan_id = db.Column(db.Integer, db.ForeignKey("plan.id"), nullable=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)

    user = db.relationship("User", back_populates="subscriptions")
    plan = db.relationship("Plan", backref="subscriptions")

"""

class UserSubscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('subscription_plan.id'), nullable=False)
    subscription_id = db.Column(db.String(255), nullable=True, unique=True)  # Subscription ID from Stripe
    start_date = db.Column(db.DateTime, nullable=False)
    expiry_date = db.Column(db.DateTime, nullable=False)
    active = db.Column(db.Boolean, default=True)

    # Relationships
    user = db.relationship('User', back_populates="subscriptions")
    plan = db.relationship('SubscriptionPlan', backref=db.backref('subscribed_users', lazy='dynamic'))

# This is like a pending payment list
class StripeSessions(db.Model):
    user_id = db.Column(db.String, db.ForeignKey("user.id"), unique=True, nullable=False, primary_key=True)
    plan_id = db.Column(db.String, db.ForeignKey("subscription_plan.id"), nullable=False)
    stripe_session = db.Column(db.String, unique=True, nullable=False)