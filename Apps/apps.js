/**
 * Periodically Rational - Student Classroom Apps Catalog
 * ========================================================
 * Each interactive app has its own dedicated directory inside /Apps/
 * (e.g., /Apps/AngleDetective/, /Apps/PolarDefender/, /Apps/BardsMeter/).
 *
 * Automatic Buttons:
 *   - "launchUrl": Always displays the primary "Launch App →" button.
 *   - "zipUrl": If provided (e.g. "AngleDetective/AngleDetective.zip"),
 *     the catalog AUTOMATICALLY renders a "📦 Download & Remix (.zip)" button.
 *     If set to null or omitted, the download button is safely hidden.
 *   - "retrospectiveUrl": Optional companion essay in Ideas (renders a "Read Retrospective 📖" button).
 */

const APPS_CATALOG = [
  {
    id: "rotate-and-relate",
    title: "Rotate & Relate: Similar Right Triangles Sandbox",
    shortTitle: "Rotate & Relate",
    badge: "Spatial Reasoning & Geometry",
    summary: "A spatial geometry tool for exploring similar right triangles and altitude relationships. Connect corresponding sides with virtual colored wires, enter similarity statements, and watch dynamic 2D animations glide and rotate the triangles into side-by-side alignment.",
    launchUrl: "RotateAndRelate/index.html",
    zipUrl: null, // Set to "RotateAndRelate/RotateAndRelate.zip" when zip is added
    tags: ["Geometry", "Manipulative"]
  },
  {
    id: "angle-detective",
    title: "Angle Detective: Parallel Lines & Transversals",
    shortTitle: "Angle Detective",
    badge: "High School Geometry",
    summary: "A high school geometry mastery tool with a 3-stage gated learning loop: name the angles with geometric notation, identify their angle pair relationship, and solve the algebraic equation. Features dynamic SVG diagrams and session performance reports.",
    launchUrl: "AngleDetective/index.html",
    zipUrl: null, // Set to "AngleDetective/AngleDetective.zip" when zip is added
    tags: ["Geometry", "Algebra"]
  },
  {
    id: "polar-defender",
    title: "Polar Defender: Radar Coordinate Defense Game",
    shortTitle: "Polar Defender",
    badge: "Coordinate Systems & Radians",
    summary: "An arcade-style radar defense game where students practice plotting polar coordinates (r, θ) and radians to neutralize incoming threats before shields breach. Features tiered difficulty, negative radius targets, call sign privacy, and retro audio.",
    launchUrl: "PolarDefender/index.html",
    zipUrl: null, // Set to "PolarDefender/PolarDefender.zip" when zip is added
    tags: ["Pre-Calculus", "Game"]
  },
  {
    id: "bards-meter",
    title: "The Bard's Meter: Shakespearean Prosody Sandbox",
    shortTitle: "The Bard's Meter",
    badge: "ELA & Poetic Scansion",
    summary: "An interactive prosody workshop exploring iambic pentameter, metrical stress, and the poetic mechanics of Shakespeare's verse. Features theatrical proscenium staging, syllable-by-syllable rhythmic pacing, and custom JSON curriculum support.",
    launchUrl: "BardsMeter/index.html",
    zipUrl: null, // Set to "BardsMeter/BardsMeter.zip" when zip is added
    retrospectiveUrl: "../Ideas/articles/bards-meter-retrospective.html",
    tags: ["ELA", "Scansion", "Case Study"]
  },
  {
    id: "statistics-calculator",
    title: "Statistical Hypothesis Testing Suite",
    shortTitle: "Statistics Calculator",
    badge: "AP & College Statistics",
    summary: "An inferential statistics suite for Chi-Square variance, 1-Sample T-tests, Z-tests for means, and Z-tests for proportions. Dynamically renders distribution curves, shades critical rejection regions (α), computes test statistics, and reports exact p-values in real time.",
    launchUrl: "StatisticsCalculator/index.html",
    zipUrl: null, // Set to "StatisticsCalculator/StatisticsCalculator.zip" when zip is added
    tags: ["Statistics", "AP Math"]
  },
  {
    id: "redox-reactions",
    title: "Redox Reactions: Oxidation & Reduction Explorer",
    shortTitle: "Redox Explorer",
    badge: "AP & High School Chemistry",
    summary: "An interactive chemistry tool for mastering oxidation numbers, electron transfer, and redox pathways. Assign oxidation states with real-time rule validation, distinguish oxidizing and reducing agents (OIL RIG), and access guided arithmetic hints.",
    launchUrl: "RedoxReactions/index.html",
    zipUrl: null, // Set to "RedoxReactions/RedoxReactions.zip" when zip is added
    tags: ["Chemistry", "Physical Science"]
  },
  {
    id: "the-rug-problem",
    title: "The Rug Problem: Geometric Quadratic Equations",
    shortTitle: "The Rug Problem",
    badge: "Algebra & Quadratic Modeling",
    summary: "A concrete mathematical manipulative that models quadratic equations ax² ± bx = c as woven patterned rugs. Students visually guess and refine unknown rug dimensions with animated algebraic substitution, interval feedback arrows, and scaffolded discriminant cases.",
    launchUrl: "TheRugProblem/index.html",
    zipUrl: null, // Set to "TheRugProblem/TheRugProblem.zip" when zip is added
    tags: ["Algebra", "Visual Models"]
  },
  {
    id: "feedback-flow",
    title: "FeedbackFlow: Rubric Feedback Builder",
    shortTitle: "FeedbackFlow",
    badge: "Teacher Productivity & Grading",
    summary: "A point-and-click grading assistant that turns rubric selections and common comments into warm, cohesive feedback paragraphs with automatic score summaries and one-touch clipboard export.",
    launchUrl: "FeedbackFlow/index.html",
    zipUrl: null, // Set to "FeedbackFlow/FeedbackFlow.zip" when zip is added
    tags: ["Teacher Utility"]
  },
  {
    id: "vocabulary-codenames",
    title: "Vocabulary Codenames: Classroom Review Game",
    shortTitle: "Vocabulary Codenames",
    badge: "Vocabulary & Classroom Review",
    summary: "A collaborative team vocabulary board game inspired by Codenames. Paste any word list to generate randomized 4×4 grids with animated card reveals, secret Spymaster key generation, and an independent teacher answer key tab.",
    launchUrl: "VocabularyCodenames/index.html",
    zipUrl: null, // Set to "VocabularyCodenames/VocabularyCodenames.zip" when zip is added
    tags: ["Review Game", "Classroom"]
  },
  {
    id: "rational-function-explorer",
    title: "Rational Function Explorer: Zeros, Asymptotes & Holes",
    shortTitle: "Rational Function Explorer",
    badge: "Algebra II & Pre-Calculus",
    summary: "An interactive rational functions tool for analyzing polynomial factor behavior. Students identify zeros, vertical asymptotes, and removable discontinuities (holes), observing them plotted live on an auto-scaled coordinate graph with detailed scoring feedback.",
    launchUrl: "RationalFunctionExplorer/index.html",
    zipUrl: "RationalFunctionExplorer/RationalFunctionExplorer.zip",
    tags: ["Algebra II", "Pre-Calculus", "Graphing"]
  },
  {
    id: "classroom-genie-suite",
    title: "The Classroom Genie: Interactive Tool Suite",
    shortTitle: "Conference Suite",
    badge: "Conference Showcase & Demos",
    summary: "Explore 13 interactive classroom tools including the Spin-a-Name Wheel, Fraction Visualizer, Transversal Angle explorer, and Polar Defender math game developed for the Pearson Virtual Educator Conference.",
    launchUrl: "../Conference/index.html",
    zipUrl: null,
    tags: ["Showcase", "13 Demos"]
  }
];
