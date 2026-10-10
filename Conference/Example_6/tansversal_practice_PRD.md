# Product Requirements Document
## Parallel Lines & Transversals Practice Tool

**Version:** 1.0  
**Date:** January 2026  
**Product Owner:** Educational Technology Team  
**Target Audience:** Geometry students (grades 8-10)

---

## 1. Executive Summary

The Parallel Lines & Transversals Practice Tool is an interactive web-based application designed to help geometry students master the identification and calculation of angles formed when a transversal intersects parallel lines. The application uses a **stepwise learning approach** with immediate feedback at each stage, ensuring students build understanding progressively before moving to more complex tasks.

---

## 2. Product Goals

### Primary Goals
- Provide structured, progressive practice for angle relationships in parallel line/transversal configurations
- Reinforce proper angle naming conventions using three-point notation
- Build fluency in identifying angle pair relationships (corresponding, alternate interior, etc.)
- Develop algebraic problem-solving skills in geometric contexts
- Track student performance for self-assessment and teacher review

### Success Metrics
- Students complete all three stages of a problem with >80% accuracy
- Students demonstrate improvement across multiple problem attempts
- Students can correctly identify angle relationships with >90% accuracy by their 5th problem
- Teachers utilize performance reports to identify struggling students

---

## 3. User Stories

### Student User Stories
- As a student, I want to see my work checked at each step so I can catch mistakes early
- As a student, I want visual feedback on my answers so I know immediately if I'm correct
- As a student, I want problems at different difficulty levels so I can build skills gradually
- As a student, I want to track my performance so I can see my improvement
- As a student, I want to download my work summary so I can show my teacher

### Teacher User Stories
- As a teacher, I want students to complete structured practice so they build understanding step-by-step
- As a teacher, I want performance data so I can identify students who need additional support
- As a teacher, I want students to maintain scratch work so I can review their problem-solving process

---

## 4. Core Learning Philosophy: Stepwise Build-Up with Constant Checking

### 4.1 Pedagogical Approach

The application implements a **scaffolded learning model** where students cannot proceed to the next stage until they have successfully completed the current stage. This approach:

1. **Prevents error accumulation** - Students must correct mistakes before building on that knowledge
2. **Reinforces foundational skills** - Each stage builds directly on the previous stage's understanding
3. **Provides immediate corrective feedback** - Students learn from mistakes in real-time
4. **Builds confidence progressively** - Small wins at each stage motivate continued effort
5. **Mirrors expert problem-solving** - Professionals verify each step before proceeding

### 4.2 Three-Stage Problem Structure

#### **Stage 1: Angle Naming (Foundational Skill)**
- **Objective:** Students must correctly name both angles using three-point notation
- **Why First:** Understanding angle notation is prerequisite for all subsequent work
- **Checking Mechanism:** Both angles must be correctly named to proceed
- **Feedback:** Immediate visual feedback (green checkmarks for correct, red X for incorrect)
- **Rationale:** If students cannot correctly identify the angles, they cannot reason about their relationships

#### **Stage 2: Relationship Identification (Conceptual Understanding)**
- **Objective:** Students identify the angle pair type and whether angles are congruent or supplementary
- **Why Second:** Students must understand the geometric relationship before solving
- **Checking Mechanism:** Both relationship type and congruence/supplementary status must be correct
- **Feedback:** Selected options highlighted green (correct) or red (incorrect)
- **Rationale:** The algebraic setup in Stage 3 depends entirely on understanding this relationship

#### **Stage 3: Algebraic Solution (Application)**
- **Objective:** Students solve for the variable and find its numerical value
- **Why Last:** This is the application of all previous understanding
- **Checking Mechanism:** Solution validated to nearest degree (accounts for rounding)
- **Feedback:** Input field turns green/red, with numerical feedback
- **Rationale:** Students can only solve correctly if they understood the relationship in Stage 2

### 4.3 Error Correction Loop

At each stage, if students submit an incorrect answer:
1. Visual feedback immediately indicates the error
2. Specific elements are highlighted (incorrect drop zones, wrong selections, etc.)
3. Students must revise and resubmit
4. The stage remains "locked" until correct answers are provided
5. No penalty for multiple attempts - emphasis is on learning, not punishment

---

## 5. Detailed Feature Specifications

### 5.1 Student Login Modal

#### Behavior
- **Trigger:** Appears immediately upon application load, before any content is visible
- **Modal Properties:** Cannot be dismissed without completing the form
- **Data Collection:**
  - First Name (required, text input, max 50 characters)
  - Last Initial (required, single character, A-Z)
  - Session Timestamp (auto-captured)

#### Content
```
Welcome to Parallel Lines & Transversals Practice!

Please enter your information:
- First Name: [text input]
- Last Initial: [text input, 1 character]

⚠️ IMPORTANT REMINDER:
Keep all scratch work used to complete this practice session.
Your teacher may ask to review your work process.

[Begin Practice Button]
```

#### Validation
- First name: Must contain at least 2 characters, letters only
- Last initial: Must be a single letter A-Z
- Cannot proceed until both fields are validly filled

#### Visual Design
- Centered modal with semi-transparent overlay
- Prominent warning icon for scratch work reminder
- Clean, professional styling consistent with main application
- "Begin Practice" button disabled until form is valid

---

### 5.2 Performance Tracking System

#### Data Captured Per Problem

For each problem attempt, the system records:

```javascript
{
  problemNumber: 1,
  level: 2,
  timestamp: "2026-01-18T14:32:15Z",
  
  stage1: {
    attempts: 2,
    correct: true,
    errorTypes: ["incorrect_blue_angle_vertex"]
  },
  
  stage2: {
    attempts: 1,
    correct: true,
    angleTypeSelected: "alternate-interior",
    relationshipSelected: "congruent",
    angleTypeCorrect: true,
    relationshipCorrect: true
  },
  
  stage3: {
    attempts: 1,
    correct: true,
    studentAnswer: 45,
    correctAnswer: 45,
    variableSolved: "x"
  },
  
  totalAttempts: 4,
  problemCompleted: true
}
```

#### Aggregate Statistics

The system maintains running totals:
- **Total Problems Attempted**
- **Total Problems Completed**
- **Problems by Level** (Level 1, 2, 3 breakdown)
- **Stage 1 Accuracy:** Correct on first attempt / Total attempts
- **Stage 2 Accuracy:** Correct on first attempt / Total attempts
- **Stage 3 Accuracy:** Correct on first attempt / Total attempts
- **Overall First-Attempt Accuracy**
- **Common Error Patterns:**
  - Angle naming errors
  - Relationship identification errors (by type)
  - Algebraic solution errors

---

### 5.3 Performance Display (On-Screen)

#### Location
- Persistent sidebar or top banner
- Always visible but not intrusive
- Updates in real-time after each submission

#### Content
```
📊 Your Progress

Name: [First Name] [Last Initial].
Problems Completed: 5

✓ Correct First Try: 12 / 15 stages (80%)

By Level:
Level 1: 2 problems
Level 2: 2 problems  
Level 3: 1 problem

Current Streak: 3 problems ✨
```

#### Visual Elements
- Progress bar showing completion percentage
- Color-coded accuracy indicators (green >80%, yellow 60-80%, red <60%)
- Achievement badges for streaks (3, 5, 10 problems in a row)

---

### 5.4 Download Report Feature

#### Button Placement
- Prominent "Download Report" button in performance dashboard
- Available at any time (doesn't require completing problems)
- Icon: Download symbol with document

#### Report Format: Plain Text (.txt)

```
========================================
PARALLEL LINES & TRANSVERSALS PRACTICE
Performance Report
========================================

STUDENT INFORMATION
-------------------
Name: John D.
Session Date: January 18, 2026
Session Start: 2:30 PM
Session End: 3:15 PM
Total Time: 45 minutes

OVERALL PERFORMANCE
-------------------
Problems Completed: 5
Total Stages Attempted: 15
First-Attempt Accuracy: 80% (12/15 stages correct)

PERFORMANCE BY LEVEL
--------------------
Level 1 (Value & Variable):
  - Problems Completed: 2
  - Average Attempts per Stage: 1.2
  - First-Attempt Accuracy: 83%

Level 2 (Expression & Value):
  - Problems Completed: 2
  - Average Attempts per Stage: 1.3
  - First-Attempt Accuracy: 75%

Level 3 (Two Expressions):
  - Problems Completed: 1
  - Average Attempts per Stage: 1.7
  - First-Attempt Accuracy: 67%

STAGE-BY-STAGE BREAKDOWN
-------------------------
Stage 1 - Angle Naming:
  - Total Attempts: 7
  - Correct First Try: 4/5 (80%)
  - Common Errors: 
    * Incorrect vertex selection (2 times)

Stage 2 - Relationship Identification:
  - Total Attempts: 6
  - Correct First Try: 4/5 (80%)
  - Angle Type Errors:
    * Confused alternate interior with corresponding (1 time)
  - Relationship Errors:
    * Selected congruent instead of supplementary (1 time)

Stage 3 - Solve for Variable:
  - Total Attempts: 6
  - Correct First Try: 4/5 (80%)
  - Average Solution Error: ±2 degrees
  - Variables Solved: x (3 times), y (2 times)

DETAILED PROBLEM LOG
--------------------
Problem 1 (Level 2) - COMPLETED
  Timestamp: 2:30 PM
  Stage 1: ✓ Correct (1 attempt)
  Stage 2: ✗ Incorrect angle type (2 attempts)
  Stage 3: ✓ Correct (1 attempt)
  Variable: x = 35°

Problem 2 (Level 1) - COMPLETED
  Timestamp: 2:37 PM
  Stage 1: ✗ Wrong vertex (2 attempts)
  Stage 2: ✓ Correct (1 attempt)
  Stage 3: ✓ Correct (1 attempt)
  Variable: y = 120°

Problem 3 (Level 2) - COMPLETED
  Timestamp: 2:45 PM
  Stage 1: ✓ Correct (1 attempt)
  Stage 2: ✓ Correct (1 attempt)
  Stage 3: ✗ Calculation error (2 attempts)
  Variable: x = 58°

Problem 4 (Level 1) - COMPLETED
  Timestamp: 2:54 PM
  Stage 1: ✓ Correct (1 attempt)
  Stage 2: ✓ Correct (1 attempt)
  Stage 3: ✓ Correct (1 attempt)
  Variable: y = 75°

Problem 5 (Level 3) - COMPLETED
  Timestamp: 3:05 PM
  Stage 1: ✓ Correct (1 attempt)
  Stage 2: ✗ Wrong relationship (2 attempts)
  Stage 3: ✗ Calculation error (2 attempts)
  Variable: x = 42°

RECOMMENDATIONS
---------------
✓ Strong angle naming skills
⚠ Review difference between alternate interior and corresponding angles
⚠ Double-check algebraic calculations, especially with expressions
✓ Good understanding of congruent vs supplementary relationships

========================================
Keep this report with your scratch work.
Review errors with your teacher.
========================================

Generated: January 18, 2026 at 3:15 PM
```

#### Report Generation Logic
- Triggered by button click
- Filename format: `ParallelLines_[FirstName][LastInitial]_[Date].txt`
- Example: `ParallelLines_JohnD_2026-01-18.txt`
- Browser download prompt automatically appears
- Report includes all data from current session

---

## 6. Difficulty Progression

### Level 1: Value & Variable
**Structure:** One angle shows a numerical value, the other shows a variable  
**Example:** `50° : x` or `y : 122°`

**Learning Objective:** Basic substitution and understanding of angle relationships

**Sample Problem:**
- Alternate interior angles
- Blue angle: 65°
- Red angle: x
- Solution: x = 65° (congruent angles)

---

### Level 2: Expression & Value
**Structure:** One angle shows an expression, the other shows a value  
**Example:** `33° : 2x - 10` or `3y + 15 : 170°`

**Learning Objective:** Setting up and solving one-step and two-step equations

**Sample Problem:**
- Consecutive interior angles
- Blue angle: 75°
- Red angle: 2x + 5
- Equation: 75 + (2x + 5) = 180
- Solution: x = 50°

---

### Level 3: Two Expressions
**Structure:** Both angles show variable expressions  
**Example:** `2x + 10 : 3x - 20` or `5y - 15 : 2y + 30`

**Learning Objective:** Setting up and solving equations with variables on both sides

**Sample Problem:**
- Corresponding angles
- Blue angle: 3x + 10
- Red angle: 5x - 30
- Equation: 3x + 10 = 5x - 30
- Solution: x = 20°

---

## 7. User Interface Requirements

### 7.1 Layout

#### Grid Structure (Wide Screen)
```
+------------------------------------------+
|  Header: Title + Level Selector          |
+------------------------------------------+
|                    |                     |
|   SVG Diagram      |  Performance Stats  |
|   (500x500px)      |  (Sidebar)          |
|                    |                     |
|                    |---------------------|
|                    |  Stage 1: Name      |
|                    |  [Interactive UI]   |
|                    |---------------------|
|                    |  Stage 2: Identify  |
|                    |  [Interactive UI]   |
|                    |---------------------|
|                    |  Stage 3: Solve     |
|                    |  [Interactive UI]   |
+------------------------------------------+
|  [New Problem] [Download Report]         |
+------------------------------------------+
```

### 7.2 Visual Design Principles

- **Color-Coded Feedback:**
  - Blue (#2196F3): First angle
  - Red (#F44336): Second angle
  - Green (#4CAF50): Correct answers
  - Red (#F44336): Incorrect answers
  - Yellow (#FFC107): Selected/in-progress

- **Progressive Disclosure:**
  - Stages appear locked (grayed out) until previous stage is complete
  - Completed stages show green checkmark in stage number badge

- **Minimal Scrolling:**
  - All interactive elements visible on a 1920x1080 screen
  - Compact but readable layout
  - Collapsible sections if needed on smaller screens

### 7.3 Interactive Elements

#### Drag-and-Drop (Stage 1)
- Point chips are visually distinct (purple background, white text)
- Drop zones have colored borders matching angle colors
- Drag cursor indicates "move" affordance
- Used points become semi-transparent and non-draggable
- Click drop zone to remove a point

#### Button Selection (Stage 2)
- Options presented as large, tappable buttons
- Selected state: filled with primary color
- Correct state: filled with green
- Incorrect state: filled with red
- Hover state: subtle lift and shadow

#### Number Input (Stage 3)
- Large, centered input field
- Placeholder text: "?"
- Auto-focus when stage unlocks
- Accept decimals (round to nearest integer)
- Enter key submits answer

---

## 8. Technical Specifications

### 8.1 Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Graphics:** SVG for geometric diagrams
- **Storage:** In-memory (session-based, no database required)
- **File Generation:** Client-side text file creation using Blob API

### 8.2 Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 8.3 Performance Requirements
- Initial load: < 2 seconds
- Problem generation: < 500ms
- Feedback rendering: < 100ms (instant feel)
- SVG rendering: < 300ms

### 8.4 Data Persistence
- Session-based only (data cleared on browser close)
- No backend storage required
- All tracking in JavaScript memory
- Export function creates downloadable snapshot

---

## 9. Problem Generation Algorithm

### 9.1 Constraints
- Angles must be between 15° and 165° (avoid edge cases)
- Variables must solve to integer values when possible
- Expressions use coefficients 1-5 and offsets -50 to +50
- No negative angle solutions
- Solutions should be "nice numbers" (avoid decimals when possible)

### 9.2 Randomization
- Random angle type selection (corresponding, alternate interior, etc.)
- Random point labeling (ensures students don't memorize positions)
- Random variable selection (x or y)
- Random coefficient and offset values within constraints

### 9.3 Validation
Before presenting a problem, verify:
- Solution is a positive integer (or within 1° of integer)
- Both angles are within valid range
- The geometric relationship is correctly represented visually

---

## 10. Error Handling

### Student-Facing Errors

#### Stage 1 Errors
- **Incomplete naming:** "Please fill in all three points for both angles."
- **Wrong angle named:** Visual highlight of incorrect drop zones
- **Vertex not in middle:** "Remember: the vertex (middle point) must be the center letter."

#### Stage 2 Errors
- **No selection made:** "Please select both the angle pair type and relationship."
- **Wrong type selected:** Highlight incorrect selection in red, show correct answer
- **Wrong relationship:** Explain the geometric rule

#### Stage 3 Errors
- **No input:** "Please enter your solution for [variable]."
- **Non-numeric input:** "Please enter a number."
- **Off by >5 degrees:** "Check your calculation. Your answer is off by [X] degrees."
- **Off by 1-5 degrees:** "Close! Check for rounding. Your answer: [X]°, Correct: [Y]°"

### System Errors
- **SVG rendering failure:** Fallback to descriptive text
- **Download failure:** Copy report text to clipboard as backup

---

## 11. Accessibility Requirements

- **Keyboard Navigation:** Full functionality without mouse
- **Screen Reader Support:** ARIA labels on all interactive elements
- **Color Blind Considerations:** Don't rely solely on color (use icons + color)
- **Font Size:** Minimum 14px, scalable up to 200%
- **Focus Indicators:** Clear visual focus on keyboard navigation

---

## 12. Success Criteria & Validation

### Student Success Indicators
- **Mastery:** 90%+ first-attempt accuracy on Stage 2 by problem 5
- **Engagement:** Average 8+ problems completed per session
- **Improvement:** Accuracy increases across session

### Product Success Indicators
- **Usability:** <5% of students require help with interface
- **Educational Impact:** Students show improvement on post-assessment
- **Adoption:** Teachers assign tool regularly (2+ times per unit)

---

## 13. Future Enhancements (Out of Scope v1.0)

### Phase 2 Features
- Teacher dashboard with class-wide analytics
- Backend storage for longitudinal tracking
- Additional angle types (linear pairs, etc.)
- Timed challenges mode
- Multiplayer competition mode
- Video explanations for each angle relationship
- Adaptive difficulty (AI-adjusted based on performance)

### Phase 3 Features
- Mobile app version
- Integration with learning management systems (Canvas, Google Classroom)
- Custom problem sets created by teachers
- Step-by-step solution walkthroughs
- Peer comparison (anonymous leaderboards)

---

## 14. Open Questions & Decisions Needed

1. **Grading tolerance:** Should Stage 3 accept ±1° or require exact answers?
   - **Recommendation:** Accept ±1° to account for rounding in multi-step problems

2. **Minimum problems:** Should there be a minimum number of problems before download?
   - **Recommendation:** No minimum—students may need to save partial work

3. **Reset function:** Should students be able to reset their session?
   - **Recommendation:** Yes, with confirmation dialog warning data loss

4. **Hints system:** Should hints be available if students are stuck?
   - **Recommendation:** Not in v1.0—encourages productive struggle

5. **Print function:** In addition to download, support browser print?
   - **Recommendation:** Yes—simple addition for student portfolios

---

## 15. Appendix: Angle Relationship Reference

### Corresponding Angles
- **Position:** Same side of transversal, same position relative to parallel line
- **Relationship:** Congruent (equal)
- **Example:** ∠1 and ∠5

### Alternate Interior Angles
- **Position:** Opposite sides of transversal, between parallel lines
- **Relationship:** Congruent (equal)
- **Example:** ∠3 and ∠6

### Alternate Exterior Angles
- **Position:** Opposite sides of transversal, outside parallel lines
- **Relationship:** Congruent (equal)
- **Example:** ∠1 and ∠8

### Consecutive Interior Angles
- **Position:** Same side of transversal, between parallel lines
- **Relationship:** Supplementary (sum to 180°)
- **Example:** ∠3 and ∠5

### Vertical Angles
- **Position:** Opposite angles formed by intersection
- **Relationship:** Congruent (equal)
- **Example:** ∠1 and ∠3 (at same intersection point)

---

**Document Status:** Draft for Review  
**Next Steps:** Design mockups, technical feasibility assessment, pilot testing with focus group