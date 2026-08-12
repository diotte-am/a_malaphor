import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ProjectOverviewHero.css';

export default function ProjectOverviewHero({ overviewText }) {
  if (!overviewText) return null;

  return (
    <section className="project-overview-hero subtle-card markdown-body">
      <ReactMarkdown>{overviewText}</ReactMarkdown>
    </section>
  );
}