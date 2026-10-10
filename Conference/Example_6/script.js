/**
 * Parallel Lines & Transversals Practice Tool
 * Main Script (Iteration 3)
 */

// --- Constants & Config ---
const ANGLE_TYPES = {
    'corresponding': { congruent: true, supplementary: false, label: 'Corresponding' },
    'alternate-interior': { congruent: true, supplementary: false, label: 'Alternate Interior' },
    'alternate-exterior': { congruent: true, supplementary: false, label: 'Alternate Exterior' },
    'consecutive-interior': { congruent: false, supplementary: true, label: 'Consecutive Interior' },
    'vertical': { congruent: true, supplementary: false, label: 'Vertical' }
};

const POINTS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
// const PROBLEM_SEQUENCE = [1, 1, 2, 2, 3, 3]; // Normal 6-problem sequence
const PROBLEM_SEQUENCE = [1, 2, 3]; // Testing 3-problem sequence (one per level)

// --- Helper Functions ---
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }

// --- Classes ---

class ProblemGenerator {
    static generate(level) {
        const typeKeys = Object.keys(ANGLE_TYPES);
        const type = randomItem(typeKeys);
        const props = ANGLE_TYPES[type];

        let angle1 = randomInt(9, 27) * 5;
        if (angle1 < 45) angle1 = 45;
        if (angle1 > 135) angle1 = 135;

        let angle2 = props.congruent ? angle1 : (180 - angle1);

        let expr1, expr2, solution, variable = Math.random() > 0.5 ? 'x' : 'y';
        let val1_display, val2_display;
        let valid = false;
        let attempts = 0;

        while (!valid && attempts < 100) {
            attempts++;
            try {
                if (level === 1) {
                    if (props.congruent) {
                        solution = angle1;
                    } else {
                        solution = 180 - angle1;
                    }
                    val1_display = `${angle1}`;
                    val2_display = variable;

                } else if (level === 2) {
                    const a = randomInt(2, 5);
                    const b = randomInt(-20, 20) * 5;
                    const targetX = randomInt(5, 50);
                    const calculatedAngle = a * targetX + b;

                    if (calculatedAngle < 45 || calculatedAngle > 135) continue;

                    angle1 = calculatedAngle;
                    expr1 = `${a}${variable} ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`;

                    if (props.congruent) {
                        angle2 = angle1;
                        val1_display = expr1;
                        val2_display = `${angle2}`;
                        solution = targetX;
                    } else {
                        angle2 = 180 - angle1;
                        val1_display = expr1;
                        val2_display = `${angle2}`;
                        solution = targetX;
                    }

                } else if (level === 3) {
                    const targetX = randomInt(5, 40);
                    const a = randomInt(2, 6);
                    const b = randomInt(-40, 40);
                    angle1 = a * targetX + b;

                    if (angle1 < 45 || angle1 > 135) continue;

                    if (props.congruent) {
                        const c = randomInt(1, a - 1 || a + 2);
                        if (c === a) continue;
                        const d = angle1 - c * targetX;

                        expr1 = `${a}${variable} ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`;
                        expr2 = `${c}${variable} ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`;

                        val1_display = expr1;
                        val2_display = expr2;
                        solution = targetX;

                    } else {
                        angle2 = 180 - angle1;
                        const c = randomInt(1, 5);
                        const d = angle2 - c * targetX;

                        expr1 = `${a}${variable} ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`;
                        expr2 = `${c}${variable} ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`;

                        val1_display = expr1;
                        val2_display = expr2;
                        solution = targetX;
                    }
                }
                valid = true;
            } catch (e) { valid = false; }
        }

        const pairs = {
            'corresponding': [[1, 5], [2, 6], [3, 7], [4, 8]],
            'alternate-interior': [[3, 5], [4, 6]],
            'alternate-exterior': [[1, 7], [2, 8]],
            'consecutive-interior': [[3, 6], [4, 5]],
            'vertical': [[1, 3], [2, 4], [5, 7], [6, 8]]
        };

        const pairIndexes = randomItem(pairs[type]);
        const shuffledLabels = shuffle([...POINTS]);
        const pointMap = {
            'T_Top': shuffledLabels[0], 'T_Bot': shuffledLabels[1],
            'I1': shuffledLabels[2], 'I2': shuffledLabels[3],
            'L1_Left': shuffledLabels[4], 'L1_Right': shuffledLabels[5],
            'L2_Left': shuffledLabels[6], 'L2_Right': shuffledLabels[7]
        };

        const getAnglePoints = (pos) => {
            const m = pointMap;
            switch (pos) {
                case 1: return [m.T_Top, m.I1, m.L1_Left];
                case 2: return [m.T_Top, m.I1, m.L1_Right];
                case 3: return [m.L1_Right, m.I1, m.I2];
                case 4: return [m.L1_Left, m.I1, m.I2];
                case 5: return [m.I1, m.I2, m.L2_Left];
                case 6: return [m.I1, m.I2, m.L2_Right];
                case 7: return [m.L2_Right, m.I2, m.T_Bot];
                case 8: return [m.L2_Left, m.I2, m.T_Bot];
            }
        };

        const bluePos = pairIndexes[0];
        const redPos = pairIndexes[1];

        return {
            level, type, props, solution, variable,
            val1_display, val2_display,
            blue: { points: getAnglePoints(bluePos), pos: bluePos },
            red: { points: getAnglePoints(redPos), pos: redPos },
            pointMap,
            trueAngle: angle1
        };
    }
}

class UIManager {
    constructor() {
        this.svg = document.getElementById('geometryDiagram');
        this.activePoint = null;
    }

    renderDiagram(problem) {
        this.svg.innerHTML = '';
        const m = problem.pointMap;

        // --- Dynamic Calculation ---
        const H = 200; // Vertical distance between lines (150 to 350)
        const CX = 250; // Center X

        let theta;
        // If blue pos is Odd (1,3,5,7), it visually represents 'theta'
        // If blue pos is Even (2,4,6,8), it visually represents '180 - theta'
        // We want the visual angle to match problem.trueAngle
        if (problem.blue.pos % 2 !== 0) {
            theta = problem.trueAngle;
        } else {
            theta = 180 - problem.trueAngle;
        }

        const thetaRad = theta * Math.PI / 180;
        // dx = H / tan(theta)
        // Note: In SVG, Y is down. 
        // If theta < 90, we want line to go Right (dx > 0). tan(theta) > 0. Correct.
        // If theta > 90, we want line to go Left (dx < 0). tan(theta) < 0. Correct.

        let dx = H / Math.tan(thetaRad);

        // Clamp dx to avoid extreme lines going off screen
        // Valid X range approx 50 to 450. 
        // I1_x = 250 - dx/2. I2_x = 250 + dx/2.
        // If dx is 400 => 50, 450. 
        if (Math.abs(dx) > 400) dx = 400 * Math.sign(dx);

        const i1x = CX - dx / 2;
        const i2x = CX + dx / 2;

        // Extrapolate for Tops/Bottoms
        // Vector is (dx, H). 
        // T_Top is from I1, going backward (-dx, -H). But purely visual, let's just go -0.5 * vector
        // T_Bot is from I2, going forward.

        const coords = {
            [m.L1_Left]: { x: 50, y: 150 }, [m.L1_Right]: { x: 450, y: 150 },
            [m.L2_Left]: { x: 50, y: 350 }, [m.L2_Right]: { x: 450, y: 350 },
            [m.I1]: { x: i1x, y: 150 }, [m.I2]: { x: i2x, y: 350 },
            [m.T_Top]: { x: i1x - dx * 0.5, y: 50 }, [m.T_Bot]: { x: i2x + dx * 0.5, y: 450 }
        };

        this.line(m.L1_Left, m.L1_Right, coords);
        this.line(m.L2_Left, m.L2_Right, coords);
        this.line(m.T_Top, m.T_Bot, coords);

        // Store current theta for drawArc
        this.currentTheta = theta;

        this.drawArc(problem.blue.pos, coords, '#3b82f6', problem.val1_display);
        this.drawArc(problem.red.pos, coords, '#f43f5e', problem.val2_display);

        Object.keys(coords).forEach(pLabel => {
            const c = coords[pLabel];
            this.point(c.x, c.y, pLabel);
        });

        const levelTitles = ["Value & Variable", "Expression & Value", "Two Expressions"];
        const badge = document.getElementById('levelBadge');
        badge.textContent = `Level ${problem.level}: ${levelTitles[problem.level - 1]}`;
    }

    line(p1, p2, coords) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute('x1', coords[p1].x); line.setAttribute('y1', coords[p1].y);
        line.setAttribute('x2', coords[p2].x); line.setAttribute('y2', coords[p2].y);
        line.setAttribute('stroke', '#1e293b'); line.setAttribute('stroke-width', '3');
        this.svg.appendChild(line);
    }

    point(x, y, label) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circle.setAttribute('cx', x); circle.setAttribute('cy', y);
        circle.setAttribute('r', '6'); circle.setAttribute('fill', '#1e293b');

        const text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        text.setAttribute('x', x + 10); text.setAttribute('y', y - 10);
        text.setAttribute('font-family', 'Inter, sans-serif'); text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-size', '16'); text.textContent = label;

        g.appendChild(circle); g.appendChild(text); this.svg.appendChild(g);
    }

    drawArc(pos, coords, color, label) {
        let cx, cy;
        if (pos <= 4) {
            // Points 1-4 are around intersection I1 (Top Line)
            const I1_coords = Object.values(coords).filter(c => Math.abs(c.y - 150) < 1).sort((a, b) => a.x - b.x)[1];
            cx = I1_coords.x;
            cy = I1_coords.y;
        } else {
            // Points 5-8 are around intersection I2 (Bottom Line)
            const I2_coords = Object.values(coords).filter(c => Math.abs(c.y - 350) < 1).sort((a, b) => a.x - b.x)[1];
            cx = I2_coords.x;
            cy = I2_coords.y;
        }

        let a1, a2;
        const theta = this.currentTheta;
        const T_DOWN = theta;
        const T_UP = 180 + theta;

        switch (pos) {
            case 1: a1 = 180; a2 = T_UP; break;
            case 2: a1 = T_UP; a2 = 360; break;
            case 3: a1 = 0; a2 = T_DOWN; break;
            case 4: a1 = T_DOWN; a2 = 180; break;
            case 5: a1 = 180; a2 = T_UP; break;
            case 6: a1 = T_UP; a2 = 360; break;
            case 7: a1 = 0; a2 = T_DOWN; break;
            case 8: a1 = T_DOWN; a2 = 180; break;
        }

        const r = 40;
        const rad1 = a1 * Math.PI / 180;
        const rad2 = a2 * Math.PI / 180;
        const x1 = cx + r * Math.cos(rad1);
        const y1 = cy + r * Math.sin(rad1);
        const x2 = cx + r * Math.cos(rad2);
        const y2 = cy + r * Math.sin(rad2);

        // Angle direction fix: SVG sweep flag 1 is clockwise.
        // 0 -> T_DOWN (e.g. 60). Clockwise. Correct.
        // T_UP (240) -> 360. Clockwise. Correct.
        // 180 -> T_UP (240). Clockwise. Correct.
        // T_DOWN(60) -> 180. Clockwise. Correct.

        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
        const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', color);
        path.setAttribute('fill-opacity', '0.2');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2');
        this.svg.appendChild(path);

        const midRad = (rad1 + rad2) / 2;
        const tr = r + 30;
        const tx = cx + tr * Math.cos(midRad);
        const ty = cy + tr * Math.sin(midRad);

        const text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        text.setAttribute('x', tx); text.setAttribute('y', ty);
        text.setAttribute('fill', color); text.setAttribute('font-weight', 'bold');
        text.setAttribute('text-anchor', 'middle'); text.setAttribute('dominant-baseline', 'middle');
        text.textContent = label;
        this.svg.appendChild(text);
    }

    fillPointBank(points) {
        const bank = document.getElementById('pointBank');
        bank.innerHTML = '';
        points.forEach(p => {
            const chip = document.createElement('div');
            chip.className = 'point-chip';
            chip.textContent = p;
            chip.dataset.point = p;

            chip.addEventListener('click', () => {
                // Deselect others
                bank.querySelectorAll('.point-chip').forEach(c => c.classList.remove('selected'));

                if (this.activePoint === p) {
                    this.activePoint = null;
                } else {
                    chip.classList.add('selected');
                    this.activePoint = p;
                }
            });
            bank.appendChild(chip);
        });
        this.activePoint = null;
    }

    setupDropZones(onPointPlaced) {
        const zones = document.querySelectorAll('.drop-zone');
        zones.forEach(oldZone => {
            // Clone and replace to strip old event listeners
            const zone = oldZone.cloneNode(true);
            oldZone.replaceWith(zone);

            zone.textContent = '';
            zone.className = `drop-zone ${zone.dataset.target}`;

            zone.addEventListener('click', () => {
                if (this.activePoint) {
                    const existing = zone.textContent;

                    zone.textContent = this.activePoint;
                    zone.classList.add('filled');
                    this.activePoint = null;
                    document.querySelectorAll('.point-chip').forEach(c => c.classList.remove('selected'));
                    onPointPlaced();
                } else if (zone.classList.contains('filled')) {
                    zone.textContent = '';
                    zone.classList.remove('filled');
                    onPointPlaced();
                }
            });
        });
    }

    // usePoint and unusePoint were removed as they are no longer needed.

    lockStage(id, locked) {
        const stage = document.getElementById(id);
        if (locked) {
            stage.classList.add('locked');
            stage.classList.remove('completed', 'active');
            if (id === 'stage3') {
                document.getElementById('graspableHelpBtn').disabled = true;
            }
        } else {
            stage.classList.remove('locked', 'completed');
            stage.classList.add('active');
            if (id === 'stage3') {
                document.getElementById('graspableHelpBtn').disabled = false;
            }
        }
    }

    completeStage(id) {
        const stage = document.getElementById(id);
        stage.classList.add('completed');
        stage.classList.remove('active');
    }

    setFeedback(id, msg, type) {
        const el = document.getElementById(`feedback${id}`);
        el.textContent = msg;
        el.className = `feedback-msg text-${type}`;
    }
}

class GMathManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.canvas = null;
        this.isInitialized = false;
        this.loadRetries = 0;
    }

    init() {
        this.checkAndLoad();
    }

    checkAndLoad() {
        if (typeof loadGM !== 'undefined') {
            console.log("GM script found, initializing...");
            loadGM(() => this.setupCanvas(), { version: '2.24.11' });
        } else {
            console.warn("Graspable Math script not found. Waiting...");
            if (this.loadRetries < 5) {
                this.loadRetries++;
                // Retry every 1 second
                setTimeout(() => this.checkAndLoad(), 1000);
            } else {
                console.error("Graspable Math script failed to load after retries.");
                this.displayError();
            }
        }
    }

    displayError() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = `
                <div style="padding: 2rem; color: #ef4444; text-align: center;">
                    <h3>Equation Solver Unavailable</h3>
                    <p>Could not load the math engine. Please check your internet connection.</p>
                </div>`;
        }
    }

    setupCanvas() {
        // Clear placeholder content
        const container = document.getElementById(this.containerId);
        if (container) container.innerHTML = '';

        const options = {
            // Minimalist View Options
            formula_panel: false,
            insert_btn: false,
            new_sheet_btn: false,
            load_btn: false,
            save_btn: false,
            settings_btn: false,
            help_btn: false,
            draw_btn: false,

            // Helpful Tools for Solving
            transform_btn: true,
            scrub_btn: true,
            keypad_btn: true,
            undo_btn: true,
            redo_btn: true,

            // Scrolling
            vertical_scroll: true,
            horizontal_scroll: true,
            use_toolbar: true
        };

        this.canvas = new gmath.Canvas('#' + this.containerId, options);
        this.isInitialized = true;
    }

    loadEquation(equation) {
        if (!this.canvas) {
            if (this.isInitialized) {
                // Should be ready, but maybe canvas failed?
                return;
            }
            console.warn("GM Canvas not ready yet. Queuing load...");
            // Retry once
            setTimeout(() => {
                if (this.canvas) this.loadEquation(equation);
            }, 1000);
            return;
        }

        this.canvas.model.reset();
        this.canvas.model.createElement('derivation', {
            eq: equation,
            pos: { x: 'center', y: 100 },
            font_size: 40
        });
    }
}

class GameManager {
    constructor() {
        this.user = { firstName: '', lastInitial: '', sessionStart: new Date() };
        this.problemIndex = 0;
        this.problem = null;
        this.totalScore = 0;
        this.problemHistory = [];
        this.ui = new UIManager();
        this.gm = new GMathManager('graspableContainer'); // Init GM Manager
        this.stats = {
            naming: 0,
            relation: 0,
            solve: 0,
            l1: 0,
            l2: 0,
            l3: 0
        };
        this.currentProblemStats = { naming: 0, relation: 0, solve: 0 };
        this.problemStartTime = 0; // Timer start
        this.helpUsed = false; // Track help usage
        this.init();
    }

    init() {
        // Initialize Graspable Math
        this.gm.init();

        document.getElementById('checkStage1Btn').addEventListener('click', () => this.checkStage1());
        document.getElementById('checkStage2Btn').addEventListener('click', () => this.checkStage2());
        document.getElementById('checkStage3Btn').addEventListener('click', () => this.checkStage3());
        document.getElementById('nextProblemBtn').addEventListener('click', () => this.nextProblem());
        document.getElementById('downloadReportBtn').addEventListener('click', () => this.downloadReport());

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.parentElement;
                parent.querySelectorAll('.option-btn').forEach(b => {
                    b.classList.remove('selected', 'incorrect');
                });
                btn.classList.add('selected');

                const typeSel = document.querySelector('#typeOptions .selected');
                const relSel = document.querySelector('#relationOptions .selected');
                document.getElementById('checkStage2Btn').disabled = !(typeSel && relSel);
            });
        });

        const input = document.getElementById('solutionInput');
        input.addEventListener('input', () => {
            document.getElementById('checkStage3Btn').disabled = input.value === '';
        });
        input.onkeydown = (e) => {
            if (e.key === 'Enter' && input.value !== '') this.checkStage3();
        };

        const helpBtn = document.getElementById('graspableHelpBtn');
        const helpModal = document.getElementById('graspableHelpModal');
        const closeHelpBtn = document.getElementById('closeGraspableBtn');

        helpBtn.addEventListener('click', () => {
            this.helpUsed = true; // Mark help as used
            helpModal.classList.add('active');

            // Construct Equation based on problem props
            const p = this.problem;
            let eqString = '';

            if (p.props.congruent) {
                // val1 = val2
                eqString = `${p.val1_display} = ${p.val2_display}`;
            } else {
                // val1 + val2 = 180
                eqString = `${p.val1_display} + ${p.val2_display} = 180`;
            }

            this.gm.loadEquation(eqString);
        });

        closeHelpBtn.addEventListener('click', () => {
            helpModal.classList.remove('active');
        });

        this.setupLogin();
    }

    setupLogin() {
        const modal = document.getElementById('loginModal');
        modal.classList.add('active');
        const fName = document.getElementById('firstName');
        const lInit = document.getElementById('lastInitial');
        const btn = document.getElementById('beginBtn');
        const form = document.getElementById('loginForm');

        const validate = () => {
            btn.disabled = !(fName.value.length >= 2 && lInit.value.length === 1 && /[a-zA-Z]/.test(lInit.value));
        };
        fName.addEventListener('input', validate);
        lInit.addEventListener('input', validate);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.user.firstName = fName.value;
            this.user.lastInitial = lInit.value.toUpperCase();
            modal.classList.remove('active');
            this.startSequence();
        });
    }

    startSequence() {
        this.problemIndex = 0;
        this.totalScore = 0;
        this.updateScoreUI();
        this.loadProblem();
    }

    loadProblem() {
        if (this.problemIndex >= PROBLEM_SEQUENCE.length) {
            this.showCompletion();
            return;
        }

        this.attempts = { blue: 0, red: 0, type: 0, rel: 0, solve: 0 };
        this.currentProblemStats = { naming: 0, relation: 0, solve: 0 };
        const level = PROBLEM_SEQUENCE[this.problemIndex];
        this.problem = ProblemGenerator.generate(level);
        this.problemStartTime = Date.now(); // Start timer
        this.helpUsed = false; // Reset help tracker

        this.ui.renderDiagram(this.problem);
        this.ui.fillPointBank(POINTS);
        this.ui.setupDropZones(() => { });

        this.ui.lockStage('stage1', false);
        this.ui.lockStage('stage2', true);
        this.ui.lockStage('stage3', true);

        document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('correct', 'incorrect'));
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected', 'correct', 'incorrect'));
        document.getElementById('checkStage2Btn').disabled = true;
        document.getElementById('checkStage3Btn').disabled = true;

        const input = document.getElementById('solutionInput');
        input.value = '';
        input.classList.remove('correct', 'incorrect');
        input.disabled = false;

        ['1', '2', '3'].forEach(id => {
            document.getElementById(`feedback${id}`).textContent = '';
            document.getElementById(`feedback${id}`).className = 'feedback-msg';
        });

        document.getElementById('variableLabel').textContent = `${this.problem.variable} = `;

        // Update Stage 2 Relationship Labels
        const relButtons = document.querySelectorAll('#relationOptions .option-btn');
        const expr1 = this.problem.val1_display;
        const expr2 = this.problem.val2_display;

        relButtons.forEach(btn => {
            if (btn.dataset.value === 'congruent') {
                btn.textContent = `Congruent (≅): ${expr1} = ${expr2}`;
            } else if (btn.dataset.value === 'supplementary') {
                btn.textContent = `Supplementary: ${expr1} + ${expr2} = 180°`;
            }
        });
    }

    checkStage1() {
        const blueZones = document.querySelectorAll('.drop-zone.blue');
        const redZones = document.querySelectorAll('.drop-zone.red');
        const blueInput = Array.from(blueZones).map(z => z.textContent);
        const redInput = Array.from(redZones).map(z => z.textContent);

        if (blueInput.includes('') || redInput.includes('')) {
            this.ui.setFeedback(1, "Please fill all points.", 'error');
            return;
        }

        const checkAngle = (input, correct) => {
            if (input[1] !== correct[1]) return false;
            const others = [input[0], input[2]];
            return others.includes(correct[0]) && others.includes(correct[2]);
        };

        if (document.getElementById('stage1').classList.contains('completed')) return;

        const blueCorrect = checkAngle(blueInput, this.problem.blue.points);
        const redCorrect = checkAngle(redInput, this.problem.red.points);

        let blueAwarded = false, redAwarded = false;

        // Handle Blue
        if (blueZones[0].classList.contains('correct')) {
            blueAwarded = true;
        } else if (blueCorrect) {
            this.awardPoints('naming', this.attempts.blue);
            blueZones.forEach(z => { z.classList.remove('incorrect'); z.classList.add('correct'); });
            blueAwarded = true;
        } else {
            this.attempts.blue++;
            if (this.attempts.blue >= 4) {
                this.forceCorrectAngle('blue');
                blueAwarded = true;
            } else {
                blueZones.forEach(z => { z.classList.remove('correct'); z.classList.add('incorrect'); });
            }
        }

        // Handle Red
        if (redZones[0].classList.contains('correct')) {
            redAwarded = true;
        } else if (redCorrect) {
            this.awardPoints('naming', this.attempts.red);
            redZones.forEach(z => { z.classList.remove('incorrect'); z.classList.add('correct'); });
            redAwarded = true;
        } else {
            this.attempts.red++;
            if (this.attempts.red >= 4) {
                this.forceCorrectAngle('red');
                redAwarded = true;
            } else {
                redZones.forEach(z => { z.classList.remove('correct'); z.classList.add('incorrect'); });
            }
        }

        if (blueAwarded && redAwarded) {
            this.ui.setFeedback(1, "Correct!", 'success');
            this.ui.completeStage('stage1');
            this.ui.lockStage('stage2', false);
        } else {
            this.ui.setFeedback(1, "Keep trying! (Check middle letters)", 'error');
        }
    }

    forceCorrectAngle(color) {
        const correctPoints = color === 'blue' ? this.problem.blue.points : this.problem.red.points;
        const zones = document.querySelectorAll(`.drop-zone.${color}`);
        zones.forEach((z, i) => {
            z.textContent = correctPoints[i];
            z.classList.remove('incorrect');
            z.classList.add('correct');
        });
        this.ui.setFeedback(1, "Auto-filled after 4 tries (0 pts).", 'warning');
    }

    checkStage2() {
        const typeBtn = document.querySelector('#typeOptions .selected');
        const relBtn = document.querySelector('#relationOptions .selected');
        const typeVal = typeBtn.dataset.value;
        const relVal = relBtn.dataset.value;
        const correctType = this.problem.type;
        const correctRel = this.problem.props.congruent ? 'congruent' : 'supplementary';
        const isTypeCorrect = typeVal === correctType;
        const isRelCorrect = relVal === correctRel;

        let typeDone = false, relDone = false;

        // Type
        if (document.querySelector('#typeOptions .correct')) {
            typeDone = true;
        } else if (isTypeCorrect) {
            this.awardPoints('relation', this.attempts.type);
            typeBtn.classList.add('correct');
            typeDone = true;
        } else {
            this.attempts.type++;
            if (this.attempts.type >= 4) {
                this.forceCorrectOption('type', correctType);
                typeDone = true;
            } else {
                typeBtn.classList.add('incorrect');
            }
        }

        // Rel
        if (document.querySelector('#relationOptions .correct')) {
            relDone = true;
        } else if (isRelCorrect) {
            this.awardPoints('relation', this.attempts.rel);
            relBtn.classList.add('correct');
            relDone = true;
        } else {
            this.attempts.rel++;
            if (this.attempts.rel >= 4) {
                this.forceCorrectOption('relation', correctRel);
                relDone = true;
            } else {
                relBtn.classList.add('incorrect');
            }
        }

        if (typeDone && relDone) {
            this.ui.setFeedback(2, "Correct!", 'success');
            this.ui.completeStage('stage2');
            this.ui.lockStage('stage3', false);
            setTimeout(() => document.getElementById('solutionInput').focus(), 100);
        } else {
            this.ui.setFeedback(2, "Select again.", 'error');
        }
    }

    forceCorrectOption(group, correctValue) {
        const options = document.querySelectorAll(`#${group}Options .option-btn`);
        options.forEach(b => {
            b.classList.remove('selected', 'incorrect');
            if (b.dataset.value === correctValue) b.classList.add('correct');
        });
        this.ui.setFeedback(2, "Auto-filled after 4 tries (0 pts).", 'warning');
    }

    checkStage3() {
        const input = document.getElementById('solutionInput');
        const userVal = parseFloat(input.value);
        const correctVal = this.problem.solution;
        const diff = Math.abs(userVal - correctVal);
        const isCorrect = diff <= 1;

        if (isCorrect) {
            this.awardPoints('solve', this.attempts.solve);
            input.classList.add('correct');
            input.disabled = true;
            this.ui.setFeedback(3, `Correct! ${this.problem.variable} = ${this.problem.solution}°`, 'success');
            this.ui.completeStage('stage3');

            // Calculate duration
            const duration = Math.round((Date.now() - this.problemStartTime) / 1000);

            this.problemHistory.push({
                level: this.problem.level,
                totalScore: this.totalScore,
                breakdown: { ...this.currentProblemStats },
                duration: duration,
                helpUsed: this.helpUsed ? 'YES' : 'NO'
            });
            document.getElementById('checkStage3Btn').disabled = true;
            setTimeout(() => this.showProblemSummary(), 1000);
        } else {
            this.attempts.solve++;
            if (this.attempts.solve >= 4) {
                input.value = this.problem.solution;
                input.classList.add('correct');
                input.disabled = true;
                this.ui.setFeedback(3, `Auto-filled: ${this.problem.solution}° (0 pts)`, 'warning');
                this.ui.completeStage('stage3');

                // Calculate duration
                const duration = Math.round((Date.now() - this.problemStartTime) / 1000);

                this.problemHistory.push({
                    level: this.problem.level,
                    totalScore: this.totalScore,
                    breakdown: { ...this.currentProblemStats },
                    duration: duration,
                    helpUsed: this.helpUsed ? 'YES' : 'NO'
                });
                setTimeout(() => this.showProblemSummary(), 1500);
            } else {
                input.classList.add('incorrect');
                this.ui.setFeedback(3, "Incorrect calculation.", 'error');
                input.onfocus = () => input.classList.remove('incorrect');
            }
        }
    }

    awardPoints(mode, attempts) {
        let pts = 0;
        if (mode === 'naming' || mode === 'relation') {
            if (attempts === 0) pts = 3;
            else if (attempts === 1) pts = 2;
            else pts = 0;
            this.stats[mode] += pts;
        } else if (mode === 'solve') {
            if (attempts === 0) pts = 5;
            else if (attempts === 1) pts = 3;
            else if (attempts < 4) pts = 1;
            else pts = 0;
            this.stats.solve += pts;
        }

        const levelKey = `l${this.problem.level}`;
        this.stats[levelKey] += pts;

        this.totalScore += pts;
        this.currentProblemStats[mode] += pts;
        this.updateScoreUI();
    }

    showProblemSummary() {
        // Calculate points earned this level
        const currentTotal = this.totalScore;
        const previousTotal = this.problemIndex > 0 ? this.problemHistory[this.problemHistory.length - 2]?.totalScore || 0 : 0;

        const gained = this.problemHistory.length > 0 ? (currentTotal - previousTotal) : currentTotal;
        const totalProblems = PROBLEM_SEQUENCE.length;

        document.getElementById('problemSummaryText').textContent = `Problem ${this.problemIndex + 1} of ${totalProblems} Complete!`;
        document.getElementById('interimScore').textContent = currentTotal;
        document.getElementById('levelSummary').textContent = `Points Earned: +${gained}`;

        const breakdown = this.currentProblemStats;
        document.getElementById('problemBreakdown').textContent =
            `Points Earned: Identify Angles ${breakdown.naming}/6, Relationship ${breakdown.relation}/6, Solve for Variable ${breakdown.solve}/5`;

        document.getElementById('problemCompleteModal').classList.add('active');
    }

    nextProblem() {
        document.getElementById('problemCompleteModal').classList.remove('active');
        this.problemIndex++;
        this.loadProblem();
    }

    updateScoreUI() {
        document.getElementById('currentScore').textContent = this.totalScore;
    }

    showCompletion() {
        document.getElementById('finalScore').textContent = this.totalScore;
        const modal = document.getElementById('completionModal');
        modal.classList.add('active');
    }

    downloadReport() {
        const getPct = (score, max) => max === 0 ? 0 : Math.round((score / max) * 100);

        // Dynamic Totals Calculation
        const totalProblems = PROBLEM_SEQUENCE.length;
        const maxScorePerProblem = 17; // 6 (Naming) + 6 (Relation) + 5 (Solve)
        const maxTotal = totalProblems * maxScorePerProblem;

        // Calculate max points per category
        const maxNaming = totalProblems * 6;
        const maxRelation = totalProblems * 6;
        const maxSolve = totalProblems * 5;

        // Calculate max points per level
        const levelCounts = { 1: 0, 2: 0, 3: 0 };
        PROBLEM_SEQUENCE.forEach(lvl => {
            if (levelCounts[lvl] !== undefined) levelCounts[lvl]++;
        });
        const maxL1 = levelCounts[1] * 17;
        const maxL2 = levelCounts[2] * 17;
        const maxL3 = levelCounts[3] * 17;

        let reportText = `
PARALLEL LINES & TRANSVERSALS REPORT
------------------------------------
Student: ${this.user.firstName} ${this.user.lastInitial}
Date: ${new Date().toLocaleDateString()}
Total Points: ${this.totalScore} / ${maxTotal} (${getPct(this.totalScore, maxTotal)}%)

PER-PROBLEM BREAKDOWN
------------------------------------
`;

        this.problemHistory.forEach((item, index) => {
            const b = item.breakdown;
            const pTotal = b.naming + b.relation + b.solve;
            reportText += `Problem ${index + 1} (Level ${item.level}):\n`;
            reportText += `  - Time:             ${item.duration}s\n`;
            reportText += `  - Equation Help:    ${item.helpUsed}\n`;
            reportText += `  - Identify Angles:      ${b.naming} / 6\n`;
            reportText += `  - Relationship ID:      ${b.relation} / 6\n`;
            reportText += `  - Variable Solving:     ${b.solve} / 5\n`;
            reportText += `  - Problem Total:        ${pTotal} / 17\n\n`;
        });

        reportText += `
DETAILED BREAKDOWN BY CATEGORY
------------------------------------
1. Angle Naming:      ${this.stats.naming} / ${maxNaming} (${getPct(this.stats.naming, maxNaming)}%)
2. Relationship ID:   ${this.stats.relation} / ${maxRelation} (${getPct(this.stats.relation, maxRelation)}%)
3. Variable Solving:  ${this.stats.solve} / ${maxSolve} (${getPct(this.stats.solve, maxSolve)}%)

DETAILED BREAKDOWN BY LEVEL
------------------------------------
Level 1 (Basic/Vars): ${this.stats.l1} / ${maxL1} (${getPct(this.stats.l1, maxL1)}%)
Level 2 (Expr/Value): ${this.stats.l2} / ${maxL2} (${getPct(this.stats.l2, maxL2)}%)
Level 3 (Two Exprs):  ${this.stats.l3} / ${maxL3} (${getPct(this.stats.l3, maxL3)}%)

------------------------------------
Session Status: Completed all ${totalProblems} problems.
`;
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Transversals_Report_${this.user.firstName}${this.user.lastInitial}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
const game = new GameManager();
