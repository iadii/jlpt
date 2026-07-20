from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    level: str = "n5"

@router.post("/completion")
async def chat_completion(request: ChatRequest):
    """
    Handle AI Tutor conversation.
    In a real implementation, this would use google-genai to call Gemini 2.0 Flash.
    """
    # Stub response
    return {
        "response": f"こんにちは！(Hello!) This is a stub AI response for your message: '{request.message}'",
        "grammar_refs": [],
        "corrections": [],
        "session_id": request.session_id or "new-session-123"
    }
