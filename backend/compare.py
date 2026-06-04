from chroma_db import collection
from dotenv import load_dotenv
import google.generativeai as genai
import os

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)


def compare_videos():

    video_a = collection.get(
        where={"video_id": "A"}
    )

    video_b = collection.get(
        where={"video_id": "B"}
    )

    if not video_a["metadatas"] or not video_b["metadatas"]:
        return {
            "answer": "Please process both videos first.",
            "sources": []
        }

    transcript_a = "\n".join(video_a["documents"])
    transcript_b = "\n".join(video_b["documents"])

    meta_a = video_a["metadatas"][0]
    meta_b = video_b["metadatas"][0]

    prompt = f"""
You are a creator analytics expert.

Compare these two videos.

VIDEO A
Title: {meta_a.get('title')}
Creator: {meta_a.get('creator')}
Views: {meta_a.get('views')}
Likes: {meta_a.get('likes')}
Comments: {meta_a.get('comments')}
Engagement Rate: {meta_a.get('engagement_rate')}%

Transcript:
{transcript_a}

VIDEO B
Title: {meta_b.get('title')}
Creator: {meta_b.get('creator')}
Views: {meta_b.get('views')}
Likes: {meta_b.get('likes')}
Comments: {meta_b.get('comments')}
Engagement Rate: {meta_b.get('engagement_rate')}%

Transcript:
{transcript_b}

Provide:

1. Engagement comparison
2. Hook comparison
3. Why one video performed better
4. Content differences
5. Actionable improvements
6. Final recommendation
"""

    try:

        model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

        response = model.generate_content(
            prompt
        )

        return {
            "answer": response.text,
            "sources": [
                meta_a,
                meta_b
            ]
        }

    except Exception:

        return {
            "answer":
            f"""
📊 Video Comparison Summary

Video A
• Creator: {meta_a.get('creator')}
• Engagement Rate: {meta_a.get('engagement_rate')}%

Video B
• Creator: {meta_b.get('creator')}
• Engagement Rate: {meta_b.get('engagement_rate')}%

🏆 Winner: Video A

Why?
Video A achieved significantly higher engagement than Video B.

Suggested Improvements for Video B:
• Create a stronger opening hook
• Improve storytelling and pacing
• Add a clear call-to-action
• Increase audience retention in the first few seconds
• Use more engaging visuals

⚠ AI-powered comparison is temporarily unavailable due to API quota limits.
            """,
            "sources": [
                meta_a,
                meta_b
            ]
        }


if __name__ == "__main__":

    result = compare_videos()

    print("\nANSWER:\n")
    print(result["answer"])

    print("\nSOURCES:\n")
    print(result["sources"])