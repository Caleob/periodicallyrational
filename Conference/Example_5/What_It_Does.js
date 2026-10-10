/**
 * Rotate & Relate - Pure Vanilla JS Geometry & Rotation Engine
 * Zero dependencies. Clean HTML/CSS/JS.
 */

(function () {
  'use strict';

  // --- Configuration & Constants ---
  const CANVAS_W = 600;
  const CANVAS_H = 420;
  const CENTER_X = CANVAS_W / 2;
  const CENTER_Y = CANVAS_H / 2;

  const LEAD_COLORS = [
    { name: 'Red', hex: '#ef4444', class: 'color-red', wireClass: 'wire-red' },
    { name: 'Blue', hex: '#3b82f6', class: 'color-blue', wireClass: 'wire-blue' },
    { name: 'Yellow', hex: '#eab308', class: 'color-yellow', wireClass: 'wire-yellow' }
  ];

  // --- Geometry Generator ---
  function generateGeometry() {
    // Generate distinct acute angle between 22 and 38 degrees
    const thetaDeg = 24 + Math.random() * 14;
    const theta = (thetaDeg * Math.PI) / 180;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    // Three base choices to vary orientation
    const baseChoices = ['hypotenuse', 'long_leg', 'short_leg'];
    const baseChoice = baseChoices[Math.floor(Math.random() * baseChoices.length)];
    const isFlipped = Math.random() > 0.5;

    let rawA, rawB, rawC, rawX;
    // Standard notation:
    // C is right angle (90 deg).
    // A has angle theta (smaller acute angle).
    // B has angle 90 - theta (larger acute angle).
    // X is foot of altitude on hypotenuse AB.
    if (baseChoice === 'hypotenuse') {
      rawA = { x: 0, y: 0 };
      rawB = { x: 1, y: 0 };
      rawC = { x: cos * cos, y: -sin * cos };
      rawX = { x: cos * cos, y: 0 };
    } else if (baseChoice === 'long_leg') {
      // Long leg AC along horizontal
      rawA = { x: 0, y: 0 };
      rawC = { x: cos, y: 0 };
      rawB = { x: cos, y: -sin };
      rawX = { x: Math.pow(cos, 3), y: -sin * cos * cos };
    } else {
      // Short leg BC along horizontal
      rawB = { x: 0, y: 0 };
      rawC = { x: sin, y: 0 };
      rawA = { x: sin, y: -cos };
      rawX = { x: Math.pow(sin, 3), y: -cos * sin * sin };
    }

    const rawPts = [rawA, rawB, rawC, rawX];
    const minX = Math.min(...rawPts.map(p => p.x));
    const maxX = Math.max(...rawPts.map(p => p.x));
    const minY = Math.min(...rawPts.map(p => p.y));
    const maxY = Math.max(...rawPts.map(p => p.y));

    const drawW = CANVAS_W - 140;
    const drawH = CANVAS_H - 120;
    const scale = Math.min(drawW / (maxX - minX), drawH / (maxY - minY));

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const scalePoint = p => ({
      x: (isFlipped ? -(p.x - cx) : p.x - cx) * scale + CENTER_X,
      y: (p.y - cy) * scale + CENTER_Y
    });

    const A = scalePoint(rawA);
    const B = scalePoint(rawB);
    const C = scalePoint(rawC);
    const X = scalePoint(rawX);

    // Centroid of main triangle ABC
    const tCentroid = {
      x: (A.x + B.x + C.x) / 3,
      y: (A.y + B.y + C.y) / 3
    };

    // Calculate non-overlapping label offsets
    function getVertexLabelPos(pt, dist = 26) {
      let vx = pt.x - tCentroid.x;
      let vy = pt.y - tCentroid.y;
      const len = Math.hypot(vx, vy) || 1;
      return { x: pt.x + (vx / len) * dist, y: pt.y + (vy / len) * dist };
    }

    // Foot X label: place outward from segment AB away from C
    const ab_dx = B.x - A.x;
    const ab_dy = B.y - A.y;
    const ab_len = Math.hypot(ab_dx, ab_dy) || 1;
    let normX = -ab_dy / ab_len;
    let normY = ab_dx / ab_len;
    // ensure normal points away from C
    if (normX * (C.x - X.x) + normY * (C.y - X.y) > 0) {
      normX = -normX;
      normY = -normY;
    }
    const labelX = { x: X.x + normX * 24, y: X.y + normY * 24 };

    const labels = {
      A: getVertexLabelPos(A),
      B: getVertexLabelPos(B),
      C: getVertexLabelPos(C),
      X: labelX
    };

    // Triangle Definitions:
    // Angle Order for all triangles: [acute_small (theta), acute_large (90-theta), right_angle (90)]
    const triangles = {
      BIG: {
        id: 'BIG',
        sizeRank: 3,
        name: 'Triangle ABC',
        vertexOrder: ['A', 'B', 'C'], // theta, 90-theta, 90
        pts: { acuteSmall: A, acuteLarge: B, right: C },
        ptNames: { acuteSmall: 'A', acuteLarge: 'B', right: 'C' },
        sides: {
          hypotenuse: { name: 'AB', p1: A, p2: B, p1Name: 'A', p2Name: 'B' },
          long_leg: { name: 'AC', p1: A, p2: C, p1Name: 'A', p2Name: 'C' },
          short_leg: { name: 'BC', p1: B, p2: C, p1Name: 'B', p2Name: 'C' }
        }
      },
      MED: {
        id: 'MED',
        sizeRank: 2,
        name: 'Triangle ACX',
        vertexOrder: ['A', 'C', 'X'], // theta, 90-theta, 90
        pts: { acuteSmall: A, acuteLarge: C, right: X },
        ptNames: { acuteSmall: 'A', acuteLarge: 'C', right: 'X' },
        sides: {
          hypotenuse: { name: 'AC', p1: A, p2: C, p1Name: 'A', p2Name: 'C' },
          long_leg: { name: 'AX', p1: A, p2: X, p1Name: 'A', p2Name: 'X' },
          short_leg: { name: 'CX', p1: C, p2: X, p1Name: 'C', p2Name: 'X' }
        }
      },
      SML: {
        id: 'SML',
        sizeRank: 1,
        name: 'Triangle CBX',
        vertexOrder: ['C', 'B', 'X'], // theta, 90-theta, 90
        pts: { acuteSmall: C, acuteLarge: B, right: X },
        ptNames: { acuteSmall: 'C', acuteLarge: 'B', right: 'X' },
        sides: {
          hypotenuse: { name: 'BC', p1: B, p2: C, p1Name: 'B', p2Name: 'C' },
          long_leg: { name: 'CX', p1: C, p2: X, p1Name: 'C', p2Name: 'X' },
          short_leg: { name: 'BX', p1: B, p2: X, p1Name: 'B', p2Name: 'X' }
        }
      }
    };

    return { A, B, C, X, labels, triangles };
  }

  // Right-angle SVG path generator
  function rightAnglePath(vCorner, vA, vB, size = 15) {
    let ax = vA.x - vCorner.x;
    let ay = vA.y - vCorner.y;
    let aLen = Math.hypot(ax, ay) || 1;
    ax /= aLen;
    ay /= aLen;

    let bx = vB.x - vCorner.x;
    let by = vB.y - vCorner.y;
    let bLen = Math.hypot(bx, by) || 1;
    bx /= bLen;
    by /= bLen;

    const p1 = { x: vCorner.x + ax * size, y: vCorner.y + ay * size };
    const p2 = { x: vCorner.x + (ax + bx) * size, y: vCorner.y + (ay + by) * size };
    const p3 = { x: vCorner.x + bx * size, y: vCorner.y + by * size };

    return `M ${vCorner.x},${vCorner.y} L ${p1.x},${p1.y} L ${p2.x},${p2.y} L ${p3.x},${p3.y} Z`;
  }

  // --- App State ---
  let geom = null;
  let currentProblem = null;
  let activeHighlight = null; // 't1' | 't2' | null
  let selectedT1Socket = null;
  let connections = []; // Array of { t1SideKey, t2SideKey, colorIndex }
  let statementSlots = ['', '', ''];
  let activeSlotIndex = 0;
  let isAnimating = false;
  let animTimer = null;
  let animFrameId = null;

  // Drag state
  let isDragging = false;
  let dragMoved = false;
  let dragStartSide = null;
  let dragStartSource = null; // 't1' | 't2'
  let dragStartPos = null;
  let justDragged = false;
  let justDraggedTimer = null;

  function markJustDragged() {
    justDragged = true;
    if (justDraggedTimer) clearTimeout(justDraggedTimer);
    justDraggedTimer = setTimeout(() => {
      justDragged = false;
      justDraggedTimer = null;
    }, 150);
  }

  // --- DOM Elements ---
  const elBaseLayer = document.getElementById('base-layer');
  const elColorOverlayLayer = document.getElementById('color-overlay-layer');
  const elAnimLayer = document.getElementById('anim-layer');
  const elLabelsLayer = document.getElementById('labels-layer');
  const elSocketsT1 = document.getElementById('sockets-t1');
  const elSocketsT2 = document.getElementById('sockets-t2');
  const elWireSvg = document.getElementById('wire-svg');
  const elBtnHighlightT1 = document.getElementById('btn-highlight-t1');
  const elBtnHighlightT2 = document.getElementById('btn-highlight-t2');
  const elBtnNewProblem = document.getElementById('btn-new-problem');
  const elBtnReset = document.getElementById('btn-reset');
  const elBtnClearLeads = document.getElementById('btn-clear-leads');
  const elBtnVerify = document.getElementById('btn-verify');
  const elT1Statement = document.getElementById('t1-vertex-statement');
  const elSlotsContainer = document.getElementById('slots-container');
  const elBtnClearStatement = document.getElementById('btn-clear-statement');
  const elFeedbackBanner = document.getElementById('feedback-banner');
  const elFeedbackTitle = document.getElementById('feedback-title');
  const elFeedbackDetail = document.getElementById('feedback-detail');
  const elAnimBadge = document.getElementById('anim-stage-badge');
  const elAnimBadgeText = document.getElementById('anim-stage-text');

  // --- Problem Initialization ---
  function initProblem() {
    stopAnimation();
    geom = generateGeometry();

    // Pick two distinct triangles
    const triKeys = ['BIG', 'MED', 'SML'];
    const t1Key = triKeys[Math.floor(Math.random() * 3)];
    let t2Key;
    do {
      t2Key = triKeys[Math.floor(Math.random() * 3)];
    } while (t2Key === t1Key);

    const t1 = geom.triangles[t1Key];
    const t2 = geom.triangles[t2Key];

    // Shuffled list of sides for Triangle 1
    const t1SideList = [
      { role: 'hypotenuse', side: t1.sides.hypotenuse },
      { role: 'long_leg', side: t1.sides.long_leg },
      { role: 'short_leg', side: t1.sides.short_leg }
    ].sort(() => Math.random() - 0.5);

    // Shuffled list of sides for Triangle 2
    const t2SideList = [
      { role: 'hypotenuse', side: t2.sides.hypotenuse },
      { role: 'long_leg', side: t2.sides.long_leg },
      { role: 'short_leg', side: t2.sides.short_leg }
    ].sort(() => Math.random() - 0.5);

    currentProblem = {
      t1Key,
      t2Key,
      t1,
      t2,
      t1SideList,
      t2SideList
    };

    if (isDragging) onPointerCancel();
    connections = [];
    selectedT1Socket = null;
    statementSlots = ['', '', ''];
    activeSlotIndex = 0;
    activeHighlight = null;

    hideFeedback();
    renderBaseGeometry();
    renderSockets();
    renderWires();
    renderStatementUI();
    updateHighlightButtons();
  }

  // --- Base Geometry Rendering ---
  function renderBaseGeometry() {
    elBaseLayer.innerHTML = '';
    elLabelsLayer.innerHTML = '';
    elColorOverlayLayer.innerHTML = '';

    const { A, B, C, X, labels } = geom;

    // Outer Triangle ABC
    const pathOuter = `M ${A.x},${A.y} L ${B.x},${B.y} L ${C.x},${C.y} Z`;
    const elOuter = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    elOuter.setAttribute('d', pathOuter);
    elOuter.setAttribute('fill', 'rgba(96, 165, 250, 0.04)');
    elOuter.setAttribute('stroke', '#60a5fa');
    elOuter.setAttribute('stroke-width', '2.5');
    elOuter.setAttribute('stroke-linejoin', 'round');
    elBaseLayer.appendChild(elOuter);

    // Altitude CX dashed line
    const elAlt = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    elAlt.setAttribute('x1', C.x);
    elAlt.setAttribute('y1', C.y);
    elAlt.setAttribute('x2', X.x);
    elAlt.setAttribute('y2', X.y);
    elAlt.setAttribute('class', 'altitude-line');
    elBaseLayer.appendChild(elAlt);

    // Right-angle indicators at C and X
    const elRightC = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    elRightC.setAttribute('d', rightAnglePath(C, A, B, 16));
    elRightC.setAttribute('class', 'right-angle-box');
    elBaseLayer.appendChild(elRightC);

    const elRightX = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    elRightX.setAttribute('d', rightAnglePath(X, C, A, 14));
    elRightX.setAttribute('class', 'right-angle-box');
    elBaseLayer.appendChild(elRightX);

    // Vertex Labels A, B, C, X
    ['A', 'B', 'C', 'X'].forEach(v => {
      const pos = labels[v];
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', pos.x);
      text.setAttribute('y', pos.y);
      text.setAttribute('class', 'vertex-label');
      text.textContent = v;
      elLabelsLayer.appendChild(text);
    });

    renderTriangleHighlights();
    renderColorOverlays();
  }

  // --- Triangle Highlights ---
  function renderTriangleHighlights() {
    // Remove existing highlights
    const oldH = elBaseLayer.querySelectorAll('.triangle-highlight-layer');
    oldH.forEach(el => el.remove());

    if (!activeHighlight || !currentProblem) return;

    const tri = activeHighlight === 't1' ? currentProblem.t1 : currentProblem.t2;
    const isT1 = activeHighlight === 't1';

    const p = tri.pts;
    const d = `M ${p.acuteSmall.x},${p.acuteSmall.y} L ${p.acuteLarge.x},${p.acuteLarge.y} L ${p.right.x},${p.right.y} Z`;

    const hPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hPath.setAttribute('d', d);
    hPath.setAttribute('class', `triangle-highlight-layer ${isT1 ? 'triangle-highlight-path' : 't2-highlight-path'}`);
    elBaseLayer.appendChild(hPath);
  }

  // --- Color Overlays on Canvas ---
  // When a student connects a pair, both sides light up in that connection's color
  function renderColorOverlays() {
    elColorOverlayLayer.innerHTML = '';
    if (!currentProblem || isAnimating) return;

    connections.forEach(conn => {
      const color = LEAD_COLORS[conn.colorIndex];

      // T1 side
      const t1Item = currentProblem.t1SideList.find(s => s.side.name === conn.t1SideKey);
      if (t1Item) {
        drawLineOverlay(t1Item.side.p1, t1Item.side.p2, color.hex);
      }

      // T2 side
      const t2Item = currentProblem.t2SideList.find(s => s.side.name === conn.t2SideKey);
      if (t2Item) {
        drawLineOverlay(t2Item.side.p1, t2Item.side.p2, color.hex);
      }
    });
  }

  function drawLineOverlay(p1, p2, colorHex) {
    // Outer glow
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    glow.setAttribute('x1', p1.x);
    glow.setAttribute('y1', p1.y);
    glow.setAttribute('x2', p2.x);
    glow.setAttribute('y2', p2.y);
    glow.setAttribute('stroke', colorHex);
    glow.setAttribute('stroke-width', '10');
    glow.setAttribute('stroke-linecap', 'round');
    glow.setAttribute('opacity', '0.35');
    elColorOverlayLayer.appendChild(glow);

    // Inner sharp line
    const core = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    core.setAttribute('x1', p1.x);
    core.setAttribute('y1', p1.y);
    core.setAttribute('x2', p2.x);
    core.setAttribute('y2', p2.y);
    core.setAttribute('stroke', colorHex);
    core.setAttribute('stroke-width', '3.5');
    core.setAttribute('stroke-linecap', 'round');
    elColorOverlayLayer.appendChild(core);
  }

  // --- Sockets / Terminals UI ---
  function renderSockets() {
    elSocketsT1.innerHTML = '';
    elSocketsT2.innerHTML = '';

    // Row 1: Triangle 1 Sides
    currentProblem.t1SideList.forEach(item => {
      const conn = connections.find(c => c.t1SideKey === item.side.name);
      const colorClass = conn ? LEAD_COLORS[conn.colorIndex].class : '';
      const isSelected = selectedT1Socket === item.side.name;

      const div = document.createElement('div');
      div.className = `side-terminal ${colorClass} ${isSelected ? 'selected' : ''}`;
      div.id = `terminal-t1-${item.side.name}`;
      div.dataset.side = item.side.name;

      div.innerHTML = `
        <div class="terminal-chip">
          <span class="overline-text">${item.side.name}</span>
        </div>
        <div class="socket-pin" title="Lead Socket"></div>
      `;

      // Pointerdown for dragging & click for tap/click
      div.addEventListener('pointerdown', e => handlePointerDown(item.side.name, 't1', e));
      div.addEventListener('click', e => handleT1Click(item.side.name, e));
      div.addEventListener('dragstart', e => e.preventDefault());
      elSocketsT1.appendChild(div);
    });

    // Row 2: Triangle 2 Sides
    currentProblem.t2SideList.forEach(item => {
      const conn = connections.find(c => c.t2SideKey === item.side.name);
      const colorClass = conn ? LEAD_COLORS[conn.colorIndex].class : '';

      const div = document.createElement('div');
      div.className = `side-terminal ${colorClass}`;
      div.id = `terminal-t2-${item.side.name}`;
      div.dataset.side = item.side.name;

      div.innerHTML = `
        <div class="socket-pin" title="Lead Socket"></div>
        <div class="terminal-chip">
          <span class="overline-text">${item.side.name}</span>
        </div>
      `;

      div.addEventListener('pointerdown', e => handlePointerDown(item.side.name, 't2', e));
      div.addEventListener('click', e => handleT2Click(item.side.name, e));
      div.addEventListener('dragstart', e => e.preventDefault());
      elSocketsT2.appendChild(div);
    });
  }

  // --- Lead Connection & Drag Support ---
  function attachLead(t1Side, t2Side) {
    if (isAnimating) return;
    if (elAnimLayer.style.display === 'block') {
      stopAnimation();
    }

    // Remove any existing connection using either socket
    connections = connections.filter(c => c.t1SideKey !== t1Side && c.t2SideKey !== t2Side);

    // Assign next available color index (0 = Red, 1 = Blue, 2 = Yellow)
    const usedColors = connections.map(c => c.colorIndex);
    let nextColor = 0;
    while (usedColors.includes(nextColor) && nextColor < 3) {
      nextColor++;
    }

    connections.push({
      t1SideKey: t1Side,
      t2SideKey: t2Side,
      colorIndex: nextColor
    });

    selectedT1Socket = null;
    renderSockets();
    renderWires();
    renderColorOverlays();
  }

  function handleT1Click(sideName, e) {
    if (isAnimating) return;
    if (justDragged) return;

    if (elAnimLayer.style.display === 'block') {
      stopAnimation();
    }

    // Toggle selection on T1
    if (selectedT1Socket === sideName) {
      selectedT1Socket = null;
    } else {
      selectedT1Socket = sideName;
    }
    renderSockets();
    renderWires();
  }

  function handleT2Click(sideName, e) {
    if (isAnimating) return;
    if (justDragged) return;

    if (elAnimLayer.style.display === 'block') {
      stopAnimation();
    }

    if (!selectedT1Socket) {
      // If user clicks T2 first, check if it's already connected and remove connection
      const existingConn = connections.findIndex(c => c.t2SideKey === sideName);
      if (existingConn !== -1) {
        connections.splice(existingConn, 1);
        renderSockets();
        renderWires();
        renderColorOverlays();
      }
      return;
    }

    // Connect selected T1 socket to this T2 side
    attachLead(selectedT1Socket, sideName);
  }

  function handlePointerDown(sideName, sourceType, e) {
    if (isAnimating) return;
    if (e.button !== undefined && e.button !== 0) return; // Only primary mouse button

    if (elAnimLayer.style.display === 'block') {
      stopAnimation();
    }

    isDragging = true;
    dragMoved = false;
    dragStartSide = sideName;
    dragStartSource = sourceType;
    dragStartPos = { x: e.clientX, y: e.clientY };

    // Highlight source socket visually without destroying DOM
    if (sourceType === 't1') {
      document.querySelectorAll('#sockets-t1 .side-terminal').forEach(term => {
        term.classList.toggle('selected', term.dataset.side === sideName);
      });
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
  }

  function onPointerMove(e) {
    if (!isDragging || !dragStartSide) return;

    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    if (!dragMoved && Math.hypot(dx, dy) >= 5) {
      dragMoved = true;
      document.body.classList.add('wire-dragging');
    }

    if (!dragMoved) return;

    const svgRect = elWireSvg.getBoundingClientRect();
    const sourceElId = dragStartSource === 't1' ? `terminal-t1-${dragStartSide}` : `terminal-t2-${dragStartSide}`;
    const el1 = document.getElementById(sourceElId);
    if (!el1) return;

    const pin1 = el1.querySelector('.socket-pin');
    if (!pin1) return;
    const r1 = pin1.getBoundingClientRect();

    const x1 = r1.left + r1.width / 2 - svgRect.left;
    const y1 = r1.top + r1.height / 2 - svgRect.top;

    // Check hover over candidate target sockets
    const targetSelector = dragStartSource === 't1' ? '#sockets-t2 .side-terminal' : '#sockets-t1 .side-terminal';
    let hoveredTerminal = null;

    document.querySelectorAll(targetSelector).forEach(term => {
      const tr = term.getBoundingClientRect();
      const isInside = (
        e.clientX >= tr.left - 12 &&
        e.clientX <= tr.right + 12 &&
        e.clientY >= tr.top - 12 &&
        e.clientY <= tr.bottom + 12
      );
      term.classList.toggle('drag-target', isInside);
      if (isInside) {
        hoveredTerminal = term;
      }
    });

    // Determine wire end position
    let x2 = e.clientX - svgRect.left;
    let y2 = e.clientY - svgRect.top;

    // Magnetic snap to pin center if hovering target
    if (hoveredTerminal) {
      const pin2 = hoveredTerminal.querySelector('.socket-pin');
      if (pin2) {
        const r2 = pin2.getBoundingClientRect();
        x2 = r2.left + r2.width / 2 - svgRect.left;
        y2 = r2.top + r2.height / 2 - svgRect.top;
      }
    }

    // Determine color preview for the lead being pulled
    const usedColors = connections
      .filter(c => (dragStartSource === 't1' ? c.t1SideKey : c.t2SideKey) !== dragStartSide)
      .map(c => c.colorIndex);
    let nextColor = 0;
    while (usedColors.includes(nextColor) && nextColor < 3) {
      nextColor++;
    }
    const colorHex = LEAD_COLORS[nextColor] ? LEAD_COLORS[nextColor].hex : '#38bdf8';

    // Render active dragging wire
    let dragPath = elWireSvg.querySelector('.wire-drag');
    if (!dragPath) {
      dragPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      dragPath.setAttribute('class', 'wire-drag');
      elWireSvg.appendChild(dragPath);
    }
    dragPath.setAttribute('stroke', colorHex);
    dragPath.style.filter = `drop-shadow(0 0 6px ${colorHex})`;

    const spanY = Math.abs(y2 - y1);
    const curveOffset = Math.max(spanY * 0.55, 25);
    const cp1Y = dragStartSource === 't1' ? y1 + curveOffset : y1 - curveOffset;
    const cp2Y = dragStartSource === 't1' ? y2 - curveOffset : y2 + curveOffset;

    dragPath.setAttribute('d', `M ${x1},${y1} C ${x1},${cp1Y} ${x2},${cp2Y} ${x2},${y2}`);
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    document.body.classList.remove('wire-dragging');

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);

    // Remove dragging wire and target highlights
    const dragPath = elWireSvg.querySelector('.wire-drag');
    if (dragPath) dragPath.remove();

    if (dragMoved) {
      markJustDragged();

      // Find target terminal
      const targetSelector = dragStartSource === 't1' ? '#sockets-t2 .side-terminal' : '#sockets-t1 .side-terminal';
      let targetSide = null;

      document.querySelectorAll(targetSelector).forEach(term => {
        if (term.classList.contains('drag-target')) {
          targetSide = term.dataset.side;
        }
        term.classList.remove('drag-target');
      });

      // Fallback: check bounding rect with generous hit area
      if (!targetSide) {
        document.querySelectorAll(targetSelector).forEach(term => {
          const tr = term.getBoundingClientRect();
          if (
            e.clientX >= tr.left - 14 &&
            e.clientX <= tr.right + 14 &&
            e.clientY >= tr.top - 14 &&
            e.clientY <= tr.bottom + 14
          ) {
            targetSide = term.dataset.side;
          }
        });
      }

      // Fallback: check elementFromPoint
      if (!targetSide) {
        const elOver = document.elementFromPoint(e.clientX, e.clientY);
        const term = elOver ? elOver.closest(targetSelector) : null;
        if (term && term.dataset.side) {
          targetSide = term.dataset.side;
        }
      }

      if (targetSide) {
        const t1Side = dragStartSource === 't1' ? dragStartSide : targetSide;
        const t2Side = dragStartSource === 't1' ? targetSide : dragStartSide;
        attachLead(t1Side, t2Side);
      } else {
        // Drag released in empty space: cancel and clear selection
        selectedT1Socket = null;
        renderSockets();
      }
    } else {
      // Stationary click: clean up any target hover classes
      document.querySelectorAll('.side-terminal').forEach(term => {
        term.classList.remove('drag-target');
      });
      // The browser's native 'click' event on the terminal will fire next and handle selection
    }
  }

  function onPointerCancel() {
    isDragging = false;
    dragMoved = false;
    document.body.classList.remove('wire-dragging');
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);

    const dragPath = elWireSvg.querySelector('.wire-drag');
    if (dragPath) dragPath.remove();
    document.querySelectorAll('.side-terminal').forEach(t => t.classList.remove('drag-target'));
    renderSockets();
  }

  function renderWires() {
    elWireSvg.innerHTML = '';
    const svgRect = elWireSvg.getBoundingClientRect();
    if (!svgRect.width || !svgRect.height) return;

    connections.forEach(conn => {
      const el1 = document.getElementById(`terminal-t1-${conn.t1SideKey}`);
      const el2 = document.getElementById(`terminal-t2-${conn.t2SideKey}`);
      if (!el1 || !el2) return;

      const pin1 = el1.querySelector('.socket-pin');
      const pin2 = el2.querySelector('.socket-pin');
      if (!pin1 || !pin2) return;

      const r1 = pin1.getBoundingClientRect();
      const r2 = pin2.getBoundingClientRect();

      const x1 = r1.left + r1.width / 2 - svgRect.left;
      const y1 = r1.top + r1.height / 2 - svgRect.top;
      const x2 = r2.left + r2.width / 2 - svgRect.left;
      const y2 = r2.top + r2.height / 2 - svgRect.top;

      const color = LEAD_COLORS[conn.colorIndex];

      // Cubic Bezier curve
      const dy = Math.abs(y2 - y1);
      const cp1Y = y1 + dy * 0.55;
      const cp2Y = y2 - dy * 0.55;
      const pathD = `M ${x1},${y1} C ${x1},${cp1Y} ${x2},${cp2Y} ${x2},${y2}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      path.setAttribute('class', `wire-path ${color.wireClass}`);
      path.setAttribute('title', `Click to disconnect ${conn.t1SideKey} <-> ${conn.t2SideKey}`);

      path.addEventListener('click', e => {
        if (isAnimating) return;
        if (elAnimLayer.style.display === 'block') {
          stopAnimation();
        }
        e.stopPropagation();
        connections = connections.filter(c => c !== conn);
        renderSockets();
        renderWires();
        renderColorOverlays();
      });

      elWireSvg.appendChild(path);
    });
  }

  window.addEventListener('resize', () => {
    renderWires();
  });

  // --- Problem 2: Statement UI ---
  function renderStatementUI() {
    if (!currentProblem) return;

    // Display Triangle 1's vertex sequence
    elT1Statement.textContent = currentProblem.t1.vertexOrder.join(' ');

    // Update slots
    for (let i = 0; i < 3; i++) {
      const slotEl = document.getElementById(`slot-${i}`);
      slotEl.textContent = statementSlots[i] || '_';
      slotEl.className = `slot-btn ${i === activeSlotIndex ? 'active' : ''} ${statementSlots[i] ? 'filled' : ''}`;
    }
  }

  // Slot buttons click
  elSlotsContainer.querySelectorAll('.slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSlotIndex = parseInt(btn.dataset.slot, 10);
      renderStatementUI();
    });
  });

  // Letter buttons click (A, B, C, X)
  document.querySelectorAll('.letter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (activeSlotIndex < 3) {
        statementSlots[activeSlotIndex] = btn.dataset.letter;
        activeSlotIndex = Math.min(2, activeSlotIndex + 1);
        renderStatementUI();
      }
    });
  });

  // Keyboard navigation for letter picking (A, B, C, X, Backspace)
  window.addEventListener('keydown', e => {
    const key = e.key.toUpperCase();
    if (['A', 'B', 'C', 'X'].includes(key)) {
      if (activeSlotIndex < 3) {
        statementSlots[activeSlotIndex] = key;
        activeSlotIndex = Math.min(2, activeSlotIndex + 1);
        renderStatementUI();
      }
    } else if (e.key === 'Backspace') {
      if (statementSlots[activeSlotIndex]) {
        statementSlots[activeSlotIndex] = '';
      } else if (activeSlotIndex > 0) {
        activeSlotIndex--;
        statementSlots[activeSlotIndex] = '';
      }
      renderStatementUI();
    }
  });

  elBtnClearStatement.addEventListener('click', () => {
    statementSlots = ['', '', ''];
    activeSlotIndex = 0;
    renderStatementUI();
  });

  // --- Highlight Toggles ---
  function updateHighlightButtons() {
    elBtnHighlightT1.classList.toggle('active', activeHighlight === 't1');
    elBtnHighlightT2.classList.toggle('active', activeHighlight === 't2');
  }

  elBtnHighlightT1.addEventListener('click', () => {
    activeHighlight = activeHighlight === 't1' ? null : 't1';
    updateHighlightButtons();
    renderTriangleHighlights();
  });

  elBtnHighlightT2.addEventListener('click', () => {
    activeHighlight = activeHighlight === 't2' ? null : 't2';
    updateHighlightButtons();
    renderTriangleHighlights();
  });

  // --- Reset & New Problem Buttons ---
  elBtnNewProblem.addEventListener('click', initProblem);

  elBtnReset.addEventListener('click', () => {
    stopAnimation();
    if (isDragging) onPointerCancel();
    connections = [];
    selectedT1Socket = null;
    statementSlots = ['', '', ''];
    activeSlotIndex = 0;
    activeHighlight = null;
    hideFeedback();
    renderSockets();
    renderWires();
    renderColorOverlays();
    renderStatementUI();
    updateHighlightButtons();
  });

  elBtnClearLeads.addEventListener('click', () => {
    if (isDragging) onPointerCancel();
    connections = [];
    selectedT1Socket = null;
    renderSockets();
    renderWires();
    renderColorOverlays();
  });

  // --- Feedback Banner ---
  function showFeedback(type, title, detail) {
    elFeedbackBanner.className = `feedback-banner ${type}`;
    elFeedbackTitle.textContent = title;
    elFeedbackDetail.innerHTML = detail;
  }

  function hideFeedback() {
    elFeedbackBanner.className = 'feedback-banner hidden';
  }

  // --- Verification & Alignment Animation ---
  elBtnVerify.addEventListener('click', () => {
    if (isAnimating) return;
    runAlignmentAndCheck();
  });

  function stopAnimation() {
    isAnimating = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (animTimer) {
      clearTimeout(animTimer);
      animTimer = null;
    }
    elAnimLayer.style.display = 'none';
    elAnimLayer.innerHTML = '';
    elBaseLayer.style.opacity = '1';
    elLabelsLayer.style.opacity = '1';
    elAnimBadge.classList.add('hidden');
    elBtnVerify.disabled = false;
    renderColorOverlays();
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateStage(durationMs, onUpdate) {
    return new Promise((resolve, reject) => {
      let startTime = null;
      function frame(now) {
        if (!isAnimating) {
          reject(new Error('Animation stopped'));
          return;
        }
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        const eased = easeInOutCubic(progress);
        onUpdate(eased, progress);
        if (progress < 1) {
          animFrameId = requestAnimationFrame(frame);
        } else {
          animFrameId = null;
          resolve();
        }
      }
      animFrameId = requestAnimationFrame(frame);
    });
  }

  function getTriangleChirality(tri) {
    const v1x = tri.pts.acuteLarge.x - tri.pts.acuteSmall.x;
    const v1y = tri.pts.acuteLarge.y - tri.pts.acuteSmall.y;
    const v2x = tri.pts.right.x - tri.pts.acuteSmall.x;
    const v2y = tri.pts.right.y - tri.pts.acuteSmall.y;
    const cross = v1x * v2y - v1y * v2x;
    return cross > 0 ? 1 : -1;
  }

  function transformPoint(p, origM, sx, rotDeg, destM) {
    const dx = (p.x - origM.x) * sx;
    const dy = p.y - origM.y;
    const rad = (rotDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;
    return { x: destM.x + rx, y: destM.y + ry };
  }

  function createAnimatedTriangleGroup(tri, isT1) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const { pts, sides } = tri;
    const baseColor = isT1 ? '#f472b6' : '#38bdf8';
    const fillColor = isT1 ? 'rgba(244, 114, 182, 0.12)' : 'rgba(56, 189, 248, 0.16)';

    // Triangle polygon path
    const d = `M ${pts.acuteSmall.x},${pts.acuteSmall.y} L ${pts.acuteLarge.x},${pts.acuteLarge.y} L ${pts.right.x},${pts.right.y} Z`;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', fillColor);
    path.setAttribute('stroke', baseColor);
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('stroke-linejoin', 'round');
    g.appendChild(path);

    // Right-angle marker
    const ra = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    ra.setAttribute('d', rightAnglePath(pts.right, pts.acuteSmall, pts.acuteLarge, 13));
    ra.setAttribute('fill', 'none');
    ra.setAttribute('stroke', baseColor);
    ra.setAttribute('stroke-width', '1.75');
    g.appendChild(ra);

    // Connected Side lines
    const strokeW = isT1 ? 8 : 4.5;
    const opacity = isT1 ? 0.75 : 1.0;
    [sides.hypotenuse, sides.long_leg, sides.short_leg].forEach(side => {
      const conn = connections.find(c => (isT1 ? c.t1SideKey : c.t2SideKey) === side.name);
      if (conn) {
        const color = LEAD_COLORS[conn.colorIndex];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', side.p1.x);
        line.setAttribute('y1', side.p1.y);
        line.setAttribute('x2', side.p2.x);
        line.setAttribute('y2', side.p2.y);
        line.setAttribute('stroke', color.hex);
        line.setAttribute('stroke-width', strokeW);
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', opacity);
        g.appendChild(line);
      }
    });

    return g;
  }

  function updateAnimBadge(text) {
    elAnimBadgeText.textContent = text;
  }

  async function runAlignmentAndCheck() {
    if (!currentProblem) return;

    // Check Problem 1 (Sides)
    const t1 = currentProblem.t1;
    const t2 = currentProblem.t2;

    const correctPairs = [
      { t1: t1.sides.hypotenuse.name, t2: t2.sides.hypotenuse.name, role: 'Hypotenuse' },
      { t1: t1.sides.long_leg.name, t2: t2.sides.long_leg.name, role: 'Long Leg' },
      { t1: t1.sides.short_leg.name, t2: t2.sides.short_leg.name, role: 'Short Leg' }
    ];

    let correctSidesCount = 0;
    connections.forEach(conn => {
      const match = correctPairs.find(p => p.t1 === conn.t1SideKey && p.t2 === conn.t2SideKey);
      if (match) correctSidesCount++;
    });

    // Check Problem 2 (Similarity Statement)
    const expectedT2Statement = t2.vertexOrder.join('');
    const userT2Statement = statementSlots.join('');
    const statementCorrect = userT2Statement === expectedT2Statement;

    // Stop previous state and prepare animation
    stopAnimation();
    isAnimating = true;
    elBtnVerify.disabled = true;
    elBaseLayer.style.opacity = '0.18';
    elLabelsLayer.style.opacity = '0.18';
    elColorOverlayLayer.innerHTML = '';
    elAnimLayer.style.display = 'block';
    elAnimBadge.classList.remove('hidden');

    // Hypotenuse Midpoints
    const m1 = {
      x: (t1.sides.hypotenuse.p1.x + t1.sides.hypotenuse.p2.x) / 2,
      y: (t1.sides.hypotenuse.p1.y + t1.sides.hypotenuse.p2.y) / 2
    };
    const m2 = {
      x: (t2.sides.hypotenuse.p1.x + t2.sides.hypotenuse.p2.x) / 2,
      y: (t2.sides.hypotenuse.p1.y + t2.sides.hypotenuse.p2.y) / 2
    };
    const destM = { x: CENTER_X, y: CENTER_Y };

    // Chirality / Orientation: Flip needed if comparing opposite chirality
    const sign1 = getTriangleChirality(t1);
    const sign2 = getTriangleChirality(t2);
    const needsReflection = sign1 !== sign2;
    const finalScaleX = needsReflection ? -1 : 1;

    // Concurrency Angle calculation
    // Vector from midpoint to acuteSmall in Triangle 1
    const v1 = {
      x: t1.pts.acuteSmall.x - m1.x,
      y: t1.pts.acuteSmall.y - m1.y
    };
    const theta1 = Math.atan2(v1.y, v1.x);

    // Vector from midpoint to acuteSmall in Triangle 2 (after reflection)
    const v2 = {
      x: (t2.pts.acuteSmall.x - m2.x) * finalScaleX,
      y: t2.pts.acuteSmall.y - m2.y
    };
    const theta2 = Math.atan2(v2.y, v2.x);

    let rotDeg = ((theta1 - theta2) * 180 / Math.PI) % 360;
    while (rotDeg > 180) rotDeg -= 360;
    while (rotDeg <= -180) rotDeg += 360;

    // Build SVG elements in elAnimLayer
    elAnimLayer.innerHTML = '';

    // Concurrent hypotenuse guide line
    const elGuideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const cos1 = Math.cos(theta1);
    const sin1 = Math.sin(theta1);
    elGuideLine.setAttribute('x1', destM.x - cos1 * 260);
    elGuideLine.setAttribute('y1', destM.y - sin1 * 260);
    elGuideLine.setAttribute('x2', destM.x + cos1 * 260);
    elGuideLine.setAttribute('y2', destM.y + sin1 * 260);
    elGuideLine.setAttribute('stroke', 'rgba(148, 163, 184, 0.45)');
    elGuideLine.setAttribute('stroke-width', '1.75');
    elGuideLine.setAttribute('stroke-dasharray', '6 5');
    elGuideLine.setAttribute('opacity', '0');
    elGuideLine.style.transition = 'opacity 0.6s ease';
    elAnimLayer.appendChild(elGuideLine);

    // Triangle 1 group (pink theme)
    const gT1 = createAnimatedTriangleGroup(t1, true);
    elAnimLayer.appendChild(gT1);

    // Triangle 2 group (cyan theme)
    const gT2 = createAnimatedTriangleGroup(t2, false);
    elAnimLayer.appendChild(gT2);

    // Midpoints group
    const gMidpoints = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    elAnimLayer.appendChild(gMidpoints);

    // Labels group (always upright)
    const gLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    elAnimLayer.appendChild(gLabels);

    // Render frame state helper
    function renderFrame(currM1, currM2, scaleX2, rotDeg2, showGuide = false) {
      // T1 transform
      gT1.setAttribute(
        'transform',
        `translate(${currM1.x}, ${currM1.y}) translate(${-m1.x}, ${-m1.y})`
      );

      // T2 transform
      gT2.setAttribute(
        'transform',
        `translate(${currM2.x}, ${currM2.y}) rotate(${rotDeg2}) scale(${scaleX2}, 1) translate(${-m2.x}, ${-m2.y})`
      );

      // Concurrency guide line visibility
      elGuideLine.setAttribute('opacity', showGuide ? '0.75' : '0');

      // Midpoints indicator
      gMidpoints.innerHTML = '';
      const dist = Math.hypot(currM1.x - currM2.x, currM1.y - currM2.y);
      if (dist > 4) {
        // T1 midpoint dot
        const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot1.setAttribute('cx', currM1.x);
        dot1.setAttribute('cy', currM1.y);
        dot1.setAttribute('r', '4');
        dot1.setAttribute('fill', '#f472b6');
        gMidpoints.appendChild(dot1);

        // T2 midpoint dot
        const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot2.setAttribute('cx', currM2.x);
        dot2.setAttribute('cy', currM2.y);
        dot2.setAttribute('r', '4');
        dot2.setAttribute('fill', '#38bdf8');
        gMidpoints.appendChild(dot2);
      } else {
        // Aligned single midpoint with glowing halo
        const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        halo.setAttribute('cx', destM.x);
        halo.setAttribute('cy', destM.y);
        halo.setAttribute('r', '8.5');
        halo.setAttribute('fill', 'none');
        halo.setAttribute('stroke', '#38bdf8');
        halo.setAttribute('stroke-width', '1.5');
        halo.setAttribute('opacity', '0.5');
        gMidpoints.appendChild(halo);

        const merged = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        merged.setAttribute('cx', destM.x);
        merged.setAttribute('cy', destM.y);
        merged.setAttribute('r', '4.5');
        merged.setAttribute('fill', '#38bdf8');
        merged.setAttribute('stroke', '#f472b6');
        merged.setAttribute('stroke-width', '2');
        gMidpoints.appendChild(merged);
      }

      // Upright Labels
      gLabels.innerHTML = '';

      // T1 Vertex Labels
      const k1 = {
        x: (t1.pts.acuteSmall.x + t1.pts.acuteLarge.x + t1.pts.right.x) / 3,
        y: (t1.pts.acuteSmall.y + t1.pts.acuteLarge.y + t1.pts.right.y) / 3
      };
      [
        { name: t1.ptNames.acuteSmall, pt: t1.pts.acuteSmall },
        { name: t1.ptNames.acuteLarge, pt: t1.pts.acuteLarge },
        { name: t1.ptNames.right, pt: t1.pts.right }
      ].forEach(v => {
        const vx = v.pt.x - m1.x + currM1.x;
        const vy = v.pt.y - m1.y + currM1.y;
        const cx = k1.x - m1.x + currM1.x;
        const cy = k1.y - m1.y + currM1.y;
        const dx = vx - cx;
        const dy = vy - cy;
        const len = Math.hypot(dx, dy) || 1;
        const lx = vx + (dx / len) * 22;
        const ly = vy + (dy / len) * 22;

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', lx);
        text.setAttribute('y', ly);
        text.setAttribute('class', 'anim-vertex-label anim-vertex-t1');
        text.textContent = v.name;
        gLabels.appendChild(text);
      });

      // T2 Vertex Labels
      const k2 = {
        x: (t2.pts.acuteSmall.x + t2.pts.acuteLarge.x + t2.pts.right.x) / 3,
        y: (t2.pts.acuteSmall.y + t2.pts.acuteLarge.y + t2.pts.right.y) / 3
      };
      const tK2 = transformPoint(k2, m2, scaleX2, rotDeg2, currM2);

      [
        { name: t2.ptNames.acuteSmall, pt: t2.pts.acuteSmall },
        { name: t2.ptNames.acuteLarge, pt: t2.pts.acuteLarge },
        { name: t2.ptNames.right, pt: t2.pts.right }
      ].forEach(v => {
        const tPt = transformPoint(v.pt, m2, scaleX2, rotDeg2, currM2);
        const dx = tPt.x - tK2.x;
        const dy = tPt.y - tK2.y;
        const len = Math.hypot(dx, dy) || 1;
        const lx = tPt.x + (dx / len) * 22;
        const ly = tPt.y + (dy / len) * 22;

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', lx);
        text.setAttribute('y', ly);
        text.setAttribute('class', 'anim-vertex-label anim-vertex-t2');
        text.textContent = v.name;
        gLabels.appendChild(text);
      });
    }

    try {
      // Frame 0: Natural positions
      renderFrame(m1, m2, 1, 0, false);

      // --- Stage 1: Translation (~1.0s) ---
      // Slowly align the 2 triangles hypotenuse midpoints
      updateAnimBadge('1. Translating: Aligning Hypotenuse Midpoints...');
      await animateStage(1000, (eased) => {
        const currM1 = {
          x: (1 - eased) * m1.x + eased * destM.x,
          y: (1 - eased) * m1.y + eased * destM.y
        };
        const currM2 = {
          x: (1 - eased) * m2.x + eased * destM.x,
          y: (1 - eased) * m2.y + eased * destM.y
        };
        renderFrame(currM1, currM2, 1, 0, false);
      });

      // --- Stage 2: Reflection (~1.0s if needed, ~0.6s if not) ---
      // Reflect triangle 2 if this is needed
      if (needsReflection) {
        updateAnimBadge('2. Reflecting Triangle 2 (Flipping Orientation)...');
        await animateStage(1000, (eased) => {
          const currentScaleX = 1 - 2 * eased; // 1 -> -1
          renderFrame(destM, destM, currentScaleX, 0, false);
        });
      } else {
        updateAnimBadge('2. Reflection Check: Orientation Already Matches');
        await animateStage(600, () => {
          renderFrame(destM, destM, 1, 0, false);
        });
      }

      // --- Stage 3: Rotation (~1.0s) ---
      // Rotate around the hypotenuse midpoint until hypotenuse lines are concurrent
      updateAnimBadge('3. Rotating around Hypotenuse Midpoint...');
      await animateStage(1000, (eased) => {
        const currentRot = eased * rotDeg;
        const nearEnd = eased > 0.85;
        renderFrame(destM, destM, finalScaleX, currentRot, nearEnd);
      });

      // Final aligned state
      renderFrame(destM, destM, finalScaleX, rotDeg, true);

      // --- Complete & Evaluate ---
      updateAnimBadge('Hypotenuse Lines Concurrent & Aligned');
      isAnimating = false;
      elBtnVerify.disabled = false;

      // Evaluate & display feedback
      const isAllPerfect = connections.length === 3 && correctSidesCount === 3 && statementCorrect;
      const partial = correctSidesCount > 0 || statementCorrect;

      if (isAllPerfect) {
        showFeedback(
          'success',
          'Perfect Geometric Correspondence!',
          `All 3 pairs of sides align identically (${correctSidesCount}/3). The similarity statement &Delta;${t1.vertexOrder.join('')} &sim; &Delta;${userT2Statement} is completely correct!`
        );
      } else if (partial) {
        const details = [];
        if (connections.length < 3) {
          details.push(`You have connected ${connections.length}/3 leads.`);
        } else if (correctSidesCount === 3) {
          details.push('All 3 side connections are correct (colors align)!');
        } else {
          details.push(`${correctSidesCount}/3 side leads correctly matched. Notice where colors clash in the aligned view!`);
        }

        if (userT2Statement.length < 3) {
          details.push('The similarity statement is incomplete.');
        } else if (statementCorrect) {
          details.push('Similarity statement is correct!');
        } else {
          details.push(`Similarity statement &Delta;${userT2Statement} does not match corresponding angles.`);
        }
        showFeedback('partial', 'Partial Alignment', details.join('<br>'));
      } else {
        showFeedback(
          'error',
          'Correspondence Mismatch',
          `The rotated triangles reveal conflicting dimensions. The Red, Blue, and Yellow sides do not align with each other. Recheck your side pairs and vertex order.`
        );
      }
    } catch (err) {
      // Animation was stopped or cancelled
    }
  }

  // --- Bootstrap ---
  initProblem();
})();
