from fastapi import FastAPI
from pydantic import BaseModel
from bot.chatbot import initialize_components, create_conversation_chain, get_response

app = FastAPI()

llm, vectorstore, memory = initialize_components()
conversation_chain = create_conversation_chain(llm, vectorstore, memory)

class ChatRequest(BaseModel):
    user_input: str

@app.get("/")
def home():
    return {"message": "Chatbot API is running!"}

@app.post("/chat")
def chat(request: ChatRequest):
    try:
        response = get_response(conversation_chain, vectorstore, request.user_input)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}