from flask import Flask, render_template, redirect, url_for, request, flash, jsonify, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import sqlite3
import os
import hashlib
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database paths
DATABASE = os.path.join(os.path.dirname(__file__), 'database', 'history.db')
USERS_DB = os.path.join(os.path.dirname(__file__), 'database', 'users.db')

# User class for Flask-Login
class User(UserMixin):
    def __init__(self, id, username, email):
        self.id = id
        self.username = username
        self.email = email

@login_manager.user_loader
def load_user(user_id):
    conn = sqlite3.connect(USERS_DB)
    c = conn.cursor()
    c.execute("SELECT id, username, email FROM users WHERE id = ?", (user_id,))
    user_data = c.fetchone()
    conn.close()
    if user_data:
        return User(user_data[0], user_data[1], user_data[2])
    return None

def init_db():
    """Initialize databases."""
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    os.makedirs(os.path.dirname(USERS_DB), exist_ok=True)
    
    # Users database
    conn = sqlite3.connect(USERS_DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  password_hash TEXT NOT NULL,
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()
    
    # History database
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS history
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER NOT NULL,
                  command TEXT NOT NULL,
                  response TEXT,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.commit()
    conn.close()

def hash_password(password):
    """Hash password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

# Routes
@app.route("/")
def home():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        conn = sqlite3.connect(USERS_DB)
        c = conn.cursor()
        c.execute("SELECT id, username, email, password_hash FROM users WHERE username = ?", (username,))
        user_data = c.fetchone()
        conn.close()
        
        if user_data and user_data[3] == hash_password(password):
            user = User(user_data[0], user_data[1], user_data[2])
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template("login.html")

@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return render_template("register.html")
        
        if len(password) < 6:
            flash('Password must be at least 6 characters', 'error')
            return render_template("register.html")
        
        try:
            conn = sqlite3.connect(USERS_DB)
            c = conn.cursor()
            c.execute("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                     (username, email, hash_password(password)))
            conn.commit()
            conn.close()
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash('Username or email already exists', 'error')
    
    return render_template("register.html")

@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("index.html", user=current_user)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))

@app.route("/history")
@login_required
def get_history():
    """Get command history for current user."""
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute("SELECT command, response, timestamp FROM history WHERE user_id = ? ORDER BY timestamp DESC", 
              (current_user.id,))
    history = c.fetchall()
    conn.close()
    return {"history": [{"command": h[0], "response": h[1], "timestamp": h[2]} for h in history]}

@app.route("/save_command", methods=['POST'])
@login_required
def save_command():
    data = request.get_json()
    command = data.get('command')
    response = data.get('response')
    
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute("INSERT INTO history (user_id, command, response) VALUES (?, ?, ?)", 
              (current_user.id, command, response))
    conn.commit()
    conn.close()
    return {"success": True}

@app.route("/clear_history", methods=['POST'])
@login_required
def clear_history():
    """Clear command history for current user."""
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute("DELETE FROM history WHERE user_id = ?", (current_user.id,))
    conn.commit()
    conn.close()
    return {"success": True}

init_db()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))