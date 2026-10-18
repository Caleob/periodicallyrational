Ran command: `Get-ChildItem -Path "c:\Users\caleo\Documents\PeriodicallyRational\Conference" -Recurse | Select-Object FullName, Length, Extension`
Ran command: `Get-ChildItem -Path "c:\Users\caleo\Documents\PeriodicallyRational\Conference"`
Viewed index.html:1-12
Viewed app.js:1-100
Viewed app.js:101-250
Viewed app.js:246-500
Viewed app.js:500-650
Viewed app.js:651-908
Viewed treasures.js:1-150
Viewed treasures.js:151-350
Viewed treasures.js:351-498
Ran command: `node -e "const fs = require('fs'); const code = fs.readFileSync('treasures.js', 'utf8'); const sandbox = {}; const vm = require('vm'); vm.runInNewContext(code, sandbox); console.log('Treasures count:', sandbox.TREASURES.length); sandbox.TREASURES.forEach((t, i) => console.log(i + 1, t.name, '|', t.group, '|', t.short));"`
Ran command: `node -e "const fs = require('fs'); const code = fs.readFileSync('treasures.js', 'utf8'); const sandbox = { window: {} }; const vm = require('vm'); vm.runInNewContext(code, sandbox); console.log('Treasures count:', sandbox.window.TREASURES.length); sandbox.window.TREASURES.forEach((t, i) => console.log(i + 1, t.name, '|', t.group, '|', t.short));"`
Ran command: `node -e "console.log(process.version)"`
Ran command: `node -e "
const fs = require('fs');
const vm = require('vm');

const treasuresCode = fs.readFileSync('treasures.js', 'utf8');
const appCode = fs.readFileSync('app.js', 'utf8');

const domMock = {
  window: {},
  document: {
    querySelector: () => ({ classList: { remove: () => {}, add: () => {} }, appendChild: () => {}, innerHTML: '', setAttribute: () => {} }),
    querySelectorAll: () => [],
    createElement: () => ({ classList: { remove: () => {}, add: () => {} }, appendChild: () => {}, setAttribute: () => {}, style: {} }),
    body: { appendChild: () => {}, style: {} },
    addEventListener: () => {}
  },
  navigator: {},
  location: { hash: '' },
  URL: {},
  matchMedia: () => ({ matches: false }),
  Audio: function() { return { addEventListener: () => {} }; },
  setInterval: () => {},
  clearInterval: () => {},
  setTimeout: () => {},
  clearTimeout: () => {}
};
domMock.window = domMock;

vm.runInNewContext(treasuresCode + '\n' + appCode, domMock);
console.log('Slides count:', domMock.SLIDES ? domMock.SLIDES.length : 'SLIDES not found on global');
"`
Ran command: `node -e "
const fs = require('fs');
const vm = require('vm');

const treasuresCode = fs.readFileSync('treasures.js', 'utf8');
const appCode = fs.readFileSync('app.js', 'utf8');

const domMock = {
  window: {},
  document: {
    querySelector: () => ({ classList: { remove: () => {}, add: () => {} }, appendChild: () => {}, innerHTML: '', setAttribute: () => {} }),
    querySelectorAll: () => [],
    createElement: (tag) => ({
      tagName: tag,
      classList: { remove: () => {}, add: () => {} },
      appendChild: () => {},
      setAttribute: () => {},
      style: {},
      getContext: () => ({
        clearRect: () => {},
        fillRect: () => {},
        createRadialGradient: () => ({ addColorStop: () => {} }),
        beginPath: () => {},
        arc: () => {},
        fill: () => {}
      })
    }),
    body: { appendChild: () => {}, style: {} },
    addEventListener: () => {}
  },
  navigator: {},
  location: { hash: '' },
  URL: {},
  matchMedia: () => ({ matches: false }),
  Audio: function() { return { addEventListener: () => {} }; },
  setInterval: () => {},
  clearInterval: () => {},
  setTimeout: () => {},
  clearTimeout: () => {}
};
domMock.window = domMock;

// In app.js, SLIDES is declared with var inside an IIFE (function(){ 'use strict'; ... })!
// So it won't be on domMock unless we expose it or parse it.
"`
Ran command: `node -e "
const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');
// remove the IIFE wrapper
appCode = appCode.replace(/^\(function\(\)\{\s*'use strict';/, '').replace(/\}\)\(\);?\s*$/, '');
// expose SLIDES
appCode += '\nglobal.SLIDES = SLIDES; global.TREASURES = window.TREASURES; global.TREASURE_GROUPS = window.TREASURE_GROUPS;';

const treasuresCode = fs.readFileSync('treasures.js', 'utf8');

const ctx = {
  window: {},
  document: {
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ appendChild: () => {}, setAttribute: () => {}, style: {}, getContext: () => ({}) }),
    body: { appendChild: () => {}, style: {} },
    addEventListener: () => {}
  },
  navigator: {},
  location: { hash: '' },
  URL: {},
  matchMedia: () => ({ matches: false }),
  Audio: function() {},
  setInterval: () => {},
  clearInterval: () => {},
  setTimeout: () => {},
  clearTimeout: () => {},
  global: {}
};
ctx.window = ctx;

const vm = require('vm');
vm.runInNewContext(treasuresCode + '\n' + appCode, ctx);

const slides = ctx.global.SLIDES;
console.log('Found slides:', slides.length);
slides.forEach((s, idx) => {
  console.log('=== SLIDE ' + (idx + 1) + ': ' + s.t + ' ===');
  console.log(s.h());
});
"`
Ran command: `node -e "
const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');
appCode = appCode.replace(/^\(function\(\)\{\s*'use strict';/, '').replace(/\}\)\(\);?\s*$/, '');
appCode += '\nglobal.SLIDES = SLIDES;';

const treasuresCode = fs.readFileSync('treasures.js', 'utf8');

const ctx = {
  window: { addEventListener: () => {} },
  document: {
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ appendChild: () => {}, setAttribute: () => {}, style: {}, getContext: () => ({}) }),
    body: { appendChild: () => {}, style: {} },
    addEventListener: () => {}
  },
  navigator: {},
  location: { hash: '' },
  URL: {},
  matchMedia: () => ({ matches: false }),
  Audio: function() {},
  setInterval: () => {},
  clearInterval: () => {},
  setTimeout: () => {},
  clearTimeout: () => {},
  global: {}
};
ctx.window.TREASURES = [];
ctx.window.TREASURE_GROUPS = [];

const vm = require('vm');
vm.runInNewContext(treasuresCode + '\n' + appCode, ctx);

const slides = ctx.global.SLIDES;
console.log('Found slides:', slides.length);
slides.forEach((s, idx) => {
  console.log('=== SLIDE ' + (idx + 1) + ': ' + s.t + ' ===');
  console.log(s.h());
});
"`
Ran command: `node -e "
const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');
appCode = appCode.replace(/^\(function\(\)\{\s*'use strict';/, '').replace(/\}\)\(\);?\s*$/, '');
appCode += '\nglobal.SLIDES = SLIDES;';

const treasuresCode = fs.readFileSync('treasures.js', 'utf8');

const mockEl = {
  style: {},
  classList: { remove: () => {}, add: () => {}, contains: () => false },
  appendChild: () => {},
  setAttribute: () => {},
  getContext: () => ({}),
  innerHTML: '',
  textContent: '',
  querySelectorAll: () => []
};

const ctx = {
  window: { addEventListener: () => {}, scrollTo: () => {} },
  document: {
    querySelector: () => mockEl,
    querySelectorAll: () => [],
    createElement: () => mockEl,
    body: mockEl,
    addEventListener: () => {}
  },
  navigator: {},
  location: { hash: '' },
  URL: {},
  matchMedia: () => ({ matches: false }),
  Audio: function() {},
  setInterval: () => {},
  clearInterval: () => {},
  setTimeout: () => {},
  clearTimeout: () => {},
  global: {}
};

const vm = require('vm');
vm.runInNewContext(treasuresCode + '\n' + appCode, ctx);

const slides = ctx.global.SLIDES;
console.log('Found slides:', slides.length);
fs.writeFileSync('slides_extracted.json', JSON.stringify(slides.map(s => ({ title: s.t, html: s.h() })), null, 2));
console.log('Saved slides_extracted.json successfully!');
"`
Ran command: `node -e "
const fs = require('fs');
const lines = fs.readFileSync('app.js', 'utf8').split('\n');
// take lines up to line 463
const part = lines.slice(0, 463).join('\n');
let code = part.replace(/^\(function\(\)\{\s*'use strict';/, '') + '\nglobal.SLIDES = SLIDES;';

const treasuresCode = fs.readFileSync('treasures.js', 'utf8');

const ctx = {
  window: {},
  document: {
    querySelector: () => ({ innerHTML: '' })
  },
  global: {}
};

const vm = require('vm');
vm.runInNewContext(treasuresCode + '\n' + code, ctx);

const slides = ctx.global.SLIDES;
console.log('Found slides:', slides.length);
const result = slides.map((s, i) => ({ index: i + 1, title: s.t, html: s.h() }));
fs.writeFileSync('slides_extracted.json', JSON.stringify(result, null, 2));
console.log('Saved slides_extracted.json successfully!');
"`
Ran command: `node -e "
const fs = require('fs');
const lines = fs.readFileSync('app.js', 'utf8').split('\n');
const part = lines.slice(0, 463).join('\n');
let code = 'var sandboxInit = function(){}; var timerInit = function(){};\n' + part.replace(/^\(function\(\)\{\s*'use strict';/, '') + '\nglobal.SLIDES = SLIDES;';

const treasuresCode = fs.readFileSync('treasures.js', 'utf8');

const ctx = {
  window: {},
  document: {
    querySelector: () => ({ innerHTML: '' })
  },
  global: {}
};

const vm = require('vm');
vm.runInNewContext(treasuresCode + '\n' + code, ctx);

const slides = ctx.global.SLIDES;
console.log('Found slides:', slides.length);
const result = slides.map((s, i) => ({ index: i + 1, title: s.t, html: s.h() }));
fs.writeFileSync('slides_extracted.json', JSON.stringify(result, null, 2));
console.log('Saved slides_extracted.json successfully!');
"`
Ran command: `node -e "
const fs = require('fs');
const slides = JSON.parse(fs.readFileSync('slides_extracted.json', 'utf8'));

slides.forEach(s => {
  console.log('--------------------------------------------------');
  console.log('SLIDE ' + s.index + ': ' + s.title);
  console.log('--------------------------------------------------');
  // Simple regex-based HTML text extractor preserving layout/blocks
  let h = s.html;
  // Replace <br> with newline
  h = h.replace(/<br\s*\/?>/gi, '\n');
  // Replace block tags with newlines
  h = h.replace(/<\/(h[1-6]|p|div|li|section|details|summary)>/gi, '\n');
  // Strip SVG tags
  h = h.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  // Strip remaining tags
  h = h.replace(/<[^>]+>/g, ' ');
  // Unescape HTML entities
  h = h.replace(/&amp;/g, '&')
       .replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>')
       .replace(/&quot;/g, '\"')
       .replace(/&#39;/g, '\'')
       .replace(/&ldquo;/g, '“')
       .replace(/&rdquo;/g, '”')
       .replace(/&lsquo;/g, '‘')
       .replace(/&rsquo;/g, '’')
       .replace(/&mdash;/g, '—')
       .replace(/&ndash;/g, '–')
       .replace(/&hellip;/g, '…')
       .replace(/&middot;/g, '·')
       .replace(/&rarr;/g, '→')
       .replace(/&larr;/g, '←')
       .replace(/&minus;/g, '−');
  // Clean whitespace
  const lines = h.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
  console.log(lines.join('\n'));
});
"`
Created parse_slides.js
Ran command: `node "C:\Users\caleo\.gemini\antigravity\brain\685ccd5a-6e60-43a4-b3ec-6e2c178f870f\scratch\parse_slides.js"`
Ran command: `node -e "
const fs = require('fs');
const slides = JSON.parse(fs.readFileSync('c:/Users/caleo/Documents/PeriodicallyRational/Conference/slides_extracted.json', 'utf8'));

for(let i=0; i<4; i++) {
  console.log('=== SLIDE ' + slides[i].index + ': ' + slides[i].title + ' ===');
  console.log(slides[i].html);
}
"`
Ran command: `node -e "
const fs = require('fs');
const slides = JSON.parse(fs.readFileSync('c:/Users/caleo/Documents/PeriodicallyRational/Conference/slides_extracted.json', 'utf8'));

for(let i=4; i<8; i++) {
  console.log('=== SLIDE ' + slides[i].index + ': ' + slides[i].title + ' ===');
  console.log(slides[i].html);
}
"`
Ran command: `node -e "
const fs = require('fs');
const slides = JSON.parse(fs.readFileSync('c:/Users/caleo/Documents/PeriodicallyRational/Conference/slides_extracted.json', 'utf8'));

console.log('=== SLIDE 5 ===');
console.log(slides[4].html);
"`
Ran command: `node -e "
const fs = require('fs');
const slides = JSON.parse(fs.readFileSync('c:/Users/caleo/Documents/PeriodicallyRational/Conference/slides_extracted.json', 'utf8'));

console.log('=== SLIDE 6 ===');
console.log(slides[5].html);
console.log('=== SLIDE 7 ===');
console.log(slides[6].html);
"`
Ran command: `node -e "
const fs = require('fs');
const slides = JSON.parse(fs.readFileSync('c:/Users/caleo/Documents/PeriodicallyRational/Conference/slides_extracted.json', 'utf8'));

console.log('=== SLIDE 6 ===');
console.log(slides[5].html);
"`
Ran command: `Remove-Item -Path "c:\Users\caleo\Documents\PeriodicallyRational\Conference\slides_extracted.json" -ErrorAction SilentlyContinue`

Here is the complete text outline of the presentation, containing all on-screen text across each slide as displayed when simply advancing through the deck (without opening pop-ups, modals, or hover states).

***

# The Classroom Genie: Building Custom Tools Without Code
**Pearson Virtual Schools Staff Conference**  
*Presenter:* Caleob King

---

## Slide 1: The Classroom Genie

* **Title:** The Classroom Genie
* **Subtitle:** Make your own classroom tools with AI. No coding required.
* **Core Idea:**
  * AI is like a genie: it grants your wish **exactly** the way you say it.
  * The good news? **This genie gives you unlimited wishes.** If the first try isn’t quite right, you just wish again.
* **Presenter / Conference Note:** Pearson Virtual Schools Staff Conference · Caleob King
* **Navigation Prompt:** Press Space, the right arrow, or rub the lamp to begin.

---

## Slide 2: Sound Familiar?

* **Heading:** Sound Familiar?
* **Lead Text:** Ready-made classroom websites can be great, until they aren’t.
* **Three Common Frustrations:**
  1. 🔑 **The Login Headache:** Another account. Another forgotten password. Another website asking for student names.
  2. 🧩 **The Almost-Right Tool:** It’s close, but it doesn’t quite fit your lesson, your students, or your standards.
  3. 🚧 **The Locked Door:** The free trial ends, or the school filter blocks the site the morning you need it.
* **The Solution (Banner):**
  * **What if…** you could make the exact tool you need in a few minutes, and it opened right in your web browser—just like a normal webpage, ready to screen-share? No account. No login. No cost. **Nothing to install (no IT ticket needed!).** And student names never leave your computer.

---

## Slide 3: How It Works: The Genie Loop

* **Heading:** How It Works: The Genie Loop
* **Lead Text:** Making a tool is a conversation, not a test. It goes around and around like this:
* **The 4 Steps:**
  1. 💭 **1. Imagine:** Think of one small thing that would make your week easier.  
     * *“I wish I had a fair way to call on students.”*
  2. 🪔 **2. Wish:** Type it into Gemini (our school-approved AI tool) in plain, everyday words.  
     * *“Make a spinning wheel that picks a name from my class list.”*
  3. 👀 **3. Try:** The AI builds it. Open it and click around like a student would.  
     * *“It works! But it picked the same kid twice.”*
  4. 🔄 **4. Tweak:** Tell the AI what to change, then try again. Repeat as often as you like.  
     * *“Take each name off the wheel after it’s picked.”*
* **Key Takeaway (Banner):**
  * You don’t need the perfect wish. **You just need a first wish.** Most good tools get there one small tweak at a time.

---

## Slide 4: Watch a Wish Grow

* **Heading:** Watch a Wish Grow
* **Lead Text:** Here’s what a typical conversation looks like (shortened a bit).
* **The Conversation Flow:**
  * 👤 **You:** Make a spinning wheel that picks a random name from a class list I paste in.
  * ✨ **Gemini / Genie:** Here’s your wheel! Paste your names in the box and click Spin.  
    *(Output: 📄 `spin-wheel.html`)*
  * 👤 **You:** Love it! But it picked Jordan twice in a row. Can you take each name off after it’s picked?
  * ✨ **Gemini / Genie:** Done! Picked names now come off the wheel. I added an Undo button too, just in case.  
    *(Output: 📄 `spin-wheel.html (version 2)`)*
  * 👤 **You:** Can it make a ticking sound while it spins? And use brighter colors?
  * ✨ **Gemini / Genie:** Ticking sound and brighter colors added. Spin away!  
    *(Output: 📄 `spin-wheel.html (version 3)`)*
* **Key Takeaway & Demo:**
  * **Three plain-English messages. Zero code.** That’s the whole skill.
  * *Button:* 🎯 Try a finished wheel

---

## Slide 5: The Cave of Wonders

* **Heading:** The Cave of Wonders
* **Lead Text:** Sixteen real tools and ideas, each one made by describing it to AI. Click any gem to explore:
* **Tool Categories & Gems Displayed:**
  * 🧰 **Everyday Helpers** *(Save time on the jobs you do every single week.)*
    1. **Spin-a-Name Wheel** — Pick a random student, or pair up partners
    2. **FeedbackFlow** — Click your rubric, get a warm feedback paragraph
    3. **Recording & Transcript Tidy-Up** — Turn Zoom links and messy transcripts into clean, shareable text
    4. **EdTech UI Prompt Drafter** — Sketch your app layout with shapes and generate a Gemini prompt
  * 🎲 **Games for Any Grade** *(Quick, fun review you can run on a shared screen.)*
    5. **Water Cycle Memory Match** — Flip cards to match words with pictures
    6. **Put It In Order Timeline** — Drag events onto a timeline, then check your order
    7. **Vocabulary Codenames** — Red team vs. blue team word game for review
    8. **The Cursed Exam** — Spooky review game with built-in whiteboard for any subject
  * 🔭 **Deep Dives: High School Subjects** *(Curious how far a conversation with AI can go? These are fascinating, and totally optional.)*
    9. **The Rug Problem** — Quadratic equations shown as rugs
    10. **Rotate & Relate** — Similar triangles you can flip and spin
    11. **Angle Detective** — Step-by-step practice with parallel lines and angles
    12. **Polar Defender** — An arcade game for plotting polar coordinates
    13. **Statistics Picture Calculator** — See the curve, the shaded zone, and the p-value
    14. **Redox Reactions** — Chemistry practice with electron transfer
    15. **The Bard's Meter** — Shakespeare poetry scansion with a rising stage curtain
    16. **Rational Function Explorer** — Find zeros, asymptotes, and holes on a dynamic graph
* **On-Screen Caption:** Point at any gem for a quick peek. Click it to open the tool, see the wish, and pick up a tip.

---

## Slide 6: Two Golden Rules

* **Heading:** Two Golden Rules
* **Lead Text:** Include these two simple requests at the end of every wish so your tool works anywhere without headaches:
* **The Rules:**
  * **1. “Put everything in one single file”** *(Rule #1)*
    * *Why:* Instead of a messy folder of parts, Gemini gives you **one clickable webpage file** that opens right in Chrome, Edge, or Safari.
    * **Easy to keep:** Save it in your lesson folder just like a Word doc or PDF.
    * **Easy to share:** Email the file to a teammate and it works on their computer too.
  * **2. “Don’t use outside internet links”** *(Rule #2)*
    * *Why:* Gemini draws all visuals and creates all sound effects **right inside the file itself** instead of pulling from outside websites.
    * **Filter-proof:** School web filters have nothing to block on the morning of your lesson.
    * **100% Offline:** Works even if your internet connection slows down.
* **On-Screen Optional Action:**
  * *Button:* 🧞‍♂️ Master of the Lamp: When to Break the Rules (Level Up)
* **Privacy Assurance (Banner):**
  * 🔒 **Privacy Note:** Our school’s Gemini setup is privacy-protected (0-PII) so you can safely paste in your lesson plans and curriculum! (And since your finished tool runs on your own computer, student names you type into a tool never go to the cloud at all.)

---

## Slide 7: Your Wish Starter & Borrowed Wishes

* **Heading:** Your Wish Starter & Borrowed Wishes
* **Lead Text:** Built for live online teaching: run on your computer and shared via screen share. Copy the general formula OR borrow a ready-made wish below:
* **Teacher Screen-Share Formula:**
  * *Header:* Teacher Screen-Share Formula · Fill in the blanks and paste into Gemini · [📋 Copy Wish Formula]
  * **1 · Who & Where:** Make a screen-share tool for my `[grade] [subject]` online class to run on my computer during live sessions.
  * **2 · Live Screen Share:** `[Describe what appears on my screen, what I click or enter, and what students see and discuss.]`
  * **3 · Single-File Guardrail:** Put everything in one single .html file. Don't use outside internet links (use inline SVG for visuals and Web Audio for sound). *(✨ Gemini speaks this language—just leave it attached!)*
* **Ready-to-Borrow Wishes:**  
  *(✨ Ready-to-Borrow Wishes (Screen-Share & Productivity Ready) · Click any button to copy the wish + single-file rule straight to your clipboard)*
  1. **Grades 3-5 · Math** [📋 Copy]  
     Make a "Mystery Number" screen-share warm-up for my 4th grade math class. Display a 4x4 grid of numbers and a list of 4 math clues (like "I am a multiple of 3" or "I am greater than 20"). As students discuss in chat, let me click numbers on the grid to cross them out until only the secret number remains, plus a button to generate a fresh board.
  2. **Grades 6-8 · ELA** [📋 Copy]  
     Make a vocabulary "Forbidden Words" game to screen share with my middle school class. Display one target vocabulary word at the top and 3 "forbidden" clue words below it, alongside a 30-second countdown timer. One student describes the word on mic without using the forbidden words while the chat guesses. Include a box where I can paste my own weekly word list.
  3. **Grades 9-12 · STEM** [📋 Copy]  
     Make a "Find the Error" screen-share tool for my high school Algebra/Chemistry class. Display a worked multi-step problem where one step has a common mistake. Let me click to highlight or reveal one step at a time as students debate in the chat where the math went wrong, then click a button to flip the faulty step into the corrected solution.
  4. **Grades 9-12 · Humanities** [📋 Copy]  
     Make a live Socratic seminar and debate board to screen share with my high school class. Display a central prompt at the top and two side-by-side columns ("Agree / Claim A" and "Disagree / Claim B"). As students share arguments and text evidence on mic or in chat, let me quickly type and drop their points into either column, star the strongest points, and export the final board as a study note.
  5. **Social Studies · Trivia** [📋 Copy]  
     Make a quote trivia game to screen share with my history class. Display a historical quote and four large answer buttons. When students vote in poll/chat and I click their choice, reveal whether it's correct along with a 2-sentence background fact.
  6. **Live Classroom Helper** [📋 Copy]  
     Make a live breakout group maker for my online class. I paste my student roster, and it automatically sorts them into groups of 4 on screen. Let me drag student names between groups live on screen, and provide a button to copy formatted group lists directly into meeting chat.
* **Transition Cue (Banner):**
  * ✨ **Step 1:** Click **Copy** on the formula or your favorite wish above and paste it into Gemini. Once Gemini writes your code, head to the next slide to turn it into a working tool!

---

## Slide 8: Save & Open Your Tool: The Magic File Maker

* **Heading:** Save & Open Your Tool: The Magic File Maker
* **Lead Text:** Gemini will hand you a block of code. You never need to read it! Paste it below to turn it into a clickable webpage file and launch it full-screen:
* **The 3 Visual Steps:**
  1. **1 · Copy from Gemini** — Click the Copy icon on Gemini’s code box  
     ➔
  2. **2 · Paste & Name Below** — Paste into the box and give it a title  
     ➔
  3. **3 · Save & Launch Full-Screen** — Saves your .html file and opens it in a new tab!
* **The Magic File Maker Interface:**
  * Label: Paste your Gemini code here: · [Clear Box]
  * Input Box Placeholder: *“Click here, then press Ctrl+V (Windows) or Cmd+V (Mac) to paste the code from Gemini...”*
  * File name field: `File name: [my-classroom-tool] .html`
  * Action Buttons:
    * 🚀 Save .html & Open in New Tab
    * 🌐 Open in New Tab Only
    * 💾 Download .html Only
  * Note: 📁 **How to use it next week:** Your saved `.html` file goes to your **Downloads** folder. Double-click it anytime (or move it to your lesson folder) and it opens right in your browser!
* **Bottom Controls / Shortcuts:**
  * 💡 **Bonus Shortcut:** If you see a **“Preview” or “Open in Canvas”** button at the bottom of Gemini’s code box, you can click that to test your tool right inside Gemini before downloading!
  * *Button:* 📝 Saving without this page? The Notepad Way

---

## Slide 9: Magic Words for Tweaking

* **Heading:** Magic Words for Tweaking
* **Lead Text:** Your first version is a rough draft! Click any phrase below to copy it (with a built-in reminder for Gemini to give you the whole updated file):
* **Tweak Categories & Phrases:**
  * 🎨 **Make it look right**
    * “Make the words big enough to read on a shared screen.” [📋 Copy]
    * “Use bright, cheerful colors.” [📋 Copy]
    * “Make it calm and simple, with less on the screen.” [📋 Copy]
  * 🖥️ **Make it easier on screen share**
    * “Add a dark mode / high-contrast toggle so it's easier to read on screen share.” [📋 Copy]
    * “Add keyboard shortcuts (like Spacebar to advance) so I can run it quickly while teaching.” [📋 Copy]
    * “Add a Start Over button and a mute button.” [📋 Copy]
  * ♻️ **Make it reusable**
    * “Let me paste in my own list of words or questions.” [📋 Copy]
    * “Add buttons to save my setup to a file and load it again later.” [📋 Copy]
  * 🛠️ **When something's not working**
    * “When I click the button, nothing happens. Please fix it.” [📋 Copy]
    * “The words run off the edge of the screen. Please make everything fit cleanly.” [📋 Copy]
    * “Start over with a simpler, cleaner version.” [📋 Copy]
* **Guiding Rule (Banner):**
  * Every tweak is just one more message. If a change makes things worse, say **“Go back to the last version.”** And if Gemini ever gives you just a small piece of code, say **“Give me the whole updated file.”**

---

## Slide 10: Tinker Time

* **Heading:** Tinker Time
* **Goal Statement:** Make one wish. Try it. Tweak it once. **That’s a win.**
* **Quick Jump Links (Back to workshop slides):**
  * ← Back to Wish List
  * ← Back to Magic File Maker
  * ← Back to Magic Words
  * ← Cave of Wonders
* **Interactive Workshop Widgets on Screen:**
  * **Timer Card:** `10:00` | Controls: `▼ −1m`, `Play`, `Reset`, `▲ +1m`
  * **Music Player Card:** ♫ Ambient Focus · 🔄 Loop | Controls: `⏮`, `►`, `⏭`, `🔊` (Volume slider)
* **Final Action:**
  * *Link Button:* Ideas Padlet