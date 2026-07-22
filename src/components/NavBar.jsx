import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">Amare</Link>
        <div className="nav-links">
          <Link to="/">Projects</Link>
          <Link to="/writing">Writing</Link>
        </div>
      </div>
    </nav>
  );
}