# Example 12: Water Cycle Memory Match

## What is this app?
This is a responsive 16-card vocabulary matching game designed for upper elementary and middle school Earth Science. Students match 8 key water cycle terms (*Evaporation, Condensation, Precipitation, Transpiration, Accumulation, Runoff, Groundwater, Water Vapor*) with their corresponding scientific illustrations. It features tactile 3D card flips, synthesized audio effects (with a mute toggle), move tracking, elapsed time counters, and a victory celebration modal.

Crucially, the app implements the **Placeholder Asset Pattern**: it references custom image files (`pic_1.png` through `pic_8.png`), but includes built-in procedural SVG fallback art so the game remains 100% playable out of the box even before custom images are gathered.

## How to use it in a virtual K-12 classroom
* **Interactive Screen-Share Warmup:** Launch the game during live Zoom, Teams, or Google Meet sessions. Students call out card coordinates or type guesses into chat, collaborating to complete the grid under a target move count.
* **Dual-Coding Science Reinforcement:** Strengthens conceptual retention by forcing students to connect abstract scientific terminology with visual representations (e.g. matching the word "Transpiration" with plant water vapor release).
* **Drop-in Custom Art Upgrades:** Teachers or students can gather real textbook graphics, diagrams, or student artwork later. Simply save them into the game folder as `pic_1.png` through `pic_8.png`, and the game instantly upgrades to custom art with zero code edits.
* **Audio Atmosphere with Total Mute Control:** Features gentle card flips, harmonious chord chimes for correct matches, and a celebratory win fanfare synthesized directly from the computer's sound chip (no outside audio downloads needed), complete with a one-click mute toggle for classroom quiet.
