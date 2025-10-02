import React, { useState, useEffect } from "react";
import StudentForm from "./StudentForm";

const COURSES = [
  "Mathematics", "Physics", "Computer Science", "Chemistry", "Biology",
  "History", "Economics", "Philosophy", "Engineering", "Art"
];

export default function StudentDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const res = await fetch("http://127.0.0.1:5000/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Unable to load students." });
      setTimeout(() => setMessage(null), 2000);
    }
  }

  async function addStudent(student) {
    try {
      const res = await fetch("http://127.0.0.1:5000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
      const body = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: body.error || "Failed to add student" });
        return;
      }
      setStudents(prev => [...prev, body]);
      setMessage({ type: "success", text: "Student added!" });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error while adding student" });
    }
  }

  async function deleteStudent(id) {
    if (!window.confirm("Delete this student?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/students/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setMessage({ type: "error", text: "Failed to delete student" });
        return;
      }
      setStudents(prev => prev.filter(s => s.id !== id));
      setMessage({ type: "success", text: "Student deleted" });
      setTimeout(() => setMessage(null), 1500);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error while deleting student" });
    }
  }

  async function editStudent(s) {
    const newName = prompt("New name", s.name);
    const newCourse = prompt("New course", s.course);
    if (!newName || !newCourse) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/students/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, course: newCourse })
      });
      if (!res.ok) {
        const body = await res.json();
        alert(body.error || "Failed to update student");
        return;
      }
      const updatedStudent = await res.json();
      setStudents(prev => prev.map(st => st.id === s.id ? updatedStudent : st));
      setMessage({ type: "success", text: "Student updated!" });
      setTimeout(() => setMessage(null), 1500);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error while updating student" });
    }
  }

  return (
    <div className="App">
      <h1>🎓 Student Record System</h1>
      <button 
        onClick={onLogout} 
        style={{ position: "absolute", right: 20, top: 20 }}
      >
        Logout
      </button>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="controls">
        <StudentForm courses={COURSES} onAdd={addStudent} />
      </div>

      <div className="grid">
        {students.map(s => (
          <div className="card" key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.course}</p>
            <div className="actions">
              <button className="edit" onClick={() => editStudent(s)}>Edit</button>
              <button className="delete" onClick={() => deleteStudent(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
