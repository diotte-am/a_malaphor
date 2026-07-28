import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import contentData from '../data/content.json';

export default function PostDetail() {
  const { category, slug } = useParams();
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryItems = contentData[category]?.items || [];
  const project = categoryItems.find(item => item.url === `/${category}/${slug}`);

  useEffect(() => {
    if (!project) {
      setLoading(false);
      return;
    }

    const markdownFiles = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default' });

    if (project.file) {
      const filePath = `../content/${category}/${project.file}.md`;
      if (markdownFiles[filePath]) {
        markdownFiles[filePath]().then((text) => {
          setContentList([{ id: project.file, text }]);
          setLoading(false);
        });
      } else {
        setContentList([{ id: 'not-found', text: '*Markdown file not found.*' }]);
        setLoading(false);
      }
    } else if (project.iterations) {
      Promise.all(
        project.iterations.map(async (iter) => {
          const filePath = `../content/${category}/${iter.file}.md`;
          if (markdownFiles[filePath]) {
            const text = await markdownFiles[filePath]();
            return { version: iter.version, id: iter.file, text };
          }
          return { version: iter.version, id: iter.file, text: '*Iteration content missing.*' };
        })
      ).then((results) => {
        setContentList(results);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [category, slug, project]);

  if (loading) return <div className="layout-container"><p>Loading...</p></div>;
  if (!project) return <div className="layout-container"><h2>Project not found</h2></div>;

  const scrollToIteration = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`layout-container ${project.iterations ? 'multi-iter-layout' : ''}`}>
      <div className="detail-top-nav">
        <Link to={`/${category}`} className="back-link">&larr; Back to {category}</Link>
        
        {/* GitHub & Pages Badge Links Header */}
        {(project.githubUrl || project.pagesUrl) && (
          <div className="project-links-badge">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="repo-link">
                GitHub Repository &rarr;
              </a>
            )}
            {project.pagesUrl && (
              <a href={project.pagesUrl} target="_blank" rel="noopener noreferrer" className="repo-link">
                Live Demo / Pages &rarr;
              </a>
            )}
          </div>
        )}
      </div>

      <div className={project.iterations ? 'project-container' : ''}>
        {/* Sticky iteration sidebar */}
        {project.iterations && (
          <aside className="iteration-nav-sidebar">
            <h3>Iterations</h3>
            <ul className="iteration-list">
              {project.iterations.map((iter) => (
                <li key={iter.file}>
                  <button 
                    onClick={() => scrollToIteration(iter.file)}
                    className="iteration-jump-btn"
                  >
                    {iter.version}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Content feed */}
        <div className="iteration-feed">
          {contentList.map((item) => (
            <section key={item.id} id={item.id} className="subtle-card markdown-body iteration-section">
              {item.version && <span className="iteration-badge">{item.version}</span>}
              <ReactMarkdown>{item.text}</ReactMarkdown>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}