import React from 'react';
import './ProjectSummaryCard.css';

export default function ProjectSummaryCard({ project }) {
  if (!project) return null;

  return (
    <header className="project-summary-card subtle-card">
      <h1 className="project-summary-title">{project.title}</h1>
      {project.description && <p className="project-summary-desc">{project.description}</p>}
      {project.stack && (
        <div className="project-stack">
          {project.stack.map((tech, index) => (
            <span key={index} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}