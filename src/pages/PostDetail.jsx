import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import contentData from '../data/content.json';
import ProjectOverviewHero from '../components/ProjectOverviewHero';
import ComingSoon from '../components/ComingSoon';

export default function PostDetail() {
  const { category, slug, phaseSlug } = useParams();
  const [contentList, setContentList] = useState([]);
  const [overviewText, setOverviewText] = useState(null);
  const [loading, setLoading] = useState(true);

  const categoryItems = contentData[category]?.items || [];
  const project = categoryItems.find(item => item.url === `/${category}/${slug}`);

  const activePhase = project?.phases 
    ? project.phases.find(p => p.url === `/${category}/${slug}/${phaseSlug}`)
    : null;

  // Fallback links from phase to project level
  const activeGithub = activePhase?.githubUrl || project?.githubUrl;
  const activePages = activePhase?.pagesUrl || project?.pagesUrl;

  // Helper to check if a string is a valid URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  useEffect(() => {
    if (!project) {
      setLoading(false);
      return;
    }

    const markdownFiles = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default' });

    const overviewPromise = project.overviewFile && markdownFiles[`../content/${category}/${project.overviewFile}.md`]
      ? markdownFiles[`../content/${category}/${project.overviewFile}.md`]().then(text => setOverviewText(text))
      : Promise.resolve();

    if (project.phases && !phaseSlug) {
      overviewPromise.then(() => setLoading(false));
      return;
    }

    const target = activePhase || project;

    if (target.comingSoon) {
      overviewPromise.then(() => setLoading(false));
      return;
    }

    if (target.file) {
      const filePath = `../content/${category}/${target.file}.md`;
      if (markdownFiles[filePath]) {
        Promise.all([overviewPromise, markdownFiles[filePath]()]).then(([_, text]) => {
          setContentList([{ id: target.file, text }]);
          setLoading(false);
        });
      } else {
        overviewPromise.then(() => {
          setContentList([{ id: 'not-found', text: '*Markdown file not found.*' }]);
          setLoading(false);
        });
      }
    } else if (target.iterations) {
      Promise.all([
        overviewPromise,
        Promise.all(
          target.iterations.map(async (iter) => {
            const filePath = `../content/${category}/${iter.file}.md`;
            if (markdownFiles[filePath]) {
              const text = await markdownFiles[filePath]();
              return { version: iter.version, id: iter.file, text };
            }
            return { version: iter.version, id: iter.file, text: '*Iteration content missing.*' };
          })
        )
      ]).then(([_, results]) => {
        setContentList(results);
        setLoading(false);
      });
    } else {
      overviewPromise.then(() => setLoading(false));
    }
  }, [category, slug, phaseSlug, project, activePhase]);

  if (loading) return <div className="layout-container"><p>Loading...</p></div>;
  if (!project) return <div className="layout-container"><h2>Project not found</h2></div>;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (project.phases && !phaseSlug) {
    return (
      <div className="layout-container detail-page-container">
        <div className="detail-top-nav">
          <Link to={`/${category}`} className="back-link">&larr; Back to {category}</Link>
          
          {(activeGithub || activePages) && (
          <div className="project-links-badge">
            {activeGithub && (
              isValidUrl(activeGithub) ? (
                <a href={activeGithub} target="_blank" rel="noopener noreferrer" className="repo-link">
                  GitHub Repository &rarr;
                </a>
              ) : (
                <span className="repo-link status-badge">{activeGithub}</span>
              )
            )}
            {activePages && (
              isValidUrl(activePages) ? (
                <a href={activePages} target="_blank" rel="noopener noreferrer" className="repo-link">
                  Live Demo / Pages &rarr;
                </a>
              ) : (
                <span className="repo-link status-badge">{activePages}</span>
              )
            )}
          </div>
        )}
        </div>

        <ProjectOverviewHero overviewText={overviewText} stack={project.stack} id="summary" />

        <section className="item-links-section" style={{ marginTop: '2rem' }}>
          <h2>Project Phases</h2>
          <div className="item-grid" style={{ marginTop: '1rem' }}>
            {project.phases.map((phase, index) => (
              <Link key={index} to={phase.url} className="subtle-card item-card-link">
                <h3>{phase.name}</h3>
                <p>{phase.summary}</p>
                <span className="item-action">Explore phase &rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const target = activePhase || project;
  if (target.comingSoon) {
    return (
      <div className="layout-container detail-page-container">
        <div className="detail-top-nav">
          <Link to={project.phases ? project.url : `/${category}`} className="back-link">
            &larr; Back to {project.phases ? 'Project Overview' : category}
          </Link>
          {(activeGithub || activePages) && (
          <div className="project-links-badge">
            {activeGithub && (
              activeGithub.startsWith('http') ? (
                <a href={activeGithub} target="_blank" rel="noopener noreferrer" className="repo-link">
                  GitHub Repository &rarr;
                </a>
              ) : (
                <span className="repo-link status-badge">{activeGithub}</span>
              )
       )}
    {activePages && (
      activePages.startsWith('http') ? (
        <a href={activePages} target="_blank" rel="noopener noreferrer" className="repo-link">
          Live Demo / Pages &rarr;
        </a>
      ) : (
        <span className="repo-link status-badge">{activePages}</span>
      )
    )}
  </div>
)}
        </div>
        <ComingSoon title={target.name} message="This phase is currently under development. Check back soon for updates!" />
      </div>
    );
  }

  return (
    <div className={`layout-container detail-page-container ${activePhase?.iterations ? 'multi-iter-layout' : ''}`}>
      <div className="detail-top-nav">
        <Link to={project.phases ? project.url : `/${category}`} className="back-link">
          &larr; Back to {project.phases ? 'Project Overview' : category}
        </Link>
        
        {(activeGithub || activePages) && (
          <div className="project-links-badge">
            {activeGithub && (
              <a href={activeGithub} target="_blank" rel="noopener noreferrer" className="repo-link">
                GitHub Repository &rarr;
              </a>
            )}
            {activePages && (
              <a href={activePages} target="_blank" rel="noopener noreferrer" className="repo-link">
                Live Demo / Pages &rarr;
              </a>
            )}
          </div>
        )}
      </div>

      <div className={activePhase?.iterations ? 'project-container' : ''}>
        {activePhase?.iterations && (
          <aside className="iteration-nav-sidebar">
            <ul className="iteration-list">
              {overviewText && (
                <li>
                  <button onClick={() => scrollToSection('summary')} className="iteration-jump-btn summary-nav-btn">
                    Summary
                  </button>
                </li>
              )}
              {activePhase.iterations.map((iter) => (
                <li key={iter.file}>
                  <button onClick={() => scrollToSection(iter.file)} className="iteration-jump-btn">
                    {iter.version}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="project-main-column">
          <ProjectOverviewHero 
            overviewText={overviewText} 
            stack={activePhase?.stack || project.stack} 
            id="summary" 
          />

          <div className="iteration-feed">
            {contentList.map((item) => (
              <section key={item.id} id={item.id} className="subtle-card markdown-body iteration-section">
                {item.version && <span className="iteration-badge top-right">{item.version}</span>}
                <ReactMarkdown>{item.text}</ReactMarkdown>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}