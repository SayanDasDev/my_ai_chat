from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies
)
from app.models import User, db

user_bp = Blueprint('user_bp', __name__)

# Register a new user
@user_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password required"}), 400

        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "User already exists"}), 400

        hashed_password = generate_password_hash(data['password'])
        new_user = User(username=data.get('username', ''), email=data['email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id)
        refresh_token = create_refresh_token(identity=new_user.id)
        return jsonify({"access_token": access_token, "refresh_token": refresh_token, "message": "User registered successfully"}), 201
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# User login
@user_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()

        if not user or not check_password_hash(user.password, data.get('password')):
            return jsonify({"error": "Invalid email or password"}), 401

        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify({"access_token": access_token, "refresh_token": refresh_token, "message": "Login successful"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# Refresh token
@user_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return jsonify({"access_token": new_access_token}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# User logout
@user_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        response = jsonify({"message": "Logout successful"})
        unset_jwt_cookies(response)  # Clears JWT cookies
        return response, 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# Get user profile
@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"id": user.id, "username": user.username, "email": user.email}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# Update user profile
@user_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        if "username" in data:
            user.username = data["username"]
        if "password" in data:
            user.password = generate_password_hash(data["password"])

        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

# Delete user account
@user_bp.route('/me', methods=['DELETE'])
@jwt_required()
def delete_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500