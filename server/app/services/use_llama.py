import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()


def askLocalAI(prompt, model='deepseek-r1:1.5b') :
  # Using OpenRouter's DeepSeek R1 model instead of local Ollama
  response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
      "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
      "Content-Type": "application/json",
    },
    data=json.dumps({
      "model": "deepseek/deepseek-r1:free",
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ],
    })
  )
  
  # Parse the JSON response
  result = response.json()
  print(result)

  
  # Extract the content from the response
  return result["choices"][0]["message"]["content"]