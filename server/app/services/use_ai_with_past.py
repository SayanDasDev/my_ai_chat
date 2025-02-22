import os
import nltk
nltk.data.find('tokenizers/punkt')
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_text_splitters import NLTKTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from app.models import User, Chat, Message, ConversationContext  # Import your database models
from app.extensions import db  # Import your database extension

load_dotenv()

def get_conversation_context(user_id: int) -> str:
    contexts = ConversationContext.query.filter_by(user_id=user_id).order_by(ConversationContext.created_at.desc()).limit(20).all()
    return "\n".join(context.context for context in reversed(contexts))

def save_conversation_context(user_id: int, context: str):
    new_context = ConversationContext(user_id=user_id, context=context)
    db.session.add(new_context)
    db.session.commit()

    # Delete older contexts if more than 20 exist
    contexts = ConversationContext.query.filter_by(user_id=user_id).order_by(ConversationContext.created_at.desc()).all()
    if len(contexts) > 20:
        for context in contexts[20:]:
            db.session.delete(context)
        db.session.commit()

def askAiWithPast(prompt: str, user_id: int, modelname: str = "gemini-2.0-flash-thinking-exp-1219") -> str:
    """
    Queries the database for all the user's chats and messages, creates embeddings, and queries Gemini AI using the provided prompt.

    Parameters:
    - prompt (str): The user query.
    - user_id (int): The ID of the user.
    - modelname (str): Gemini AI model to use (default: "gemini-2.0-flash-thinking-exp-1219").

    Returns:
    - str: The AI response in plain text format.
    """
    # Get API Key from environment variable
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GOOGLE_API_KEY in environment variables.")

    print("With past:")

    # Query the database for the user's chats and messages
    user = User.query.get(user_id)
    user_name = user.username if user else "User"
    user_chats = Chat.query.filter_by(user_id=user_id).all()
    user_messages = Message.query.filter(Message.chat_id.in_([chat.id for chat in user_chats])).all()

    # Combine all messages into a single text
    combined_text = ""
    for chat in user_chats:
        combined_text += f"Chat Name: {chat.name}\nChat ID: {chat.id}\n"
        chat_messages = [message for message in user_messages if message.chat_id == chat.id]
        for message in chat_messages:
            combined_text += f"User: {message.prompt}\nAI: {message.response}\n\n"

    # Split text into chunks
    text_splitter = NLTKTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = text_splitter.split_text(combined_text)

    # Generate embeddings
    embedding_model = GoogleGenerativeAIEmbeddings(google_api_key=api_key, model="models/embedding-001")
    db = Chroma.from_texts(chunks, embedding_model, persist_directory="./chroma_db")
    db.persist()
    retriever = db.as_retriever(search_kwargs={"k": 5})

    # Define chat template
    chat_template = ChatPromptTemplate.from_messages([
                SystemMessagePromptTemplate.from_template(f"""
                You are an AI assistant. Answer the user's questions based on the given context. The user's name is {user_name}. Be concise and provide accurate information.
                """),
        HumanMessagePromptTemplate.from_template("""
        Context: {context}
        Question: {question}
        Answer (in plain text format): """)
    ])

    # Define AI model
    chat_model = ChatGoogleGenerativeAI(google_api_key=api_key, model=modelname)
    output_parser = StrOutputParser()

    # Format documents for retrieval
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    # Build the RAG chain
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | chat_template
        | chat_model
        | output_parser
    )

    # Retrieve the conversation context from the database
    conversation_context = get_conversation_context(user_id)

    # Add the current prompt to the conversation context
    conversation_context += f"User: {prompt}\n"

    # Concatenate the conversation context into a single string
    full_prompt = conversation_context

    # Invoke the model with the user prompt
    response = rag_chain.invoke(full_prompt)

    # Add the AI response to the conversation context
    conversation_context += f"AI: {response.strip()}\n"

    # Save the updated conversation context to the database
    save_conversation_context(user_id, conversation_context)

    return response.strip()