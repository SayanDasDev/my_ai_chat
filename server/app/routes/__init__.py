from flask import Blueprint

# Create a global blueprint for the app
main_bp = Blueprint('main', __name__)

# Import all route modules (ensures they get registered)
from .user_routes import user_bp
from .chat_routes import chat_bp
from .message_routes import message_bp
from .feedback_routes import feedback_bp

# This allows the main app to import routes easily
