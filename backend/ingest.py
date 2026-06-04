from whisper_transcript import get_transcript
from embedder import chunk_text
from chroma_db import collection
from metadata import get_youtube_metadata

def ingest_video(url, video_id):

    try:
        old = collection.get(
            where={"video_id": video_id}
        )

        if old["ids"]:
            collection.delete(
                ids=old["ids"]
            )

    except:
        pass

    transcript = get_transcript(url)

    video_metadata = get_youtube_metadata(url)

    chunks = chunk_text(transcript)

    for index, chunk in enumerate(chunks):

        collection.add(
            documents=[chunk],
            ids=[f"{video_id}_{index}"],
            metadatas=[{
                "video_id": video_id,
                "chunk_id": index,
                "title": video_metadata.get("title"),
                "creator": video_metadata.get("creator"),
                "views": video_metadata.get("views", 0),
"likes": video_metadata.get("likes", 0),
"comments": video_metadata.get("comments", 0),
                "engagement_rate": video_metadata.get("engagement_rate"),
                "duration": video_metadata.get("duration"),
                "upload_date": video_metadata.get("upload_date")
            }]
        )

    return {
    "video_id": video_id,
    "title": video_metadata.get("title"),
    "creator": video_metadata.get("creator"),
    "views": video_metadata.get("views"),
    "likes": video_metadata.get("likes"),
    "comments": video_metadata.get("comments"),

    "duration": video_metadata.get("duration"),
    "upload_date": video_metadata.get("upload_date"),

    "engagement_rate": video_metadata.get("engagement_rate"),
    "thumbnail": video_metadata.get("thumbnail"),
    "chunks_stored": len(chunks)
}