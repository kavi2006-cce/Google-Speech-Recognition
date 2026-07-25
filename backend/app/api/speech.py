from fastapi import APIRouter, Depends, UploadFile, File, Form, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
import base64
import json

from app.database import get_db
from app import models, schemas, auth
from app.speech_engine import process_audio_file
from app.analytics import SUPPORTED_LANGUAGES, analyze_transcript

router = APIRouter(prefix="/speech", tags=["Speech Processing"])

@router.get("/languages")
def get_supported_languages():
    return {"languages": SUPPORTED_LANGUAGES}

@router.post("/process", response_model=schemas.SpeechProcessResponse)
async def process_speech(
    file: UploadFile = File(None),
    audio_base64: str = Form(None),
    language: str = Form("en-US"),
    title: str = Form("Voice Recording"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    audio_bytes = b""
    if file:
        audio_bytes = await file.read()
    elif audio_base64:
        # Strip data URL prefix if present
        if "," in audio_base64:
            audio_base64 = audio_base64.split(",")[1]
        audio_bytes = base64.b64decode(audio_base64)
    else:
        # Default mock sample audio process if neither provided
        audio_bytes = b"MOCK_AUDIO_HEADER_TEST"

    result = process_audio_file(audio_bytes, language=language)

    # Save to database automatically if user is authenticated
    lang_info = next((l for l in SUPPORTED_LANGUAGES if l["code"] == language), {"name": "English (US)"})
    
    new_recording = models.Recording(
        user_id=current_user.id,
        title=title,
        transcript=result["transcript"],
        language=language,
        language_name=lang_info["name"],
        confidence=result["confidence"],
        duration_seconds=result["duration_seconds"],
        word_count=result["word_count"],
        wpm=result["wpm"],
        filler_words_count=result["filler_words_count"],
        emotion=result["emotion"]
    )
    db.add(new_recording)
    db.commit()

    return result

@router.websocket("/stream")
async def websocket_speech_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            text_chunk = payload.get("text", "")
            lang = payload.get("language", "en-US")
            
            analysis = analyze_transcript(text_chunk, duration_seconds=3.0)
            
            response = {
                "status": "active",
                "chunk": text_chunk,
                "confidence": analysis["confidence"],
                "wpm": analysis["wpm"],
                "fillers": analysis["detected_fillers"],
                "emotion": analysis["emotion"]
            }
            await websocket.send_json(response)
    except WebSocketDisconnect:
        pass
