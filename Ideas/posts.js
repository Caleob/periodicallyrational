/**
 * Periodically Rational — Writing & Ideas Data Ledger
 * ====================================================
 * To publish a new post, essay, or reading recommendation, simply add a new
 * object to the TOP of the IDEAS_POSTS array below.
 *
 * Supported Types:
 *   - "App Retrospective" : Has articleUrl AND appUrl (renders two buttons)
 *   - "Curated Reading"   : Has externalUrl, author, source, and optional quote
 *   - "Conference Talk"   : Links to presentation slides/demos
 *   - "Essay"             : Links to an article in ./articles/
 *   - "Notes"             : Forthcoming writing or quick pedagogical thought
 */

const IDEAS_POSTS = [
  {
    id: "bards-meter-retrospective",
    type: "App Retrospective",
    badge: "App Retrospective",
    title: "The Limits of the Code: Why Deep Content Knowledge Still Matters",
    date: "2026-10-10",
    author: "Caleob King",
    meta: "By Caleob King • Software Post-Mortem & ELA Scansion Case Study • October 2026",
    summary: "Can a STEM educator use AI to build a great English Language Arts tool? To find out, I built <em>The Bard's Meter</em>—an interactive Shakespearean prosody sandbox. In this retrospective essay, I examine what went right mechanically, the subtle pedagogical dangers of treating poetic scansion like binary math, and why deep subject expertise remains irreplaceable even in an era of effortless code generation.",
    articleUrl: "./articles/bards-meter-retrospective.html",
    appUrl: "../Apps/BardsMeter/index.html",
    actionLabel: "Read Retrospective Essay →",
    appActionLabel: "Launch The Bard's Meter App 🎭 →",
    tags: ["Pedagogy", "AI Tools", "ELA Scansion"]
  },
  {
    id: "cognitive-superloading",
    type: "Curated Reading",
    badge: "Curated Reading",
    title: "Recommended Reading: \"Cognitive Superloading\"",
    date: "2026-10-09",
    author: "Wess Trabelsi",
    source: "Substack",
    meta: "By Wess Trabelsi • Substack",
    quote: "Thoughtful, analytical, and deeply relevant. This piece explores cognitive load and student agency in the age of AI with rare clarity and nuance.",
    summary: "An incisive essay that moves beyond surface-level hype to examine what happens to student cognition, mental models, and retention when interacting with AI tools in learning environments.",
    externalUrl: "https://wesstrabelsi.substack.com/p/cognitive-superloading?utm_campaign=post-expanded-share&utm_medium=web&triedRedirect=true",
    actionLabel: "Read on Substack →",
    tags: ["Cognitive Science", "AI in Education"]
  },
  {
    id: "classroom-genie-presentation",
    type: "Conference Talk",
    badge: "Conference Talk",
    title: "The Classroom Genie: Building Custom Classroom Tools",
    date: "2026-10-08",
    author: "Caleob King",
    meta: "Prepared for the 2026 Pearson Virtual Educator Conference",
    summary: "How can classroom educators design and deploy custom, interactive browser-based learning tools without needing to be professional programmers? This presentation explores using modern AI workflows to create tailored, lightweight educational software for student devices—complete with full slides, live interactive demonstrations, and practical prompt frameworks.",
    articleUrl: "../Conference/index.html",
    actionLabel: "Launch Presentation & Demos →",
    tags: ["Presentations", "AI Workflows"]
  },
  {
    id: "forthcoming-notes",
    type: "Notes",
    badge: "Notes",
    title: "Forthcoming Writing & Essays",
    date: "2026-10-01",
    author: "Caleob King",
    meta: "STEM Pedagogy & Classroom Technology",
    summary: "Additional essays and tool retrospectives exploring mathematics pedagogy, inquiry-based science activities, and the realities of classroom software design are in preparation and will be shared here.",
    articleUrl: null,
    tags: ["Announcements"]
  }
];
