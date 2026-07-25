from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Recording Schemas
class RecordingBase(BaseModel):
    title: str
    transcript: str
    language: str = "en-US"
    language_name: str = "English (US)"
    confidence: float = 0.95
    duration_seconds: float = 0.0
    word_count: int = 0
    wpm: float = 0.0
    filler_words_count: int = 0
    emotion: str = "Neutral"
    is_favorite: bool = False

class RecordingCreate(RecordingBase):
    pass

class RecordingResponse(RecordingBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Speech Process Schema
class SpeechProcessRequest(BaseModel):
    audio_base64: Optional[str] = None
    language: str = "en-US"
    title: Optional[str] = None

class SpeechProcessResponse(BaseModel):
    transcript: str
    confidence: float
    duration_seconds: float
    word_count: int
    wpm: float
    filler_words_count: int
    detected_fillers: List[str]
    emotion: str
    language: str

# Settings Schemas
class SettingsBase(BaseModel):
    theme: str = "dark"
    default_language: str = "en-US"
    auto_save: bool = True
    auto_download: bool = False
    noise_reduction: bool = True
    voice_commands_enabled: bool = True
    recognition_speed: str = "normal"

class SettingsUpdate(SettingsBase):
    pass

class SettingsResponse(SettingsBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Analytics Summary Schema
class AnalyticsSummary(BaseModel):
    total_recordings: int
    today_recordings: int
    total_words: int
    avg_accuracy: float
    languages_used_count: int
    total_recording_time_minutes: float
    avg_wpm: float
    top_filler_words: List[dict]
    language_distribution: List[dict]
    daily_usage: List[dict]
