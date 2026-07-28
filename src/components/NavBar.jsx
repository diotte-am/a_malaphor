// src/components/Navbar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          a_malaphor
        </Link>
        <div className="nav-links">
          <NavLink to="/code">Code</NavLink>
          <NavLink to="/make">Make</NavLink>
          <NavLink to="/teach">Teach</NavLink>
          <NavLink to="/collaborate">Collaborate</NavLink>
        </div>
      </div>
    </nav>
  );
}