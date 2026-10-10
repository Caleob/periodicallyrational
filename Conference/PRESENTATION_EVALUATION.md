# Presentation Slide Text Audit & Critical Evaluation

**Project:** *The Classroom Genie: Building Custom Tools Without Code*  
**Audience:** Pearson Virtual Schools Staff Conference (Teachers & Educational Staff)  
**Presenter:** Caleob King  
**Scope:** Raw slide text extraction (excluding example app internals) followed by a critical evaluation against non-coder accessibility, the "imagine-prompt-iterate" loop, early experimentation, jargon reduction, and practical classroom utility.

---

## Part 1: Raw Slide Text Content

### Slide 1: The Wish and the Lamp
* **Headline:** The Classroom Genie: Building Custom Tools Without Code
* **Sub-headline / Context:** Pearson Virtual Schools Staff Conference. Presenter: Caleob King.
* **Featured Card:** 
  > AI is a **powerful but overly literal Genie**. It can build any educational manipulative you imagine, but it takes every word literally, so you must state your wish clearly.
* **On-Screen Cue:** Press Space or the right arrow to begin.

---

### Slide 2: The Three Curses of Ready-Made EdTech
* **Headline:** The Three Curses of Ready-Made EdTech
* **Card 1 (The Login Nightmare):** Lost passwords, account limits, student privacy risks.
* **Card 2 (The Cookie-Cutter Trap):** Generic tools never fit your exact lesson or state standard.
* **Card 3 (The Paywall & Firewall):** Subscriptions expire and school security blocks outside sites.
* **Banner (The Genie's Secret):** 
  > **The Genie's Secret:** your web browser is already a free, offline projector. Works from your desktop with zero logins, zero accounts, and 100% privacy.

---

### Slide 3: Meeting the Genie
* **Headline:** Meeting the Genie
* **Sub-headline:** The Genie does not read minds. It executes your exact words.
* **Card 1 (Rule 1):** 
  * Title: 1. Keep it in one house
  * Text: Everything inside a single standalone .html file.
* **Card 2 (Rule 2):** 
  * Title: 2. No phantom files
  * Text: Browser-made sounds and code-drawn shapes instead of downloads.
* **Card 3 (Rule 3):** 
  * Title: 3. Protect student privacy
  * Text: Everything stays in your browser. Nothing goes to outside servers.

---

### Slide 4: The Cave of Wonders
* **Headline:** The Cave of Wonders
* **Sub-headline / Instructions:** Nine builds are hidden here. Hover or focus a gem to hear its secret. Click to open it.
* **Interactive Gems Displayed (Names & Levels on Stage):**
  1. **EduSpin Wheel Picker** *(Level 1: Foundations)* — Random student & pair picker
  2. **FeedbackFlow** *(Level 2: Evolution)* — Click-to-build grading feedback assistant
  3. **Elastic Timeline** *(Level 3: Physics & Loops)* — Kinesthetic chronology ordering game
  4. **Vocabulary Codenames** *(Level 4: Remote Workflows)* — Team review game with spymaster shortcuts
  5. **Rotate & Relate** *(Level 5: The Web Triad)* — Similar-triangles geometry sandbox
  6. **Transversal Angles Practice** *(Level 6: State Machines)* — Scaffolded angle relationship trainer
  7. **Polar Defender** *(Level 7: Gamification)* — Arcade radar coordinate defense game
  8. **Hypothesis Testing Suite** *(Level 8: Architecture & Computation)* — Inferential statistics distribution calculator
  9. **Redox Reaction Interactive** *(Level 9: Domain Modeling)* — Oxidation states & electron transfer simulation
* **Caption Default:** Hover or focus a treasure to hear its secret…

---

### Slide 5: The Golden Prompt Formula
* **Headline:** The Teacher's Golden Prompt Formula
* **Grid Elements:**
  * **Role (Who the Genie is):** "Act as an educational web tool maker."
  * **Audience (Who it is for):** "Build a tool for my 6th-grade Earth Science students."
  * **Function (What it does):** "Students click steps of the water cycle to see an animation."
  * **Guardrails (Safety & portability):**
    * Single standalone .html file.
    * No external image, font, or audio downloads.
    * 100% student data privacy offline.
* **Action Button:** Copy formula template
* **Template Injected into Clipboard:**
  ```text
  Act as an educational web tool maker.
  Build a tool for my [grade + subject] students.
  [Describe what students click/see and what the tool does.]
  Keep everything inside one single file that ends in .html.
  Do not use outside websites, image links, or sound downloads.
  Keep student information 100% private on my computer.
  ```
* *[Unrendered / Orphaned Function in `app.js` (Prompt Bank `PB()`)]:*
  * Math: "Build a fraction-comparison game for my 4th graders: two fraction bars, students click which is larger, with a score."
  * ELA: "Build a sentence-unscramble tool for my 7th graders: shuffled words, drag to order, Check button."
  * Science: "Build a water cycle explorer for 6th-grade Earth Science: click each stage to see an animation."
  * Social Studies: "Build a map-labeling quiz for my 8th graders using shapes drawn in code, no images."

---

### Slide 6: Step-by-Step Hands-On Guide
* **Headline:** Step-by-Step Hands-On Guide
* **Card 1 (Step 1):** 
  * Title: Step 1: Copy the code
  * Text: Click "Copy code" in your AI chat. Never drag-highlight hundreds of lines.
* **Card 2 (Step 2):** 
  * Title: Step 2: Open your starter file
  * Text: Open the pre-made tool.html in Notepad or TextEdit.
* **Card 3 (Step 3):** 
  * Title: Step 3: Paste and save
  * Text: Ctrl+S on Windows, Cmd+S on Mac.
* **Card 4 (Step 4):** 
  * Title: Step 4: Double-click to run
  * Text: It opens in Chrome, Edge, or Safari, offline.
* **Action Button:** Blank HTML FILE (Downloads `tool.html` starter file)

---

### Slide 7: Tinker Time
* **Timer Component:**
  * Default countdown: `10:00`
  * Buttons: `▼ -1m`, `Play`, `Reset`, `▲ +1m`
* **Integrated Music Player:**
  * Track title: `Ambient Focus` (with `Loop` indicator)
  * Controls: Previous track, Play/Pause, Next track, Mute toggle, Volume slider
  * Playlist items: *Ambient Focus*, *Upbeat Flow*, *Gentle Chords*, *Lofi Pause*, *Retro Arcade*
* **Action Buttons:**
  * Ideas Padlet (*toast: "Ideas Padlet: Link coming soon"*)
  * Feedback Survey (*toast: "Feedback Survey: Link coming soon"*)

---

## Part 2: Critical Evaluation Against Your Criteria

### 1. Tone, Wordiness, and Non-Coder Relatability
* **The Metaphor vs. Technical Drift:** The presentation sets up an appealing, accessible metaphor in the opening ("The Genie", "The Cave of Wonders", "The Three Curses"), which creates high emotional resonance for teachers struggling with school tech. However, starting around Slide 3 and peaking in Slide 4, the language rapidly drifts into software engineering parlance:
  * Slide 3 introduces phrases like `single standalone .html file` and `browser-made sounds and code-drawn shapes`.
  * Slide 4 labels showcase apps with developer milestones: `Level 5: The Web Triad`, `Level 6: State Machines`, `Level 8: Architecture & Computation`, and `Level 9: Domain Modeling`.
* **The Intimidation Factor:** Non-coder teachers do not think in terms of "State Machines" or "The Web Triad (HTML/CSS/JS)". Encountering those terms signals: *"This is a computer science workshop in disguise; I'm out of my depth."*
* **Slide Densities:** Slides 1 through 3 are relatively punchy, but Slide 5 ("The Golden Prompt Formula") and Slide 6 ("Step-by-Step Hands-On Guide") read like procedural technical documentation rather than an empowering invitation to create.

---

### 2. Failure to Capture the "Imagine – Prompt – Iterate" Vibe-Coding Loop
* **The "One-Shot Fallacy":** The entire slide flow implies that creation is a linear, single-shot waterfall:
  $$\text{Formulate Golden Prompt} \longrightarrow \text{Copy Code} \longrightarrow \text{Paste into Notepad} \longrightarrow \text{Run File}$$
  This is the exact opposite of modern vibe coding. Vibe coding is a **conversational dialogue**:
  1. *Imagine:* "I wish my students had a fast way to pair up for debates."
  2. *Prompt:* "Make two spinning wheels that pick names."
  3. *Test:* "Wait, the wheel landed on the same kid twice, and it looks too dark."
  4. *Iterate:* "Hey AI, remove names after they're picked, and make the background bright blue."
* **Missing the Conversation:** Nowhere in the deck does a teacher see what an iterative exchange with an LLM actually looks like. Slide 5 gives the impression that if you don't formulate the perfect 4-part prompt upfront with all the right guardrails, the Genie fails.
* **Hiding the Real Superpower:** The true superpower for non-coders isn't getting it right on turn one; it's realizing that **making mistakes and asking the AI to fix them takes 5 seconds**. The current slides don't teach attendees how to say: *"That's almost right, but change X."*

---

### 3. Early Experimentation & The Friction Barrier
* **Backloading the Action:** The audience does not get invited to touch anything or experiment until Slide 7 ("Tinker Time"), which is the final slide of the deck. By the time they reach Slide 7, passive listening fatigue has set in.
* **The "Notepad/TextEdit" Chasm (High Failure Rate for Beginners):**
  * Step 2 on Slide 6 tells attendees: *"Open the pre-made tool.html in Notepad or TextEdit."*
  * In practice with non-technical audiences, this is where 40–60% of attendees get stuck:
    * On Windows: Saving in Notepad frequently appends `.txt`, producing `tool.html.txt`, which fails to launch in a browser.
    * On macOS: TextEdit defaults to Rich Text Mode (`.rtf`), converting HTML code into escaped rich text or curly quotes, causing a blank or broken page.
    * Opening a `.html` file by double-clicking opens it in the browser, not the editor. To edit it, a teacher must right-click $\to$ "Open With" $\to$ Notepad—a non-intuitive step never mentioned on the slide.
* **Lack of Instant Micro-Wins:** There is no "try this 30-second prompt right now in your chat" moment in the first 10 minutes to hook their confidence.

---

### 4. Simple, Low-Jargon, Achievable Goals
* **The Ceiling is Too High, The Floor is Too Low:**
  * Slide 4 showcases complex, collegiate-level applications: *Inferential Statistics Hypothesis Testing Suite (Chi-Square/T-Test/Z-Test)* and *Redox Reaction Interactive with Electron Transfer Animation*. 
  * While this proves that AI is capable of building sophisticated software, it drastically overshoots what an elementary or middle school teacher needs for Monday morning. It sets an intimidating standard rather than an achievable one.
* **Orphaned Practical Examples:** In `app.js`, there is a hidden function `PB()` containing four wonderfully simple, grounded prompts:
  * Math: 4th-grade fraction comparison bars.
  * ELA: 7th-grade sentence unscrambler.
  * Science: 6th-grade water cycle explorer.
  * Social Studies: 8th-grade map-labeling quiz.
  * *Critical issue:* **This prompt bank is completely missing from the visible presentation slides.** The most practical, low-barrier examples were left in code comments instead of being in front of attendees.

---

### 5. Immediate Usefulness in Teachers' Day-to-Day Practice
* **Slide 2 Hits the Bullseye, but Slide 3–6 Loses the Thread:**
  * Slide 2 ("The Three Curses of Ready-Made EdTech") is the strongest pedagogical slide in the entire deck. Every teacher in 2026 immediately feels the pain of *The Login Nightmare*, *The Cookie-Cutter Trap*, and *The Paywall/Firewall*.
  * But immediately after establishing this emotional pain point, the deck pivots into technical constraints (file extensions, avoiding CDNs, Web Audio synthesis) rather than answering: *"How does this make your teaching day 10 times easier tomorrow morning?"*
* **What Teachers Actually Need to See:**
  * *Grading relief:* Clicking buttons to generate personalized report card comments or essay feedback (as in FeedbackFlow).
  * *Engagement on screen shares:* A 5-minute bell-ringer or brain break that doesn't require logging into Kahoot or Pear Deck.
  * *Micro-differentiation:* Modifying a tool on the fly for an IEP student without waiting for district IT approval.

---

## Part 3: Summary Scorecard by Slide

| Slide # | Slide Title | Wordiness / Jargon Level | "Vibe / Iterate" Presence | Practical Teacher Value | Critical Diagnosis |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | The Wish and the Lamp | **Low** (Warm & accessible) | ⚠️ Framing only ("must state wish clearly") | **Medium** (Sets expectation) | Good opener, but "overly literal Genie" sets a fear tone rather than an exploratory one. |
| **2** | The Three Curses of EdTech | **Low** (Highly relatable) | ❌ None | **High** (Directly validates teacher pain) | Best slide in the deck. Connects with daily frustrations instantly. |
| **3** | Meeting the Genie | ⚠️ **Medium** (Introduces tech constraints) | ❌ None | **Medium** (Explains safety/privacy) | Necessary safety guardrails, but phrased as rigid developer rules rather than simple principles. |
| **4** | The Cave of Wonders | 🔴 **High** (Dev architecture jargon: *State Machines, Web Triad, APIs*) | ⚠️ Implicit only (Level 2 mentions evolution) | ⚠️ Mixed (Inspiring, but deeply intimidating) | Impressive showcase, but names/levels alienate non-coders and obscure the simple tools. |
| **5** | The Golden Prompt Formula | ⚠️ **Medium-High** (Structured prompt engineering) | ❌ None (Implies one-shot perfection) | **Medium** (Gives a template, but feels academic) | Misses the iterative magic. Omits the conversational back-and-forth and hides the practical prompt bank. |
| **6** | Step-by-Step Guide | **Medium** (File management procedural text) | ❌ None | 🔴 **High friction risk** (The Notepad/TextEdit hurdle) | TextEdit/Notepad instructions are notorious failure points during live virtual sessions. |
| **7** | Tinker Time | **Low** (Action-oriented) | ⚠️ Dependent on live facilitator coaching | **High** (Hands-on time) | Great timer/music interface, but arrives too late after heavy lecture slides. |

---

## Key Strategic Takeaways (For Next Steps)

1. **Shift the Narrative from "Software Engineer" to "Classroom Partner":** Remove developer taxonomy (*Web Triad, State Machines, Domain Modeling*) and replace them with teacher-centered categories (*Quick Class Routines, Instant Games, Grading Shortcuts*).
2. **Demonstrate the Conversation, Not Just the Prompt:** Show an actual 2-step iteration: *"Here is my crude first wish $\to$ Here is what happened $\to$ Here is how I asked the Genie to tweak it."*
3. **Bring the Hidden Prompt Bank into the Light:** Expose the simple subject-specific starter prompts currently stranded inside the unused `PB()` code function.
4. **Eliminate the Notepad Friction Point:** Provide a browser-based previewer or direct copy-paste sandbox so teachers see their apps run in seconds without fighting file-saving errors.
