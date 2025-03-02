import ollama
from dotenv import load_dotenv

load_dotenv()


def askLocalAI(prompt, model='deepseek-r1:1.5b') :

  response = ollama.chat(model=model, messages=[{"role": "user", "content": prompt}])
  # print(response["message"]["content"])
  return response["message"]["content"]