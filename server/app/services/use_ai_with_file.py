import os
import nltk
nltk.data.find('tokenizers/punkt')
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import NLTKTextSplitter
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from app.models import User, ConversationContext, db  # Import your database models

load_dotenv()

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

def askAiWithFile(prompt: str, filepath: str, filename: str, user_id: str, modelname: str = "gemini-2.0-flash-thinking-exp-1219") -> str:
    """
    Loads a PDF file, extracts text, creates embeddings, and queries Gemini AI using the provided prompt.

    Parameters:
    - prompt (str): The user query.
    - filepath (str): Path to the PDF file.
    - filename (str): Name of the file.
    - user_id (str): Name of the user.
    - modelname (str): Gemini AI model to use (default: "gemini-2.0-flash-thinking-exp-1219").

    Returns:
    - str: The AI response in Markdown format.
    """
    # Get API Key from environment variable
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GOOGLE_API_KEY in environment variables.")

    # Define the path for the persisted embeddings
    persist_directory = f"./chroma_db/{user_id}_{filename}"

    # Check if embeddings already exist
    if os.path.exists(persist_directory):
        db = Chroma(persist_directory=persist_directory, embedding_function=GoogleGenerativeAIEmbeddings(google_api_key=api_key, model="models/embedding-001"))
    else:
        # Load the document
        loader = PyPDFLoader(filepath)
        pages = loader.load_and_split()

        # Split text into chunks
        text_splitter = NLTKTextSplitter(chunk_size=500, chunk_overlap=100)
        chunks = text_splitter.split_documents(pages)

        # Generate embeddings
        embedding_model = GoogleGenerativeAIEmbeddings(google_api_key=api_key, model="models/embedding-001")
        db = Chroma.from_documents(chunks, embedding_model, persist_directory=persist_directory)
        db.persist()

    retriever = db.as_retriever(search_kwargs={"k": 5})

    user = User.query.get(user_id)
    user_name = user.username if user else "User"

    # Define chat template
    chat_template = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(f"""
        You are an AI assistant. Answer the user's questions only based on the given context. You can use your knowledge only if the context matches with the question. If the question is out of context. Answer with I did not find anything relevant in the given pdf. The user's name is {user_name}. The pdf file name is {filename}. Be concise and provide accurate information.
        """),
        HumanMessagePromptTemplate.from_template("""
        Context: {context}
        Question: {question}
        Answer (in text format): """)
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


    # Invoke the model with the user prompt
    response = rag_chain.invoke(prompt)

    save_conversation_context(user_id, prompt, response)

    return response.strip()