const MathUtils = {
    gamma: (z) => {
      if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * MathUtils.gamma(1 - z));
      z -= 1;
      const p = [
        676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012,
        9.9843695780195716e-6, 1.5056327351493116e-7
      ];
      let x = 0.99999999999980993;
      for (let i = 0; i < p.length; i++) x += p[i] / (z + i + 1);
      const t = z + p.length - 0.5;
      return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    },
    erf: (x) => {
      var sign = (x >= 0) ? 1 : -1;
      x = Math.abs(x);
      var a1 =  0.254829592;
      var a2 = -0.284496736;
      var a3 =  1.421413741;
      var a4 = -1.453152027;
      var a5 =  1.061405429;
      var p  =  0.3275911;
      var t = 1.0 / (1.0 + p*x);
      var y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);
      return sign * y;
    },
    chiPdf: (x, k) => {
      if (x <= 0 || k <= 0) return 0;
      const numerator = Math.pow(x, (k / 2) - 1) * Math.exp(-x / 2);
      const denominator = Math.pow(2, k / 2) * MathUtils.gamma(k / 2);
      return numerator / denominator;
    },
    chiCdf: (x, k) => {
      if (x <= 0) return 0;
      const n = 100;
      const h = x / n;
      let sum = MathUtils.chiPdf(0.0001, k) + MathUtils.chiPdf(x, k);
      for (let i = 1; i < n; i += 2) sum += 4 * MathUtils.chiPdf(i * h, k);
      for (let i = 2; i < n - 1; i += 2) sum += 2 * MathUtils.chiPdf(i * h, k);
      return (h / 3) * sum;
    },
    normPdf: (x) => {
      return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
    },
    normCdf: (x) => {
      return 0.5 * (1 + MathUtils.erf(x / Math.sqrt(2)));
    },
    tPdf: (x, v) => {
      const num = MathUtils.gamma((v + 1) / 2);
      const den = Math.sqrt(v * Math.PI) * MathUtils.gamma(v / 2);
      const base = 1 + (x * x) / v;
      const pow = -(v + 1) / 2;
      return (num / den) * Math.pow(base, pow);
    },
    tCdf: (x, v) => {
      if (x === 0) return 0.5;
      const limit = x;
      const n = 200; 
      const h = Math.abs(limit) / n;
      let sum = MathUtils.tPdf(0, v) + MathUtils.tPdf(limit, v); 
      for (let i = 1; i < n; i += 2) sum += 4 * MathUtils.tPdf(i * h, v);
      for (let i = 2; i < n - 1; i += 2) sum += 2 * MathUtils.tPdf(i * h, v);
      const integral = (h / 3) * sum;
      return x > 0 ? 0.5 + integral : 0.5 - integral;
    },
    pdf: (x, df, type) => {
      if (type === 'chi') return MathUtils.chiPdf(x, df);
      if (type === 't') return MathUtils.tPdf(x, df);
      return MathUtils.normPdf(x); 
    },
    cdf: (x, df, type) => {
      if (type === 'chi') return MathUtils.chiCdf(x, df);
      if (type === 't') return MathUtils.tCdf(x, df);
      return MathUtils.normCdf(x);
    },
    ppf: (targetArea, df, type) => {
      if (targetArea <= 0) return type === 'chi' ? 0 : -10;
      if (targetArea >= 1) return type === 'chi' ? 100 : 10;
      let low = type === 'chi' ? 0 : -10;
      let high = type === 'chi' ? Math.max(100, df + 10) : 10;
      let mid = 0;
      for (let i = 0; i < 50; i++) { 
        mid = (low + high) / 2;
        const val = MathUtils.cdf(mid, df, type);
        if (val < targetArea) low = mid;
        else high = mid;
      }
      return mid;
    }
  };
  
  const config = {
      chi: {
        title: "Chi-Square Variance Test",
        sym: { sample: "s", pop: "σ", stat: "χ²" },
        distType: 'chi'
      },
      t_mean: {
        title: "One-Sample t-Test (Mean)",
        sym: { sample: "x̄", pop: "μ", stat: "t" },
        distType: 't'
      },
      z_mean: {
        title: "One-Sample Z-Test (Mean)",
        sym: { sample: "x̄", pop: "μ", stat: "z" },
        distType: 'normal'
      },
      z_prop: {
        title: "One-Proportion Z-Test",
        sym: { sample: "p̂", pop: "p", stat: "z" },
        distType: 'normal'
      }
  };
  
  let mode = null;
  let state = {
      n: 10,
      sampleVal: 1,
      popVal: 0,
      extraVal: 1,
      cvLeft: "",
      areaLeft: "",
      cvRight: "",
      areaRight: "",
      h1Op: "≠",
      decision: null,
      chiInputMode: "sd"
  };
  
  let testStat = 0;
  let df = 0;
  let currentConfig = null;
  
  // DOM Elements
  const els = {};
  window.onload = () => {
      els.menuView = document.getElementById('menu-view');
      els.calcView = document.getElementById('calc-view');
      els.headerTitle = document.getElementById('header-title');
      els.headerDf = document.getElementById('header-df');
      els.cvLeft = document.getElementById('cvLeft');
      els.areaLeft = document.getElementById('areaLeft');
      els.cvRight = document.getElementById('cvRight');
      els.areaRight = document.getElementById('areaRight');
      els.pValueDisplay = document.getElementById('p-value-display');
      els.pValueLabel = document.getElementById('p-value-label');
      els.canvas = document.getElementById('canvas');
      els.distLabel = document.getElementById('dist-label');
      els.formulaDisplay = document.getElementById('formula-display');
      els.calcStat = document.getElementById('calc-stat');
      els.chiToggle = document.getElementById('chi-toggle');
      els.btnSd = document.getElementById('btn-sd');
      els.btnVar = document.getElementById('btn-var');
      els.inputN = document.getElementById('input-n');
      els.inputSample = document.getElementById('input-sample');
      els.inputPop = document.getElementById('input-pop');
      els.inputExtra = document.getElementById('input-extra');
      els.labelSample = document.getElementById('label-sample');
      els.labelPop = document.getElementById('label-pop');
      els.labelExtra = document.getElementById('label-extra');
      els.extraInputContainer = document.getElementById('extra-input-container');
      els.h0Sym = document.getElementById('h0-sym');
      els.h0Val = document.getElementById('h0-val');
      els.h1Sym = document.getElementById('h1-sym');
      els.h1Op = document.getElementById('h1-op');
      els.h1Val = document.getElementById('h1-val');
      els.btnReject = document.getElementById('btn-reject');
      els.btnFail = document.getElementById('btn-fail');
  
      // Attach Input Listeners
      els.inputN.addEventListener('input', (e) => { state.n = e.target.value; updateCalc(); });
      els.inputSample.addEventListener('input', (e) => { state.sampleVal = e.target.value; updateCalc(); });
      els.inputPop.addEventListener('input', (e) => { state.popVal = e.target.value; updateCalc(); });
      els.inputExtra.addEventListener('input', (e) => { state.extraVal = e.target.value; updateCalc(); });
      
      els.cvLeft.addEventListener('input', (e) => updateFromCvLeft(e.target.value));
      els.areaLeft.addEventListener('input', (e) => updateFromAreaLeft(e.target.value));
      els.cvRight.addEventListener('input', (e) => updateFromCvRight(e.target.value));
      els.areaRight.addEventListener('input', (e) => updateFromAreaRight(e.target.value));
      
      els.h1Op.addEventListener('change', (e) => { state.h1Op = e.target.value; updateCalc(); });
  };
  
  function setMode(newMode) {
      mode = newMode;
      if (!mode) {
          els.menuView.classList.remove('hidden');
          els.calcView.classList.add('hidden');
          return;
      }
      
      currentConfig = config[mode];
      
      // Reset state based on mode
      state.cvLeft = ""; state.areaLeft = "";
      state.cvRight = ""; state.areaRight = "";
      state.decision = null;
      state.h1Op = "≠";
      
      if (mode === 'chi') { state.n = 10; state.sampleVal = 2; state.popVal = 2; }
      if (mode === 't_mean') { state.n = 10; state.sampleVal = 105; state.popVal = 100; state.extraVal = 10; } 
      if (mode === 'z_mean') { state.n = 30; state.sampleVal = 105; state.popVal = 100; state.extraVal = 15; } 
      if (mode === 'z_prop') { state.n = 100; state.sampleVal = 0.55; state.popVal = 0.5; }
      
      els.menuView.classList.add('hidden');
      els.calcView.classList.remove('hidden');
      
      setupUI();
      updateCalc();
  }
  
  function setChiMode(newMode) {
      state.chiInputMode = newMode;
      if (newMode === 'sd') {
          els.btnSd.classList.add('active');
          els.btnVar.classList.remove('active');
      } else {
          els.btnVar.classList.add('active');
          els.btnSd.classList.remove('active');
      }
      updateLabels();
      updateCalc();
  }
  
  function setDecision(dec) {
      state.decision = dec;
      if (dec === 'reject') {
          els.btnReject.classList.add('active');
          els.btnFail.classList.remove('active');
      } else if (dec === 'fail') {
          els.btnFail.classList.add('active');
          els.btnReject.classList.remove('active');
      } else {
          els.btnReject.classList.remove('active');
          els.btnFail.classList.remove('active');
      }
  }
  
  function setupUI() {
      els.headerTitle.textContent = currentConfig.title;
      els.distLabel.textContent = `Distribution: ${mode === 'chi' ? 'Chi-Square' : mode === 't_mean' ? "Student's t" : "Standard Normal"}`;
      
      let formulaHtml = "";
      if (mode === 'chi') {
          formulaHtml = `χ² = <div class="frac"><span>(n-1)s²</span><span class="bottom">σ²</span></div>`;
          els.chiToggle.classList.remove('hidden');
          els.extraInputContainer.classList.add('hidden');
          setChiMode(state.chiInputMode); // initialize buttons
      } else if (mode === 't_mean') {
          formulaHtml = `t = <div class="frac"><span>x̄ - μ</span><span class="bottom">s / √n</span></div>`;
          els.chiToggle.classList.add('hidden');
          els.extraInputContainer.classList.remove('hidden');
          els.labelExtra.textContent = "s =";
      } else if (mode === 'z_mean') {
          formulaHtml = `z = <div class="frac"><span>x̄ - μ</span><span class="bottom">σ / √n</span></div>`;
          els.chiToggle.classList.add('hidden');
          els.extraInputContainer.classList.remove('hidden');
          els.labelExtra.textContent = "σ =";
      } else if (mode === 'z_prop') {
          formulaHtml = `z = <div class="frac"><span>p̂ - p</span><span class="bottom">√p(1-p)/n</span></div>`;
          els.chiToggle.classList.add('hidden');
          els.extraInputContainer.classList.add('hidden');
      }
      els.formulaDisplay.innerHTML = formulaHtml;
      
      // Reset inputs
      els.inputN.value = state.n;
      els.inputSample.value = state.sampleVal;
      els.inputPop.value = state.popVal;
      els.inputExtra.value = state.extraVal;
      
      els.cvLeft.value = ""; els.areaLeft.value = "";
      els.cvRight.value = ""; els.areaRight.value = "";
      els.h1Op.value = "≠";
      setDecision(null);
      
      updateLabels();
  }
  
  function updateLabels() {
      if (mode === 'chi') {
          const isSd = state.chiInputMode === 'sd';
          els.labelSample.textContent = isSd ? 's =' : 's² =';
          els.labelPop.textContent = isSd ? 'σ =' : 'σ² =';
          els.h0Sym.textContent = isSd ? 'σ' : 'σ²';
          els.h1Sym.textContent = isSd ? 'σ' : 'σ²';
      } else {
          els.labelSample.textContent = `${currentConfig.sym.sample} =`;
          els.labelPop.textContent = `${currentConfig.sym.pop} =`;
          els.h0Sym.textContent = currentConfig.sym.pop;
          els.h1Sym.textContent = currentConfig.sym.pop;
      }
  }
  
  function updateCalc() {
      const nNum = parseFloat(state.n);
      const samp = parseFloat(state.sampleVal);
      const pop = parseFloat(state.popVal);
      const extra = parseFloat(state.extraVal);
      
      df = mode === 'chi' || mode === 't_mean' ? Math.max(1, (parseInt(nNum) || 2) - 1) : 0;
      els.headerDf.textContent = (mode === 'z_prop' || mode === 'z_mean') ? 'Distribution: Normal (Z)' : `df = ${df}`;
      
      let stat = 0;
      if (mode === 'chi' && nNum && !isNaN(samp) && !isNaN(pop)) {
          let sSq = state.chiInputMode === 'sd' ? samp * samp : samp;
          let sigSq = state.chiInputMode === 'sd' ? pop * pop : pop;
          if (sigSq !== 0) stat = ((nNum - 1) * sSq) / sigSq;
      } else if (mode === 't_mean' && nNum && extra && extra !== 0) {
          stat = (samp - pop) / (extra / Math.sqrt(nNum));
      } else if (mode === 'z_mean' && nNum && extra && extra !== 0) {
          stat = (samp - pop) / (extra / Math.sqrt(nNum));
      } else if (mode === 'z_prop' && nNum && pop > 0 && pop < 1) {
          const num = samp - pop;
          const den = Math.sqrt((pop * (1 - pop)) / nNum);
          if (den !== 0) stat = num / den;
      }
      
      testStat = stat;
      els.calcStat.textContent = isNaN(stat) ? "0.0000" : stat.toFixed(4);
      
      els.h0Val.textContent = isNaN(pop) ? '0' : pop;
      els.h1Val.textContent = isNaN(pop) ? '0' : pop;
      
      updatePValue();
      drawCanvas();
  }
  
  function updatePValue() {
      const type = currentConfig.distType;
      const isLeftSet = state.cvLeft !== "";
      const isRightSet = state.cvRight !== "";
  
      const pLow = MathUtils.cdf(testStat, df, type);
      const pHigh = 1 - pLow;
  
      let pVal = 0;
      if (isLeftSet && isRightSet) {
          pVal = 2 * Math.min(pLow, pHigh);
          els.pValueLabel.textContent = "Two-Tailed";
      } else if (isLeftSet) {
          pVal = pLow;
          els.pValueLabel.textContent = "Left-Tailed";
      } else if (isRightSet) {
          pVal = pHigh;
          els.pValueLabel.textContent = "Right-Tailed";
      } else {
          els.pValueDisplay.textContent = "--";
          els.pValueLabel.textContent = "Define Rejection Region";
          return;
      }
      
      let clampedPValue = Math.max(0, Math.min(1.0, pVal));
      els.pValueDisplay.textContent = clampedPValue.toFixed(4);
  }
  
  function updateFromCvLeft(val) {
      state.cvLeft = val;
      if (val === "" || isNaN(val)) { 
          state.areaLeft = ""; els.areaLeft.value = ""; 
      } else {
          state.areaLeft = MathUtils.cdf(parseFloat(val), df, currentConfig.distType).toFixed(4);
          els.areaLeft.value = state.areaLeft;
      }
      updatePValue();
      drawCanvas();
  }
  
  function updateFromAreaLeft(val) {
      state.areaLeft = val;
      if (val === "" || isNaN(val)) { 
          state.cvLeft = ""; els.cvLeft.value = ""; 
      } else {
          state.cvLeft = MathUtils.ppf(parseFloat(val), df, currentConfig.distType).toFixed(3);
          els.cvLeft.value = state.cvLeft;
      }
      updatePValue();
      drawCanvas();
  }
  
  function updateFromCvRight(val) {
      state.cvRight = val;
      if (val === "" || isNaN(val)) { 
          state.areaRight = ""; els.areaRight.value = ""; 
      } else {
          state.areaRight = (1 - MathUtils.cdf(parseFloat(val), df, currentConfig.distType)).toFixed(4);
          els.areaRight.value = state.areaRight;
      }
      updatePValue();
      drawCanvas();
  }
  
  function updateFromAreaRight(val) {
      state.areaRight = val;
      if (val === "" || isNaN(val)) { 
          state.cvRight = ""; els.cvRight.value = ""; 
      } else {
          state.cvRight = MathUtils.ppf(1 - parseFloat(val), df, currentConfig.distType).toFixed(3);
          els.cvRight.value = state.cvRight;
      }
      updatePValue();
      drawCanvas();
  }
  
  function drawCanvas() {
      const canvas = els.canvas;
      if (!canvas || !mode) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const type = currentConfig.distType;
  
      ctx.clearRect(0, 0, width, height);
      
      let xMin, xMax, peakY;
      if (type === 'chi') {
          xMin = 0;
          xMax = MathUtils.ppf(0.9995, df, 'chi');
          const modeX = df >= 2 ? df - 2 : 0.2;
          peakY = MathUtils.pdf(modeX, df, 'chi') * 1.1;
      } else {
          xMin = -5;
          xMax = 5;
          peakY = (type === 't' ? MathUtils.pdf(0, df, 't') : MathUtils.pdf(0, 0, 'normal')) * 1.1;
      }
  
      const range = xMax - xMin;
      const baselineY = height - 40;
      
      const mapX = (x) => ((x - xMin) / range) * width;
      const mapY = (y) => baselineY - (y / peakY) * (baselineY - 40);
  
      // Grid
      ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1; ctx.beginPath();
      for(let i=0; i<=width; i+=width/20) { ctx.moveTo(i,0); ctx.lineTo(i,baselineY); }
      for(let i=0; i<=baselineY; i+=baselineY/10) { ctx.moveTo(0,i); ctx.lineTo(width,i); }
      ctx.stroke();
  
      // Distribution Curve
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#2563eb'; 
      let started = false;
      for (let px = 0; px < width; px++) {
          const x = xMin + (px / width) * range;
          const y = MathUtils.pdf(x, df, type);
          if (!isFinite(y)) continue;
          if (!started) { ctx.moveTo(px, mapY(y)); started = true; }
          else { ctx.lineTo(px, mapY(y)); }
      }
      ctx.stroke();
  
      const shadeArea = (startX, endX, color) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          let s = Math.max(xMin, startX);
          let e = Math.min(xMax, endX);
          if (s >= e) return;
          const startPx = mapX(s);
          const endPx = mapX(e);
          ctx.moveTo(startPx, baselineY);
          for (let px = startPx; px <= endPx; px++) {
              const x = xMin + ((px) / width) * range;
              const y = MathUtils.pdf(x, df, type);
              ctx.lineTo(px, mapY(y));
          }
          ctx.lineTo(endPx, baselineY);
          ctx.closePath();
          ctx.fill();
      };
  
      // Rejection Regions
      if (state.cvLeft !== "" && !isNaN(parseFloat(state.cvLeft))) {
          const limit = parseFloat(state.cvLeft);
          shadeArea(xMin - 1, limit, 'rgba(165, 243, 252, 0.6)');
          if(limit > xMin && limit < xMax) {
              ctx.beginPath(); ctx.strokeStyle = '#0891b2';
              ctx.moveTo(mapX(limit), baselineY);
              ctx.lineTo(mapX(limit), mapY(MathUtils.pdf(limit, df, type)) - 20);
              ctx.stroke();
              ctx.fillStyle = '#0891b2'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'right';
              ctx.fillText(limit.toFixed(2), mapX(limit) - 5, mapY(MathUtils.pdf(limit, df, type)) - 25);
          }
      }
  
      if (state.cvRight !== "" && !isNaN(parseFloat(state.cvRight))) {
          const limit = parseFloat(state.cvRight);
          shadeArea(limit, xMax + 1, 'rgba(251, 207, 232, 0.6)');
          if(limit > xMin && limit < xMax) {
              ctx.beginPath(); ctx.strokeStyle = '#be185d';
              ctx.moveTo(mapX(limit), baselineY);
              ctx.lineTo(mapX(limit), mapY(MathUtils.pdf(limit, df, type)) - 20);
              ctx.stroke();
              ctx.fillStyle = '#be185d'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
              ctx.fillText(limit.toFixed(2), mapX(limit) + 5, mapY(MathUtils.pdf(limit, df, type)) - 25);
          }
      }
  
      // Test Statistic Marker
      const statX = mapX(testStat);
      if (statX >= 0 && statX <= width) {
          ctx.beginPath();
          ctx.lineWidth = 2; ctx.strokeStyle = '#111827'; ctx.setLineDash([5, 5]);
          ctx.moveTo(statX, baselineY); ctx.lineTo(statX, 10); ctx.stroke(); ctx.setLineDash([]);
          
          ctx.fillStyle = '#111827'; 
          ctx.font = 'bold 12px system-ui'; 
          ctx.textAlign = 'center';
          ctx.fillText(`${currentConfig.sym.stat}: ${testStat.toFixed(2)}`, statX, baselineY + 20); 
          ctx.textAlign = 'left';
      } 
  
      // Baseline
      ctx.strokeStyle = '#111827'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, baselineY); ctx.lineTo(width, baselineY); ctx.stroke();
  }
