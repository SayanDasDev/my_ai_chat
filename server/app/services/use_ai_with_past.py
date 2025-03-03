import os
import nltk
nltk.data.find('tokenizers/punkt')
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from app.models import User, ConversationContext  # Import your database models
from app.extensions import db  # Import your database extension

from app.services import askAI

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

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

def find_similar_prompt(prompt: str, contexts: list) -> str:
    print("Finding similar prompt")
    prompts = [context.prompt for context in contexts]
    if not prompts:
        return None

    vectorizer = TfidfVectorizer().fit_transform([prompt] + prompts)
    vectors = vectorizer.toarray()
    cosine_similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()
    highest_similarity_index = cosine_similarities.argmax()
    highest_similarity_score = cosine_similarities[highest_similarity_index]

    # Define a threshold for similarity (e.g., 0.8)
    if highest_similarity_score >= 0.8:
        print("Similary found")
        return contexts[highest_similarity_index].response.strip()
    print("Similary not found")
    return None

def askAiWithPast(prompt: str, user_id: int) -> str:
    """
    Queries the database for the user's conversation context, checks for a matching or similar prompt, and queries Gemini AI if no match is found.

    Parameters:
    - prompt (str): The user query.
    - user_id (int): The ID of the user.
    - modelname (str): Gemini AI model to use (default: "gemini-2.0-flash-thinking-exp-1219").

    Returns:
    - str: The AI response in plain text format.
    """
    # Retrieve the conversation context from the database
    contexts = get_conversation_context(user_id)

    # Check if the prompt matches one of the previous questions exactly
    for context in contexts:
        if context.prompt == prompt:
            return context.response.strip()  # Return the corresponding AI response

    # Check for similar prompts
    similar_response = find_similar_prompt(prompt, contexts)
    if similar_response:
        return similar_response

    # Use AI to generate the answer
    response = askAI(prompt)

    # Save the updated conversation context to the database
    save_conversation_context(user_id, prompt, response)

    return response