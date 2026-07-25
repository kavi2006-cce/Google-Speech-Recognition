from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app import models, schemas, auth
from app.exporters import generate_export_file

router = APIRouter(prefix="/recordings", tags=["Recordings Management"])

@router.get("", response_model=List[schemas.RecordingResponse])
def get_recordings(
    search: Optional[str] = None,
    language: Optional[str] = None,
    favorite_only: bool = False,
    sort_by: str = "newest",
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Recording).filter(models.Recording.user_id == current_user.id)
    
    if search:
        query = query.filter(
            (models.Recording.title.ilike(f"%{search}%")) | 
            (models.Recording.transcript.ilike(f"%{search}%"))
        )
    if language:
        query = query.filter(models.Recording.language == language)
    if favorite_only:
        query = query.filter(models.Recording.is_favorite == True)
        
    if sort_by == "oldest":
        query = query.order_by(models.Recording.created_at.asc())
    elif sort_by == "duration":
        query = query.order_by(models.Recording.duration_seconds.desc())
    elif sort_by == "words":
        query = query.order_by(models.Recording.word_count.desc())
    else:
        query = query.order_by(models.Recording.created_at.desc())

    return query.all()

@router.post("", response_model=schemas.RecordingResponse)
def create_recording(
    recording_in: schemas.RecordingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_rec = models.Recording(
        user_id=current_user.id,
        **recording_in.dict()
    )
    db.add(new_rec)
    db.commit()
    db.refresh(new_rec)
    return new_rec

@router.get("/{rec_id}", response_model=schemas.RecordingResponse)
def get_recording(
    rec_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    rec = db.query(models.Recording).filter(models.Recording.id == rec_id, models.Recording.user_id == current_user.id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recording not found")
    return rec

@router.put("/{rec_id}", response_model=schemas.RecordingResponse)
def update_recording(
    rec_id: int,
    recording_in: schemas.RecordingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    rec = db.query(models.Recording).filter(models.Recording.id == rec_id, models.Recording.user_id == current_user.id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recording not found")
    
    for field, val in recording_in.dict().items():
        setattr(rec, field, val)
    db.commit()
    db.refresh(rec)
    return rec

@router.delete("/{rec_id}")
def delete_recording(
    rec_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    rec = db.query(models.Recording).filter(models.Recording.id == rec_id, models.Recording.user_id == current_user.id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recording not found")
    db.delete(rec)
    db.commit()
    return {"success": True, "message": "Recording deleted"}

@router.post("/{rec_id}/favorite")
def toggle_favorite(
    rec_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    rec = db.query(models.Recording).filter(models.Recording.id == rec_id, models.Recording.user_id == current_user.id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recording not found")
    rec.is_favorite = not rec.is_favorite
    db.commit()
    return {"is_favorite": rec.is_favorite}

@router.get("/{rec_id}/export")
def export_recording(
    rec_id: int,
    format: str = Query("txt", description="Format: txt, pdf, docx, csv, json, srt, vtt"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    rec = db.query(models.Recording).filter(models.Recording.id == rec_id, models.Recording.user_id == current_user.id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recording not found")
    
    rec_dict = {
        "title": rec.title,
        "transcript": rec.transcript,
        "language_name": rec.language_name,
        "duration_seconds": rec.duration_seconds,
        "word_count": rec.word_count,
        "wpm": rec.wpm,
        "confidence": rec.confidence,
        "emotion": rec.emotion,
        "created_at": rec.created_at.strftime("%Y-%m-%d %H:%M:%S")
    }

    content, media_type, filename = generate_export_file(format, rec_dict)
    
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
