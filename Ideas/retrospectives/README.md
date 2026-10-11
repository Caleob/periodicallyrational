# Tool Retrospectives & Case Studies: Architecture Guide

This directory houses reflective case studies on educational tools built for or tested on **Periodically Rational**. 

Unlike the main `/Apps/` directory (which hosts finished, production-ready STEM manipulatives for students), the `/Ideas/retrospectives/` directory is dedicated to **pedagogical experiments, post-mortems, and design essays**. Each entry showcases a working prototype alongside an honest analysis of what went right mechanically, what fell short pedagogically, and what lessons were learned regarding subject-matter expertise.

---

## 📁 Directory Structure

Every tool retrospective is organized as a self-contained folder:

```text
Ideas/
├── index.html                     <-- Main Writing & Ideas hub
└── retrospectives/
    ├── README.md                  <-- This guide
    └── <tool-slug>/               <-- Dedicated folder for each case study
        ├── index.html             <-- The retrospective essay (analysis & reflection)
        ├── app.html               <-- The interactive web app prototype
        └── assets/                <-- (Optional) screenshots, diagrams, custom JSONs
```

### Current Entries:
- **`shakespeare-scansion/`**
  - **Essay (`index.html`):** *"The Limits of the Code: Why Deep Content Knowledge Still Matters"*
  - **Tool (`app.html`):** *The Bard's Meter* (Interactive Shakespeare prosody workshop)

---

## 🛠️ How to Add a Future Retrospective (Step-by-Step)

When writing about a new app and analyzing what went right and wrong:

### 1. Create the Retrospective Directory
Choose a clean, descriptive slug (e.g., `Ideas/retrospectives/wave-optics/` or `Ideas/retrospectives/latin-declensions/`).

### 2. Add the Interactive App (`app.html`)
- Place your single-page HTML tool inside the folder as `app.html`.
- Add a top header link and a footer link back to the essay (`./index.html`) and the Ideas hub (`../../index.html`).

### 3. Write the Retrospective Essay (`index.html`)
Follow the established Periodically Rational editorial layout:
- **Badge:** `App Retrospective & Pedagogy`
- **Header:** Clear, provocative title and subtitle reflecting the core insight.
- **Prototype Callout:** A highlighted card near the top with a direct button to launch `./app.html`.
- **What Went Right:** A bulleted breakdown of the technical, UX, and engagement successes.
- **What Went Wrong / The Pedagogical Blindspot:** A candid analysis of domain limitations, edge cases, student misconceptions, or epistemic traps.
- **Takeaway & Theory:** Connecting the experiment to educational theory (e.g., Shulman's Pedagogical Content Knowledge, cognitive load, inquiry-based learning).
- **Navigation:** Back links to `../../index.html` and the site footer.

### 4. Register the Entry in `Ideas/index.html`
Add a card to the "Tool Retrospectives & Case Studies" section of `Ideas/index.html` with:
- An `App Retrospective` badge
- Title and descriptive blurb
- Two buttons: `Read Retrospective →` (linking to `./retrospectives/<tool-slug>/index.html`) and `Launch App →` (linking to `./retrospectives/<tool-slug>/app.html`).
