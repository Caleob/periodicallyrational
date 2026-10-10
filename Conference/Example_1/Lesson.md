# Lesson 1: The Browser Engine & Self-Contained Files

### 1. The Browser is an App Player (Not Just an Internet Window)
* A web browser (Chrome, Edge, Safari) is not just a viewer for websites—it is a powerful, offline software player already installed on your computer.
* HTML (`.html`) files are simply documents that tell this player what to display and run.
* **Built-in Security & Privacy:** Opening a local `.html` file stored on your computer runs entirely in your machine's private memory. No student data, rosters, or inputs ever leave your computer or touch an outside cloud server.

### 2. Keep Everything Self-Contained
* Professional websites usually pull images, sounds, and fonts from dozens of different servers across the web.
* External links can break, get blocked by school district firewalls, or fail when Wi-Fi drops.
* For our early tools, we prompt the AI to make everything 100% self-contained inside one single file:
  * **Visuals:** Drawn with code (HTML5 Canvas or SVG).
  * **Sounds:** Generated on the fly by your computer's audio chip (Web Audio API).
