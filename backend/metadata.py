from yt_dlp import YoutubeDL

def get_youtube_metadata(url):

    ydl_opts = {
        "quiet": True
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(
            url,
            download=False
        )

    title = info.get("title")
    views = info.get("view_count", 0)
    likes = info.get("like_count", 0)
    comments = info.get("comment_count", 0)
    creator = info.get("channel")
    duration = info.get("duration")
    upload_date = info.get("upload_date")
    thumbnail = info.get("thumbnail")

    engagement_rate = 0

    if views:
        engagement_rate = round(
            ((likes + comments) / views) * 100,
            2
        )

    return {
        "title": title,
        "views": views,
        "likes": likes,
        "comments": comments,
        "creator": creator,
        "duration": duration,
        "upload_date": upload_date,
        "engagement_rate": engagement_rate,
        "thumbnail": thumbnail
    }