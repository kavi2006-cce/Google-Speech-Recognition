import pyttsx3

class Speaker:
    """Handles text-to-speech output."""
    
    def __init__(self):
        self.engine = pyttsx3.init()
        # Configure voice properties
        self.engine.setProperty('rate', 150)  # Speed
        self.engine.setProperty('volume', 1.0)  # Volume
    
    def speak(self, text):
        """Speak the given text."""
        print("Assistant:", text)
        self.engine.say(text)
        self.engine.runAndWait()
    
    def set_rate(self, rate):
        """Set speech rate."""
        self.engine.setProperty('rate', rate)
    
    def set_volume(self, volume):
        """Set speech volume (0.0 to 1.0)."""
        self.engine.setProperty('volume', volume)
    
    def get_voices(self):
        """Get available voices."""
        return self.engine.getProperty('voices')
    
    def set_voice(self, voice_id):
        """Set voice by ID."""
        self.engine.setProperty('voice', voice_id)