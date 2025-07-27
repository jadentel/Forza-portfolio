"""Imports"""
import os
from flask import Flask
from flask_cors import CORS  
from flask_migrate import Migrate
from .extensions import db, login_manager
from .views import api_bp

def create_app(config_class=None):
    """Function to create an app"""
    app = Flask(__name__)
    login_manager.init_app(app)

    # Use the config class
    assert config_class is not None, "Config not given"
    app.config.from_object(config_class)

    CORS(app)
    
    # Register the blueprint
    app.register_blueprint(api_bp, url_prefix='/api')

    db.init_app(app)
    migrate = Migrate(app, db)

    return app
