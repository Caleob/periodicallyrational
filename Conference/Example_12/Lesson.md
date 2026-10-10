# Lesson 12: Prompting for Future Assets & Graceful Fallbacks

### 1. Refer to Assets You Don't Have Yet (The Placeholder Pattern)
* Teachers often stall out thinking they must gather, crop, and convert every graphic before talking to an AI.
* You don't have to wait! In your prompt, simply establish an agreed-upon naming convention: *"Assume I have images stored as pic_1.png, pic_2.png, and so on."*
* The AI wires up all the image references in advance, allowing you to build the software now and gather the actual artwork later.

### 2. Demand Graceful Fallbacks (Never Leave a Broken Icon)
* If an image is missing, moved, or slow to load, a raw broken-image icon looks unfinished and breaks student immersion.
* Always prompt for an automated safety net: *"Use simple alt text or generated art so it works even without the stored images."*
* The AI writes `onerror` handlers with inline SVG icons or styled symbols. The tool is 100% playable on day one, and magically upgrades itself the moment your real picture files land in the folder.

### 3. Simple Prompts Can Deliver Polished Games
* You don't need a 500-word prompt full of programming jargon to get a high-quality classroom tool.
* A clear, straightforward prompt providing the content list (the 8 vocabulary terms), the core mechanic (16-card memory match), and a few sensory touches (water theme, synthesized audio, mute button) gives the AI everything it needs to deliver an engaging, gamified review activity.
