import React from 'react';
import { Link } from 'react-router-dom';

export default function PageLayout({ title, description, items }) {
  return (
    <div className="layout-container">
      {/* Free-standing page title */}
      <header className="page-header">
        <h1>{title}</h1>
      </header>

      {/* Description block in a subtle card */}
      <div className="subtle-card">
        <p className="page-description">{description}</p>
      </div>

      {/* Grid of detail item links */}
      <section className="item-links-section">
        <div className="item-grid">
          {items && items.map((item, index) => (
            <Link key={index} to={item.url} className="subtle-card item-card-link">
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
              <span className="item-action">View details &rarr;</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}