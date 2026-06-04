import chromadb

# Persistent local database
client = chromadb.PersistentClient(
    path="./chroma_db"
)

# Create collection if it doesn't exist
collection = client.get_or_create_collection(
    name="videos"
)