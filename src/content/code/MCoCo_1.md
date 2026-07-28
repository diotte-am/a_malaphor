# 🏗️ Malden Community Coalition Platform: Architectural Case Study

<details>
<summary><b>1. Project Overview & The Core Challenge (Click to expand)</b></summary>
<br />

**The Mission:** Rebuild and modernize the community resource and news hub for the Malden Community Coalition. This project involved transforming a legacy, static HTML website that received minimal user engagement into a highly performant, accessible, and multi-lingual web application designed to scale.

**The Strategy:** To eliminate server maintenance overhead and hosting costs for a non-profit organization, I architected a decoupled, client-side application using a Jamstack approach. This strategy delivered sub-second load times and eliminated database operational costs by pairing a structured data layer with a highly reusable, component-driven React user interface.

---
</details>

<details>
<summary><b>2. The Planning Process & Choosing the Stack (Click to expand)</b></summary>
<br />

Before development, I analyzed user requirements to establish clear engineering and accessibility constraints:
* The application must load efficiently on low-specification mobile devices over cellular networks.
* The system must support instantaneous language switching (English, Spanish, Portuguese, and Chinese) without requiring a browser page reload.
* The deployment must require minimal technical infrastructure to maintain.

**The Technology Selection:**
* **Vite + React:** Selected to optimize build performance, enforce a minimal production bundle size, and provide a reliable local development environment.
* **React Router v6:** Implemented to establish declarative client-side routing and handle dynamic view rendering using parameterized URL paths.
* **i18next Framework:** Chosen as the core localization engine to manage complex, multi-lingual string dependencies entirely on the client side.

---
</details>

<details>
<summary><b>3. Visual Design, Branding, and Component Reuse (Click to expand)</b></summary>
<br />

A major goal of the rewrite was turning a low-traffic static site into a functional community hub while maintaining visual continuity for existing users.

#### Visual Continuity and Branding
I preserved the established color scheme and core branding elements from the legacy website but re-engineered them to meet modern web standards. This color palette was integrated into a structured CSS variable system, ensuring consistent application across the entire user interface.

#### Layout Uniformity and the Hero Banner System
To establish design consistency across distinct views (such as News, Resources, and Video dashboards), I implemented a standard content header layout. For individual news articles, a structured hero banner system featuring a programmatic CSS gradient background was introduced. This system acts as a repeatable visual anchor across the layout, establishing an immediate typographic hierarchy that guides the user's eye cleanly down to the primary text blocks.

#### Component Architecture and Lifecycle Reuse
To maximize code maintainability, the user interface is broken down into modular, self-contained components. UI patterns like `NewsCard`, `VideoCard`, and `ResourceCard` share layout behaviors but remain decoupled from specific parent views. For example, utilities like the inline "Copy Share Link" clipboard action use asynchronous web APIs (`navigator.clipboard`) isolated entirely within the card component. This isolates state management to the component level, leaving parent layout grids clean and readable.

---
</details>

<details>
<summary><b>4. Engineering for Accessibility (WCAG 2.1) (Click to expand)</b></summary>
<br />

Because this platform serves a diverse municipal demographic, digital inclusion was treated as a core engineering requirement rather than a post-development feature.

* **Contrast and Color Independence:** All color choices, derived from the legacy branding palette, were vetted using contrast verification algorithms to guarantee a minimum 4.5:1 contrast ratio against text backgrounds. No interface elements rely solely on color to convey meaning or interaction states.
* **Keyboard Navigation and Semantic HTML:** I prioritized semantic HTML tags (`<article>`, `<section>`, `<header>`, `<nav>`) to build an intuitive visual and technical document hierarchy. Focus indicators are preserved across all custom interaction elements, allowing full platform utility via keyboard navigation alone.
* **Screen Reader Compatibility:** Previews and image objects use explicit, descriptive `alt` text parameters to ensure screen reader engines translate the context correctly. Interactive components utilize programmatic attributes, such as `aria-labelledby` linked to corresponding layout headers, to establish a safe accessibility tree.

---
</details>

<details>
<summary><b>5. Engineering for Scalability: Data Architecture (Click to expand)</b></summary>
<br />

I designed a data architecture capable of supporting frequent data updates—such as new resource listings, video workshops, and multi-block news entries—without requiring changes to the application code.

#### Decoupling UI from Content
Instead of hardcoding text layouts or deploying a database backend, I organized the content layer into structured JSON files. The React application functions purely as a rendering engine. Adding, removing, or updating data requires modifying only the JSON files, separating the data layer from the application logic.

#### Multi-Language Strategy: System Keys vs. Localized Strings
When organizing data categories and tags (e.g., `"category": "Workshops"`), translating data values directly within the core data object would break search filtering logic and array index lookups during a language switch.
* **The Solution:** I maintained all data categories and tags as immutable English "system keys" within the underlying JSON data layer. These system keys are passed through i18next translation hooks (`t('videos:categories.' + category)`) to fetch the appropriate localized string from separate locale dictionary files. This ensures that data filtering logic remains identical across all languages while displaying the correct translation on screen.

#### Dynamic Block-Based Article Engine
To migrate rich-text news articles from the legacy site without storing unsafe, unvalidated raw HTML strings in the JSON data layer, I engineered a nested block-rendering engine. Articles are structured as arrays of typed objects (such as `"type": "text"`, `"type": "quote"`, or `"type": "media-text"`). The article viewer maps over these blocks dynamically, safely rendering the content inside appropriate, semantic HTML tags.

---
</details>

<details>
<summary><b>6. Handling Dynamic Actions in a Static Architecture (Click to expand)</b></summary>
<br />

Building a client-side, serverless application introduces unique constraints when handling user input, such as contact forms or email newsletter sign-ups, since there is no native backend server to capture data payloads.

* **The Third-Party Solution:** To preserve a serverless architecture while providing dynamic utility, I integrated a third-party form handler endpoint. 
* **The Mechanism:** When a user submits an email request form, the React component captures the input data state and forwards the submission directly to the external handler API via an asynchronous POST request. This decoupled strategy allows the platform to accept user contact submissions securely while maintaining zero operational server footprint or database exposure.

---
</details>

<details>
<summary><b>7. Automation and CI/CD Infrastructure via GitHub Actions (Click to expand)</b></summary>
<br />

To keep the platform updated without manual code deployment, I built an automated infrastructure pipeline using GitHub Actions workflows.

#### Automated Metadata Extraction and Content Ingestion
The coalition hosts informational and educational workshops on YouTube on a monthly release schedule. To prevent developers from needing to manually write JSON entries for each video item, I wrote an automated ingestion script using Python.
* **The Automated Workflow:** A weekly scheduled GitHub Action triggers a Python script that leverages data processing utilities to scrape metadata (titles, descriptions, publishing timestamps, and links) directly from the target YouTube channel feed. The script automatically converts this information into structured data objects and rewrites the internal data JSON file with the newly discovered video modules.

#### Continuous Integration and Continuous Deployment (CI/CD)
The platform features an automated compilation pipeline that triggers whenever an update is pushed to the repository.
* **Automated Build and Deployment:** When a repository commit occurs—or when the automated video metadata script commits updated video data—a GitHub Actions runner initializes a local environment container, installs system dependencies, validates the source files, and builds the static production application via Vite. 
* **URL Mapping and Delivery:** Upon a successful compilation, the workflow pushes the distribution bundle straight to the hosting server. Custom domain mappings are configured at the DNS routing layer, ensuring that incoming browser requests resolve securely and instantaneously to the fresh deployment.

---
</details>

<details>
<summary><b>8. Solving Layout Challenges: The Spotlight Component (Click to expand)</b></summary>
<br />

During the implementation of the user interface, a significant layout conflict occurred when rendering responsive dashboard grids next to the homepage Spotlight Component (`HomeFeaturedSection`).

* **The Problem:** When reusable resource cards were nested inside the homepage spotlight column, they inherited vertical stretching constraints from the parent grid container. This forced the internal card components to separate vertically, creating a large amount of empty whitespace underneath the primary action buttons.
* **The Solution:** I resolved this layout conflict by writing explicit CSS flexbox overrides targeted specifically to the spotlight container context. By applying `height: auto !important`, `justify-content: flex-start`, and setting the container to `align-self: flex-start`, I forced the nested cards to shrink-wrap precisely to the height of their internal text content. This eliminated the unwanted whitespace, aligned the content elements naturally, and ensured that the section footer layout locked cleanly to the base of the component across all viewport sizes.

---
</details>