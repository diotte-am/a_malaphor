import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ProjectOverviewHero.css';

export default function ProjectOverviewHero({ overviewText, id }) {
  if (!overviewText) return null;

  return (
    <section id={id} className="project-overview-hero markdown-body">
      <ReactMarkdown>{overviewText}</ReactMarkdown>
    </section>
  );
}