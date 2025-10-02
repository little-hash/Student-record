# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import json, os, hashlib

app = Flask(__name__)
CORS(app)

DB_FILE = os.path.join(os.path.dirname(__file__), "db.json")

# ---------------- Helper functions ----------------
def read_db():
    if not os.path.exists(DB_FILE):
        # create empty DB if missing
        with open(DB_FILE, "w") as f:
            json.dump({"users": [], "students": []}, f, indent=2)
    with open(DB_FILE, "r") as f:
        return json.load(f)

def write_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ---------------- Root ----------------
@app.route("/")
def home():
    return jsonify({"message": "Student Record System API"})

# ---------------- Signup ----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = read_db()
    users = data.get("users", [])
    req = request.json
    username = req.get("username")
    password = req.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if any(u["username"] == username for u in users):
        return jsonify({"error": "Username already exists"}), 400

    new_user = {
        "id": len(users) + 1,
        "username": username,
        "password": hash_password(password)
    }

    users.append(new_user)
    data["users"] = users
    write_db(data)
    return jsonify({"message": "User created"}), 201

# ---------------- Login ----------------
@app.route("/login", methods=["POST"])
def login():
    data = read_db()
    users = data.get("users", [])
    req = request.json
    username = req.get("username")
    password = req.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    
    hashed = hash_password(password)
    user = next((u for u in users if u["username"] == username and u["password"] == hashed), None)
    if user:
        return jsonify({"message": "Login successful", "user": {"id": user["id"], "username": user["username"]}})
    return jsonify({"error": "Invalid credentials"}), 401

# ---------------- Get all students ----------------
@app.route("/students", methods=["GET"])
def get_students():
    data = read_db()
    return jsonify(data.get("students", []))

# ---------------- Add student ----------------
@app.route("/students", methods=["POST"])
def add_student():
    data = read_db()
    students = data.get("students", [])

    req = request.json
    name = req.get("name")
    course = req.get("course")

    if not name or not course:
        return jsonify({"error": "Name and course are required"}), 400

    student = {
        "id": len(students) + 1,
        "name": name,
        "course": course
    }

    students.append(student)
    data["students"] = students
    write_db(data)
    return jsonify(student), 201

# ---------------- Update student ----------------
@app.route("/students/<int:id>", methods=["PUT", "PATCH"])
def update_student(id):
    data = read_db()
    students = data.get("students", [])
    req = request.json

    student = next((s for s in students if s["id"] == id), None)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    name = req.get("name")
    course = req.get("course")

    if not name or not course:
        return jsonify({"error": "Name and course are required"}), 400

    student["name"] = name
    student["course"] = course
    write_db(data)
    return jsonify(student)

# ---------------- Delete student ----------------
@app.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):
    data = read_db()
    students = data.get("students", [])
    student = next((s for s in students if s["id"] == id), None)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    students = [s for s in students if s["id"] != id]
    data["students"] = students
    write_db(data)
    return jsonify({"message": "Student deleted"}), 200

# ---------------- Run ----------------
if __name__ == "__main__":
    app.run(debug=True)

