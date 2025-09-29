import React, { useState } from "react";
import StudentForm from "./StudentForm";

function StudentApp() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const courses = ["Math", "Science", "History"];

  function handleAdd(student) {
    setStudents([...students, student]);
  }

  // Filter students by name or course
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Student System</h2>

      {/* Add student form */}
      <StudentForm courses={courses} onAdd={handleAdd} />

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginTop: 10, width: "100%", padding: 8 }}
      />

      {/* Student list */}
      <ul>
        {filteredStudents.map((s, i) => (
          <li key={i}>
            {s.name} — <strong>{s.course}</strong>
          </li>
        ))}
      </ul>

      {filteredStudents.length === 0 && <p>No students found</p>}
    </div>
  );
}

export default StudentApp;
