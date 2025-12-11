from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader, CSVLoader, TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
import glob
from dotenv import load_dotenv
from docx import Document
# Load environment variables
load_dotenv()

# Constants
DATA_PATH = "data/"
DB_NAME = "vector_db"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)


def load_docx(file_path):
    """Load content from a .docx file."""
    doc = Document(file_path)
    content = []
    for paragraph in doc.paragraphs:
        if paragraph.text.strip():  
            content.append(paragraph.text.strip())
    return [{"page_content": "\n".join(content), "metadata": {"source": file_path}}]

def load_documents_from_path(path, text_loader_kwargs=None):
    """Load documents based on file type."""
    if os.path.isdir(path):
        loader = DirectoryLoader(path, glob="**/*.*", loader_cls=TextLoader, loader_kwargs=text_loader_kwargs)
        return loader.load()
    elif os.path.isfile(path):
        if path.endswith(".txt") or path.endswith(".md"):
            loader = TextLoader(path, **text_loader_kwargs)
        elif path.endswith(".pdf"):
            loader = PyPDFLoader(path)
        elif path.endswith(".csv"):
            loader = CSVLoader(path)
        elif path.endswith(".docx"):
            loader = load_docx(path)
        else:
            print(f"Unsupported file type: {path}")
            return []
        return loader.load()
    else:
        print(f"Invalid path: {path}")
        return []

def process_documents(documents):
    """Split documents into smaller chunks."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    return text_splitter.split_documents(documents)

def build_vectorstore(documents, db_name, embeddings):
    """Build or update the vectorstore."""
    if os.path.exists(db_name):
        print(f"Deleting existing vectorstore at {db_name}...")
        Chroma(persist_directory=db_name, embedding_function=embeddings).delete_collection()

    print("Creating new vectorstore...")
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=db_name
    )
    print(f"Vectorstore created and persisted at {db_name}")
    return vectorstore

def main():
    text_loader_kwargs = {'autodetect_encoding': True}
    paths = glob.glob(f"{DATA_PATH}*")
    documents = []

    for path in paths:
        doc_type = os.path.basename(path)
        docs = load_documents_from_path(path, text_loader_kwargs)
        for doc in docs:
            doc.metadata["doc_type"] = doc_type
        documents.extend(docs)

    print(f"Total documents loaded: {len(documents)}")

    chunks = process_documents(documents)
    print(f"Created {len(chunks)} chunks")

    build_vectorstore(chunks, DB_NAME, embeddings)

if __name__ == "__main__":
    main()