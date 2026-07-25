import speech_recognition as sr

class SpeechRecognizer:
    """Handles speech recognition using Google API."""
    
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
    
    def listen(self, timeout=5, phrase_time_limit=5):
        """Listen for speech input from microphone."""
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
        return audio
    
    def recognize(self, audio, language="en-IN"):
        """Recognize speech from audio using Google API."""
        return self.recognizer.recognize_google(audio, language=language).lower()
    
    def recognize_google_cloud(self, audio, credentials_json=None):
        """Recognize speech using Google Cloud Speech-to-Text."""
        return self.recognizer.recognize_google_cloud(audio, credentials_json=credentials_json)