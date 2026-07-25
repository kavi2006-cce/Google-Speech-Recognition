from flask import Flask
app = Flask(__name__)

app.secret_key = "your_secret_key"

@app.route("/")
def home():
    return "AI Surveillance System Running"

if __name__ == "__main__":
    app.run(debug=True)