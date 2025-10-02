import React from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage({ onLogin }) {
  return (
    <div className="page-container login-page">
      <LoginForm onLogin={onLogin} />
    </div>
  );
}
