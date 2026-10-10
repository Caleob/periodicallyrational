# Product Requirements Document (PRD)
## Project: Rotate & Relate — Similar Right Triangles

---

> **Note for Non-Coders & Prompt Engineers:**  
> This document is crafted to demonstrate how an engineer translates an idea into a specification so unambiguous that an advanced AI coding model (e.g., Claude 3.7 Sonnet, GPT-4o, Gemini 1.5 Pro) can implement the complete application in a single pass without missing visual details, math accuracy, or interactive edge cases.
>
> When non-coders ask an AI: *"Make me a geometry game where triangles rotate and students match sides,"* the AI guesses everything: the color palette, the math, whether there's drag-and-drop, how animations ease, and what happens when you press backspace. This PRD replaces every guess with explicit architectural instructions.

---

## 1. Executive Summary & Pedagogical Vision

### 1.1 The Core Problem
In secondary school geometry, the **Altitude-to-the-Hypotenuse Theorem** states that the altitude drawn from the right angle of a right triangle to its hypotenuse creates two smaller right triangles that are similar to each other and to the original triangle.

While algebraically straightforward ($\Delta ABC \sim \Delta ACX \sim \Delta CBX$), students consistently struggle with **spatial orientation**:
1. The triangles share vertices (e.g., vertex $C$ represents a $90^\circ$ angle in the large triangle, but acute angles in the sub-triangles).
2. The triangles are nested, rotated, and often reflected relative to one another.
3. Students cannot visually match which side corresponds to which (e.g., which segment is the hypotenuse, which is the long leg, and which is the short leg).

### 1.2 The Solution: "Rotate & Relate"
**Rotate & Relate** is a zero-dependency, web-based interactive visual manipulative designed to develop spatial reasoning. It randomly generates a right triangle with an altitude, picks two of the three triangles, and challenges the student to:
1. **Side-to-Side Correspondence:** Physically wire corresponding sides together using 3 color-coded virtual patch leads (Red, Blue, Yellow) via drag-and-drop or click-to-connect.
2. **Similarity Statement:** Write the formal geometric similarity statement in correct corresponding vertex order ($\Delta \underline{\phantom{ABC}} \sim \Delta \underline{\phantom{ABC}}$).
3. **Visualize Alignment (The "Aha!" Moment):** Trigger a 3-stage rigid transformation animation (Translation $\rightarrow$ Reflection $\rightarrow$ Rotation) that extracts the two triangles, brings their hypotenuse midpoints together, flips orientation if chiralities differ, and rotates them into concurrency so the student can directly witness whether their colored leads align or clash.

---

## 2. Technical Stack & Architectural Rules

### 2.1 The Pure Vanilla Web Triad
To ensure zero build steps, complete portability, 100% offline functionality, and extreme longevity, the project strictly uses the standard vanilla web triad across 3 standalone files:
* `Elements_On_Screen.html`: Semantic HTML5 markup, SVG container scaffolding, UI cards, and modal elements.
* `How_It_Looks.css`: Custom CSS3 design system, responsive Flexbox/Grid layouts, dark modern geometric aesthetics, animations, and typography tokens.
* `What_It_Does.js`: Pure ES6+ JavaScript containing the procedural geometry generator, SVG vector renderer, pointer-driven drag-and-wire physics, similarity validation engine, and frame-by-frame transformation animator.

### 2.2 Strict Constraints
1. **Zero External Libraries:** No React, Vue, jQuery, GSAP, D3, or Tailwind. Everything must be implemented with native DOM, SVG, and CSS APIs.
2. **High-DPI Vector Graphics:** All geometry, right-angle indicators, altitude lines, and patch leads must be drawn inside responsive SVG elements using normalized coordinate spaces.
3. **Hardware-Accelerated Fluidity:** Canvas and wire interactions must utilize the Pointer Events API (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) for unified touch and mouse support.
4. **Self-Contained Execution:** The application must run cleanly by simply double-clicking `Elements_On_Screen.html` in any modern web browser.

---

## 3. Visual Design System & Design Tokens (`How_It_Looks.css`)

### 3.1 Design Metaphor: "Dark Mode Cyber-Geometry Studio"
The interface mimics a high-precision digital mathematics workstation: deep obsidian backgrounds, high-contrast neon accents, glowing vector lines, and clean card surfaces.

### 3.2 CSS Design Tokens (`:root`)
```css
:root {
  /* Surfaces & Backgrounds */
  --bg-main: #0a0a0f;           /* Deep space background */
  --bg-card: #12121a;           /* Secondary card surface */
  --bg-card-hover: #171722;     /* Interactive card hover */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-focus: #3b82f6;

  /* Typography Colors */
  --text-main: #f1f5f9;         /* Slate 100 high-contrast text */
  --text-muted: #94a3b8;        /* Slate 400 descriptive text */
  --text-dim: #64748b;          /* Slate 500 hints and labels */

  /* UI Accent Palette */
  --accent-blue: #3b82f6;       /* Primary actions & branding */
  --accent-cyan: #06b6d4;       /* Geometric highlights */
  --accent-pink: #ec4899;       /* Triangle 1 accent */
  --accent-emerald: #10b981;    /* Success states */

  /* The 3 Correspondence Patch Lead Colors */
  --lead-red: #ef4444;          /* Lead 1 (Red) */
  --lead-red-glow: rgba(239, 68, 68, 0.4);
  --lead-blue: #3b82f6;         /* Lead 2 (Blue) */
  --lead-blue-glow: rgba(59, 130, 246, 0.4);
  --lead-yellow: #eab308;       /* Lead 3 (Yellow) */
  --lead-yellow-glow: rgba(234, 179, 8, 0.4);

  /* Typography Stacks */
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-math: 'Cambria Math', 'Times New Roman', Georgia, serif;
}
```

### 3.3 Typography & Mathematical Notation
* **Body/UI Elements:** Use modern system sans-serif with crisp letter spacing (`-0.02em` on headings).
* **Geometric Vertices & Segments:** Rendered in mathematical serif italic (`font-family: var(--font-math); font-style: italic; font-weight: 700;`).
* **True Geometric Vinculum (Overline Notation):** Geometric line segments (e.g., $\overline{AB}$, $\overline{CX}$) must use a simulated CSS vinculum via pseudo-elements (`::before`) rather than crude unicode macrons:
  ```css
  .overline-text {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    font-family: var(--font-math);
    font-style: italic;
    font-weight: 700;
    line-height: 1;
    padding-top: 3px;
  }
  .overline-text::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background-color: currentColor;
    border-radius: 1px;
  }
  ```

### 3.4 Responsive Layout Architecture
* **Container:** Max-width `1440px`, centered with `margin: 0 auto`, `padding: 1.25rem 1.5rem`.
* **Workspace Grid:** Two-column split layout (`grid-template-columns: 1.15fr 0.85fr; gap: 1.25rem;`).
* **Responsive Breakpoint (`@media (max-width: 1024px)`):** Collapses into a single column (`grid-template-columns: 1fr;`) stacking the canvas above the problem cards.

---

## 4. Screen Layout & DOM Structure (`Elements_On_Screen.html`)

```
+----------------------------------------------------------------------------------------------------+
| HEADER: Badge ("SPATIAL REASONING") | Title ("Rotate & Relate") | [New Triangle]  [Reset]          |
+----------------------------------------------------+-----------------------------------------------+
| LEFT PANEL: Geometry Canvas (1.15fr)               | RIGHT PANEL: Educational Problems (0.85fr)    |
| +------------------------------------------------+ | +-------------------------------------------+ |
| | Toolbar: [Highlight T1] [Highlight T2] [Status]| | | CARD 1: Side-to-Side Correspondence       | |
| +------------------------------------------------+ | | Row 1 (T1 Sides): [ AB ]  [ AC ]  [ BC ]    | |
| | SVG Canvas (600 x 420 viewBox):                | | | ~ ~ ~ Bezier Patch Leads SVG ~ ~ ~ ~ ~ ~  | |
| |  - Dot Grid Background Pattern                 | | | Row 2 (T2 Sides): [ AX ]  [ CX ]  [ AC ]    | |
| |  - Outer Triangle ABC with Dashed Altitude CX  | | | Legend: (o) Red  (o) Blue  (o) Yellow     | |
| |  - Perpendicular right-angle square markers    | | | [Clear Leads]                           | |
| |  - Dynamic Color Glowing Side Overlays         | | +-------------------------------------------+ |
| |  - Transformation Layer (Animated Ghost)       | | CARD 2: Similarity Statement                | |
| |  - Upright Vertex Labels (A, B, C, X)          | |   Δ [ A B C ]  ~  Δ [ _ ] [ _ ] [ _ ]       | |
| +------------------------------------------------+ |   Choose Vertex: [ A ] [ B ] [ C ] [ X ]    | |
| | Footer Hints: ⊥ Right angles | ~ Similarities  | |   [Clear Statement]                         | |
| +------------------------------------------------+ | +-------------------------------------------+ |
|                                                    | ACTION: [ Visualize Alignment & Check ]       |
|                                                    | FEEDBACK BANNER: [ Success / Partial / Error] |
+----------------------------------------------------+-----------------------------------------------+
```

### 4.1 Header (`.app-header`)
* **Brand area:**
  * Pill badge: `SPATIAL REASONING` (cyan pill with soft cyan border).
  * H1: `Rotate & Relate`.
  * Subtitle: `Altitude to the Hypotenuse & Geometric Correspondence`.
* **Action buttons:**
  * `#btn-new-problem` (`.btn-secondary`): Includes an SVG reload/cycle icon.
  * `#btn-reset` (`.btn-ghost`): Resets user answers on the current problem.

### 4.2 Left Panel: Interactive Geometry Canvas (`.canvas-panel`)
* **Toolbar (`.canvas-toolbar`):**
  * Highlight buttons: `#btn-highlight-t1` (pink dot indicator), `#btn-highlight-t2` (cyan dot indicator).
  * Status badge: `#anim-stage-badge` (hidden by default; displays a pulsing blue dot and text such as `"Translating..."` or `"Rotating..."` during animations).
* **SVG Geometry Wrapper (`.svg-wrapper`):**
  * `<svg id="geo-svg" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid meet">`
  * Embedded `<defs>` dot pattern for grid texture (`#grid-dots`, 24x24 spacing).
  * 4 Isolated SVG Layer Groups:
    1. `<g id="base-layer">`: Static white/blue triangle lines, right-angle boxes, altitude line.
    2. `<g id="color-overlay-layer">`: Dynamic neon double-layered glow lines matching user wire connections.
    3. `<g id="anim-layer" style="display: none;">`: Isolated animation layer holding ghost clone triangles during the alignment check.
    4. `<g id="labels-layer">`: Scaled upright text labels ($A, B, C, X$) with dark stroke halos for contrast.
* **Canvas Footer:** Educational reference hints explaining $\perp$ and $\sim$ notation.

### 4.3 Right Panel: Interactive Problems (`.problems-panel`)

#### Card 1: Side-to-Side Correspondence (`#card-problem-1`)
* Step indicator badge `1` + Title `Side-to-Side Correspondence`.
* **Wire Board Container (`.wire-board-container`):**
  * **Top Row (`#row-t1`):** Triangle 1 label badge (`tag-t1`, pink) + sockets container (`#sockets-t1`).
  * **Middle Area (`.wire-svg-area`):** SVG element (`#wire-svg`) spanning the full gap between rows to draw interactive cubic Bezier curves representing physical patch cables.
  * **Bottom Row (`#row-t2`):** Triangle 2 label badge (`tag-t2`, cyan) + sockets container (`#sockets-t2`).
* **Terminal Component Anatomy (`.side-terminal`):**
  * Terminal chip displaying the line segment name with true overline (e.g., $\overline{AC}$).
  * Socket Pin (`.socket-pin`): A circular metallic connector that glows when selected, active, or snapped.
* **Color Legend Bar (`.color-legend-bar`):**
  * 3 color swatches: Lead 1 (Red), Lead 2 (Blue), Lead 3 (Yellow).
  * Text button: `#btn-clear-leads` ("Clear Leads").

#### Card 2: Similarity Statement (`#card-problem-2`)
* Step indicator badge `2` + Title `Similarity Statement`.
* **Formula Display Box (`.similarity-formula-box`):**
  * Left side: Fixed Triangle 1 symbol ($\Delta$) and vertex sequence (e.g., `A B C`).
  * Middle symbol: Tilde similarity operator ($\sim$).
  * Right side: Triangle 2 symbol ($\Delta$) followed by 3 dashed interactive slot buttons:
    * `<button class="slot-btn active" data-slot="0" id="slot-0">_</button>`
    * `<button class="slot-btn" data-slot="1" id="slot-1">_</button>`
    * `<button class="slot-btn" data-slot="2" id="slot-2">_</button>`
* **Letter Picker Row (`.letter-picker-row`):**
  * 4 quick-selection buttons: `[A]`, `[B]`, `[C]`, `[X]`.
  * `#btn-clear-statement` ("Clear").

#### Action Card & Feedback Banner (`.action-card`)
* Large primary action button: `#btn-verify` (`Visualize Alignment & Check`).
* Dynamic Feedback Banner: `#feedback-banner` with 3 state classes: `.success`, `.partial`, `.error`.

---

## 5. Mathematical Engine & Geometry Specification (`What_It_Does.js`)

### 5.1 The Geometric Model
The entire diagram is derived from a single randomized right triangle $\Delta ABC$ with altitude $\overline{CX}$ perpendicular to hypotenuse $\overline{AB}$:
```
                C (Right angle = 90°)
               /| \
              / |  \
             /  |   \
            /   |    \
           /    |     \
          /     |      \
         A------X-------B
      (theta)  (Altitude (90° - theta)
                foot)
```

1. **Acute Angle Generation:** Select a random angle $\theta \in [24^\circ, 38^\circ]$ (in radians: $\theta = \text{deg} \cdot \pi / 180$).
   * *Rationale:* Constraining $\theta$ away from $45^\circ$ ensures that the short leg and long leg are visibly distinct in every randomized instance, preventing visual ambiguity.
2. **Base Choices:** The orientation of the base triangle is chosen at random from 3 configurations:
   * `'hypotenuse'`: Hypotenuse $AB$ is horizontal.
   * `'long_leg'`: Long leg $AC$ is horizontal.
   * `'short_leg'`: Short leg $BC$ is horizontal.
3. **Random Reflection:** 50% probability of reflecting the triangle horizontally (`isFlipped = Math.random() > 0.5`).
4. **Canonical Coordinates (Normalized):**
   * Hypotenuse base:
     * $A = (0, 0)$
     * $B = (1, 0)$
     * $C = (\cos^2\theta, -\sin\theta\cos\theta)$
     * $X = (\cos^2\theta, 0)$
5. **Centering & Scaling to ViewBox (600 x 420):**
   * Compute bounding box of all 4 points $\{A, B, C, X\}$.
   * Set target drawing envelope: width $W = 600 - 140 = 460$, height $H = 420 - 120 = 300$.
   * Scale factor $S = \min(W / \Delta x, H / \Delta y)$.
   * Center transformed coordinates at $(300, 210)$.

### 5.2 The Three Similar Triangles Registry
Every generated geometry defines 3 triangles with strict angle-ordered vertex assignments:
* Angle 1: Smaller acute angle ($\theta$)
* Angle 2: Larger acute angle ($90^\circ - \theta$)
* Angle 3: Right angle ($90^\circ$)

| Triangle ID | Display Name | Vertex Order (Angle 1, 2, 3) | Hypotenuse | Long Leg | Short Leg |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BIG** | Triangle $ABC$ | `[A, B, C]` | $\overline{AB}$ | $\overline{AC}$ | $\overline{BC}$ |
| **MED** | Triangle $ACX$ | `[A, C, X]` | $\overline{AC}$ | $\overline{AX}$ | $\overline{CX}$ |
| **SML** | Triangle $CBX$ | `[C, B, X]` | $\overline{BC}$ | $\overline{CX}$ | $\overline{BX}$ |

### 5.3 Collision-Avoidant Label Positioning
Vertex labels cannot simply be placed at vertex coordinates; they must be projected outward to prevent overlapping triangle lines:
* **Vertices $A, B, C$:** Projected outward from the centroid of $\Delta ABC$ by distance $d = 26\text{px}$:
  $$\vec{v}_{\text{label}} = P_v + 26 \cdot \frac{P_v - C_{\text{centroid}}}{\|P_v - C_{\text{centroid}}\|}$$
* **Altitude Foot $X$:** Projected outward perpendicular to segment $AB$, directed away from vertex $C$:
  $$\vec{u}_{AB} = \frac{B - A}{\|B - A\|}, \quad \vec{n} = (-u_y, u_x)$$
  $$\text{If } \vec{n} \cdot (C - X) > 0 \implies \vec{n} = -\vec{n}$$
  $$X_{\text{label}} = X + 24 \cdot \vec{n}$$

---

## 6. User Interaction & State Engine

### 6.1 State Machine Specification
```javascript
let geom = null;               // Output of generateGeometry()
let currentProblem = null;     // { t1Key, t2Key, t1, t2, t1SideList, t2SideList }
let activeHighlight = null;    // 't1' | 't2' | null
let selectedT1Socket = null;   // sideName string | null
let connections = [];          // Array of { t1SideKey, t2SideKey, colorIndex (0..2) }
let statementSlots = ['', '', '']; // 3-element array of strings
let activeSlotIndex = 0;       // 0, 1, or 2
let isAnimating = false;       // boolean lock
```

### 6.2 Problem Initialization (`initProblem`)
1. Stop any ongoing animations and clear timers.
2. Generate fresh randomized geometry.
3. Select two distinct triangle keys at random from `['BIG', 'MED', 'SML']` (e.g., $T_1 = \text{MED}$, $T_2 = \text{SML}$).
4. Randomly shuffle the 3 sides of $T_1$ for its socket row.
5. Randomly shuffle the 3 sides of $T_2$ for its socket row.
6. Reset connections, statement slots, highlight states, and feedback banners.
7. Render base geometry, sockets, wires, and similarity formula prompt.

### 6.3 Dual-Mode Patch Lead Connection (Click + Drag)
Users must be able to connect leads via either **Click-to-Click** (accessible for trackpads/keys) or **Fluid Drag-and-Drop** (natural for touch/mouse):

#### Mode A: Click-to-Click
1. Clicking a socket in Row 1 ($T_1$) selects it (adds `.selected` class with glowing cyan halo).
2. Clicking any socket in Row 2 ($T_2$) attaches a lead between the selected $T_1$ socket and the clicked $T_2$ socket.
3. Clicking an already-connected socket or clicking directly on an SVG wire deletes that connection.

#### Mode B: Drag-and-Drop with Magnetic Snapping
1. `pointerdown` on any terminal chip or socket pin records starting socket and coordinates.
2. `pointermove` calculates distance. If $\Delta > 5\text{px}$, drag mode engages (`body.classList.add('wire-dragging')`).
3. An active dashed SVG path (`.wire-drag`) follows the cursor in real time using a cubic Bezier curve.
4. **Magnetic Snapping:** If the pointer moves within $14\text{px}$ of a valid target socket in the opposite row, the target terminal scales up (`.drag-target`), and the wire tip magnetically locks to the center of the target socket pin.
5. `pointerup` evaluates target: if released over a target socket, `attachLead(t1Side, t2Side)` triggers; otherwise, the drag cancels cleanly.

#### Wire Physics & Geometry (Cubic Bezier Path)
Wires are drawn in the `#wire-svg` area using cubic Bezier curves with vertical control point offsets:
$$\text{Path: } M\ x_1, y_1\ C\ x_1, (y_1 + 0.55\Delta y)\quad x_2, (y_2 - 0.55\Delta y)\quad x_2, y_2$$
Where $(x_1, y_1)$ is the center of the $T_1$ pin and $(x_2, y_2)$ is the center of the $T_2$ pin.

#### Color Cycling Rules
* Lead colors cycle in order: **Red (0) $\rightarrow$ Blue (1) $\rightarrow$ Yellow (2)**.
* When a new wire is attached, it automatically grabs the lowest available color index not currently in use.
* Max 3 connections permitted. Connecting an already-connected socket replaces its previous wire.

### 6.4 Canvas Triangle Highlighting
* Clicking "Highlight Triangle 1" shades $T_1$ on the SVG canvas with semi-transparent pink fill (`rgba(244, 114, 182, 0.2)`) and a bold pink outline.
* Clicking "Highlight Triangle 2" shades $T_2$ on the canvas with cyan fill (`rgba(56, 189, 248, 0.2)`) and a bold cyan outline.
* Highlighting allows students to visually isolate the two triangles of interest amidst the intersecting lines.

### 6.5 Dynamic Canvas Color Overlays
When a lead is connected between two sides, both corresponding segments on the main geometry canvas immediately light up in that lead's color (Red, Blue, or Yellow) using a double-layered SVG stroke (a thick $10\text{px}$ glow line at $35\%$ opacity underneath a crisp $3.5\text{px}$ core line).

### 6.6 Similarity Statement Input System
* Clicking any slot (`#slot-0`, `#slot-1`, `#slot-2`) sets `activeSlotIndex`.
* Clicking letter buttons (`[A]`, `[B]`, `[C]`, `[X]`) fills the active slot and automatically advances to the next slot (`Math.min(2, activeSlotIndex + 1)`).
* **Physical Keyboard Listener:** Pressing keys `A`, `B`, `C`, or `X` on a physical keyboard enters the letter and advances. Pressing `Backspace` clears the current slot or moves back one slot.

---

## 7. The Alignment Animation Choreography & Verification Engine

When the student clicks **"Visualize Alignment & Check"**, the app executes a multi-phase visual proof.

### 7.1 Mathematical Foundations of the Alignment
To determine whether two similar triangles coincide, one triangle must be mapped onto the other through rigid Euclidean transformations:
1. **Hypotenuse Midpoints:**
   $$M_1 = \frac{T_{1,\text{hyp}}.p_1 + T_{1,\text{hyp}}.p_2}{2}, \quad M_2 = \frac{T_{2,\text{hyp}}.p_1 + T_{2,\text{hyp}}.p_2}{2}$$
   Target Destination: Canvas Center $M_{\text{dest}} = (300, 210)$.
2. **Chirality (Orientation) Detection:**
   Calculate the 2D cross product of vectors from the small acute angle to the large acute angle and right angle:
   $$\vec{v}_1 = P_{\text{acuteLarge}} - P_{\text{acuteSmall}}, \quad \vec{v}_2 = P_{\text{right}} - P_{\text{acuteSmall}}$$
   $$\text{Chirality} = \text{sgn}(v_{1x}v_{2y} - v_{1y}v_{2x})$$
   If $\text{Chirality}(T_1) \neq \text{Chirality}(T_2)$, $T_2$ is reflected across its local vertical axis ($scaleX = -1$).
3. **Concurrency Angle Calculation:**
   Compute the angle between the hypotenuse vector of $T_1$ and the (reflected) hypotenuse vector of $T_2$:
   $$\theta_{\text{rot}} = \text{atan2}(v_{1y}, v_{1x}) - \text{atan2}(v_{2y}, v_{2x})$$
   Normalize $\theta_{\text{rot}}$ to $(-180^\circ, +180^\circ]$.

### 7.2 The 3-Stage Animation Timeline
All animations utilize smooth cubic easing:
$$\text{easeInOutCubic}(t) = \begin{cases} 4t^3 & t < 0.5 \\ 1 - \frac{(-2t + 2)^3}{2} & t \ge 0.5 \end{cases}$$

```
0.0s             1.0s                           2.0s                           3.0s
+----------------+------------------------------+------------------------------+---------------->
|  STAGE 1:      |  STAGE 2:                    |  STAGE 3:                    |  EVALUATION &  |
|  TRANSLATION   |  REFLECTION (if needed)      |  ROTATION                    |  FEEDBACK      |
|  Midpoints     |  Flip T2 horizontally        |  Rotate T2 until hypotenuse  |  Show banner,  |
|  move to (300, |  scaleX: 1.0 -> -1.0         |  lines are concurrent;       |  evaluate side |
|  210)          |  (Skip/Hold if same chiral)  |  Guide line fades in         |  & vertex math |
+----------------+------------------------------+------------------------------+---------------->
```

* **Stage 1: Translation (~1.0s):**
  * Status badge: `"1. Translating: Aligning Hypotenuse Midpoints..."`
  * Triangle 1 and Triangle 2 detach from the static drawing into `#anim-layer`.
  * Background layers fade to $18\%$ opacity.
  * Both triangles smoothly slide until their hypotenuse midpoints $M_1$ and $M_2$ meet at $(300, 210)$.
* **Stage 2: Reflection (~0.6s – 1.0s):**
  * If $\text{Chirality}(T_1) \neq \text{Chirality}(T_2)$: Status displays `"2. Reflecting Triangle 2 (Flipping Orientation)..."`, scaling $T_2$ horizontally from $1.0 \rightarrow -1.0$.
  * If chiralities match: Status displays `"2. Reflection Check: Orientation Already Matches"` with a brief pause.
* **Stage 3: Rotation (~1.0s):**
  * Status badge: `"3. Rotating around Hypotenuse Midpoint..."`
  * Triangle 2 rotates around the shared midpoint until its hypotenuse is exactly parallel to Triangle 1's hypotenuse.
  * An infinite dashed guide line appears through the concurrent hypotenuses.
* **Upright Floating Labels:** Throughout all transformations, vertex labels ($A, B, C, X$) are mathematically recalculated every frame to remain **strictly horizontal and upright**, dynamically projected outside the moving polygon edges.

### 7.3 Interruptibility & Cancellation
If the user clicks "Reset", "New Triangle", or interacts with sockets during an animation:
* `stopAnimation()` executes immediately: cancels `requestAnimationFrame`, clears timers, resets SVG layer opacities to $1.0$, hides `#anim-layer`, and re-enables controls.

---

## 8. Verification Logic & Educational Feedback

### 8.1 Validation Rubric

#### Check 1: Side Correspondence (3 Pairs)
The program compares user connections to the ground-truth roles:
* $\text{Hypotenuse}(T_1) \longleftrightarrow \text{Hypotenuse}(T_2)$
* $\text{Long Leg}(T_1) \longleftrightarrow \text{Long Leg}(T_2)$
* $\text{Short Leg}(T_1) \longleftrightarrow \text{Short Leg}(T_2)$
* Each correct pair increments `correctSidesCount` (0 to 3).

#### Check 2: Similarity Statement (Exact Vertex Order)
The student's 3 letters must match $T_2$'s angle-ordered sequence:
$$\text{Expected: } T_{2,\text{vertexOrder}} = [T_{2,\text{acuteSmall}}, T_{2,\text{acuteLarge}}, T_{2,\text{right}}]$$
$$\text{User Statement: } \text{statementSlots.join('')}$$
$$\text{statementCorrect} = (\text{User Statement} === \text{Expected})$$

### 8.2 Feedback States & Copy

| Status | Trigger Condition | Banner Class | Content & Educational Coaching |
| :--- | :--- | :--- | :--- |
| **Perfect** | All 3 leads correct AND statement correct | `.feedback-banner.success` | **Perfect Geometric Correspondence!**<br>All 3 pairs of sides align identically (3/3). The similarity statement $\Delta [T_1] \sim \Delta [T_2]$ is completely correct! Notice how identical colors lie directly on top of each other in the aligned view. |
| **Partial** | Some side pairs correct OR statement correct | `.feedback-banner.partial` | **Partial Alignment**<br>Highlights specific successes and flaws (e.g., *"2/3 side leads correctly matched. Notice where colors clash in the aligned view! Similarity statement is incomplete."*). |
| **Mismatch** | 0 sides correct AND statement incorrect | `.feedback-banner.error` | **Correspondence Mismatch**<br>The rotated triangles reveal conflicting dimensions. The Red, Blue, and Yellow sides do not align with each other. Recheck your side pairs and vertex order. |

---

## 9. Comprehensive Acceptance Criteria & Verification Matrix

To verify that an AI-generated codebase matches the specifications, validate against this test matrix:

| ID | Test Scenario | Expected Result | Pass/Fail Criteria |
| :--- | :--- | :--- | :--- |
| **AC-01** | Initial Page Load | Clean load, zero console errors, randomized right triangle rendered with dashed altitude line. | No script errors; SVG viewBox fits 600x420; 2 sockets rows populated with 3 sides each. |
| **AC-02** | Acute Angle Constrained | Regenerating 20 problems produces acute angles strictly between $24^\circ$ and $38^\circ$. | No degenerate or near-isosceles $45^\circ$ triangles appear. |
| **AC-03** | Right Angle Markers | Perpendicular square markers render at vertex $C$ and altitude foot $X$. | Correct SVG path orientation regardless of triangle rotation/flip. |
| **AC-04** | Socket Shuffling | The order of sides in Row 1 and Row 2 is randomized. | Sides are not always displayed in identical or predictable order. |
| **AC-05** | Click-to-Connect Leads | Click $T_1$ socket (highlights cyan) $\rightarrow$ Click $T_2$ socket draws colored Bezier wire. | Wire renders in next available color; both canvas sides light up with matching glow. |
| **AC-06** | Drag-and-Drop Leads | Drag pointer from socket $\rightarrow$ dashed wire follows cursor $\rightarrow$ release on socket snaps wire. | Fluid drag tracking; cursor switches to grabbing; magnetic snap activates within $14\text{px}$. |
| **AC-07** | Lead Replacement Rules | Connecting an already-wired socket disconnects the previous wire. | Max 3 wires total; no duplicate wires to the same socket. |
| **AC-08** | Delete Wires | Clicking an active wire or clicking an active $T_2$ socket removes the lead. | Wire disappears; canvas side glow clears; color returns to available pool. |
| **AC-09** | Statement Slot Navigation | Clicking slot activates it; typing letters fills slot and auto-advances. | Slots accept only A, B, C, X; Backspace deletes and retreats active index. |
| **AC-10** | Highlight T1 / T2 | Clicking "Highlight Triangle 1" shades $T_1$ pink; clicking T2 shades $T_2$ cyan. | Highlights toggle independently without disturbing geometry or wire state. |
| **AC-11** | 3-Stage Animation | Clicking "Visualize Alignment & Check" triggers Translation $\rightarrow$ Reflection $\rightarrow$ Rotation. | Smooth cubic easing; status pill updates; hypotenuses align concurrently; labels stay upright. |
| **AC-12** | Animation Cancellation | Clicking "Reset" or "New Triangle" mid-animation halts all animation loops immediately. | No lingering animation frames; DOM layers reset cleanly; no console errors. |
| **AC-13** | Accurate Verification | Correct matching yields emerald success banner; mismatches yield descriptive feedback. | Mathematical logic accurately checks hypotenuse/long leg/short leg correspondence. |

---

## 10. The Non-Coder's Playbook: How to Prompt Advanced Coding Models

When creating sophisticated software without writing code manually, use this PRD as a template. Observe the key techniques applied throughout this document:

### Rule 1: Specify the Coordinate Space and Math Explicitly
* **Vague:** *"Draw a right triangle with an altitude."*
* **Engineering Standard (Used Here):** *"Generate an acute angle $\theta \in [24^\circ, 38^\circ]$. In normalized space, let $A=(0,0), B=(1,0), C=(\cos^2\theta, -\sin\theta\cos\theta), X=(\cos^2\theta, 0)$. Scale to a $600 \times 420$ viewBox centered at $(300, 210)$."*
* **Why it matters:** An AI model given exact trigonometry will produce an infallible geometric model on the first try.

### Rule 2: Detail Every Interaction State & Fallback
* **Vague:** *"Let users draw wires between buttons."*
* **Engineering Standard (Used Here):** *"Support both click-to-click and pointer drag. Use Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`). On pointermove $> 5\text{px}$, activate drag mode. Draw a cubic Bezier curve with control points offset by $0.55\Delta y$. Magnetically snap to targets within $14\text{px}$."*
* **Why it matters:** This prevents the model from generating broken drag scripts that lose tracking when the mouse moves too fast.

### Rule 3: Define Animation Timelines Like a Motion Designer
* **Vague:** *"Animate the triangle to match the other one."*
* **Engineering Standard (Used Here):** *"Break alignment into 3 discrete sequential stages: Stage 1 (1.0s Translation of midpoints to $(300,210)$), Stage 2 (0.6–1.0s Reflection if chirality cross product differs), Stage 3 (1.0s Rotation around midpoint until hypotenuses align concurrently). Vertex labels must recalculate each frame to remain upright."*
* **Why it matters:** AI models often try to tween everything at once, creating a chaotic, dizzying spin that destroys the educational value of the transformation.

### Rule 4: Provide Exact Color Tokens & Component Anatomy
* **Vague:** *"Make it look modern and dark."*
* **Engineering Standard (Used Here):** Provide complete CSS custom properties (`--bg-main: #0a0a0f`, `--lead-red: #ef4444`, etc.) and explicitly describe font pairings, overline vinculums, and border radii.
* **Why it matters:** This ensures visual cohesion matching commercial design systems.
