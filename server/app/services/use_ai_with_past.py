import nltk
nltk.data.find('tokenizers/punkt')
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from app.models import User, ConversationContext  # Import your database models
from app.extensions import db  # Import your database extension

from app.services import askAI

def get_conversation_context(user_id: int) -> list:
    contexts = ConversationContext.query.filter_by(user_id=user_id).order_by(ConversationContext.created_at.desc()).limit(5).all()
    return contexts

def save_conversation_context(user_id: int, prompt: str, response: str):
    new_context = ConversationContext(user_id=user_id, prompt=prompt, response=response)
    db.session.add(new_context)
    db.session.commit()

    # Delete older contexts if more than 5 exist
    contexts = ConversationContext.query.filter_by(user_id=user_id).order_by(ConversationContext.created_at.desc()).all()
    if len(contexts) > 5:
        for context in contexts[5:]:
            db.session.delete(context)
        db.session.commit()

def askAiWithPast(prompt: str, user_id: int) -> str:
    """
    Queries the database for the user's conversation context, checks for a matching prompt, and queries Gemini AI if no match is found.

    Parameters:
    - prompt (str): The user query.
    - user_id (int): The ID of the user.
    - modelname (str): Gemini AI model to use (default: "gemini-2.0-flash-thinking-exp-1219").

    Returns:
    - str: The AI response in plain text format.
    """
    # Retrieve the conversation context from the database
    contexts = get_conversation_context(user_id)

    # Check if the prompt matches one of the previous questions
    for context in contexts:
        if context.prompt == prompt:
            return context.response.strip()  # Return the corresponding AI response

    # Use AI to generate the answer
    response = askAI(prompt)

    # Save the updated conversation context to the database
    save_conversation_context(user_id, prompt, response)

    return response