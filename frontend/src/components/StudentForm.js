import React, { useState } from 'react';

function StudentForm({ courses, onAdd }){
  const [name, setName] = useState('');
  const [course, setCourse] = useState(courses[0] || '');

  function handleSubmit(e){
    e.preventDefault();
    if(!name.trim()){ alert('Please enter a name'); return; }
    onAdd({ name: name.trim(), course });
    setName(''); setCourse(courses[0] || '');
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'flex',gap:8}}>
      <input type="text" placeholder="Enter name" value={name} onChange={e=>setName(e.target.value)} />
      <select value={course} onChange={e=>setCourse(e.target.value)}>
        {courses.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <button className="btn" type="submit">Add Student</button>
    </form>
  );
}

export default StudentForm;
