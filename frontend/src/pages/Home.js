// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="entry-screen">
      <div className="entry-card">
        <h1 className="entry-title">Sweet Shop</h1>
        <p className="entry-subtitle">Select how you want to login:</p>

        <div className="entry-buttons">
          <button
            className="entry-button primary"
            onClick={() => navigate('/user-login')}
          >
            Login as User
          </button>
          <button
            className="entry-button"
            onClick={() => navigate('/admin-login')}
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
