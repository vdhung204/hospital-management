from fastapi import FastAPI
from pydantic import BaseModel
from bot.chatbot import chatbot_response

app = FastAPI()

class ChatRequest(BaseModel):
    user_input: str

@app.get("/")
def home():
    return {"message": "Chatbot API is running!"}

@app.post("/chat")
def chat(request: ChatRequest):
    try:
        response = chatbot_response(request.user_input)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}