import speech_recognition as sr
import pyttsx3
import webbrowser

# Initialize recognizer
r = sr.Recognizer()

# Initialize text-to-speech engine
engine = pyttsx3.init()

def speak(text):
    print("Assistant:", text)
    engine.say(text)
    engine.runAndWait()

with sr.Microphone() as source:
    speak("Tell me your command")
    r.adjust_for_ambient_noise(source, duration=1)
    audio = r.listen(source, timeout=5, phrase_time_limit=5)

try:
    command = r.recognize_google(audio, language="en-IN").lower()
    print("You said:", command)

    if "youtube" in command:
        speak("Opening YouTube")
        webbrowser.open("https://www.youtube.com")

    elif "google" in command:
        speak("Opening Google")
        webbrowser.open("https://www.google.com")

    elif "hello" in command:
        speak("Hello, how can I help you?")

    else:
        speak("Sorry, I did not understand")

except sr.UnknownValueError:
    speak("I could not understand your voice")

except sr.RequestError:
    speak("Internet problem detected")

print("Program finished.")