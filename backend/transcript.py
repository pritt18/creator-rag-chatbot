from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled

def get_video_id(url):
    if "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]

    if "v=" in url:
        return url.split("v=")[1].split("&")[0]

    return None


def get_youtube_transcript(url):
    try:
        video_id = get_video_id(url)

        api = YouTubeTranscriptApi()

        transcript = api.fetch(video_id)

        return " ".join(
            [item.text for item in transcript]
        )

    except TranscriptsDisabled:
        return "Transcript unavailable"