# Lesson 16: Visual Anchors & Responsive Math Interfaces

### 1. Start with a Visual Anchor
* Using an image, wireframe, or mock layout gives your build an immediate target.
* It prevents feature creep and keeps the visual hierarchy clear from step one.

### 2. Design for Responsive Edge Cases Early
* What fits cleanly on a widescreen desktop monitor will overflow on a laptop or stack awkwardly on a phone.
* Decide early whether your app should lock to `100vh` (no-scroll dashboard style) or allow vertical scrolling on smaller screens.

### 3. Anticipate Math & Data Edge Cases
* Building dynamic tools requires thinking through the math.
* For rational functions, that meant handling factor cancellation (holes vs. asymptotes), zero-division spikes, dynamic auto-scaling, and deduplicating repeated factors so students aren't penalized.

### 4. Give Users Manual Overrides
* Algorithmic automation (like auto-scaling graph bounds) is great, but algorithms fail on edge cases.
* Adding simple manual controls (like `y × 2` and `y × 1/2`) gives the user control when the auto-scale isn't quite right.

### 5. Iterate and Refine Tone
* Great tools feel right.
* Shifting from rigid labels ("Manage Vertical Asymptotes") to clean labels ("Vertical Asymptotes"), replacing bulky inline cards with sleek overlay buttons or pop-up modals, and picking warm palette colors (#fdfaf6) turn a functional script into an approachable classroom product.
