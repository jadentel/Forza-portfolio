"""Imports"""

from flask_wtf import FlaskForm
from wtforms import BooleanField, FileField, SelectField
from .models import ActivityType



from wtforms import StringField, TextAreaField, PasswordField
from wtforms.validators import DataRequired, EqualTo


class RegisterForm(FlaskForm):
    """Defining the register form fields"""

    username = StringField(
        "username", validators=[DataRequired(message="Username Missing")]
    )
    first_name = StringField(
        "first_name", validators=[DataRequired(message="First Name Missing")]
    )
    last_name = StringField(
        "last_name", validators=[DataRequired(message="Last Name Missing")]
    )
    email = StringField("email", validators=[DataRequired(message="Email Missing")])
    password_hash = TextAreaField(
        "Password",
        validators=[
            DataRequired(message="Password Missing"),
            EqualTo("password_hash2", message="Passwords Must Match"),
        ],
    )
    password_hash2 = TextAreaField(
        "Confirm Password", validators=[DataRequired(message="Password Missing")]
    )


class LoginForm(FlaskForm):
    """Defining the login form fields"""

    username = StringField(
        "username", validators=[DataRequired(message="Username Missing")]
    )
    password = PasswordField(
        "Password", validators=[DataRequired(message="Password Missing")]
    )

class ActivityForm(FlaskForm):
    activity_name = StringField('Name', validators=[DataRequired()])
    activity_type = SelectField('Activity Type', choices=[(activity_type.name, activity_type.value) for activity_type in ActivityType])
    gpx_file = FileField('GPX File')
    public = BooleanField('Public', default=True)

