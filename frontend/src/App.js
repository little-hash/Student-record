import React, { useEffect, useState } from 'react';
import StudentForm from './components/StudentForm';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

const COURSES = [
  'Mathematics','Physics','Computer Science','Chemistry','Biology',
  'History','Economics','Philosophy','Engineering','Art'
];

function App() {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);        // logged-in user
  const [showSignup, setShowSignup] = useState(false);  // toggle signup/login

  // fetch students only if logged in
  useEffect(() => { if(user) fetchStudents() }, [user]);

  async function fetchStudents(){
    try{
      const res = await fetch('http://127.0.0.1:5000/students');
      if(!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      setStudents(data);
    }catch(err){
      console.error('Fetch students failed', err);
      setMessage({type:'error', text:'Unable to load students. Backend may be down.'});
    }
  }

  async function addStudent(student){
    try{
      const res = await fetch('http://127.0.0.1:5000/students', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(student)
      });
      const body = await res.json();
      if(!res.ok){ setMessage({type:'error', text: body.error || 'Failed to add'}); return; }
      setStudents(prev => [...prev, body]);
      setMessage({type:'success', text:'Student added!'});
      setTimeout(()=>setMessage(null),2000);
    }catch(err){
      console.error(err);
      setMessage({type:'error', text:'Network error while adding student'});
    }
  }

  async function deleteStudent(id){
    if(!window.confirm('Delete this student?')) return;
    try{
      const res = await fetch(`http://127.0.0.1:5000/students/${id}`, { method:'DELETE'});
      if(!res.ok){ setMessage({type:'error', text:'Failed to delete'}); return; }
      setStudents(prev => prev.filter(s=>s.id!==id));
      setMessage({type:'success', text:'Student deleted'});
      setTimeout(()=>setMessage(null),1500);
    }catch(err){
      console.error(err);
      setMessage({type:'error', text:'Network error while deleting'});
    }
  }

  // handle login
  function handleLogin(u){
    setUser(u);
  }

  // handle logout
  function handleLogout(){
    setUser(null);
    setStudents([]);
  }

  if(!user){
    return (
      <div className="App">
        <h1>🎓 Student Record System</h1>
        {showSignup 
          ? <SignupForm onSignup={() => setShowSignup(false)} /> 
          : <LoginForm onLogin={handleLogin} />}
        <button onClick={() => setShowSignup(!showSignup)}>
          {showSignup ? "Back to Login" : "Sign Up"}
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>🎓 Student Record System</h1>
      <button onClick={handleLogout} style={{position:'absolute', right:20, top:20}}>Logout</button>
      {message && <div className={`message ${message.type==='success'?'success':'error'}`}>{message.text}</div>}
      <div className="controls">
        <StudentForm courses={COURSES} onAdd={addStudent} />
      </div>
      <div className="grid">
        {students.map(s=> (
          <div className="card" key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.course}</p>
            <div className="actions">
              <button className="edit" onClick={()=>{
                const newName = prompt('New name', s.name);
                const newCourse = prompt('New course', s.course);
                if(newName && newCourse){
                  fetch(`http://127.0.0.1:5000/students/${s.id}`, {
                    method:'PUT',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({name:newName, course:newCourse})
                  }).then(()=>fetchStudents())
                }
              }}>Edit</button>
              <button className="delete" onClick={()=>deleteStudent(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
