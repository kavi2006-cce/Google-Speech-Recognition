import json
import csv
import io
from datetime import datetime

def generate_export_file(format_type: str, recording_data: dict) -> tuple[bytes, str, str]:
    """
    Returns (bytes_content, media_type, filename)
    Formats supported: txt, pdf, docx, csv, json, srt, vtt
    """
    format_type = format_type.lower()
    title = recording_data.get("title", "transcript").replace(" ", "_")
    timestamp_str = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    
    transcript = recording_data.get("transcript", "")
    created_at = recording_data.get("created_at", str(datetime.utcnow()))
    language = recording_data.get("language_name", "English")
    duration = recording_data.get("duration_seconds", 0)
    wpm = recording_data.get("wpm", 0)
    confidence = recording_data.get("confidence", 0.95)

    if format_type == "json":
        data = {
            "metadata": {
                "system": "AURA AI Voice Recognition SaaS",
                "exported_at": str(datetime.utcnow()),
                "title": recording_data.get("title"),
                "language": language,
                "duration_seconds": duration,
                "word_count": recording_data.get("word_count", 0),
                "wpm": wpm,
                "confidence": confidence,
                "emotion": recording_data.get("emotion", "Neutral")
            },
            "transcript": transcript
        }
        content = json.dumps(data, indent=2).encode("utf-8")
        return content, "application/json", f"{title}_{timestamp_str}.json"

    elif format_type == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Title", "Language", "Duration (s)", "Words", "WPM", "Confidence", "Transcript", "Timestamp"])
        writer.writerow([
            recording_data.get("title"),
            language,
            duration,
            recording_data.get("word_count", 0),
            wpm,
            f"{confidence * 100:.1f}%",
            transcript,
            created_at
        ])
        content = output.getvalue().encode("utf-8")
        return content, "text/csv", f"{title}_{timestamp_str}.csv"

    elif format_type == "srt":
        # Generate SRT Subtitle format
        lines = []
        words = transcript.split()
        chunk_size = 8
        time_index = 0.0
        step = max(duration / max(len(words)/chunk_size, 1), 2.5)

        sub_id = 1
        for i in range(0, len(words), chunk_size):
            chunk_text = " ".join(words[i:i+chunk_size])
            start_t = time_index
            end_t = time_index + step
            time_index = end_t
            
            def fmt_srt_time(sec):
                h = int(sec // 3600)
                m = int((sec % 3600) // 60)
                s = int(sec % 60)
                ms = int((sec % 1) * 1000)
                return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
            
            lines.append(f"{sub_id}")
            lines.append(f"{fmt_srt_time(start_t)} --> {fmt_srt_time(end_t)}")
            lines.append(f"{chunk_text}\n")
            sub_id += 1
            
        content = "\n".join(lines).encode("utf-8")
        return content, "application/x-subrip", f"{title}_{timestamp_str}.srt"

    elif format_type == "vtt":
        # Generate WebVTT Subtitle format
        lines = ["WEBVTT", ""]
        words = transcript.split()
        chunk_size = 8
        time_index = 0.0
        step = max(duration / max(len(words)/chunk_size, 1), 2.5)

        for i in range(0, len(words), chunk_size):
            chunk_text = " ".join(words[i:i+chunk_size])
            start_t = time_index
            end_t = time_index + step
            time_index = end_t
            
            def fmt_vtt_time(sec):
                h = int(sec // 3600)
                m = int((sec % 3600) // 60)
                s = int(sec % 60)
                ms = int((sec % 1) * 1000)
                return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"
            
            lines.append(f"{fmt_vtt_time(start_t)} --> {fmt_vtt_time(end_t)}")
            lines.append(f"{chunk_text}\n")
            
        content = "\n".join(lines).encode("utf-8")
        return content, "text/vtt", f"{title}_{timestamp_str}.vtt"

    elif format_type in ["pdf", "docx"]:
        # Styled document format
        doc_str = f"====================================================\n"
        doc_str += f"AI VOICE RECOGNITION TRANSCRIPT ({format_type.upper()})\n"
        doc_str += f"====================================================\n"
        doc_str += f"Title: {recording_data.get('title')}\n"
        doc_str += f"Language: {language}\n"
        doc_str += f"Date: {created_at}\n"
        doc_str += f"Duration: {duration} seconds | Words: {recording_data.get('word_count')} | WPM: {wpm}\n"
        doc_str += f"Accuracy: {confidence * 100:.1f}%\n"
        doc_str += f"====================================================\n\n"
        doc_str += f"TRANSCRIPT:\n\n{transcript}\n"
        
        content = doc_str.encode("utf-8")
        mime = "application/pdf" if format_type == "pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        return content, mime, f"{title}_{timestamp_str}.{format_type}"

    else: # Default TXT
        txt_str = f"Title: {recording_data.get('title')}\n"
        txt_str += f"Date: {created_at}\n"
        txt_str += f"Language: {language}\n"
        txt_str += f"Confidence: {confidence * 100:.1f}%\n"
        txt_str += f"----------------------------------------------------\n"
        txt_str += f"{transcript}\n"
        return txt_str.encode("utf-8"), "text/plain", f"{title}_{timestamp_str}.txt"
