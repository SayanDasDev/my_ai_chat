import os
import nltk
nltk.data.find('tokenizers/punkt')
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import NLTKTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

load_dotenv()


def askAiWithFile(prompt: str, filepath: str, modelname: str = "gemini-2.0-flash-thinking-exp-1219") -> str:
    """
    Loads a PDF file, extracts text, creates embeddings, and queries Gemini AI using the provided prompt.

    Parameters:
    - prompt (str): The user query.
    - filepath (str): Path to the PDF file.
    - modelname (str): Gemini AI model to use (default: "gemini-2.0-flash-thinking-exp-1219").

    Returns:
    - str: The AI response in Markdown format.
    """
    # Get API Key from environment variable
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GOOGLE_API_KEY in environment variables.")

    # Load the document
    loader = PyPDFLoader(filepath)
    pages = loader.load_and_split()

    # Split text into chunks
    text_splitter = NLTKTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = text_splitter.split_documents(pages)

    # Generate embeddings
    embedding_model = GoogleGenerativeAIEmbeddings(google_api_key=api_key, model="models/embedding-001")
    db = Chroma.from_documents(chunks, embedding_model, persist_directory="./chroma_db")
    db.persist()
    retriever = db.as_retriever(search_kwargs={"k": 5})

    # Define chat template
    chat_template = ChatPromptTemplate.from_messages([
        HumanMessagePromptTemplate.from_template("""
        Answer the question based on the given context.
        Context: {context}
        Question: {question}
        Answer (in Markdown format): """)
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
    return response.strip()
