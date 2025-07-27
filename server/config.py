"""Imports"""
import os

# This file contains the configuration settings for the application

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Base Config"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default_secret_key'
    WTF_CSRF_ENABLED = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    """Development Config"""
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')

class TestConfig(Config):
    """Test Config"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = True

class ProductionConfig(Config):
    """Production Config"""
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
