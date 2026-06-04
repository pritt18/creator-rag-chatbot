from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag import ask_question
from compare import compare_videos
from ingest import ingest_video
from chroma_db import collection

app = FastAPI(
    title="Creator RAG Chatbot API"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Request Models
# ==========================

class ChatRequest(BaseModel):
    question: str


class VideoRequest(BaseModel):
    video_a_url: str
    video_b_url: str


# ==========================
# Routes
# ==========================

@app.get("/")
def home():
    return {
        "message": "Creator RAG Chatbot API Running"
    }


@app.post("/chat")
def chat(request: ChatRequest):

    result = ask_question(
        request.question
    )

    return result


@app.get("/compare")
def compare():

    return compare_videos()


@app.post("/process-videos")
def process_videos(request: VideoRequest):

    result_a = ingest_video(
        request.video_a_url,
        "A"
    )

    result_b = ingest_video(
        request.video_b_url,
        "B"
    )

    return {
        "message": "Videos processed successfully",
        "video_a": result_a,
        "video_b": result_b
    }

@app.get("/transcript/{video_id}")
def get_transcript(video_id: str):

    result = collection.get(
        where={"video_id": video_id}
    )

    transcript = "\n".join(
        result["documents"]
    )

    return {
        "transcript": transcript
    }