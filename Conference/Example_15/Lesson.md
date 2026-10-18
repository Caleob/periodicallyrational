# Lesson 15: Multimodal Prompting & Visual Layout Drafters

### 1. Show, Don't Just Tell (Why Visual Wireframes Beat Wall-of-Text Prompts)
* Describing a complex two-dimensional screen layout using only prose (*"put a banner at the top, a 300px sidebar on the left, a canvas in the center, and three buttons at the bottom"*) is tedious and frequently misunderstood by AI models.
* Vision-capable language models (like Gemini) excel at spatial reasoning when provided with a visual reference.
* Supplying a clean geometric wireframe alongside your prompt gives the AI an unambiguous spatial blueprint, resulting in immediate, beautifully proportioned interface layouts on turn one.

### 2. Keep Wireframe Shapes Textless (Preventing Vision AI Hallucinations)
* A common mistake when prompting with images is putting mock text or messy handwriting inside wireframe boxes.
* Vision models attempt to OCR (read) every letter, often misinterpreting sample labels as structural code requirements or hallucinating unintended behaviors.
* By exporting completely blank colored shapes and mapping their purpose through an external color legend, you provide pure spatial coordinates without confusing the model's optical recognition engine.

### 3. Automate the Tedious Parts (Color-Coded Prompt Pairing)
* Manually typing out color names, hex codes, element groupings, and layout relationships takes 15–20 minutes of tedious prompt engineering.
* By building a dedicated helper tool that binds canvas shapes to a live prompt generator, teachers can drag and drop shapes in two minutes and receive both a reference image and a perfectly formatted prompt with zero manual formatting.

### 4. Smart Canvas Layering (Auto-Background Sorting)
* When building visual canvas tools, users often create buttons first and then try to draw a background panel behind them, accidentally trapping the small buttons underneath.
* Designing the tool with automatic z-index sorting—ensuring large structural panels automatically remain in the background—guarantees that buttons, pills, and inputs placed on top remain instantly selectable, draggable, and editable.
