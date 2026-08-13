import React from 'react';
import { Link } from 'react-router-dom';
import './ComingSoon.css';

export default function ComingSoon({ title = "Coming Soon", message = "This section is currently under development. Check back soon for updates!" }) {
  return (
    <div className="layout-container coming-soon-container">
      <div className="subtle-card coming-soon-card">
        <h2>{title}</h2>
        <p>{message}</p>
        <Link to={-1} className="back-link">&larr; Go Back</Link>
      </div>
    </div>
  );
}