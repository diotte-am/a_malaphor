import React from 'react';
import './TechStack.css';

export default function TechStack({ stack }) {
  if (!stack || stack.length === 0) return null;

  return (
    <div className="card-top-left-stack">
      {stack.map((tech, idx) => (
        <span key={idx} className="tech-badge">
          {tech}
        </span>
      ))}
    </div>
  );
}