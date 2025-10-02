import React, { useState } from 'react';

export default function SignupForm({ onSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert("User created successfully!");
        onSignup();  // navigate to login
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input 
        placeholder="Username" 
        value={username} 
        onChange={e => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      <button type="submit">Sign Up</button>
      <span className="page-toggle">
        Already have an account? <a href="/">Login</a>
      </span>
    </form>
  );
}
