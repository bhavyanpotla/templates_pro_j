/* ==========================================================================
   TEXT TO CHART SYNTHESIZER ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  let chartInstance = null;

  // DOM Elements
  const chartForm = document.getElementById('chartForm');
  const promptInput = document.getElementById('promptInput');
  const chartTypeSelect = document.getElementById('chartTypeSelect');
  const consoleLogs = document.getElementById('consoleLogs');
  const parserStatus = document.getElementById('parserStatus');

  const mainChartCanvas = document.getElementById('mainChartCanvas').getContext('2d');
  const tableHead = document.getElementById('tableHead');
  const tableBody = document.getElementById('tableBody');
  const jsonOutput = document.getElementById('jsonOutput');

  const exportPngBtn = document.getElementById('exportPngBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');

  // Initialization
  init();

  function init() {
    setupEventListeners();
    synthesizeChart();
  }

  function setupEventListeners() {
    // Form Submission
    chartForm.addEventListener('submit', (e) => {
      e.preventDefault();
      synthesizeChart();
    });

    // Preset Badges
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        promptInput.value = chip.getAttribute('data-prompt');
        chartTypeSelect.value = chip.getAttribute('data-type');
        synthesizeChart();
      });
    });

    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const viewId = btn.getAttribute('data-view');
        document.getElementById(viewId).classList.add('active');
      });
    });

    // Export Handlers
    exportPngBtn.addEventListener('click', exportPNG);
    exportCsvBtn.addEventListener('click', exportCSV);
  }

  // Core NLP Data Synthesizer Simulation
  function synthesizeChart() {
    const prompt = promptInput.value.trim();
    const type = chartTypeSelect.value;

    if (!prompt) return;

    logConsole(`[NLP Engine] Parsing query: "${prompt}"`);
    parserStatus.textContent = "SYNTHESIZING...";
    parserStatus.style.color = "#3b82f6";

    setTimeout(() => {
      const generatedData = parseTextToDataset(prompt, type);
      
      renderChart(generatedData.labels, generatedData.datasets, type);
      renderTable(generatedData.labels, generatedData.datasets);
      renderJSON(generatedData.labels, generatedData.datasets, type);

      logConsole(`[Success] Visual rendered using ${type.toUpperCase()} layout.`);
      parserStatus.textContent = "READY";
      parserStatus.style.color = "#10b981";
    }, 600);
  }

  // Parses natural language string into Chart.js datasets
  function parseTextToDataset(text, type) {
    const clean = text.toLowerCase();
    
    // Default Fallback Dataset
    let labels = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
    let datasets = [{
      label: 'Revenue (in $10k)',
      data: [42, 35, 58, 24, 18],
      backgroundColor: [
        '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'
      ],
      borderColor: '#111827',
      borderWidth: 2
    }];

    if (clean.includes('growth') || clean.includes('user') || clean.includes('quarter')) {
      labels = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];
      datasets = [{
        label: 'Active Subscribers (Thousands)',
        data: [120, 240, 390, 580],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4
      }];
    } else if (clean.includes('radar') || clean.includes('latency') || clean.includes('region')) {
      labels = ['US-East', 'US-West', 'EU-Central', 'AP-South', 'SA-East'];
      datasets = [
        { label: 'Latency (ms)', data: [24, 45, 88, 120, 150], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.2)' },
        { label: 'Uptime Score (%)', data: [99.9, 99.8, 99.5, 98.9, 99.1], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.2)' }
      ];
    } else if (clean.includes('market') || clean.includes('share') || clean.includes('product')) {
      labels = ['SaaS Platform', 'Custom AI Agents', 'API Subscriptions', 'Consulting Services'];
      datasets = [{
        label: 'Market Share %',
        data: [45, 30, 15, 10],
        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
      }];
    }

    return { labels, datasets };
  }

  // Render Chart.js Canvas
  function renderChart(labels, datasets, type) {
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(mainChartCanvas, {
      type: type,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f9fafb', font: { family: 'sans-serif' } } }
        },
        scales: (type === 'pie' || type === 'doughnut' || type === 'radar') ? {} : {
          x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
          y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } }
        }
      }
    });
  }

  // Render Data Table View
  function renderTable(labels, datasets) {
    tableHead.innerHTML = `<th>Category / Label</th>`;
    datasets.forEach(ds => {
      tableHead.innerHTML += `<th>${ds.label}</th>`;
    });

    tableBody.innerHTML = '';
    labels.forEach((label, index) => {
      let rowHtml = `<tr><td><strong>${label}</strong></td>`;
      datasets.forEach(ds => {
        rowHtml += `<td>${ds.data[index]}</td>`;
      });
      rowHtml += `</tr>`;
      tableBody.innerHTML += rowHtml;
    });
  }

  // Render Configuration JSON View
  function renderJSON(labels, datasets, type) {
    const config = {
      type: type,
      data: { labels, datasets },
      generatedAt: new Date().toISOString()
    };
    jsonOutput.textContent = JSON.stringify(config, null, 2);
  }

  // Export Canvas Image PNG
  function exportPNG() {
    if (!chartInstance) return;
    const imageURI = chartInstance.toBase64Image();
    const link = document.createElement('a');
    link.download = 'chart-synthesis.png';
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logConsole('[System] Chart image exported as PNG.');
  }

  // Export Data CSV
  function exportCSV() {
    const rows = [];
    const headers = ['Category', 'Value'];
    rows.push(headers.join(','));

    const labels = chartInstance.data.labels;
    const data = chartInstance.data.datasets[0].data;

    labels.forEach((lbl, i) => {
      rows.push(`"${lbl}",${data[i]}`);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "chart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logConsole('[System] Dataset exported as CSV file.');
  }

  function logConsole(msg) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    consoleLogs.appendChild(entry);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

});
