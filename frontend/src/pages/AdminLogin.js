import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const saveSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('email', data.email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data.role !== 'admin') {
        setError('This account is not an admin');
        return;
      }
      saveSession(res.data);
      navigate('/admin');
    } catch (err) {
      setError('Admin login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/auth/register', {
        email,
        password,
        role: 'admin',
      });
      saveSession(res.data);
      navigate('/admin');
    } catch (err) {
      setError('Admin register failed');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1 className="login-title">ADMIN LOGIN</h1>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <span className="login-icon">👤</span>
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <span className="login-icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            LOGIN
          </button>

          <button
            type="button"
            className="login-secondary"
            onClick={handleRegister}
          >
            REGISTER
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
