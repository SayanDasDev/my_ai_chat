from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from app.config.config import Config  # Import configuration settings
from app.extensions import db, migrate  # Import the database

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  # Load config from class

    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    CORS(app)

    # Register Blueprints (modular routes)
    from app.routes import user_bp, post_bp
    app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(post_bp, url_prefix='/posts')

    return app
