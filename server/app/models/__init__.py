from app.extensions import db  # Import the database object
from .user import User  # Import individual models
from .chat import Chat  # Import individual models
from .message import Message  # Import individual models
from .conversation_context import ConversationContext  # Import individual models
from .feedback import Feedback  # Import individual models

# This allows you to do: `from app.models import User`
