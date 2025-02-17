from flask import Blueprint, jsonify

post_bp = Blueprint('post_bp', __name__)

@post_bp.route('/', methods=['GET'])
def get_posts():
    return jsonify({"message": "List of posts"})
