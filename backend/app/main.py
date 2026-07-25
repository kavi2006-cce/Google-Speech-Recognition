from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.config import settings
from app.database import engine, Base, SessionLocal
from app import models, auth
from app.api import auth as auth_router, speech, recordings, analytics, admin

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade AI Voice Recognition SaaS API powered by Google Speech Recognition",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(speech.router, prefix=settings.API_V1_STR)
app.include_router(recordings.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def seed_demo_data():
    db = SessionLocal()
    try:
        demo_user = db.query(models.User).filter(models.User.username == "demo_user").first()
        if not demo_user:
            demo_user = models.User(
                username="demo_user",
                email="demo@auraspeech.ai",
                password_hash=auth.get_password_hash("demo123"),
                role="admin"
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            # Seed sample recordings for immediate visualization
            samples = [
                {
                    "title": "Quarterly Product Strategy Briefing",
                    "transcript": "Welcome everyone to our Q3 strategy discussion. Today we are launching the new AI Voice Recognition feature powered by Google Speech API. The continuous streaming performance looks amazing and we expect a 40 percent boost in user engagement.",
                    "language": "en-US",
                    "language_name": "English (United States)",
                    "confidence": 0.98,
                    "duration_seconds": 24.5,
                    "word_count": 42,
                    "wpm": 102.8,
                    "filler_words_count": 1,
                    "emotion": "Energetic",
                    "is_favorite": True
                },
                {
                    "title": "தமிழ் குரல் அங்கீகார சோதனை (Tamil Speech Test)",
                    "transcript": "கூகிள் குரல் அங்கீகார தொழில்நுட்பம் மிகவும் துல்லியமாக செயல்படுகிறது. இந்த செயலி மூலம் நமது பேச்சை நேரடியாக உரையாக மாற்ற முடியும்.",
                    "language": "ta-IN",
                    "language_name": "Tamil (India)",
                    "confidence": 0.95,
                    "duration_seconds": 18.0,
                    "word_count": 19,
                    "wpm": 63.3,
                    "filler_words_count": 0,
                    "emotion": "Calm",
                    "is_favorite": True
                },
                {
                    "title": "AI Engineering Team Sync",
                    "transcript": "Basically we need to make sure that our noise reduction filter handles background noise seamlessly. You know, umm, the confidence scores must remain above 95 percent even in crowded office environments.",
                    "language": "en-US",
                    "language_name": "English (United States)",
                    "confidence": 0.92,
                    "duration_seconds": 31.0,
                    "word_count": 35,
                    "wpm": 67.7,
                    "filler_words_count": 3,
                    "emotion": "Focused",
                    "is_favorite": False
                }
            ]

            for sample in samples:
                rec = models.Recording(user_id=demo_user.id, **sample)
                db.add(rec)
            
            setting = models.UserSetting(user_id=demo_user.id)
            db.add(setting)
            db.commit()
    finally:
        db.close()

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "engine": "Google Speech Recognition API"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
