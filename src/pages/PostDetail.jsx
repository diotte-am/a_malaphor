import React from 'react';

export default function PostDetail() {
  return (
    <article className="layout-container markdown-body">
      <header className="post-meta-header">
        <h1>Building an Entity Graph Extraction Pipeline</h1>
        <div className="post-meta">
          <time>July 15, 2026</time>
          <span className="dot-divider">•</span>
          <div className="tag-group inline">
            <span className="tag">Python</span>
            <span className="tag">Neo4j</span>
            <span className="tag">Ollama</span>
          </div>
        </div>
      </header>

      <p className="lead-paragraph">
        Extracting structured entity relationships from unstructured conversational transcripts requires careful prompting and deterministic JSON parsing when using local models.
      </p>

      <h2>Pipeline Architecture</h2>
      <p>
        The core objective is to convert raw transcript blocks into nodes and edges within a graph database without relying on external API endpoints.
      </p>

      <blockquote>
        <p><strong>Note:</strong> When running local models via Ollama on macOS, ensure file system access permissions are explicitly granted if reading directly from restricted local directories.</p>
      </blockquote>

      <h2>Configuration Example</h2>
      <p>Here is a minimal configuration snippet for defining node types prior to insertion:</p>

      <pre>
<code>{`# graph_config.py
NODE_TYPES = ["Person", "Organization", "Project", "Concept"]

def format_prompt(raw_text):
    return f"""
    Extract entity triplets (subject, relation, object) from the following text.
    Return ONLY a JSON array.
    Text: {raw_text}
    """`}</code>
      </pre>

      <h2>Key Learnings</h2>
      <ul>
        <li>Local 7B models require strict schema enforcers or post-processing fallback loops.</li>
        <li>Neo4j constraints should be created prior to bulk ingestion to prevent duplicate node creation.</li>
      </ul>
    </article>
  );
}