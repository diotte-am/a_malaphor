# Building an LLM-to-Graph Pipeline: Iteration 1 (The Functional Prototype)

This technical breakdown tracks the first major iteration of my localized Knowledge Graph pipeline, designed to extract entities and semantic relationships from complex media transcripts and ingest them into Neo4j. 

The goal for Iteration 1 was simple: establish a functional, deterministic batch ingestion framework using a local LLM via Ollama and a native Neo4j instance, while gracefully handling the unpredictable nature of local model outputs.

---

## 🏗️ The Architecture Overview

The system is split into three clean, decoupled layers to prevent codebase clutter and ensure maintainability:

1. **The Parsing Layer (`src/extractor/parser.py`):** Handles raw transcript breakdown and time-window sliding.
2. **The Extraction Layer (`src/extractor/processors.py`):** Packages context, manages structured prompting, and communicates with a local Ollama instance.
3. **The Ingestion Layer (`src/runner.py`):** Manages the batch loop, transaction execution, state checking via completion markers, and diagnostic suites.

```
+--------------------+      +-----------------------+      +---------------------+
|   Parsing Layer    | ---> |   Extraction Layer    | ---> |   Ingestion Layer   |
| (Sliding Windows)  |      |   (Ollama LLM Run)    |      | (Neo4j Determinism) |
+--------------------+      +-----------------------+      +---------------------+
```

---

## 🛑 Core Engineering Challenges & Breakthroughs

### 1. The Monolithic Context Bottleneck
* **The Problem:** Passing an entire 45-minute transcript text block to a local LLM in one go crashed the context window, caused severe hallucinations, or missed fine-grained entity intersections entirely.
* **The Solution:** Decoupled text parsing from database logic. The parser now processes text into discrete, overlapping 3-minute sliding audio windows based on transcript timestamps. This gives the LLM precise, bite-sized context bounds.

### 2. Guarding Against Unpredictable Local LLM Outputs
* **The Problem:** Despite explicit schema constraints in the system prompt, local models occasionally break character. A major pipeline crash occurred when the LLM generated natural language spaces inside Neo4j relationship types (e.g., `[r:Mentions MediaWork as affiliation]`), which violates Cypher syntax and throws a fatal `SyntaxError`.
* **The Solution (Defensive Ingestion):** Instead of fighting the model's adherence boundaries indefinitely, I built a defensive sanitization layer right at the database entry point to force clean string transformation before it hits the driver:

```python
# Defensive Sanitization in src/runner.py
for rel in graph_data.relationships:
    # Force UPPERCASE_SNAKE_CASE and strip spaces/hyphens
    clean_rel_type = rel.type.strip().replace(" ", "_").replace("-", "_").upper()
    
    if not clean_rel_type:
        clean_rel_type = "RELATED_TO"
        
    rel_query = f"""
    MATCH (source {{id: $source_id}})
    MATCH (target {{id: $target_id}})
    MERGE (source)-[r:{clean_rel_type}]->(target)
    ON CREATE SET r.context = $summary
    """
    tx.run(rel_query, source_id=rel.source_id, target_id=rel.target_id, summary=rel.summary)
```

### 3. Chronological Evaluation & Verification Mismatches
* **The Problem:** The evaluation log generator initially outputted blank markdown files. This was driven by a hardcoded naming convention mismatch where the query targeted a generic ID (`wlg_episode_1`) while the pipeline runner was dynamically creating descriptive, file-bound tokens (`wlg_episode_01_full`).
* **The Solution:** Synchronized the explicit `episode_id` string contract across both the runner and the log utilities. Additionally, tightened the Cypher query logic to isolate relationships dynamically *only* if both participating nodes co-occur inside the identical time chunk, preventing global relationship bleeding:

```cypher
// Chronicling chunks and tightening relational boundaries
MATCH (e:Episode {id: $episode_id})-[:HAS_CHUNK]->(c:TranscriptChunk)
MATCH (c)-[:MENTIONS]->(n)
OPTIONAL MATCH (n)-[r]->(m)
WHERE (c)-[:MENTIONS]->(m) 
RETURN 
    c.timestamp AS timestamp,
    collect(distinct {label: labels(n)[0], name: n.name, id: n.id}) AS entities,
    collect(distinct {source: n.name, type: type(r), target: m.name, summary: r.context}) AS relationships
ORDER BY timestamp ASC
```

### 4. Cold-Start Schema Compilation Warnings
* **The Problem:** When executing evaluation scripts or diagnostic utilities on a completely clean or freshly wiped database instance, Neo4j surfaced a wall of chatty compilation warnings (`The missing label name is: TranscriptChunk`, `The missing relationship type is: HAS_CHUNK`).
* **The Solution:** Isolated this as an artifact of Neo4j's ahead-of-time (AOT) query plan compilation. If a Cypher read query references structural elements that do not physically exist in the database's schema directory *at the exact millisecond compilation begins*, the engine flags them. Structuring the pipeline to guarantee the ingestion layer commits its transactions *before* the evaluation suite compiles its read blocks ensures the internal graph indexer registers the topology, silencing the warnings on subsequent runs.

---

## 🎯 Iteration 1 Architectural Decisions

* **Completion Marker State Files (`.done`):** Rather than keeping processing state in-memory or constantly querying the DB to check if an episode is finished, the runner drops a tiny `{episode_id}.done` log file. If it exists, the runner skips the file instantly, making crashes completely safe to resume.
* **Schema-Agnostic Database Code:** Node label variables are completely dynamic. They map directly from the LLM response object rather than hardcoded string parameters. If I decide to update my entity taxonomy tomorrow, I only update the system prompt; my pipeline infrastructure remains entirely untouched.

---

## 🚀 Next Steps for Iteration 2

With the foundational pipeline safely ingesting data, the next phase will focus on improving the fidelity of the data being extracted:
* **The Human-In-The-Loop Feedback Loop:** Setting up a rapid iteration cycle where I audit the generated Markdown evaluation log against actual audio playback, shifting modifications away from code architecture into prompt few-shot tuning.
* **Coreference Resolution:** Tackling the issue of the LLM extracting ambiguous entities (like pronouns or partial names) by passing a small rolling historical context buffer to the extraction layer.