# Lesson 11: Client-Side Utilities & Privacy-First Workflows

### 1. Build Utilities That Feed External AI (No API Keys Required)
* You don't always need to embed an expensive or complex AI API directly inside your custom tool.
* Embedding API keys introduces security risks, rate limits, and network dependencies.
* Instead, prompt the AI to build lightweight *prep utilities*: tools that clean, format, and package raw classroom data so you can paste it into whichever AI assistant you already use (ChatGPT, Claude, Gemini, etc.).

### 2. Protect Student Privacy at the Source (FERPA By Design)
* Meeting transcripts from Zoom or Teams often contain student full names in every spoken caption cue.
* When designing tools for educational use, prompt for automatic anonymization: identify the teacher by speaker frequency and replace student names with generic labels (`STUDENT:`).
* Scrubbing private information *before* copying text keeps student records safe and FERPA-compliant.

### 3. The Power of Rich-Text Clipboard Items
* Prompting for smart clipboard helpers turns repetitive daily tasks into single-click workflows.
* Ask the AI to write dual-format clipboard items (`text/html` and `text/plain`): when pasted into an LMS or email, the recording link pastes as a rich clickable link; when pasted into notepad, it includes the full URL and passcode.
