import React, { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) onLogin(data.user);
      else alert(data.error);
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      <button type="submit">Login</button>
      <span className="page-toggle">
        Don't have an account? <a href="/signup">Sign Up</a>
      </span>
    </form>
  );
}

