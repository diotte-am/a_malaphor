import React from 'react';

export default function Home() {
  const projects = [
    {
      id: 1,
      title: "Entity Graph Extraction Pipeline",
      description: "Localized transcript parsing and knowledge graph extraction using Python, local LLMs, and Neo4j.",
      tags: ["Python", "Neo4j", "Ollama"],
      githubUrl: "https://github.com/diotte-am/a_malaphor",
    },
    {
      id: 2,
      title: "Community Coalition Web App",
      description: "Accessible React platform featuring custom domain routing, video metadata extraction, and dynamic staff listings.",
      tags: ["React", "JavaScript", "CSS Modules"],
      githubUrl: "https://github.com/diotte-am",
    }
  ];

  const posts = [
    {
      id: 1,
      title: "Building an Local LLM Knowledge Graph Pipeline",
      date: "2026-07-15",
      summary: "Handling local model formatting constraints and Mac OS permissions when parsing transcripts into Neo4j."
    },
    {
      id: 2,
      title: "Managing State Decay in Virtual React Applications",
      date: "2026-06-02",
      summary: "Architecting real-time metric counters and component state tracking cleanly without unnecessary re-renders."
    }
  ];

  return (
    <div className="layout-container">
      {/* Hero Intro */}
      <header className="hero-section">
        <h1>Amare</h1>
        <p className="subtitle">
          Computer Science & Data Operations | Building web applications, data extraction pipelines, and technical write-ups.
        </p>
      </header>

      {/* Projects Grid */}
      <section className="section-block">
        <h2>Featured Projects</h2>
        <div className="card-grid">
          {projects.map((project) => (
            <article key={project.id} className="content-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tag-group">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="card-actions">
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  View Source &rarr;
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Recent Writing */}
      <section className="section-block">
        <h2>Writing & Notes</h2>
        <div className="list-group">
          {posts.map((post) => (
            <article key={post.id} className="list-item-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <time>{post.date}</time>
              </div>
              <p>{post.summary}</p>
              <a href="#/writing">Read Write-up &rarr;</a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}