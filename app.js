/* ==============================================
   AquaSense — JavaScript Application Logic
   ============================================== */

// =========================================
// 1. NAVBAR SCROLL EFFECT
// =========================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// =========================================
// 2. MOBILE HAMBURGER MENU
// =========================================
const hamburger = document.getElementById('hamburger-btn');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

// =========================================
// 3. SCROLL REVEAL ANIMATIONS
// =========================================
const revealElements = document.querySelectorAll(
  '.about-card, .feature-card, .gauge-card, .chart-card, .result-card, .tech-pill, .contact-info-item'
);
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// =========================================
// 4. COUNTER ANIMATION (Hero Stats)
// =========================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-value').forEach(animateCounter);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.getElementById('hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// =========================================
// 5. CHART.JS SETUP
// =========================================
Chart.defaults.color = '#6b8fa8';
Chart.defaults.font.family = "'Outfit', sans-serif";

const CHART_GRID = {
  color: 'rgba(0,212,255,0.07)',
  drawBorder: false
};

// Generate initial time labels
function getTimeLabels(count) {
  const labels = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const t = new Date(now - i * 3000);
    labels.push(t.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }
  return labels;
}

function randomAround(base, spread) {
  return parseFloat((base + (Math.random() - 0.5) * spread * 2).toFixed(2));
}

const MAX_POINTS = 20;

// --- pH Chart ---
const phData = Array.from({ length: MAX_POINTS }, () => randomAround(7.2, 0.4));
const phCtx = document.getElementById('phChart').getContext('2d');
const phGrad = phCtx.createLinearGradient(0, 0, 0, 250);
phGrad.addColorStop(0, 'rgba(0,212,255,0.4)');
phGrad.addColorStop(1, 'rgba(0,212,255,0)');

const phChart = new Chart(phCtx, {
  type: 'line',
  data: {
    labels: getTimeLabels(MAX_POINTS),
    datasets: [{
      label: 'pH',
      data: phData,
      borderColor: '#00d4ff',
      backgroundColor: phGrad,
      borderWidth: 2.5,
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHitRadius: 10
    }]
  },
  options: {
    responsive: true,
    animation: { duration: 500 },
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: CHART_GRID, ticks: { maxTicksLimit: 5, maxRotation: 0 } },
      y: { grid: CHART_GRID, min: 5, max: 9, ticks: { stepSize: 1 } }
    }
  }
});

// --- Turbidity Chart ---
const turbData = Array.from({ length: MAX_POINTS }, () => randomAround(3.4, 1.5));
const turbCtx = document.getElementById('turbidityChart').getContext('2d');
const turbGrad = turbCtx.createLinearGradient(0, 0, 0, 250);
turbGrad.addColorStop(0, 'rgba(0,245,212,0.4)');
turbGrad.addColorStop(1, 'rgba(0,245,212,0)');

const turbidityChart = new Chart(turbCtx, {
  type: 'line',
  data: {
    labels: getTimeLabels(MAX_POINTS),
    datasets: [{
      label: 'Turbidity (NTU)',
      data: turbData,
      borderColor: '#00f5d4',
      backgroundColor: turbGrad,
      borderWidth: 2.5,
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHitRadius: 10
    }]
  },
  options: {
    responsive: true,
    animation: { duration: 500 },
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: CHART_GRID, ticks: { maxTicksLimit: 5, maxRotation: 0 } },
      y: { grid: CHART_GRID, min: 0, max: 10, ticks: { stepSize: 2 } }
    }
  }
});

// --- Multi-Parameter Bar Chart ---
const multiCtx = document.getElementById('multiChart').getContext('2d');
const hours = Array.from({ length: 12 }, (_, i) => {
  const h = new Date();
  h.setHours(h.getHours() - (11 - i));
  return h.getHours() + ':00';
});

const multiChart = new Chart(multiCtx, {
  type: 'bar',
  data: {
    labels: hours,
    datasets: [
      {
        label: 'pH (scaled x10)',
        data: hours.map(() => randomAround(72, 5)),
        backgroundColor: 'rgba(0,212,255,0.7)',
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Dissolved O2 (mg/L x10)',
        data: hours.map(() => randomAround(81, 8)),
        backgroundColor: 'rgba(0,245,212,0.7)',
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Temperature (x2)',
        data: hours.map(() => randomAround(49, 4)),
        backgroundColor: 'rgba(168,85,247,0.7)',
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Turbidity (NTU x5)',
        data: hours.map(() => randomAround(17, 5)),
        backgroundColor: 'rgba(245,158,11,0.7)',
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  },
  options: {
    responsive: true,
    animation: { duration: 600 },
    plugins: {
      legend: {
        display: true,
        labels: { boxWidth: 12, padding: 20, color: '#6b8fa8', font: { size: 11 } }
      }
    },
    scales: {
      x: { grid: CHART_GRID, stacked: false },
      y: { grid: CHART_GRID, stacked: false }
    }
  }
});

// =========================================
// 6. LIVE SENSOR DATA SIMULATION
// =========================================

// Sensor config: { id, base, spread, min, max, unit, goodMin, goodMax }
const SENSORS = [
  { id: 'ph',           base: 7.2,  spread: 0.3,  min: 0,    max: 14,   unit: '',       goodMin: 6.5,  goodMax: 8.5,  label: 'ph',          goodLabel: 'Normal',  warnLabel: 'Abnormal', barMax: 14   },
  { id: 'turbidity',    base: 3.4,  spread: 1.2,  min: 0,    max: 10,   unit: 'NTU',    goodMin: 0,    goodMax: 5,    label: 'turbidity',   goodLabel: 'Clear',   warnLabel: 'Cloudy',   barMax: 10   },
  { id: 'do',           base: 8.1,  spread: 0.6,  min: 0,    max: 10,   unit: 'mg/L',   goodMin: 6,    goodMax: 10,   label: 'do',          goodLabel: 'Optimal', warnLabel: 'Low O2',   barMax: 10   },
  { id: 'temp',         base: 24.5, spread: 1.5,  min: 0,    max: 50,   unit: '°C',     goodMin: 15,   goodMax: 30,   label: 'temp',        goodLabel: 'Normal',  warnLabel: 'High',     barMax: 50   },
  { id: 'tds',          base: 320,  spread: 40,   min: 0,    max: 1000, unit: 'ppm',    goodMin: 0,    goodMax: 500,  label: 'tds',         goodLabel: 'Safe',    warnLabel: 'High TDS', barMax: 1000 },
  { id: 'conductivity', base: 640,  spread: 60,   min: 0,    max: 2000, unit: 'µS/cm',  goodMin: 0,    goodMax: 1500, label: 'conductivity',goodLabel: 'Normal',  warnLabel: 'High',     barMax: 2000 }
];

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

// Smoothing: keep previous values for gentle drift
const sensorState = {};
SENSORS.forEach(s => { sensorState[s.id] = s.base; });

function updateSensors() {
  const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
  document.getElementById('last-update-time').textContent = timeStr;

  SENSORS.forEach(s => {
    // Drift slowly
    let newVal = sensorState[s.id] + (Math.random() - 0.5) * s.spread;
    newVal = clamp(newVal, s.base - s.spread * 3, s.base + s.spread * 3);
    newVal = clamp(newVal, s.min, s.max);
    sensorState[s.id] = newVal;

    const display = newVal % 1 === 0 ? Math.round(newVal).toString() : newVal.toFixed(1);
    document.getElementById('val-' + s.id).textContent = display;

    const pct = ((newVal - s.min) / (s.max - s.min)) * 100;
    document.getElementById('bar-' + s.id).style.width = pct.toFixed(1) + '%';

    const isGood = newVal >= s.goodMin && newVal <= s.goodMax;
    const statusEl = document.getElementById('status-' + s.id);
    statusEl.textContent = (isGood ? '✓ ' : '⚠ ') + (isGood ? s.goodLabel : s.warnLabel);
    statusEl.className = 'gauge-status ' + (isGood ? 'good' : 'warn');
  });

  // Update pH chart
  const newTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  phChart.data.labels.push(newTime);
  phChart.data.datasets[0].data.push(parseFloat(sensorState['ph'].toFixed(2)));
  if (phChart.data.labels.length > MAX_POINTS) {
    phChart.data.labels.shift();
    phChart.data.datasets[0].data.shift();
  }
  phChart.update('none');

  // Update turbidity chart
  turbidityChart.data.labels.push(newTime);
  turbidityChart.data.datasets[0].data.push(parseFloat(sensorState['turbidity'].toFixed(2)));
  if (turbidityChart.data.labels.length > MAX_POINTS) {
    turbidityChart.data.labels.shift();
    turbidityChart.data.datasets[0].data.shift();
  }
  turbidityChart.update('none');
}

// Start live updates every 3 seconds
setInterval(updateSensors, 3000);
updateSensors();

// =========================================
// 7. CONTACT FORM SUBMIT
// =========================================
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('contact-submit-btn');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('form-success').style.display = 'block';
    btn.style.display = 'none';
    document.getElementById('contact-form').reset();
  }, 1200);
}

// =========================================
// 8. SMOOTH ANCHOR SCROLLING
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
