import os
from dotenv import load_dotenv
import google.generativeai as genai

from chroma_db import collection
from memory_graph import graph

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def ask_question(question):

    question_lower = question.lower()

    # ----------------------------
    # Direct Metadata Retrieval
    # ----------------------------

    if "video a" in question_lower:

        video_a = collection.get(
            where={"video_id": "A"}
        )

        if video_a["metadatas"]:

            meta = video_a["metadatas"][0]

            if "creator" in question_lower:

                answer = (
                    f"Video A was created by "
                    f"{meta['creator']}."
                )

                return {
                    "answer": answer,
                    "sources": [meta]
                }

            if "engagement" in question_lower:

                answer = (
                    f"Video A has an engagement rate "
                    f"of {meta['engagement_rate']}%."
                )

                return {
                    "answer": answer,
                    "sources": [meta]
                }

            if "views" in question_lower:

                answer = (
                    f"Video A has "
                    f"{meta['views']} views."
                )

                return {
                    "answer": answer,
                    "sources": [meta]
                }

            if "likes" in question_lower:

                answer = (
                    f"Video A has "
                    f"{meta['likes']} likes."
                )

                return {
                    "answer": answer,
                    "sources": [meta]
                }

    if "video b" in question_lower:

        video_b = collection.get(
            where={"video_id": "B"}
        )

        if video_b["metadatas"]:

            meta = video_b["metadatas"][0]

            if "creator" in question_lower:

                answer = (
                    f"Video B was created by "
                    f"{meta['creator']}."
                )

                return {
                    "answer": answer,
                    "sources": [meta]
                }

            if "engagement" in question_lower:

                answer = (
                    f"Video B has an engagement rate "
                    f"of {meta['engagement_rate']}%."
                )

                return {
                    "answer": answer,
                    "sources": [meta]
                }

            if "views" in question_lower:

                answer = (
                    f"Video B has "
                    f"{meta['views']} views."
                )

                return {
                    "answer": answer,
                    "sources": [meta]
                }

            if "likes" in question_lower:

                answer = (
                    f"Video B has "
                    f"{meta['likes']} likes."
                )

                return {
                    "answer": answer,
                    "sources": [meta]
                }

    # ----------------------------
    # Vector Search
    # ----------------------------

    results = collection.query(
    query_texts=[question],
    n_results=2
)

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    context = "\n".join(documents)

    metadata_text = ""

    for meta in metadatas:

        metadata_text += f"""
Video ID: {meta.get('video_id')}
Title: {meta.get('title')}
Creator: {meta.get('creator')}
Views: {meta.get('views')}
Likes: {meta.get('likes')}
Comments: {meta.get('comments')}
Engagement Rate: {meta.get('engagement_rate')}
Duration: {meta.get('duration')}
Upload Date: {meta.get('upload_date')}
Chunk ID: {meta.get('chunk_id')}
"""

    prompt = f"""
You are a creator analytics assistant.

Transcript Context:
{context}

Video Metadata:
{metadata_text}

Question:
{question}

Instructions:
- Answer only using provided transcript and metadata.
- Mention video IDs when relevant.
- Compare videos when asked.
- Do not invent information.
- If information is unavailable, say so.
"""

    try:

        response = model.generate_content(
            prompt
        )

        answer = response.text

    except Exception:

        answer = """
Gemini API is temporarily unavailable.

Relevant information found:

""" + metadata_text

    # ----------------------------
    # Store Memory
    # ----------------------------

    try:

        graph.invoke(
            {
                "question": question,
                "answer": answer
            },
            config={
                "configurable": {
                    "thread_id": "creator-chat"
                }
            }
        )

    except Exception:
        pass

    return {
        "answer": answer,
        "sources": metadatas
    }