/* ==========================================================================
   ML GOVERNANCE ENGINE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  let driftChartInstance = null;

  // DOM Elements
  const activeModelTitle = document.getElementById('activeModelTitle');
  const activeModelDesc = document.getElementById('activeModelDesc');
  const governanceLogs = document.getElementById('governanceLogs');
  const driftChartCanvas = document.getElementById('driftChartCanvas').getContext('2d');

  const retrainModal = document.getElementById('retrainModal');
  const triggerRetrainBtn = document.getElementById('triggerRetrainBtn');
  const confirmRetrainBtn = document.getElementById('confirmRetrainBtn');
  const closeMdl = document.querySelector('.close-modal');

  // Model Specifications Data
  const modelRegistry = {
    'credit-risk': {
      title: 'Credit-Risk-Evaluator',
      version: 'v2.4.1',
      desc: 'Automated customer credit scoring model used in direct lending workflows.',
      risk: 'HIGH (EU AI Act Annex III)',
      driftData: [0.02, 0.03, 0.04, 0.05, 0.08, 0.08]
    },
    'lead-qualification': {
      title: 'Lead-Scoring-Agent',
      version: 'v1.8.0',
      desc: 'LLM fine-tune scoring incoming inbound lead qualifications.',
      risk: 'MEDIUM (Internal Operations)',
      driftData: [0.05, 0.09, 0.14, 0.18, 0.22, 0.25]
    },
    'tender-ocr': {
      title: 'Tender-Document-RAG',
      version: 'v3.1.2',
      desc: 'Vision Transformer extracting clause embeddings from procurement PDFs.',
      risk: 'LOW (Read-Only Document Analysis)',
      driftData: [0.01, 0.01, 0.02, 0.02, 0.03, 0.03]
    }
  };

  init();

  function init() {
    setupEventListeners();
    renderDriftChart(modelRegistry['credit-risk'].driftData);
  }

  function setupEventListeners() {
    // Registry Item Switcher
    document.querySelectorAll('.model-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.model-item').forEach(m => m.classList.remove('active'));
        item.classList.add('active');

        const key = item.getAttribute('data-model');
        const data = modelRegistry[key];

        if (data) {
          activeModelTitle.innerHTML = `${data.title} <span class="version-tag">${data.version}</span>`;
          activeModelDesc.textContent = data.desc;
          renderDriftChart(data.driftData);
          logConsole(`[Registry] Switched telemetry context to model: ${data.title}`);
        }
      });
    });

    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
      });
    });

    // Retrain Modal Actions
    triggerRetrainBtn.addEventListener('click', () => {
      retrainModal.style.display = 'flex';
    });

    closeMdl.addEventListener('click', () => {
      retrainModal.style.display = 'none';
    });

    confirmRetrainBtn.addEventListener('click', () => {
      retrainModal.style.display = 'none';
      logConsole('[Pipeline] Retraining job dispatched to Kubernetes cluster. Job ID: #8492');
      alert('Retraining Job successfully queued!');
    });
  }

  // Render Chart.js Drift Telemetry
  function renderDriftChart(driftData) {
    if (driftChartInstance) {
      driftChartInstance.destroy();
    }

    driftChartInstance = new Chart(driftChartCanvas, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'Population Stability Index (PSI)',
          data: driftData,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f8fafc' } }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' }, min: 0, max: 0.3 }
        }
      }
    });
  }

  function logConsole(msg) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    governanceLogs.appendChild(entry);
    governanceLogs.scrollTop = governanceLogs.scrollHeight;
  }

});
