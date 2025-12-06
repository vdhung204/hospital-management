from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.llms import Ollama
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.callbacks import StdOutCallbackHandler

MESSAGE_SYSTEM = "Bạn là nhân viên y tế, nhiệm vụ của bạn hỗ trợ người dùng tại Việt Nam trả lời các câu hỏi. Hãy trả lời các câu hỏi của họ một cách chính xác và thân thiện. Nếu bạn không biết câu trả lời, hãy nói rằng bạn không biết. Tuyệt đối không đưa ra lời khuyên cho họ, chỉ trả lời các câu hỏi bằng tiếng Việt, nếu người dùng hỏi bằng tiếng Anh hãy nói với họ là bạn chỉ tư vấn cho người Việt Nam không thể tư vấn cho họ và lịch sự xin lỗi. Luôn khuyến khích người dùng tham khảo ý kiến chuyên gia y tế. Hãy giữ thái độ tôn trọng và đồng cảm trong mọi tình huống, xưng hô là tôi và gọi người dùng là bạn."

#     prompt = f"{message_system}\n\nContext:\n{context}\n\nQuestion: {user_input}"

def initialize_components():
    """Initialize the LLM, embeddings, vectorstore, and memory."""
    llm = Ollama(model="mistral")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = Chroma(persist_directory="vector_db", embedding_function=embeddings)
    memory = ConversationBufferWindowMemory(memory_key='chat_history', return_messages=True)
    return llm, vectorstore, memory


def create_conversation_chain(llm, vectorstore, memory):
    """Create the conversational retrieval chain."""
    retriever = vectorstore.as_retriever()
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        callbacks=[StdOutCallbackHandler()]
    )
    return conversation_chain

def get_response(conversation_chain, vectorstore, user_input: str):
    """Process user input and return the chatbot's response."""
    results = vectorstore.similarity_search(user_input, k=5)
    context = "\n".join([doc.page_content for doc in results])

    prompt = f"{MESSAGE_SYSTEM}\n\nContext:\n{context}\n\nQuestion (trả lời bằng tiếng Việt): {user_input}"
    response = conversation_chain.invoke(prompt)
    
    return response["answer"]
