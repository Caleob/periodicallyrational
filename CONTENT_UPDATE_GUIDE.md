# Periodically Rational: Content Management & Publishing Guide

Welcome to your permanent reference manual for updating **Writing & Ideas** and **Student Learning Apps**. 

Both sections are **data-driven**: you never have to manually edit cards or touch HTML structure in the main index files. You simply edit a clean JavaScript data ledger (`posts.js` or `apps.js`), test locally by double-clicking the file in Windows, and push to GitHub!

---

## 🧭 The Architecture at a Glance

| Section | Master Data Ledger | Where the Content Lives | How It Works |
| :--- | :--- | :--- | :--- |
| **Ideas & Writing** | [`Ideas/posts.js`](./Ideas/posts.js) | [`Ideas/articles/`](./Ideas/articles/) | Automatically sorted by date; includes interactive filter pills (*Essays*, *Retrospectives*, *Readings*). |
| **Classroom Apps** | [`Apps/apps.js`](./Apps/apps.js) | Dedicated folder inside [`/Apps/`](./Apps/) | Automatically renders **Launch** button, and if a `.zip` archive is specified, automatically injects a **Download & Remix (.zip)** button. |

> [!TIP]
> **Zero Local Server Needed**: Because we use `posts.js` and `apps.js` rather than raw `.json`, you can double-click [`Ideas/index.html`](./Ideas/index.html) or [`Apps/index.html`](./Apps/index.html) straight from Windows File Explorer to test offline without browser security errors.

---

## ⚡ Recipe 1: Recommend a Reading (30 Seconds)

When you come across a great article on Substack, Edutopia, or an academic paper and want to recommend it:

1. Open [`Ideas/posts.js`](./Ideas/posts.js).
2. Paste this block at the top of the `IDEAS_POSTS` list (right after `const IDEAS_POSTS = [`):

```javascript
  {
    id: "short-slug-name",
    type: "Curated Reading",
    title: "Recommended Reading: \"Article Title Here\"",
    date: "2026-10-15",
    author: "Author Name",
    source: "Substack", // or "Edutopia", "The Atlantic", etc.
    meta: "By Author Name • Substack",
    quote: "A short memorable sentence from the piece that caught your attention.",
    summary: "Your 1–2 sentence takeaway explaining why this is worth reading.",
    externalUrl: "https://example.com/link-to-article",
    actionLabel: "Read on Substack →",
    tags: ["Pedagogy", "AI"]
  },
```

3. Save the file. **Done!** The card, badge, quote box, and external button are generated automatically.

---

## 📝 Recipe 2: Publish a New Essay or Proof Note

1. Go to [`Ideas/articles/`](./Ideas/articles/).
2. Make a copy of `_article_template.html` and rename it (e.g., `inquiry-geometry.html`).
3. Open your new file and edit the title, subtitle, and paragraphs.
4. Register the essay in [`Ideas/posts.js`](./Ideas/posts.js):

```javascript
  {
    id: "inquiry-geometry",
    type: "Essay",
    title: "Inquiry-Based Proofs in High School Geometry",
    date: "2026-10-20",
    author: "Caleob King",
    meta: "By Caleob King • STEM Pedagogy • October 2026",
    summary: "How visual manipulatives shift student intuition from rote formula memorization into genuine geometric proof.",
    articleUrl: "./articles/inquiry-geometry.html",
    actionLabel: "Read Essay →",
    tags: ["Geometry", "Math Pedagogy"]
  },
```

---

## 🎭 Recipe 3: Publish an App Retrospective

An App Retrospective is simply an essay that reflects on an interactive tool and provides direct links to both the essay and the app:

1. Ensure the app prototype lives in its own folder inside [`/Apps/`](./Apps/) (e.g. `Apps/BardsMeter/`).
2. Write your retrospective essay in [`Ideas/articles/your-retrospective.html`](./Ideas/articles/).
3. Add the entry to [`Ideas/posts.js`](./Ideas/posts.js) with **both** `articleUrl` and `appUrl`:

```javascript
  {
    id: "bards-meter-retrospective",
    type: "App Retrospective",
    title: "The Limits of the Code: Why Deep Content Knowledge Still Matters",
    date: "2026-10-10",
    author: "Caleob King",
    meta: "By Caleob King • Software Post-Mortem & ELA Scansion Case Study • October 2026",
    summary: "Can a STEM educator use AI to build a great ELA tool? In this retrospective essay, I examine what went right mechanically and why deep subject expertise remains irreplaceable.",
    articleUrl: "./articles/bards-meter-retrospective.html",
    appUrl: "../Apps/BardsMeter/index.html",
    actionLabel: "Read Retrospective Essay →",
    appActionLabel: "Launch The Bard's Meter App 🎭 →",
    tags: ["Pedagogy", "AI Tools", "ELA"]
  },
```

*The Ideas feed will automatically render **two buttons** on the card: one to read the essay, and one to launch the app.*

---

## 🚀 Recipe 4: Add a New Student App & Remix .zip Download

Every app has its own self-contained folder under `Apps/`:

1. **Create the app's folder**: e.g., `Apps/WaveOptics/`.
2. Place your app's files inside (e.g., `Apps/WaveOptics/index.html`, styles, audio).
3. **(Optional) Add a Remix .zip**: If you want students or educators to be able to download and remix the tool, compress the app files into a zip archive and place it right inside that app's folder:
   `Apps/WaveOptics/WaveOptics.zip`
4. Register the tool in [`Apps/apps.js`](./Apps/apps.js):

```javascript
  {
    id: "wave-optics",
    title: "Wave Optics: Double-Slit Interference Sandbox",
    shortTitle: "Wave Optics",
    badge: "Physics & Wave Mechanics",
    summary: "Explore wave interference, slit separation, and diffraction fringes with live interactive wave simulations.",
    launchUrl: "WaveOptics/index.html",
    zipUrl: "WaveOptics/WaveOptics.zip", // Or set to null if you don't have a zip yet!
    tags: ["Physics", "Simulation"]
  },
```

### How the Buttons Behave:
* **`launchUrl` provided**: The catalog renders `Launch Wave Optics →`.
* **`zipUrl` provided**: The catalog **automatically adds** `📦 Download .zip (Remix) ⤓`.
* **`zipUrl: null`**: The download button is safely hidden until you add a zip file.

---

## 🚢 Publishing Your Changes (Git Checklist)

Once you've made your changes and verified them by double-clicking the HTML files in Windows:

1. Open PowerShell or Terminal in the repository folder:
   ```powershell
   cd C:\Users\caleo\Documents\PeriodicallyRational
   ```
2. Stage all updated files:
   ```powershell
   git add .
   ```
3. Commit with a clear note:
   ```powershell
   git commit -m "Publish new post: [Post Title]"
   ```
4. Push live to GitHub:
   ```powershell
   git push origin main
   ```
5. Visit **`https://www.periodicallyrational.com`** in ~60 seconds to see your updates live!
