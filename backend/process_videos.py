from ingest import ingest_video

video_a = input("Enter Video A URL: ")
video_b = input("Enter Video B URL: ")

print("\nProcessing Video A...")
result_a = ingest_video(video_a, "A")

print("\nProcessing Video B...")
result_b = ingest_video(video_b, "B")

print("\nDone!")
print(result_a)
print(result_b)