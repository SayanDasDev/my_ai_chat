from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Feedback, Message, Chat

feedback_bp = Blueprint('feedback_bp', __name__)

# Add feedback
@feedback_bp.route('/', methods=['POST'])
@jwt_required()
def add_feedback():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        message_id = data.get('message_id')
        feedback_text = data.get('feedback')
        rating = data.get('rating')

        if not message_id or not feedback_text or rating is None:
            return jsonify({"error": "message_id, feedback, and rating are required"}), 400

        # Check if the message exists and belongs to the current user's chat
        message = Message.query.filter_by(id=message_id).first()
        chat = Chat.query.filter_by(id=message.chat_id, user_id=user_id).first()
        if not message or not chat:
            return jsonify({"error": "Message not found or does not belong to the user's chat"}), 404

        new_feedback = Feedback(message_id=message_id, feedback=feedback_text, rating=rating)
        db.session.add(new_feedback)
        db.session.commit()

        return jsonify({"message": "Feedback added successfully"}), 201
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# Get all feedbacks for the current user
@feedback_bp.route('/', methods=['GET'])
@jwt_required()
def get_feedbacks():
    try:
        user_id = get_jwt_identity()

        # Get all feedbacks for messages that belong to the current user's chats
        feedbacks = db.session.query(Feedback).join(Message).join(Chat).filter(Chat.user_id == user_id).all()

        feedback_list = [
            {
                "id": str(feedback.id),
                "message_id": str(feedback.message_id),
                "feedback": feedback.feedback,
                "rating": feedback.rating,
                "created_at": feedback.created_at.isoformat(),
                "message_prompt": feedback.message.prompt,
                "message_response": feedback.message.response
            }
            for feedback in feedbacks
        ]

        return jsonify(feedback_list), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# Get top or bottom feedbacks for the current user
@feedback_bp.route('/query', methods=['GET'])
@jwt_required()
def get_top_or_bottom_feedbacks():
    try:
        user_id = get_jwt_identity()
        top = request.args.get('top')
        bottom = request.args.get('bottom')

        if top:
            limit = int(top)
            feedbacks = db.session.query(Feedback).join(Message).join(Chat).filter(Chat.user_id == user_id).order_by(Feedback.rating.desc()).limit(limit).all()
        elif bottom:
            limit = int(bottom)
            feedbacks = db.session.query(Feedback).join(Message).join(Chat).filter(Chat.user_id == user_id).order_by(Feedback.rating.asc()).limit(limit).all()
        else:
            return jsonify({"error": "Query parameter 'top' or 'bottom' is required"}), 400

        feedback_list = [
            {
                "id": str(feedback.id),
                "message_id": str(feedback.message_id),
                "feedback": feedback.feedback,
                "rating": feedback.rating,
                "created_at": feedback.created_at.isoformat(),
                "message_prompt": feedback.message.prompt,
                "message_response": feedback.message.response
            }
            for feedback in feedbacks
        ]

        return jsonify(feedback_list), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500