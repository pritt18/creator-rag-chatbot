from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, StateGraph
from typing import TypedDict

class ChatState(TypedDict):
    question: str
    answer: str

memory = MemorySaver()

def chatbot(state: ChatState):
    return state

builder = StateGraph(ChatState)

builder.add_node("chatbot", chatbot)

builder.add_edge(START, "chatbot")

graph = builder.compile(
    checkpointer=memory
)