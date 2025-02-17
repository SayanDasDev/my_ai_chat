from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Chat
import uuid

chat_bp = Blueprint('chat_bp', __name__)

# Create a new chat
@chat_bp.route('/', methods=['POST'])
@jwt_required()
def create_chat():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        chat_name = data.get("name", "New Chat")  # Default name if not provided
        new_chat = Chat(user_id=user_id, name=chat_name)

        db.session.add(new_chat)
        db.session.commit()

        return jsonify({"id": str(new_chat.id), "name": new_chat.name, "created_at": new_chat.created_at.isoformat()}), 201
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# Get all chats for the authenticated user
@chat_bp.route('/', methods=['GET'])
@jwt_required()
def get_chats():
    try:
        user_id = get_jwt_identity()
        chats = Chat.query.filter_by(user_id=user_id).order_by(Chat.created_at.desc()).all()

        chat_list = [
            {"id": str(chat.id), "name": chat.name, "created_at": chat.created_at.isoformat()}
            for chat in chats
        ]
        return jsonify(chat_list), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# Get a specific chat by ID
@chat_bp.route('/<uuid:chat_id>', methods=['GET'])
@jwt_required()
def get_chat(chat_id):
    try:
        user_id = get_jwt_identity()
        chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first()

        if not chat:
            return jsonify({"error": "Chat not found"}), 404

        return jsonify({"id": str(chat.id), "name": chat.name, "created_at": chat.created_at.isoformat()}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# Rename a chat
@chat_bp.route('/<uuid:chat_id>', methods=['PUT'])
@jwt_required()
def update_chat(chat_id):
    try:
        user_id = get_jwt_identity()
        chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first()

        if not chat:
            return jsonify({"error": "Chat not found"}), 404

        data = request.get_json()
        if "name" in data:
            chat.name = data["name"]
            db.session.commit()
            return jsonify({"message": "Chat renamed successfully"}), 200

        return jsonify({"error": "Invalid request"}), 400
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# Delete a chat
@chat_bp.route('/<uuid:chat_id>', methods=['DELETE'])
@jwt_required()
def delete_chat(chat_id):
    try:
        user_id = get_jwt_identity()
        chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first()

        if not chat:
            return jsonify({"error": "Chat not found"}), 404

        db.session.delete(chat)
        db.session.commit()
        return jsonify({"message": "Chat deleted successfully"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500
