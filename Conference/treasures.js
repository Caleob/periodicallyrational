/* =====================================================================
   CAVE OF WONDERS CONTENT
   ---------------------------------------------------------------------
   Everything shown on the Cave slide and inside each treasure's pop-up
   lives here, written in plain, teacher-friendly language.

   - Treasures appear in the Cave grouped by "group", in the order listed.
   - "prompt" is the exact prompt used to build each example (copied from
     that Example folder's Prompt.txt). Everything else is display text.
   - Text fields may contain simple HTML like <b>, <em>, or <br>.
   ===================================================================== */

window.TREASURE_GROUPS = [
  {id:"helpers", icon:"🧰", title:"Everyday Helpers",
   sub:"Save time on the jobs you do every single week.", hue:0},
  {id:"games", icon:"🎲", title:"Games for Any Grade",
   sub:"Quick, fun review you can run on a shared screen.", hue:150},
  {id:"deep", icon:"🔭", title:"Deep Dives: High School Math & Science",
   sub:"Curious how far a conversation with AI can go? These are fascinating, and totally optional.", hue:250}
];

window.TREASURES = [

  /* ---------------------------- EVERYDAY HELPERS ---------------------------- */
  {
    group:"helpers",
    name:"Spin-a-Name Wheel",
    short:"Pick a random student, or pair up partners",
    grades:"Any grade",
    file:"Example_1/WheelPicker.html",
    downloadFile:"Example_1/EduSpin_Wheel_Picker.zip", downloadName:"EduSpin_Wheel_Picker.zip",
    wish:"A colorful spinning wheel that picks a random name from a class list I paste in. Add an option for two wheels side by side so I can pair things up.",
    prompt:"Act as an expert educational front-end developer. Build a safe, versatile, single-file HTML/CSS/JavaScript web app featuring a dynamic wheel picker system that supports either a single wheel (for student picking or quick draws) or two side-by-side wheels (for compare/contrast discussions and pairings).\n\nStrict Technical Guardrails:\n1. Zero Dependencies: Use pure vanilla JavaScript and standard HTML5 Canvas only. Do not reference external CDNs, frameworks, stylesheets, remote fonts, or external image/audio files.\n2. Self-Contained Output: Return all HTML, CSS, and JavaScript in one continuous code block inside a single file.\n\nInterface & Setup Panel:\n- Design a modern, distraction-free, high-contrast dark theme optimized for virtual screen sharing.\n- At the top, include a collapsible \"Setup & Settings\" drawer:\n  * Mode Selector Toggle: \"Single Wheel\" vs. \"Dual Wheels\". Switching modes dynamically toggles the visible inputs and display layout.\n  * In \"Single Wheel\" mode: Show one <textarea> for List 1 (e.g., student roster or prompt bank).\n  * In \"Dual Wheels\" mode: Show two side-by-side <textareas> for List 1 and List 2 (e.g., Vocab Set A vs. Set B, or Students vs. Tasks).\n  * Options: A checkbox for \"Remove selected item(s) after spin\" (default: checked).\n  * An \"Update Wheels\" button to parse lists and refresh the canvas.\n\nWheel & Canvas Behavior:\n- Main Display:\n  * Single Wheel Mode: Centered large canvas with a fixed indicator arrow at the top and a prominent \"Spin Wheel\" button.\n  * Dual Wheels Mode: Two equal-sized side-by-side canvases (\"Wheel 1\" and \"Wheel 2\"), each with its own top indicator arrow and distinct header, controlled by a shared \"Spin Both Wheels\" button.\n- Parsing & Sanitization:\n  * When \"Update Wheels\" is clicked, clean each list (strip empty lines, trim extra whitespace, eliminate internal duplicates).\n  * Dynamically calculate slice angles (2π / N) for each wheel. Render alternating, vibrant, high-contrast slice colors with clean, radially rotated text labels centered in each slice.\n- Spin Physics & Fair Removal:\n  * Spinning must use realistic deceleration (physics easing) with randomized duration and rotation velocity.\n  * In Dual Wheel mode, ensure both wheels spin independently and never land on identical items if the two lists share terms.\n  * If \"Remove selected item after spin\" is active: When a wheel lands on an item, remove that winning item from that wheel's active pool. Crucially, if that same item exists in the other wheel's active list, remove it from there as well so it cannot appear again in either wheel. Update both wheels immediately.\n\nAudio & Result Reveal:\n- Web Audio Synthesis: Use the native browser Web Audio API to procedurally generate a subtle, mechanical tick as slices pass the top pointer, and a pleasant completion chime when the wheel(s) stop.\n- Dynamic Result Banner:\n  * Single Wheel: Display \"Selected: [Winning Item]\" with an option to manually undo removal if needed.\n  * Dual Wheels: Display \"Compare & Contrast: Identify one critical similarity and one fundamental difference between [Item 1] and [Item 2].\"",
    what:"A bright, colorful spinning wheel that runs right in your web browser. Paste in your class list and spin to call on someone at random. Or turn on two wheels side by side to make partners, or to pair up ideas for a discussion.",
    uses:[
      ["Fair cold-calling","Spin to choose who answers or reads next. The ticking sound keeps everyone watching."],
      ["No repeats","Turn on “remove after picking” so nobody gets chosen twice in a row."],
      ["Two-wheel discussions","Put characters on one wheel and settings on the other. Spin both and ask, “How are these connected?”"],
      ["Private by design","No account, no login. Your class list never leaves your computer."]
    ],
    lesson:{title:"Your Web Browser Can Run Apps", points:[
      ["It opens like a document",[
        "Chrome, Edge, and Safari can open a tool file the same way Word opens a document. Just double-click it.",
        "There’s nothing to install and nothing to log into."
      ]],
      ["Ask for everything in one file",[
        "I asked the AI to draw the wheel itself and to make the sounds with the computer, instead of pulling pictures or sound files from the internet.",
        "That means nothing can go missing, and the school filter has nothing to block."
      ]]
    ]}
  },
  {
    group:"helpers",
    name:"FeedbackFlow",
    short:"Click your rubric, get a warm feedback paragraph",
    grades:"Grades 3–12",
    file:"Example_2/FeedbackFlow_2.html",
    downloadFile:"Example_2/FeedbackFlow.zip", downloadName:"FeedbackFlow.zip",
    wish:"Let me click a level for each part of my rubric, and turn those clicks into a friendly, ready-to-paste feedback paragraph. Add buttons for comments I use all the time.",
    promptNote:"Scroll to the very bottom: that’s the follow-up tweak I sent after trying the first version. One extra message added custom score levels and a score summary.",
    prompt:"Act as an expert educational productivity tool developer. Build a flexible, safe, single-file HTML/CSS/JavaScript web application that turns rubric tier selections and quick-insert buttons into a cohesive, professional feedback paragraph for grading virtual student submissions.\n\nStrict Technical Guardrails:\n1. Zero Dependencies: Use vanilla JavaScript and standard browser DOM APIs only. No external CSS frameworks, CDN scripts, fonts, or server calls.\n2. Complete Standalone File: Deliver everything in a single, continuous code block containing all HTML, CSS, and JS.\n3. Zero-PII by Design: Do not store or ask for student names or IDs. The tool operates strictly as an in-memory text synthesizer.\n\nInterface & Workflow Layout:\n- Visual Design: Clean, high-contrast, modern layout optimized for split-screen grading next to an LMS or gradebook.\n- Configuration Panel (Collapsible Drawer):\n  * Dynamic Rubric Builder: Allow the teacher to add, edit, or delete rubric criteria (e.g., \"Thesis\", \"Evidence\", \"Conventions\"). For each criterion, provide editable feedback text fields corresponding to proficiency levels (0, 1, 2, 3, and 4).\n  * Quick-Insert / Hot-Key Button Manager: Allow teachers to add custom one-click phrase buttons (e.g., \"Wrong assignment submitted\", \"Resubmit by Friday\", or teacher contact info/office hours). Each item has a button label and the corresponding text snippet it injects.\n  * Template Import / Export: Provide two buttons:\n    - \"Export Configuration (.json)\": Downloads the active rubric criteria, tier statements, and quick-insert buttons as a local JSON file.\n    - \"Import Configuration (.json)\": Allows uploading a previously saved JSON file to instantly restore all categories and custom snippets without retyping.\n- Daily Grading Interface (Main View):\n  * Criteria Selectors: Render each configured rubric category with interactive radio buttons or slider steps for levels 0 through 4. Selecting a tier highlights the choice and updates the text generator immediately.\n  * Quick-Insert Action Bar: Display the custom hot-key buttons in a visible toolbar above the feedback box. Clicking a button appends that pre-set phrase directly to the feedback output.\n  * Live Feedback Preview Box: A dynamic <textarea> showing the assembled, polished feedback paragraph in real time. The teacher can directly edit or type in this box if manual personalization is needed.\n  * Copy Actions: A prominent, primary \"Copy Feedback to Clipboard\" button with temporary visual confirmation (e.g., green checkmark / \"Copied!\"), plus a \"Reset / Clear Form\" button to prep for the next submission.\n\nBehavior & Text Assembly Logic:\n- As the teacher clicks tier ratings, the app joins the active tier phrases into a smooth, natural narrative with appropriate spacing and punctuation.\n- If a criterion is left unselected, simply skip it without breaking or displaying \"undefined\".\n- Quick-insert snippets append to the end of the text as distinct sentences.\n\n**Refinement Prompt**\n0-4 for a score is a good default but I want the flexibility to grade 0-6 on a criterion or give a 0/2/4/6/8 score...\n\nIn the  Rubric & Snippet Configuration maybe include a \"Score\" input field next to the level (initially showing 0,1,2,3, and 4 and then include an option to add level or remove level. I'm not sure how to handle the word descriptor (i.e . emerging, developing, etc) maybe make that editable as well? Add this increased flexibility to the tool.\nAlso allow the user to select \"Include score in text\". Do not add the score inline add a rubric summary at the end that looks like this:\n\nScore 10/12\n------\nThesis        3/4\nStyle           4/4\nEvidence   3/4",
    what:"A point-and-click grading helper. Instead of typing the same comments on 80 papers, you click a level for each part of your rubric (like “Main Idea” or “Evidence”). The tool turns your clicks into a warm, complete feedback paragraph you can copy and paste with one click.",
    uses:[
      ["Faster grading that still sounds like you","Keep it open next to student work and watch the paragraph build as you click."],
      ["Your go-to comments, one click away","Add buttons for things you say all the time, like “Remember to cite two sources.”"],
      ["Optional score summary","It can add up the points (like 10/12) and attach a neat breakdown at the end."],
      ["Reuse your rubric next year","Save your rubric to a small file on your computer, then load it again whenever you need it."]
    ],
    lesson:{title:"Start Simple, Then Add On", points:[
      ["Your first version doesn’t need everything",[
        "I built the basic version first. After using it, I sent one more message: “I want to grade 0–6 on some parts, and add a score summary at the end.”",
        "One follow-up message, and the new version was ready."
      ]],
      ["Describe what should happen, in your own words",[
        "“When I click a level, add that sentence to the paragraph” works great. You don’t need any technical words.",
        "Be specific about what you want to see on the screen."
      ]],
      ["Saving without an account",[
        "Because there’s no login, ask for “Save my setup to a file” and “Load my setup” buttons.",
        "Your rubric lives in a small file on your computer, ready for next time."
      ]]
    ]}
  },
  {
    group:"helpers",
    name:"Recording & Transcript Tidy-Up",
    short:"Turn Zoom links and messy transcripts into clean, shareable text",
    grades:"Any grade (a tool just for you)",
    file:"Example_11/index.html",
    downloadFile:"Example_11/Lesson_Transcript_Prep.zip", downloadName:"Lesson_Transcript_Prep.zip",
    wish:"Paste in my class recording link and passcode and give me one neat, clickable link for students. Let me drop in my meeting transcript file and get clean, readable text with student names swapped out.",
    prompt:"Act as an expert educational productivity developer and front-end engineer. Build a fast, lightweight, and 100% private single-page web utility called \"Lesson Transcript & Link Prep\" to help virtual teachers clean classroom video recordings and transcript files (.vtt) for use with external AI summarization tools.\n\n### Technical & Privacy Guardrails:\n1. Pure Client-Side Execution: Zero external AI APIs, zero server calls, and zero external trackers. All transcript parsing, sanitization, and regex matching execute entirely in browser memory.\n2. Complete Standalone Architecture: Clean, modular structure using HTML5, modern CSS3, and native JavaScript (split across index.html, style.css, and script.js).\n3. FERPA Privacy by Design: Automatically identify the primary instructor and anonymize all student speakers to prevent personally identifiable information (PII) from ever being passed into commercial AI models.\n\n### User Interface & Layout:\n- Modern EdTech Design: Clean slate/neutral background (#f8fafc), white cards with subtle borders and shadows, crisp typography (Clash Display headings, Outfit body text), and vivid purple primary accents (#4f46e5).\n- Responsive Two-Column Input Deck:\n  * Column 1 (Transcript Upload): An intuitive drag-and-drop zone for `.vtt` caption files, with a fallback file picker button and file confirmation status.\n  * Column 2 (Recording & Passcode Info): Direct input fields for \"Recording URL\" and \"Passcode (optional)\", accompanied by a high-visibility \"Paste from Clipboard\" button that automatically parses meeting invitations.\n\n### Core Processing & Business Logic:\n\n1. Intelligent Clipboard Extraction:\n   - When the user clicks \"Paste from Clipboard\", inspect the clipboard string:\n     * Extract the meeting recording URL using regex (matching http/https URLs).\n     * Extract the meeting passcode using case-insensitive regex matching patterns like \"Passcode: [code]\", \"Access Passcode: [code]\", or \"Password: [code]\".\n     * Populate the respective input fields immediately and update the live preview.\n\n2. WebVTT Sanitization & Anonymization Engine:\n   - When a `.vtt` file is dropped or selected:\n     * Strip WebVTT headers (`WEBVTT`, `Kind: captions`, `Language:`, `NOTE`, etc.).\n     * Remove timing lines containing arrow timestamps (`00:00:00.000 --> 00:00:05.000`) and cue sequence numbers.\n     * Clean voice tags (`<v Name>`) and HTML tags (`<b>`, `<i>`, `<c>`).\n     * Analyze speaker frequency to automatically identify the main speaker (the teacher).\n     * Anonymize other speakers: replace student speaker names with `STUDENT: [speech]`.\n     * Clean speech continuation: deduplicate progressive live-caption fragments and smoothly merge consecutive lines from the same speaker into natural paragraphs.\n\n3. Two Dedicated Output Cards:\n   - Card 1: Hyperlinked Recording & Passcode\n     * Renders a live preview with a clickable link (`Watch the Lesson Recording`) and an optional styled passcode badge.\n     * \"Copy Link & Passcode\" action: writes a dual-format clipboard payload (rich HTML `<a href=\"...\">` and plain text fallback) so it pastes as a live hyperlink in Google Docs, Word, Outlook, Gmail, or Canvas LMS.\n   - Card 2: Completely Cleaned Transcript\n     * A full-width, scrollable, editable `<textarea>` containing the clean, timestamp-free transcript.\n     * Live word counter badge.\n     * \"Copy Transcript\" button that copies the sanitized text with one click, ready for the teacher to paste into ChatGPT, Claude, Gemini, or any AI resource for lesson recaps.\n\n4. Action Controls:\n   - A \"Clear All\" reset button to quickly wipe inputs, file state, and outputs for the next lesson.\n",
    what:"After a live class, you’re left with a recording link, a passcode, and a messy transcript file full of time codes. This tool turns the link and passcode into one tidy, clickable link for your announcement or email. It also turns the transcript into clean paragraphs, with student speakers relabeled as “STUDENT,” ready to paste into your AI helper for a lesson recap.",
    uses:[
      ["One-click announcement links","Paste the meeting info and copy a clickable “Watch the Lesson Recording” link that works in email and your LMS."],
      ["Lesson recaps in minutes","Copy the clean transcript into the AI chat you already use and ask for a summary, a review sheet, or quiz questions."],
      ["Student names removed","Student speakers are relabeled automatically. Always skim the text before sharing, though: a name spoken out loud can still slip through."],
      ["Nothing leaves your computer","All the cleanup happens right in your browser."]
    ],
    lesson:{title:"Build Helpers That Get Your Stuff Ready", points:[
      ["You don’t need AI inside your tool",[
        "This tool doesn’t use AI at all. It just tidies up your text so you can paste it into the AI chat you already use.",
        "Small “get it ready” helpers are some of the most useful things you can build."
      ]],
      ["Protect privacy before you paste",[
        "Ask your tool to remove student names before any text goes near an AI chat.",
        "Then give it a quick read yourself. You’re the final safety check."
      ]],
      ["Ask for smart copy buttons",[
        "Ask for a copy button that pastes as a clickable link in emails and your LMS. It’s a small touch that saves a step every single day."
      ]]
    ]}
  },

  /* ---------------------------- GAMES FOR ANY GRADE ---------------------------- */
  {
    group:"games",
    name:"Water Cycle Memory Match",
    short:"Flip cards to match words with pictures",
    grades:"Grades 2–6",
    file:"Example_12/index.html",
    downloadFile:"Example_12/Water_Cycle_Memory.zip", downloadName:"Water_Cycle_Memory.zip",
    wish:"A 16-card memory game that matches water cycle words to pictures, with a water theme, fun sounds, a mute button, and a New Game button.",
    promptNote:"That’s the whole wish! A short, plain request like this one is all it took to get a polished game.",
    prompt:"Assume I have images for each of the vocab words\n\nEvaporation\n\nCondensation\n\nPrecipitation\n\nTranspiration\n\nAccumulation (Collection)\n\nRunoff\n\nGroundwater\n\nWater Vapor\n\nand the images are stored as pic_1.png, pic_2.png and so on.\n\nMake a simple memory game that can be displayed on screen. Make it a single html file and use some simple alt text or generated art so it works even without the stored images (if they are missing). Have a \"New Game\" button that starts a new game with a shuffled order. There should be 16 cards on screen, the images and the words. Use a water theme, fun sound effects with a mute button and smooth animations.\n\n",
    what:"A classic flip-two-cards memory game. Students match 8 water cycle words (like Evaporation and Condensation) with pictures that show them. Cards flip with a satisfying animation, matches play a happy chime, and there’s a celebration when the board is cleared.",
    uses:[
      ["Screen-share warm-up","Students call out which cards to flip while you click. It’s a great whole-class opener."],
      ["Words plus pictures","Connecting a vocabulary word to a picture helps it stick."],
      ["Use your own pictures","Save your own images in the game folder as pic_1.png through pic_8.png, and the game uses them automatically."],
      ["Classroom-friendly sound","Gentle sound effects, with a mute button for quiet times."]
    ],
    lesson:{title:"Short Wishes Work", points:[
      ["You don’t need a long, fancy prompt",[
        "This whole game came from a short paragraph: the list of words, “make a memory game,” and a few fun touches like a water theme and sounds."
      ]],
      ["Ask for pictures you don’t have yet",[
        "I told the AI: “Assume I have pictures named pic_1.png, pic_2.png, and so on.”",
        "That let me build the game first and add the pictures later."
      ]],
      ["Ask for a backup plan",[
        "“If a picture is missing, show something simple instead” means the game never shows a broken image. It works on day one."
      ]]
    ]}
  },
  {
    group:"games",
    name:"Put It In Order Timeline",
    short:"Drag events onto a timeline, then check your order",
    grades:"Grades 3–12",
    file:"Example_3/Elastic_Timeline.html",
    downloadFile:"Example_3/Elastic_Timeline.zip", downloadName:"Elastic_Timeline.zip",
    wish:"Cards float at the bottom of the screen, and students drag them onto a timeline in order. A Check button turns cards in the right place green and cards that need to move yellow. Let me paste in any list.",
    prompt:"Create a complete, single-file HTML web application (HTML, CSS, and JS combined in one file) for a teacher-facing, interactive timeline ordering activity designed for screen sharing.\r\n\r\n### 1. Visual & UI Architecture\r\n- Dark/Modern EdTech Aesthetic: Slate/Navy dark background (#0f172a), high contrast typography, crisp rounded cards with soft shadows, and clean glassmorphism accents.\r\n- Top Header: Includes the app title (\"Elastic Timeline\"), a \"Pasting / Setup\" modal button (gear icon or \"Edit List\"), a prominent \"Check Timeline\" button, and a \"Reset\" button.\r\n- Setup Modal: \r\n  - Opens cleanly as an overlay/modal with a backdrop blur; must NOT take up permanent screen real estate.\r\n  - Contains a large textarea where the teacher pastes line-separated events in correct chronological order (1 per line).\r\n  - A \"Load Activity\" button that parses the text, assigns 1-based original index IDs, clears the timeline, and spawns the cards in the floating dock.\r\n  - Automatically loads a default sample dataset on first visit (e.g., 5-6 historical or narrative events).\r\n\r\n### 2. Floating Bottom Dock (Unplaced Pool)\r\n- Occupies the bottom 35% of the screen.\r\n- Unplaced cards float gently with subtle, continuous CSS drifting/hovering physics to feel alive and playful.\r\n- Dragging a card out of the floating dock pauses its floating animation and makes it draggable.\r\n\r\n### 3. Elastic Top Timeline Rail\r\n- Occupies the top/middle 60% of the screen.\r\n- Features a central horizontal line (the timeline stem).\r\n- Elastic Insertion & Dynamic Spacing: When dragging a card over the timeline, adjacent attached cards fluidly slide left and right (using dynamic CSS transforms or FLIP transitions) to clear a space. Dropping the card inserts it at that exact relative position and recalibrates horizontal spacing evenly across the rail.\r\n- Vertical Staggering / Magnetic Offset (Anti-Collision):\r\n  - Long event text must never overlap horizontally adjacent cards.\r\n  - When cards snap to the timeline, alternate their vertical positions (e.g., odd-indexed placed cards sit slightly ABOVE the rail stem, even-indexed placed cards sit slightly BELOW the rail stem) with visible vertical connecting lines attaching them to the main rail stem.\r\n  - Implement a subtle spring/magnetic snapping effect as cards approach the stem.\r\n\r\n### 4. Logic & Grading (Wordle-Style LIS Algorithm)\r\n- When the teacher/class clicks \"Check Timeline\":\r\n  - Read only the cards currently placed on the timeline stem from left to right.\r\n  - Extract their original 1-based answer indices.\r\n  - Compute the Longest Increasing Subsequence (LIS) of the placed cards.\r\n  - Apply Wordle Color Coding:\r\n    - GREEN (#22c55e background / glowing border): Cards that are part of the LIS (the correct structural backbone).\r\n    - YELLOW / AMBER (#eab308 background / glowing border): Displaced cards that break the sequence and need to be moved.\r\n    - GREY / DEFAULT: Cards left in the bottom pool remain neutral.\r\n- If all placed cards form a perfect monotonically increasing sequence and all cards from the pool are used, trigger a subtle celebration particle/confetti effect.\r\n\r\n### 5. Technical Requirements\r\n- Standard Pointer Events (PointerDown, PointerMove, PointerUp) or HTML5 Drag and Drop for butter-smooth desktop and touch/stylus operation.\r\n- Fully standalone: Zero external framework dependencies (Vanilla JavaScript, inline CSS inside `<style>`, pure HTML).\r\n- Responsive: Recalculates canvas/bounds on window resize so cards stay within bounds.\r\n- Make the code complete, production-ready, and fully contained within a single index.html file.",
    what:"Event cards float gently at the bottom of the screen. Drag them onto the timeline and the other cards slide over to make room. Click “Check Timeline” and the cards light up to show which ones are in the right order, Wordle-style.",
    uses:[
      ["Sequencing together on a shared screen","Read the cards aloud, ask the class what comes next, and drag the cards into place together."],
      ["Gentle feedback","Green means it’s in the right place. Yellow means “move me.” Students see where the order broke without feeling defeated."],
      ["Any list, any subject","Click “Edit List” and paste events in order: story plot points, history, the steps of a science process."],
      ["Celebrate success","Confetti bursts across the screen when the whole order is correct."]
    ],
    lesson:{title:"Describe How It Should Feel", points:[
      ["Use everyday words for movement",[
        "You don’t need to know anything about animation. I used phrases like “float gently,” “snap into place,” and “slide apart to make room.”"
      ]],
      ["Borrow games students already know",[
        "Students know Wordle’s green and yellow. Asking for “Wordle colors” got gentle, familiar feedback instead of a harsh “Wrong!”"
      ]],
      ["Build in an “Edit List” button",[
        "Don’t lock one set of questions into your tool. Ask for a button where you can paste your own list.",
        "Then one tool becomes a game for every unit you teach."
      ]]
    ]}
  },
  {
    group:"games",
    name:"Vocabulary Codenames",
    short:"Red team vs. blue team word game for review",
    grades:"Grades 4–12",
    file:"Example_4/CodeNames.html",
    downloadFile:"Example_4/Vocabulary_Codenames.zip", downloadName:"Vocabulary_Codenames.zip",
    wish:"A Codenames-style game: a 4-by-4 grid of my vocabulary words with secret red, blue, and “trap” cards, plus buttons to copy each team’s secret list so I can message it to my student clue-givers.",
    prompt:"Act as an expert educational web application developer. Build a flexible, safe, single-file HTML/CSS/JavaScript web application that turns any list of 16+ vocabulary words into an interactive 4x4 \"Codenames\" vocabulary game with instant spymaster text-export tools for virtual or hybrid classrooms.\r\n\r\n### Strict Technical Guardrails:\r\n1. Zero Dependencies: Use vanilla JavaScript and standard browser DOM APIs only. No external CSS frameworks, CDN scripts, icon libraries, fonts, or server calls.\r\n2. Complete Standalone File: Deliver everything in a single, continuous code block containing all HTML, CSS, and JS (`index.html`).\r\n3. Zero-PII & Local State: Operates entirely client-side in browser memory. Do not store or request any personal or student data.\r\n\r\n### Card Role Distribution (4x4 / 16-Tile Grid):\r\nWhen generating a new game, randomly distribute the 16 selected words into the following secret roles:\r\n- 5 Red Team Words\r\n- 5 Blue Team Words\r\n- 5 Neutral / Bystander Words\r\n- 1 Assassin Word\r\n\r\n### Core Workflow & Interface Requirements:\r\n\r\n1. Word Input & Game Setup Section:\r\n   - Textarea: Allow teachers to paste 16 or more vocabulary words (must handle newline, comma, or tab separation smoothly).\r\n   - Word Counter & Validation: Display a real-time counter of valid unique words entered.\r\n   - Smart Picker: If more than 16 words are provided, randomly select 16 words when generating the game while keeping the unused words available for a quick \"Reshuffle Board\" action.\r\n   - \"Generate Game\" and \"Reshuffle / New Game\" buttons.\r\n\r\n2. Spymaster Copy Utility (Direct Messaging Tools):\r\n   - Provide high-visibility \"One-Click Copy\" buttons that copy formatted, plain-text strings directly to the clipboard (with a temporary \"Copied!\" visual confirmation feedback) to quickly direct message spymasters in Zoom, Teams, Google Meet, or Discord:\r\n     * [Copy Red Key]: Formatted as `🔴 RED TEAM WORDS (5): Word1, Word2, Word3, Word4, Word5`\r\n     * [Copy Blue Key]: Formatted as `🔵 BLUE TEAM WORDS (5): Word1, Word2, Word3, Word4, Word5`\r\n     * [Copy Assassin]: Formatted as `💀 ASSASSIN WORD (1): Word`\r\n     * [Copy Master Key]: Formatted as a neat 4-section summary of all secret roles.\r\n\r\n3. Interactive 4x4 Game Board:\r\n   - Display a responsive 4x4 grid of large, easy-to-read cards.\r\n   - Default Player View: Cards start neutral/hidden with large, bold word text.\r\n   - Interactive Reveal: Clicking a card flips/reveals its identity with distinct color coding:\r\n     * Red Team: High-contrast red background with white text.\r\n     * Blue Team: High-contrast blue background with white text.\r\n     * Neutral: Soft gray background with strike-through text.\r\n     * Assassin: Dark charcoal/black background with white text and a clear warning indicator.\r\n   - Spymaster Peek Toggle: Include a \"Show Spymaster Color Overlays\" toggle switch that subtly colors all card borders/badges so the teacher running the board on screen-share can see all secret roles without revealing them to student players.\r\n\r\n4. UI & Visual Design:\r\n   - Modern, high-contrast visual design optimized for split-screen usage or video conference screen sharing.\r\n   - Smooth hover effects, clear focus states, and scalable typography using modern system UI fonts (`system-ui`, `sans-serif`).\r\n   - Clean structural sections with clean spacing and clear visual hierarchy.",
    what:"A vocabulary review game based on the party game Codenames. Paste in 16 or more words, and the tool lays them out as cards with secret team colors hidden underneath. Two student clue-givers (“spymasters”) give one-word hints to help their team find their own words on your shared screen.",
    uses:[
      ["Team review","Split the class into a Red Team and a Blue Team, in the main session or in breakout rooms."],
      ["Secret lists in one click","Copy each team’s secret word list and private-message it to your clue-givers in Zoom, Teams, or Meet."],
      ["Reveal as they guess","Click a card to flip it and show its color, including the surprise trap card that ends the game."],
      ["A teacher-only answer key","Open the key in a separate tab. When you share just one tab, students won’t see it."]
    ],
    lesson:{title:"Design for Your Online Classroom", points:[
      ["Build around the tools you already use",[
        "I asked for copy buttons formatted for the chat box in my meeting software, so sending secret lists takes seconds."
      ]],
      ["Ask for a teacher-only view",[
        "Many games need a hidden answer key. Ask for a “teacher peek” button or a separate key window so you can run the game without spoiling it."
      ]],
      ["Emojis are free pictures",[
        "You don’t need to find graphics. Ask for emojis like 🔴, 🔵, and 💀 to make buttons and cards instantly clear and colorful."
      ]]
    ]}
  },

  /* ---------------------------- DEEP DIVES ---------------------------- */
  {
    group:"deep",
    name:"The Rug Problem",
    short:"Quadratic equations shown as rugs",
    grades:"Algebra 1 & 2",
    file:"Example_10/index.html",
    downloadFile:"Example_10/The_Rug_Problem.zip", downloadName:"The_Rug_Problem.zip",
    wish:"Show quadratic equations as rugs with a piece cut out or added on. Students guess the missing width, and the tool shows their guess being plugged in and says whether it’s too high or too low.",
    prompt:"Act as an expert educational software engineer and secondary mathematics curriculum specialist. Build an interactive, zero-dependency, single-file HTML/CSS/JavaScript web application called \"The Rug Problem\" to help algebra and geometry students master quadratic equations (of the form ax² ± bx = c) through an intuitive geometric area model.\n\n### Technical & Environmental Constraints:\n- Zero Dependencies: Pure native HTML5, SVG, CSS3, and modern JavaScript combined inside one standalone `index.html` file.\n- Client-Side Privacy: Operates entirely in browser memory; no backend server, cookies, or external CDN dependencies.\n- Rich Aesthetics: High-contrast dark theme with sophisticated typography (serif headings like Palatino/Iowan Old Style, clean sans-serif UI) and rich jewel tones (saffron #f2b84b, madder red #a8324a, deep indigo #2a2f6e, mint #5fd4a0).\n\n### Core Pedagogical Architecture: The Rug Problem\nRather than treating quadratic equations as abstract formula manipulation, model equations as physical Persian woven rugs:\n1. An initial rectangular rug of dimensions (a₁·x) by (a₂·x), yielding a base quadratic area of a·x² (where a = a₁·a₂).\n2. A linear modification strip:\n   - If b > 0: A rectangular corner section of dimensions (b by x) is cut out from the rug.\n   - If b < 0: An extra rectangular flap of dimensions (|b| by x) is sewn onto the bottom of the rug.\n3. The resulting net area equals a target value c: a·x² - b·x = c (or a·x² + |b|·x = c).\n4. The student must determine the unknown width x. A guess within 0.01 of the true positive root counts as correct.\n\n### Key Interactive Features:\n\n1. Procedural SVG Rug Stage:\n   - Render a textured Persian rug using SVG pattern definitions (diamond weave pattern with saffron accents and madder circular medallions).\n   - Accurately draw the polygon path representing the net rug geometry:\n     * Full rectangle if b = 0.\n     * Cutout notch with dashed yellow border and cutout dimensions if b > 0.\n     * Attached rectangular flap with dimensions if b < 0.\n   - Render clear dimension arrows and labels for side lengths (a₁·x, a₂·x) with glowing pulsating markers for the unknown variable x.\n   - Include a prominent total area badge showing the numerical target area c.\n\n2. Equation & Narrative Synchronization:\n   - Dynamic equation display showing the active quadratic form with styled x slots (e.g., 6x² - 2x = 4).\n   - Clear verbal story banner explaining the geometry in plain English (e.g., \"A 2x by 3x rug with a 2 by x section cut out has a total area of 4.00\").\n\n3. Animated Kinesthetic Guess & Evaluation:\n   - Numerical guess input with \"Check\" button and Enter key submission.\n   - Multi-step substitution animation:\n     * Step 1: The guessed number smoothly replaces each instance of x in the equation slots with glowing saffron highlights.\n     * Step 2: The evaluated left-hand side is computed and compared against target area c.\n     * Step 3: Fly animation—the evaluated result element detaches and smoothly glides across the screen into the active cell of the guess-history table.\n     * Step 4: Directional feedback—display whether the result is too low (↑) or too high (↓) with color-coded badges, or mark with a checkmark (✓) and celebrate when within 0.01.\n\n4. Guess History & Scaffolding Table:\n   - A sticky sidebar table tracking all student guesses, chronological attempt numbers, and evaluation results.\n   - Allows students to engage in bisection / binary-search numerical reasoning to home in on the root.\n\n5. Scaffolded Level Progression:\n   - Level 0: Pure x² squares (x² = c).\n   - Level 1: Concrete rugs with physical integer dimensions and clean positive roots.\n   - Level 2: Abstract quadratics with decimal roots.\n   - Level 3: No real solutions (negative discriminant D < 0)—helping students discover why some quadratics cannot produce real geometric dimensions.\n   - Level 4: Negative Area boundary conditions.\n   - Action controls: \"Reveal x\" button for teacher demonstration or stuck students, and \"New rug\" button for unlimited procedural practice.\n",
    what:"Each equation becomes a picture of a woven rug, with a piece cut out or a strip added on. Students guess the missing width. The tool plugs their guess into the equation step by step, shows whether the total is too high or too low, and keeps a table of their guesses so they can zero in on the answer.",
    uses:[
      ["See the algebra","x² becomes a real square and x becomes a strip, so the symbols mean something."],
      ["Guess, check, and improve","Students propose guesses in the chat and narrow in together."],
      ["Levels that build","Levels go from simple squares up to problems that have no solution at all, and students discover why."]
    ],
    lesson:{title:"Turn Symbols Into Pictures", points:[
      ["Ask the AI to draw the math",[
        "Asking for “show each equation as a rug with a piece cut out” turned abstract letters into something students can picture."
      ]],
      ["Show the work, not just right or wrong",[
        "Instead of just “Too low,” I asked the tool to show the guess being plugged in, one step at a time."
      ]],
      ["Include problems that can’t be solved",[
        "Asking for a level with no solution sparks great discussions about why."
      ]]
    ]}
  },
  {
    group:"deep",
    name:"Rotate & Relate",
    short:"Similar triangles you can flip and spin",
    grades:"Geometry",
    file:"Example_5/Elements_On_Screen.html",
    downloadFile:"Example_5/Rotate_And_Relate.zip", downloadName:"Rotate_And_Relate.zip",
    wish:"Students connect matching sides of two triangles with colored cords and write the similarity statement. Then they watch one triangle slide, flip, and turn until it lands on the other.",
    prompt:"Act as an expert educational front-end engineer and geometric visualization specialist. Build a zero-dependency, interactive web manipulative called \"Rotate & Relate: Similar Right Triangles\" designed to help secondary geometry students master the Altitude-to-the-Hypotenuse Theorem through tactile side-matching and kinematic transformation animations.\n\n### Technical Stack & Architectural Triad:\nSplit the implementation into 3 clean, modular standalone files with zero external dependencies (no React, D3, or Tailwind; pure HTML5, CSS3, and ES6+ JavaScript):\n1. `Elements_On_Screen.html`: Semantic HTML5 markup, SVG container scaffolding, UI cards, and modal elements.\n2. `How_It_Looks.css`: Modern \"Dark Cyber-Geometry\" theme (#0a0a0f canvas, #12121a cards, glowing neon accents: cyan #38bdf8, gold #fbbf24, violet #a855f7), responsive layout, and typography.\n3. `What_It_Does.js`: Procedural geometry generator, SVG coordinate rendering, pointer-driven patch cord physics, similarity verification engine, and multi-stage transformation animator.\n\n### Pedagogical Core: Altitude-to-the-Hypotenuse:\nWhen an altitude is drawn from the right angle of a right triangle to its hypotenuse, it creates two smaller sub-triangles that are similar to each other and to the parent triangle.\nThe tool must randomly generate a primary right triangle (vertices labeled A, B, C with altitude to point D), select two of the three triangles (Large, Medium, or Small), and challenge students to:\n1. Match corresponding sides using 3 color-coded virtual patch leads.\n2. Formulate the exact geometric similarity statement in correct corresponding vertex order.\n3. Trigger an animated transformation proof that translates, reflects, and rotates the triangles into concurrency to verify their work visually.\n\n### Interactive Components & Behavior:\n\n1. Dynamic SVG Geometry Workspace:\n   - Procedurally generate a non-isosceles right triangle with altitude $CD \\perp AB$.\n   - Display angle markers ($90^\\circ$ squares) and distinct vertex labels.\n   - Render the two selected triangles to be compared.\n\n2. Color-Coded Patch Cords (Drag & Connect):\n   - Provide 3 virtual patch cords:\n     * Red Cord: Connects corresponding Short Legs.\n     * Blue Cord: Connects corresponding Long Legs.\n     * Yellow Cord: Connects corresponding Hypotenuses.\n   - Use unified Pointer Events (`pointerdown`, `pointermove`, `pointerup`) with live SVG quadratic bezier curve rendering while dragging between side midpoint anchor pins.\n\n3. Similarity Statement Builder:\n   - Provide interactive dropdowns or text inputs for the similarity statement:\n     $\\Delta \\text{ [ _ _ _ ] } \\sim \\Delta \\text{ [ _ _ _ ] }$\n   - Ensure the student must match vertices in exact corresponding order (e.g., matching right angle to right angle, acute to acute).\n\n4. The Kinematic Transformation Animation (The \"Aha!\" Moment):\n   - When the student clicks \"Check & Animate\":\n     * Stage 1 (Translation): Glide the second triangle across the canvas until hypotenuse midpoints coincide.\n     * Stage 2 (Reflection): If the two triangles have opposite spatial chirality, smoothly reflect across the axis.\n     * Stage 3 (Rotation): Rotate the second triangle into concurrency so it nests directly inside or coincides with the first.\n   - As the triangles align, if the patch cords were connected correctly, the cords shrink into glowing alignment rings. If incorrect, mismatched cords visibly twist and flash amber/red.\n\n5. Controls & Feedback:\n   - \"New Problem\": Generates a new randomized right triangle configuration.\n   - \"Reset Cords\": Clears connected leads.\n   - Real-time score and streak tracking.",
    what:"A hands-on geometry tool for similar right triangles. Students drag colored cords between matching sides, type the similarity statement, then press a button to watch the triangles lift off, flip over, and rotate until they line up.",
    uses:[
      ["Make hidden shapes visible","Students see how the overlapping triangles really match up."],
      ["Test their thinking","Colored cords show which sides students think go together."],
      ["The “aha!” moment","The animation shows right away whether their matches line up or clash."],
      ["Endless practice","Click “New Problem” for a fresh triangle every time."]
    ],
    lesson:{title:"Plan Big Projects Before You Build", points:[
      ["Ask the AI to help you plan first",[
        "For a bigger idea, start with: “Before you build anything, help me write a one-page plan for this tool. Ask me questions.”",
        "A clear plan keeps the AI from guessing about your rules and layout."
      ]],
      ["Big tools can be split into three files",[
        "When a tool gets large, ask for three files: one for <b>what’s on the screen</b>, one for <b>how it looks</b>, and one for <b>what it does</b>. They stay together in one folder.",
        "It keeps big projects tidy for you and for the AI."
      ]],
      ["Animate the hard part",[
        "Textbook diagrams can’t move. Ask the AI to slide, flip, and turn shapes so students can watch the idea happen."
      ]]
    ]}
  },
  {
    group:"deep",
    name:"Angle Detective",
    short:"Step-by-step practice with parallel lines and angles",
    grades:"Geometry",
    file:"Example_6/transversal_angles.html",
    downloadFile:"Example_6/Transversal_Angles.zip", downloadName:"Transversal_Angles.zip",
    wish:"Practice with parallel lines cut by a transversal, in three steps: name the angles, choose the relationship, then solve for x. Each step only unlocks after the one before it is correct.",
    prompt:"Act as an expert educational software architect specializing in scaffolded secondary mathematics instruction. Build an interactive, responsive web application for high school geometry students to master angle relationships formed by parallel lines cut by a transversal line.\n\n### Core Pedagogical Architecture: The 3-Stage Gated State Machine\nTo ensure deep conceptual mastery, students cannot simply guess answers or skip ahead. Every problem must follow a strictly scaffolded 3-stage sequence where subsequent stages remain locked until the current stage is verified:\n\n1. Stage 1: Angle Naming (Geometric Notation):\n   - Highlight two specific target angles on the dynamic SVG diagram with high-contrast color badges (Blue and Red).\n   - Provide a draggable/clickable point bank containing the labeled line points.\n   - Challenge students to construct the standard 3-point geometric name for both angles (e.g., $\\angle AGH$ and $\\angle GHD$) by dragging or selecting points into 3-slot target drop zones.\n   - Validate vertex ordering (the vertex point MUST be in the center position).\n\n2. Stage 2: Relationship Identification & Geometric Properties:\n   - Once Stage 1 is verified, unlock Stage 2.\n   - Angle Pair Classification: Interactive selector for the relationship type:\n     * Alternate Interior Angles\n     * Alternate Exterior Angles\n     * Corresponding Angles\n     * Consecutive (Same-Side) Interior Angles\n     * Consecutive (Same-Side) Exterior Angles\n     * Linear Pair / Vertical Angles\n   - Property Determination: Toggle between Congruent ($\\cong$) or Supplementary ($180^\\circ$).\n   - Provide instant, non-punitive corrective feedback explaining the geometric rationale.\n\n3. Stage 3: Algebraic Application & Equation Solving:\n   - Once Stage 2 is verified, unlock Stage 3.\n   - Display dynamic algebraic expressions or numerical values next to the target angles (e.g., $(3x + 15)^\\circ$ and $(5x - 25)^\\circ$).\n   - Challenge students to set up the equation, solve for the variable $x$, and submit their numerical answer.\n   - Include a built-in scratchpad or steps modal to help students structure their algebraic working.\n\n### Dynamic SVG Geometry & Problem Engine:\n- Procedural Diagram Generator:\n  * Two horizontal parallel lines ($l_1, l_2$) intersected by a transversal line ($t$).\n  * The transversal angle must vary dynamically between $45^\\circ$ and $135^\\circ$ (excluding $90^\\circ$) so no two consecutive problems look identical.\n  * Render clear angle arcs, vertex points, and arrowheads.\n  * Dynamically calculate text label offsets so letters never collide with lines or angle arcs.\n\n### Difficulty Levels & Session Flow:\n- Level 1: Numerical angle values and simple single-step variables.\n- Level 2: Linear expressions paired with numerical values.\n- Level 3: Systems with algebraic expressions on both angles requiring multi-step equation solving.\n- Session Management & Export:\n  * Student login modal (first name and last initial only—100% offline, zero server storage).\n  * 6-problem session set with real-time accuracy scoring.\n  * End-of-session downloadable performance summary report (timestamped text file) containing problem breakdown, accuracy, and attempts for easy submission to the teacher.\n\n### Technical Guardrails:\n- Pure client-side execution (HTML5, CSS3, ES6 JavaScript) with zero required backend or database.\n- Responsive, accessible design with clear focus states and keyboard navigation.",
    what:"A geometry practice tool that walks students through each problem in three steps: name the two marked angles, decide how they’re related (and whether they’re equal or add up to 180°), then solve for x. Each step unlocks only when the one before it is right. Students finish with a short report they can download and turn in.",
    uses:[
      ["Catch mistakes early","Students can’t rush to the algebra until they’ve named and classified the angles correctly."],
      ["A fresh diagram every time","Every problem draws a new set of lines at a new angle."],
      ["Three difficulty levels","Levels go from plain numbers up to equations on both angles."],
      ["Something to turn in","An end-of-session report shows each student’s accuracy and attempts."]
    ],
    lesson:{title:"Unlock One Step at a Time", points:[
      ["Lock later steps until earlier ones are right",[
        "In multi-step problems, one early mistake snowballs. Ask the AI to keep step 2 locked until step 1 is correct."
      ]],
      ["Borrowing a tool someone else built",[
        "The full version in the download adds a help button powered by Graspable Math, a free algebra tool made by other people.",
        "The trade-off: that part needs the internet, unlike our one-file tools."
      ]]
    ]}
  },
  {
    group:"deep",
    name:"Polar Defender",
    short:"An arcade game for plotting polar coordinates",
    grades:"Precalculus",
    file:"Example_7/index.html",
    downloadFile:"Example_7/Polar_Defender.zip", downloadName:"Polar_Defender.zip",
    wish:"An arcade radar game: threats appear at polar coordinates and students aim a turret to hit them. Include three difficulty levels, music, and sound effects.",
    prompt:"Act as an expert educational game designer and senior creative technologist. Build an arcade-style, high-intensity math game called \"POLAR DEFENDER\" that transforms polar coordinate plotting into an engaging radar defense intercept simulator.\n\n### Game Premise & Narrative:\nThe player acts as an intercept defense operator at the Unified Polar Defense Command. Incoming hostile airborne threats appear on a 360-degree radar display at specific polar coordinates $(r, \\theta)$. The player must interpret the coordinate telemetry and fire the central defense turret to neutralize threats before they breach shield perimeter.\n\n### Architectural Structure:\n- Structure the application cleanly across 3 standalone files: `index.html`, `style.css`, and `script.js`.\n- Integrate external audio sound effects and musical tracks (`Playing_Music.mp3`, `Pause_Music.mp3`, `Win_Music.mp3`, `Turret_Fire.mp3`, `Turret_Miss.mp3`, `Enemy_Fire.mp3`, `Enemy_Explode.mp3`) with robust audio unlock handlers conforming to browser autoplay security policies.\n\n### Core Screens & Game Flow:\n\n1. Clearance / Login Terminal:\n   - Retro tactical command UI asking for a \"Call Sign\" (e.g. VIPER, GHOST, MATHWIZ) with strict privacy guidelines (no real names).\n   - Challenge Tier Selection:\n     * Recruit: 10 Shields, extended target fuse, continuous angle guidance, 1.0x score multiplier.\n     * Veteran: 7 Shields, standard fuse, standard angle guidelines, 1.25x score multiplier.\n     * Commander: 5 Shields, fast threat emergence, radians & negative radius equivalents, 1.5x score multiplier.\n   - Animated \"Credentials Accepted\" security clearance sequence.\n\n2. Mission Briefing Overlay:\n   - Interactive 3-step walkthrough of polar coordinate mechanics ($r$ = distance from center radar pole, $\\theta$ = counterclockwise angle from the positive x-axis).\n   - Quick start and skip controls.\n\n3. Combat HUD & Radar Canvas:\n   - Radar Canvas: 520x520 circular radar screen featuring concentric range rings ($r = 1$ to $5$), radial angle spokes ($0^\\circ, 30^\\circ, 45^\\circ, 60^\\circ, 90^\\circ\\dots$), and a continuous rotating phosphor sweep beam.\n   - Threat Telemetry Panel: Displays the intercepted signal $(r, \\theta)$ in prominent glowing green typography.\n   - Center Turret: Pivot base with dual cannon barrels that rotate dynamically toward the player's aim angle, featuring realistic rotation easing, muzzle flash, and recoil kickback.\n   - Firing Mechanism: Clicking the radar canvas locks coordinates and automatically rotates and fires the turret. Players can also aim and press the Spacebar or \"Fire Cannon\" button.\n   - Threat Destruction & Miss Consequences: Direct hits trigger a particle explosion with screen shake and sound effect. Misses trigger a counter-attack laser from the threat, depleting shield integrity.\n   - Shield Integrity Bar: Segmented health indicators that flash crimson upon damage.\n   - Wave Progression & Escalation:\n     * Wave 1-2: Standard positive degree angles ($0^\\circ-360^\\circ$) at integer radii.\n     * Wave 3-4: Introduction of radian angles ($\\frac{\\pi}{6}, \\frac{\\pi}{4}, \\frac{\\pi}{3}, \\frac{\\pi}{2}, \\pi, \\frac{3\\pi}{2}\\dots$).\n     * Wave 5+: Negative radius equivalents on Commander tier ($(-r, \\theta)$ maps opposite through the pole to $(r, \\theta + 180^\\circ)$).\n   - Audio & Music Control Bar: Live toggles for Music, Sound FX, Mission Briefing, and Pause (\"Temporal Delay\").\n   - Victory & Game Over Screens: Detailed operational debrief with final score, accuracy percentage, longest streak, and rank classification.\n\n### Visual Aesthetic & Game Feel:\n- Cyberpunk tactical military CRT monitor styling: deep obsidian (#050b08), glowing radar green (#00ff88), neon alert amber (#ffb700), warning crimson (#ff2244).\n- Dynamic screen shake on explosions, glowing phosphor trails, and particle emitter effects.",
    what:"An arcade-style radar game. Threats appear on a circular radar screen at polar coordinates (a distance and an angle). Students read the coordinates and aim a turret to hit them before the shields run out.",
    uses:[
      ["Practice that feels like a game","Plotting coordinates becomes a race to protect your shields."],
      ["Call signs, not names","Students play as “VIPER” or “GHOST,” so you can share scores on screen without showing real names."],
      ["Three difficulty levels","Recruit, Veteran, and Commander levels make it easy to differentiate."],
      ["Sound with a mute button","Music and sound effects, with one-click mute controls."]
    ],
    lesson:{title:"Add Your Own Sounds and Pictures", points:[
      ["Put the files in the same folder",[
        "Keep your sound files and pictures in the same folder as the tool, then tell the AI the exact file names: “Play Turret_Fire.mp3 when I click.”"
      ]],
      ["Sound needs a first click",[
        "Web browsers won’t play sound until someone clicks on the page. Ask for a Start button so that first click turns the sound on.",
        "Always ask for a mute button too."
      ]],
      ["Make it feel exciting",[
        "Ask for little reactions like a screen shake, a cannon kickback, or an explosion. Small touches turn a drill into a game."
      ]]
    ]}
  },
  {
    group:"deep",
    name:"Statistics Picture Calculator",
    short:"See the curve, the shaded zone, and the p-value",
    grades:"AP Statistics",
    file:"Example_8/Vanilla/index.html",
    downloadFile:"Example_8/Hypothesis_Testing.zip", downloadName:"Hypothesis_Testing.zip",
    wish:"A statistics calculator for four common hypothesis tests that draws the curve, shades the “reject” zone, and marks where the student’s result lands.",
    prompt:"Act as a senior computational statistician and educational front-end software architect. Build a comprehensive, zero-dependency statistical hypothesis testing calculator suite with interactive real-time probability distribution curve visualizations.\n\n### Architectural Dual Implementation Challenge:\nThis project demonstrates two architectural paradigms achieving the exact same interactive capability:\n1. `Vanilla/`: Implemented using pure, zero-dependency HTML5, CSS3, and ES6+ JavaScript. Requires zero npm packages, zero external CDNs, and works 100% offline.\n2. `Tailwind Calculator/`: Implemented using utility-first Tailwind CSS classes for rapid UI prototyping and consistent spacing design tokens.\n\n### Supported Statistical Hypothesis Tests:\nThe suite must feature a top-level test selector supporting 4 core hypothesis tests:\n1. Chi-Square Test for Variance ($\\sigma^2$):\n   - Sample variance ($s^2$) or sample standard deviation ($s$), sample size ($n$), hypothesized variance ($\\sigma_0^2$).\n   - Degrees of freedom $df = n - 1$.\n   - Test statistic formula: $\\chi^2 = \\frac{(n-1)s^2}{\\sigma_0^2}$.\n   - Graph: Asymmetric, right-skewed Chi-square distribution curve.\n2. One-Sample Student's T-Test for Mean ($\\mu$ with unknown $\\sigma$):\n   - Sample mean ($\\bar{x}$), sample standard deviation ($s$), sample size ($n$), hypothesized mean ($\\mu_0$).\n   - Degrees of freedom $df = n - 1$.\n   - Test statistic formula: $t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$.\n   - Graph: Student's t-distribution curve with dynamic degrees-of-freedom kurtosis adjustment.\n3. One-Sample Z-Test for Mean ($\\mu$ with known population $\\sigma$):\n   - Sample mean ($\\bar{x}$), population standard deviation ($\\sigma$), sample size ($n$), hypothesized mean ($\\mu_0$).\n   - Test statistic formula: $Z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$.\n   - Graph: Standard normal distribution curve $\\mathcal{N}(0, 1)$.\n4. One-Sample Z-Test for Population Proportion ($p$):\n   - Sample proportion ($\\hat{p} = x/n$), hypothesized proportion ($p_0$), sample size ($n$).\n   - Standard error: $SE = \\sqrt{\\frac{p_0(1-p_0)}{n}}$.\n   - Test statistic formula: $Z = \\frac{\\hat{p} - p_0}{SE}$.\n   - Graph: Standard normal distribution curve.\n\n### Real-Time Canvas Distribution Visualization:\n- Dynamic HTML5 Canvas rendering (1000x350 resolution):\n  * Accurately plot probability density functions using numerical approximations (polynomial approximation for normal CDF and Wilson-Hilferty transformation for Chi-square).\n  * Shaded Rejection Regions: Interactive inputs for Critical Values (Left CV, Right CV) and significance levels ($\\alpha$). Dynamically shade rejection tails in soft red/amber.\n  * Test Statistic Marker: Plot the calculated test statistic as a distinct vertical neon indicator line directly on the curve so students can instantly see whether the statistic falls inside or outside the rejection region.\n  * Real-Time P-Value: Automatically compute and display the one-tailed or two-tailed p-value corresponding to the current test statistic.\n\n### UI & Layout Specifications:\n- High-contrast, dark workstation theme (#0d1117 background, #161b22 panels, crisp borders).\n- Interactive formula preview panel showing LaTeX-style mathematical formula notation populated with current user numbers.\n- Responsive input panels with automatic input sanitization (handling division by zero, invalid degrees of freedom, and sample sizes $n < 2$).",
    what:"A calculator for four common hypothesis tests. Type in your sample numbers and it draws the matching curve, shades the rejection zone, marks where your result lands, and calculates the p-value as you type.",
    uses:[
      ["See the decision","Students can see whether their result falls inside the shaded zone."],
      ["Formulas with real numbers","Formulas appear with the student’s own numbers filled in."],
      ["Two versions to compare","The download includes a plain version that works offline and a second version built with an add-on design toolkit."]
    ],
    lesson:{title:"Ask for Plain, Simple Code", points:[
      ["Watch out for add-ons",[
        "Sometimes the AI builds with add-on toolkits from the internet (you might see names like React or Tailwind). These can break offline or get blocked by school filters.",
        "To stay safe, say: “Use plain HTML, CSS, and JavaScript, with nothing extra to download.”"
      ]],
      ["Your browser is a powerful calculator",[
        "Your browser can handle serious math, with no special software required."
      ]],
      ["Connect numbers to pictures",[
        "Seeing the result land inside or outside the shaded zone makes the idea click in a way a table of numbers can’t."
      ]]
    ]}
  },
  {
    group:"deep",
    name:"Redox Reactions",
    short:"Chemistry practice with electron transfer",
    grades:"Chemistry",
    file:"Example_9/index.html",
    downloadFile:"Example_9/Redox_Reaction.zip", downloadName:"Redox_Reaction.zip",
    wish:"Students assign a charge number to each atom, decide what loses and gains electrons, and watch the electrons move. A Help button turns the screen orange and gives hints without giving away the answer.",
    prompt:"Act as a university chemistry education specialist and expert front-end developer. Build an advanced, interactive single-file web application called \"Redox Reaction Interactive\" to help high school and AP/College Chemistry students master oxidation numbers, half-reactions, and electron transfer pathways in chemical equations.\n\n### Technical & Environmental Constraints:\n- Zero Dependencies: Pure native HTML5, CSS3, and modern JavaScript combined inside one standalone `index.html` file.\n- Client-Side Privacy: Operates entirely in browser memory; no backend server, tracking, or cloud requirements.\n- Crisp Scientific Typography: Ensure precise rendering of chemical formulas with proper subscripts ($H_2O$), ionic charge superscripts ($Fe^{3+}$, $SO_4^{2-}$), coefficients, and reaction symbols ($\\to$, $+$).\n\n### Core Instructional Workflow & Features:\n\n1. Dynamic Chemical Equation Stage:\n   - Display balanced chemical equations (e.g., $2Mg + O_2 \\to 2MgO$, $Zn + Cu^{2+} \\to Zn^{2+} + Cu$, etc.) with high-contrast, scalable chemical notation.\n   - For each atom in both reactants and products, provide an interactive \"Oxidation State Drop-Zone Box\" placed directly above or below the chemical symbol.\n\n2. Interactive Oxidation State Assignment:\n   - Provide a clean number bank ($-3, -2, -1, 0, +1, +2, +3, +4, +5, +6, +7$) that students can click or drag to assign oxidation states to each individual atom.\n   - Validation & Feedback:\n     * Instant validation against foundational chemical rules: free elements have an oxidation number of 0; monoatomic ions equal their charge; Group 1 alkali metals are +1; Oxygen is typically -2; Hydrogen is +1 with nonmetals; the sum of oxidation states in a neutral compound must equal 0, or equal the polyatomic ion's charge.\n     * Clear color-coded feedback (green for correct, amber/red for incorrect with guidance).\n\n3. OIL RIG Electron Transfer Analysis:\n   - Once oxidation states are correctly assigned, prompt students to analyze electron transfer:\n     * **Oxidation Is Loss (OIL):** Identify which species lost electrons, the change in oxidation number (e.g., $0 \\to +2$), and which substance acts as the reducing agent.\n     * **Reduction Is Gain (RIG):** Identify which species gained electrons, the change in oxidation number (e.g., $+2 \\to 0$), and which substance acts as the oxidizing agent.\n   - Animate the electron transfer pathway: visual glowing particle or arc tracing the flow of electrons from the oxidized species to the reduced species across the reaction arrow.\n\n4. Guided \"Help Mode\" (Ambient Scaffolding):\n   - Include an interactive \"Need Help?\" toggle button.\n   - When activated, the entire screen transitions to an ambient warm warning theme (safety orange background tint) with:\n     * Step-by-step oxidation rule reminders.\n     * Visual breakdown of compound charges and arithmetic balance equations.\n     * Guided prompts that walk the student through deducing the unknown element's state without giving away the final answer.\n\n5. Problem Bank & Progress Tracker:\n   - Multi-problem set with diverse reaction types (synthesis, single displacement, combustion, disproportionation).\n   - Problem counter, student nickname header, and session completion celebrations.",
    what:"A chemistry practice tool. Students assign oxidation numbers to every atom in a reaction, decide which substance loses electrons and which gains them, and then watch the electrons travel across the reaction arrow.",
    uses:[
      ["Hands-on practice","Students click to assign numbers and get instant feedback."],
      ["Remembering “OIL RIG”","Oxidation Is Loss, Reduction Is Gain, practiced on every problem."],
      ["Help without spoilers","The Help button tints the screen orange and shows step-by-step hints."],
      ["Easy to see on a shared screen","Large, clear chemistry text is easy to read during a live class."]
    ],
    lesson:{title:"Ask for the Details Your Subject Needs", points:[
      ["Be specific about how things should look",[
        "Chemistry needs small raised and lowered numbers (like H₂O and Fe³⁺). Ask for them by name, and the tool will match your textbook."
      ]],
      ["Gentle help instead of pop-ups",[
        "Pop-up windows cover the problem. I asked for a Help button that tints the screen and shows hints right next to the work."
      ]]
    ]}
  }
];
