"""Imports"""
import sys
from app import create_app, db
from config import DevelopmentConfig, TestConfig

# We check if we are running the app in development mode or in testing mode
if len(sys.argv) > 1 and sys.argv[1] == "dev":
    # Run the in memory database for api testing
    app = create_app(config_class=TestConfig)
else:
    # Run the database for development
    app = create_app(config_class=DevelopmentConfig)

# Create the database
with app.app_context():
    db.create_all()

# Run the app
if __name__ == "__main__":
    
    app.run(host="0.0.0.0", port=5001, debug=True)
