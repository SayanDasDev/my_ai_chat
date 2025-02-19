import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)


def askGemini(prompt, model='gemini-2.0-flash') :
  model = genai.GenerativeModel(model)
  response = model.generate_content(prompt)

  return response.text