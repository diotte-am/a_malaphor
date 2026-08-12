### Project Overview: Weird Little People

**Background & Inspiration**
The inception of this project stems from the podcast *Weird Little Guys*, which highlights a critical and disturbing reality: the white supremacist and Christian nationalist movements are deeply interconnected webs. Looking closely at tragedies like the murder of Heather Heyer during the Unite the Right rally in Charlottesville, it becomes clear that the individuals involved are not isolated actors; they are linked to networks, organizations, and historical events spanning decades. 

Despite the volume of information available, a significant gap exists in the research landscape. There is currently no centralized, highly interconnected database capable of mapping these individuals, their complex relationships, and the vast array of primary sources that document their activities. 

**The Project Objective**
*Weird Little People* bridges this gap by building a robust data engineering pipeline designed to construct a centralized, highly queryable graph database. By programmatically combining unstructured narrative sources and structured encyclopedic data, the project maps the intricate web of actors, organizations, ideologies, and events within these extremist movements.

**The End-to-End Pipeline**
The architecture is designed to process noisy, unstructured data into a structured knowledge graph through a series of automated, observable steps:

*   **Data Ingestion & Anchoring:** The pipeline is built to ingest a wide variety of unstructured primary and secondary sources, including audio journalism (podcast transcripts), extremist manifestos, court documents, and forum archives. This text is processed through a custom chunking system that synchronizes text blocks with chronological timestamps or document metadata to maintain historical context.
*   **Entity Extraction:** A local LLM processes the chunked data to identify and extract core entities (people, organizations, media, events) using strict schemas and in-memory deduplication.
*   **Contextual Enrichment:** To solve coreference challenges (like aliases, changing organization names, and nicknames), the pipeline cross-references extracted entities with structural data from external APIs like Wikipedia, establishing canonical, ground-truth node identities.
*   **Relationship & Temporal Mapping:** A secondary LLM extraction pass maps the complex semantic connections between entities. It utilizes graph-specific design patterns to track temporal data, accurately reflecting how affiliations and leadership roles evolve over time.
*   **Knowledge Graph Construction:** The structured data is ingested into a Neo4j database, transforming isolated facts into a deeply traversable network of relationships.

**The Ultimate Vision & Future Scope**
The graph database is not just an analytical tool; it is the foundational dataset for advanced machine learning applications. 

Once fully populated, this graph will power a Retrieval-Augmented Generation (RAG) system. The long-term vision is to train an intelligent agent capable of analyzing arbitrary texts to determine an individual's proximity to extremist movements. Ultimately, this agent will be equipped to detect sanitized nationalist propaganda, identify subtle dog whistles, and power automated systems that provide real-time, evidence-based debunking of harmful misinformation.
