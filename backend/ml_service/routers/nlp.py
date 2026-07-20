from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class GrammarCheckRequest(BaseModel):
    text: str

class PronunciationScoreRequest(BaseModel):
    audio_s3_key: str
    expected_text: str

@router.post("/check-grammar")
async def check_grammar(request: GrammarCheckRequest):
    """
    Detect Japanese grammar errors.
    """
    # Stub response
    return {
        "original": request.text,
        "corrections": [],
        "is_correct": True
    }

@router.post("/score-pronunciation")
async def score_pronunciation(request: PronunciationScoreRequest):
    """
    Score pronunciation based on expected text vs ASR output.
    """
    # Stub response
    return {
        "score": 95.0,
        "feedback": "Excellent pronunciation!"
    }
