import yt_dlp
import whisper
import os
import uuid

model = whisper.load_model("base")

def get_transcript(url):

    unique_id = str(uuid.uuid4())

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": f"{unique_id}.%(ext)s",
        "quiet": False
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:

        info = ydl.extract_info(
            url,
            download=True
        )

        downloaded_file = ydl.prepare_filename(info)

    print("Downloaded:", downloaded_file)

    if not os.path.exists(downloaded_file):
        raise Exception(
            f"Downloaded file not found: {downloaded_file}"
        )

    result = model.transcribe(downloaded_file)

    os.remove(downloaded_file)

    return result["text"]