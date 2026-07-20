from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, srs, quiz, nlp

app = FastAPI(
    title="JLPT Sensei ML Service",
    description="Microservice providing AI Tutor, Smart SRS, and NLP features for JLPT Sensei.",
    version="1.0.0",
)

# Allow requests from the Django backend (which typically runs on 8000)
# and frontend (which typically runs on 3000)
origins = [
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router, prefix="/ml/chat", tags=["AI Tutor"])
app.include_router(srs.router, prefix="/ml/srs", tags=["Smart SRS"])
app.include_router(quiz.router, prefix="/ml/quiz", tags=["Adaptive Quiz"])
app.include_router(nlp.router, prefix="/ml/nlp", tags=["NLP Utilities"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "jlpt-ml-service"}
