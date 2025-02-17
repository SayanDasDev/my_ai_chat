from flask import Blueprint

# Create a global blueprint for the app
main_bp = Blueprint('main', __name__)

# Import all route modules (ensures they get registered)
from .user_routes import user_bp
from .post_routes import post_bp

# This allows the main app to import routes easily
