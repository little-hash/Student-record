from flask import Flask, jsonify, request
from flask_cors import CORS
import json, os, hashlib

app = Flask(__name__)
CORS(app)

DB_FILE = os.path.join(os.path.dirname(__file__), "db.json")

def read_db():
    with open(DB_FILE, "r") as f:
        return json.load(f)

def write_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

# Helper: hash password
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Root route
@app.route("/")
def home():
    return jsonify({"message": "Student Record System API (db.json)"})

#  Signup
@app.route("/signup", methods=["POST"])
def signup():
    data = read_db()
    users = data["users"]
    req = request.json
    username = req.get("username")
    password = req.get("password")
    
    if any(u["username"] == username for u in users):
        return jsonify({"error": "Username already exists"}), 400
    
    new_user = {
        "id": len(users)+1,
        "username": username,
        "password": hash_password(password)
    }
    users.append(new_user)
    write_db(data)
    return jsonify({"message": "User created"}), 201

#  Login
@app.route("/login", methods=["POST"])
def login():
    data = read_db()
    users = data["users"]
    req = request.json
    username = req.get("username")
    password = req.get("password")
    hashed = hash_password(password)
    
    user = next((u for u in users if u["username"] == username and u["password"] == hashed), None)
    if user:
        return jsonify({"message": "Login successful", "user": {"id": user["id"], "username": user["username"]}})
    return jsonify({"error": "Invalid credentials"}), 401

#  Students endpoints remain the same
@app.route("/students", methods=["GET"])
def get_students():
    data = read_db()
    return jsonify(data["students"])

@app.route("/students", methods=["POST"])
def add_student():
    data = read_db()
    students = data["students"]
    new_student = request.json
    new_student["id"] = len(students) + 1
    students.append(new_student)
    write_db(data)
    return jsonify(new_student), 201

if __name__ == "__main__":
    app.run(debug=True)
