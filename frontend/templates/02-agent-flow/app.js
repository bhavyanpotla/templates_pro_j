document.addEventListener('DOMContentLoaded', () => {

  // 1. Workflow Node Canvas Simulator
  const nodeCards = document.querySelectorAll('.node-card');
  const consoleBox = document.getElementById('consoleBox');

  const nodeLogs = {
    trigger: "● TRIGGER ACTIVE: Incoming Google Maps lead detected at 11:24:02. Initiating qualification pipeline...",
    'ai-agent': "● AI ENGINE EXECUTING: Voice model executing cold outbound conversation. Qualification Score: 92/100.",
    output: "● ACTION DISPATCHED: Hot lead transferred to WhatsApp + Salesforce CRM created instantly."
  };

  nodeCards.forEach(card => {
    card.addEventListener('click', () => {
      nodeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const key = card.getAttribute('data-node');
      if (consoleBox && nodeLogs[key]) {
        consoleBox.innerHTML = nodeLogs[key];
      }
    });
  });

  // 2. Showcase Apps Tabs System
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      document.getElementById(`${targetTab}-content`).classList.add('active');
    });
  });

  // 3. Tax / ROI Calculator Engine
  const serviceTier = document.getElementById('serviceTier');
  const taxRate = document.getElementById('taxRate');

  function updateCalculator() {
    if (!serviceTier || !taxRate) return;
    const base = parseFloat(serviceTier.value);
    const rate = parseFloat(taxRate.value);
    const halfTax = (base * rate) / 2;
    const total = base + (base * rate);

    document.getElementById('basePrice').textContent = "₹" + base.toLocaleString('en-IN');
    document.getElementById('cgstVal').textContent = "₹" + Math.round(halfTax).toLocaleString('en-IN');
    document.getElementById('sgstVal').textContent = "₹" + Math.round(halfTax).toLocaleString('en-IN');
    document.getElementById('totalPrice').textContent = "₹" + Math.round(total).toLocaleString('en-IN');
  }

  if (serviceTier && taxRate) {
    serviceTier.addEventListener('change', updateCalculator);
    taxRate.addEventListener('change', updateCalculator);
    updateCalculator();
  }

  // 4. Drawer & Modal Controller
  const modal = document.getElementById('bookingModal');
  const drawer = document.getElementById('serviceDrawer');

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (drawer) drawer.style.display = 'none';
      modal.style.display = 'flex';
    });
  });

  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'none';
      if (drawer) drawer.style.display = 'none';
    });
  });

  // 5. Accordion Toggle
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      const isActive = parent.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      if (!isActive) parent.classList.add('active');
    });
  });

});
