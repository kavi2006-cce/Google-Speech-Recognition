# Google Speech Recognition Project

A Flask-based voice assistant application that uses Google Speech Recognition and text-to-speech capabilities.

## Features

- Voice command recognition using Google Speech API
- Text-to-speech responses
- Web interface for interaction
- Command history stored in SQLite database

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Open your browser at `http://localhost:5000`

## Usage

- Speak commands into your microphone
- Supported commands: "youtube", "google", "hello"
- View command history at `/history`

## Project Structure

```
GoogleSpeechRecognitionProject/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── templates/          # HTML templates
├── static/             # CSS, JS, images
├── speech/             # Speech recognition modules
└── database/           # SQLite database
```