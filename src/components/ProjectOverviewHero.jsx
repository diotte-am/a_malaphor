import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ProjectOverviewHero.css';

export default function ProjectOverviewHero({ overviewText, stack, id }) {
  if (!overviewText && (!stack || stack.length === 0)) return null;

  return (
    <section id={id} className="project-overview-hero markdown-body">
      {stack && stack.length > 0 && (
        <div className="overview-tech-stack">
          {stack.map((tech, idx) => (
            <span key={idx} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
      )}
      {overviewText && <ReactMarkdown>{overviewText}</ReactMarkdown>}
    </section>
  );
}