# RAG Chatbot y tế trả lời câu hỏi và thắc mắc của bệnh nhân

Dự án này là một ví dụ minh họa cách ứng dụng kỹ thuật Retrieval-Augmented Generation (RAG) để xây dựng chatbot phục vụ tra cứu thông tin, giải đáp thắc mắc cho bệnh nhân giúp giảm tải áp lực cho bộ phận lễ tân và giúp người bệnh giải đáp các thắc mắc.

## Mục tiêu dự án

Trình bày toàn bộ quy trình xây dựng chatbot nội bộ sử dụng kỹ thuật RAG.

Ứng dụng phương pháp embedding vào truy xuất thông tin cung cấp thông tin chính xác cho người dùng.

Thực hành triển khai mô hình thực tế với công cụ như Langchain, Chroma, và OpenAI Embedding API.

## Các bước triển khai

### 1. Sử dụng Vector Embedding
   
Giới thiệu khái niệm semantic search thông qua việc chuyển đổi văn bản thành vector số học trong không gian nhiều chiều.

🔍 Một số mô hình embedding tiêu biểu:

Word2Vec	2013	[Link PDF](https://arxiv.org/pdf/1301.3781)

BERT	2018	[Link PDF](https://arxiv.org/pdf/1810.04805)

OpenAI Embedding	2024	[OpenAI Docs](https://platform.openai.com/docs/guides/embeddings)

### 2. Sử dụng Framework: Langchain

Trang chủ: https://www.langchain.com

Hỗ trợ tạo pipeline để tích hợp LLM + retriever + prompt templates nhanh chóng.

Tích hợp tốt với nhiều vector stores, bao gồm Chroma, FAISS, Pinecone, v.v.

### 3. Vector Store: ChromaDB

Trang chủ: https://www.trychroma.com

Dễ sử dụng, cài đặt nhanh, phù hợp với dự án nhỏ & vừa.

Hỗ trợ persist dữ liệu vector, metadata và document chunks.

## 4. Tối ưu hiệu suất của RAG

Dự án cũng triển khai thử nghiệm kỹ thuật Ensemble Hybrid Retrieval để cải thiện độ chính xác trong việc truy vấn thông tin

assets/image.png

📚 Tham khảo khóa học : [LLM Engineering: Master AI, Large Language Models & Agents](https://www.udemy.com/course/llm-engineering-master-ai-and-large-language-models/?srsltid=AfmBOor6WsNolL8DlWIY6aKr7422R23lNaEAPuO61pquAhMiqgvEOyVu&couponCode=KEEPLEARNING)

