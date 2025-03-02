from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Message, Chat
from app.services import askAI, askAiWithFile, askAiWithPast, askLocalAI
from werkzeug.utils import secure_filename
import os
import uuid


message_bp = Blueprint('message_bp', __name__)

# Create a new message in a chat
@message_bp.route('/', methods=['POST'])
@jwt_required()
def create_message():
    try:
        user_id = get_jwt_identity()
        chat_id = request.form.get('chat_id')
        prompt = request.form.get('prompt')
        generateChatName = request.form.get('generate_chat_name')
        rememberPast = request.form.get('remember_past')
        model = request.form.get('model')
        file = request.files.get('file')

        if not chat_id or not prompt:
            return jsonify({"error": "chat_id, prompt, and response are required"}), 400

        # Check if the chat exists and belongs to the current user
        chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first()
        if not chat:
            return jsonify({"error": "Chat not found or does not belong to the user"}), 404


        upload_folder = os.path.join(os.getcwd(), 'uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        if file:
            filename = secure_filename(file.filename)
            filename = f"{uuid.uuid4().hex}_{filename}"
            file.save(os.path.join(upload_folder, filename))
            print(f"File saved as {filename}")

            filepath = upload_folder + "/" + filename

            response = f"*#FILE=${filename}#" + askAiWithFile(prompt=prompt, filename=file.filename, filepath=filepath)

        elif rememberPast == "true":
            response = askAiWithPast(prompt, user_id)
        else:
            if model == "deepseek":
                response = askLocalAI(prompt)
            else:
                response = askAI(prompt)

        if(generateChatName == "true"):
            chat_name_prompt = f"""
            Please generate a chat name based on the following conversation:
            Question: {prompt}
            Answer: {response}
            The chat name should be relevant to the topic and not exceed 5 words. Provide only the chat name.
            """
            chat_name = askAI(chat_name_prompt)
            chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first()
            chat.name = chat_name


        new_message = Message(chat_id=chat_id, prompt=prompt, response=response)

        db.session.add(new_message)
        db.session.commit()

        return jsonify({
            "id": str(new_message.id),
            "chat_id": str(new_message.chat_id),
            "prompt": new_message.prompt,
            "response": new_message.response,
            "created_at": new_message.created_at.isoformat()
        }), 201
    except Exception as e:
        print(str(e))  # Log the error for debugging
        return jsonify({"error": str(e)}), 500

# Get all messages for a specific chat
@message_bp.route('/<uuid:chat_id>', methods=['GET'])
@jwt_required()
def get_messages(chat_id):
    try:
        user_id = get_jwt_identity()

        # Check if the chat exists and belongs to the current user
        chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first()
        if not chat:
            return jsonify({"error": "Chat not found or does not belong to the user"}), 404

        messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.created_at.desc()).all()

        message_list = [
            {
                "id": str(message.id),
                "chat_id": str(message.chat_id),
                "prompt": message.prompt,
                "response": message.response,
                "created_at": message.created_at.isoformat()
            }
            for message in messages
        ]

        return jsonify(message_list), 200
    except Exception as e:
        print(str(e))  # Log the error for debugging
        return jsonify({"error": str(e)}), 500

# Get a specific message by ID
@message_bp.route('/<uuid:message_id>', methods=['GET'])
@jwt_required()
def get_message(message_id):
    try:
        user_id = get_jwt_identity()
        message = Message.query.filter_by(id=message_id).first()

        if not message:
            return jsonify({"error": "Message not found"}), 404

        # Check if the message belongs to the user's chat
        chat = Chat.query.filter_by(id=message.chat_id, user_id=user_id).first()
        if not chat:
            return jsonify({"error": "Message does not belong to your chat"}), 403

        return jsonify({
            "id": str(message.id),
            "chat_id": str(message.chat_id),
            "prompt": message.prompt,
            "response": message.response,
            "created_at": message.created_at.isoformat()
        }), 200
    except Exception as e:
        print(str(e))  # Log the error for debugging
        return jsonify({"error": str(e)}), 500

# Delete a specific message
@message_bp.route('/<uuid:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    try:
        user_id = get_jwt_identity()
        message = Message.query.filter_by(id=message_id).first()

        if not message:
            return jsonify({"error": "Message not found"}), 404

        # Check if the message belongs to the user's chat
        chat = Chat.query.filter_by(id=message.chat_id, user_id=user_id).first()
        if not chat:
            return jsonify({"error": "Message does not belong to your chat"}), 403

        db.session.delete(message)
        db.session.commit()

        return jsonify({"message": "Message deleted successfully"}), 200
    except Exception as e:
        print(str(e))  # Log the error for debugging
        return jsonify({"error": str(e)}), 500
