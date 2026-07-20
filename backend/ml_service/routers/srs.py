from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta

router = APIRouter()

class ReviewItem(BaseModel):
    user_id: int
    content_type: str
    content_id: int
    correct_count: int
    incorrect_count: int
    response_time_ms: int
    ease_factor: float
    interval_days: int

class PredictRecallRequest(BaseModel):
    items: List[ReviewItem]

@router.post("/batch-predict-recall")
async def batch_predict_recall(request: PredictRecallRequest):
    """
    Predict probability of recall and optimal next review date.
    Uses a stubbed Half-Life Regression logic for now.
    """
    predictions = []
    for item in request.items:
        # Stubbed logic: just add interval days to today
        # In a real model, this would use features to predict P(recall) and optimize h
        next_date = datetime.now() + timedelta(days=max(1, int(item.ease_factor * item.interval_days)))
        predictions.append({
            "content_id": item.content_id,
            "content_type": item.content_type,
            "predicted_recall": 0.85, # Stub
            "next_review_date": next_date.isoformat(),
            "interval_days": max(1, int(item.ease_factor * item.interval_days))
        })
    
    return {"predictions": predictions}
