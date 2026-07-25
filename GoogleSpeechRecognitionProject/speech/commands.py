import webbrowser

class CommandHandler:
    """Handles voice commands and executes actions."""
    
    def __init__(self, speaker):
        self.speaker = speaker
        self.commands = {
            'youtube': self.open_youtube,
            'google': self.open_google,
            'hello': self.greet,
            'hi': self.greet,
            'time': self.get_time,
            'date': self.get_date,
        }
    
    def execute(self, command):
        """Execute the appropriate command."""
        command = command.lower()
        
        for key, action in self.commands.items():
            if key in command:
                return action()
        
        self.speaker.speak("Sorry, I did not understand that command.")
        return "Unknown command"
    
    def open_youtube(self):
        """Open YouTube in browser."""
        self.speaker.speak("Opening YouTube")
        webbrowser.open("https://www.youtube.com")
        return "Opened YouTube"
    
    def open_google(self):
        """Open Google in browser."""
        self.speaker.speak("Opening Google")
        webbrowser.open("https://www.google.com")
        return "Opened Google"
    
    def greet(self):
        """Greet the user."""
        self.speaker.speak("Hello! How can I help you?")
        return "Greeted user"
    
    def get_time(self):
        """Tell the current time."""
        from datetime import datetime
        time = datetime.now().strftime("%I:%M %p")
        self.speaker.speak(f"The time is {time}")
        return f"Time: {time}"
    
    def get_date(self):
        """Tell the current date."""
        from datetime import datetime
        date = datetime.now().strftime("%B %d, %Y")
        self.speaker.speak(f"Today's date is {date}")
        return f"Date: {date}"