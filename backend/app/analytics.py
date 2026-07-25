import re

FILLER_WORDS = [
    "like", "actually", "basically", "you know", "umm", "uh", "er", 
    "literally", "honestly", "i mean", "sort of", "kind of", "right"
]

SUPPORTED_LANGUAGES = [
    {"code": "en-US", "name": "English (United States)", "flag": "🇺🇸"},
    {"code": "en-IN", "name": "English (India)", "flag": "🇮🇳"},
    {"code": "en-GB", "name": "English (United Kingdom)", "flag": "🇬🇧"},
    {"code": "ta-IN", "name": "Tamil (India)", "flag": "🇮🇳"},
    {"code": "hi-IN", "name": "Hindi (India)", "flag": "🇮🇳"},
    {"code": "es-ES", "name": "Spanish (Spain)", "flag": "🇪🇸"},
    {"code": "fr-FR", "name": "French (France)", "flag": "🇫🇷"},
    {"code": "de-DE", "name": "German (Germany)", "flag": "🇩🇪"},
    {"code": "ja-JP", "name": "Japanese (Japan)", "flag": "🇯🇵"},
    {"code": "zh-CN", "name": "Chinese (Mandarin)", "flag": "🇨🇳"},
    {"code": "ar-SA", "name": "Arabic (Saudi Arabia)", "flag": "🇸🇦"},
    {"code": "pt-BR", "name": "Portuguese (Brazil)", "flag": "🇧🇷"},
    {"code": "ru-RU", "name": "Russian (Russia)", "flag": "🇷🇺"},
    {"code": "it-IT", "name": "Italian (Italy)", "flag": "🇮🇹"},
    {"code": "ko-KR", "name": "Korean (South Korea)", "flag": "🇰🇷"},
    {"code": "nl-NL", "name": "Dutch (Netherlands)", "flag": "🇳🇱"},
    {"code": "pl-PL", "name": "Polish (Poland)", "flag": "🇵🇱"},
    {"code": "tr-TR", "name": "Turkish (Turkey)", "flag": "🇹🇷"},
    {"code": "sv-SE", "name": "Swedish (Sweden)", "flag": "🇸🇪"},
    {"code": "da-DK", "name": "Danish (Denmark)", "flag": "🇩🇰"},
    {"code": "fi-FI", "name": "Finnish (Finland)", "flag": "🇫🇮"},
    {"code": "no-NO", "name": "Norwegian (Norway)", "flag": "🇳🇴"},
    {"code": "el-GR", "name": "Greek (Greece)", "flag": "🇬🇷"},
    {"code": "he-IL", "name": "Hebrew (Israel)", "flag": "🇮🇱"},
    {"code": "id-ID", "name": "Indonesian (Indonesia)", "flag": "🇮🇩"},
    {"code": "ms-MY", "name": "Malay (Malaysia)", "flag": "🇲🇾"},
    {"code": "th-TH", "name": "Thai (Thailand)", "flag": "🇹🇭"},
    {"code": "vi-VN", "name": "Vietnamese (Vietnam)", "flag": "🇻🇳"},
    {"code": "uk-UA", "name": "Ukrainian (Ukraine)", "flag": "🇺🇦"},
    {"code": "cs-CZ", "name": "Czech (Czech Republic)", "flag": "🇨🇿"},
    {"code": "hu-HU", "name": "Hungarian (Hungary)", "flag": "🇭🇺"},
    {"code": "ro-RO", "name": "Romanian (Romania)", "flag": "🇷🇴"},
    {"code": "sk-SK", "name": "Slovak (Slovakia)", "flag": "🇸🇰"},
    {"code": "bg-BG", "name": "Bulgarian (Bulgaria)", "flag": "🇧🇬"},
    {"code": "kn-IN", "name": "Kannada (India)", "flag": "🇮🇳"},
    {"code": "te-IN", "name": "Telugu (India)", "flag": "🇮🇳"},
    {"code": "ml-IN", "name": "Malayalam (India)", "flag": "🇮🇳"},
    {"code": "mr-IN", "name": "Marathi (India)", "flag": "🇮🇳"},
    {"code": "bn-IN", "name": "Bengali (India)", "flag": "🇮🇳"},
    {"code": "gu-IN", "name": "Gujarati (India)", "flag": "🇮🇳"},
    {"code": "pa-IN", "name": "Punjabi (India)", "flag": "🇮🇳"},
]

def analyze_transcript(transcript: str, duration_seconds: float = 10.0, base_confidence: float = 0.96):
    words = re.findall(r'\b\w+\b', transcript)
    word_count = len(words)
    
    # Calculate WPM
    minutes = max(duration_seconds / 60.0, 0.05)
    wpm = round(word_count / minutes, 1) if word_count > 0 else 0.0
    
    # Filler words detection
    lower_text = transcript.lower()
    detected_fillers = []
    filler_count = 0
    
    for filler in FILLER_WORDS:
        matches = len(re.findall(r'\b' + re.escape(filler) + r'\b', lower_text))
        if matches > 0:
            filler_count += matches
            detected_fillers.append(f"{filler} ({matches})")
            
    # Basic Emotion Heuristics
    emotion = "Neutral"
    if any(k in lower_text for k in ["amazing", "great", "fantastic", "exciting", "awesome", "love"]):
        emotion = "Energetic"
    elif any(k in lower_text for k in ["urgent", "important", "alert", "error", "fast", "asap"]):
        emotion = "Urgent"
    elif any(k in lower_text for k in ["system", "data", "report", "analysis", "project", "code"]):
        emotion = "Focused"
    elif any(k in lower_text for k in ["calm", "relax", "peace", "smooth", "steady"]):
        emotion = "Calm"

    # Confidence calculation tweak based on filler ratio
    filler_penalty = min(filler_count * 0.015, 0.12)
    confidence = max(round(base_confidence - filler_penalty, 3), 0.82)
    
    return {
        "word_count": word_count,
        "wpm": wpm,
        "filler_words_count": filler_count,
        "detected_fillers": detected_fillers,
        "emotion": emotion,
        "confidence": confidence
    }
