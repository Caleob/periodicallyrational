# Parallel Lines & Transversals Practice Tool

A responsive, interactive web application designed for high school geometry students to practice and master angle relationships in parallel line/transversal configurations.

## Features

- **Scaffolded Learning Sequence**:
  1.  **Angle Naming**: Practice identification using 3-point naming conventions.
  2.  **Relationship Identification**: Determine angle pair types (e.g., Alternate Interior, Corresponding) and their properties (Congruent vs. Supplementary).
  3.  **Algebraic Application**: Set up and solve equations based on geometric properties.
- **Dynamic Problem Generation**:
  - **Level 1**: Numerical values and simple variables.
  - **Level 2**: Linear expressions and numerical values.
  - **Level 3**: Systems with two expressions.
- **Interactive Geometry**:
  - Dynamically rendered SVG diagrams that visually match the calculated angles.
  - Drag-and-drop interface for angle naming.
- **Immediate Feedback**: Real-time validation for each stage of the problem.
- **Progress Tracking**: Session-based scoring and a downloadable summary report.

## Usage

1.  **Open the Application**: Open `index.html` in any modern web browser.
2.  **Log In**: Enter your first name and last initial to begin the session.
3.  **Complete Problems**:
    - **Stage 1**: Identify the specific angles indicated by Blue and Red formatting. Drag points from the bank to the drop zones.
    - **Stage 2**: Select the correct angle relationship type and whether they are Congruent (≅) or Supplementary (180°).
    - **Stage 3**: Solve for the variable $x$ and enter the value.
4.  **Finish & Report**: Complete the sequence of 6 problems and download your performance report.

## Project Structure

```text
/
├── index.html      # Main application structure and UI layout
├── style.css       # Visual styling, variables, and animations
├── script.js       # Core game logic, problem generation, and UI management
├── README.md       # Project documentation
└── .gitignore      # Git configuration
```

## Key Components

### `ProblemGenerator` (script.js)
Handles the creation of random geometry problems. It ensures angle values are valid (between 45° and 135°) and generates appropriate algebraic expressions based on the current difficulty level.

### `UIManager` (script.js)
Manages the SVG rendering and DOM interactions.
- Draws the transversal diagram based on the generated angle.
- Handles drag-and-drop logic for points.
- Manages stage locking and progression states.

### `GameManager` (script.js)
Orchestrates the overall flow of the application.
- Tracks user score and history.
- Validates answers against the generated problem data.
- Generates the final performance report.

## Version History

- **v1.0**: Initial release with basic problem types.
- **v1.1**: Enhanced SVG rendering for accurate angle visualization.
- **v1.2**: Added git version control and polished UI text (mathematical symbols).
