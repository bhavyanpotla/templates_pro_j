/* ==========================================================================
   NEXUS OS — Copilot Engine Script (Fully Operational & Interactive)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // State Storage
  let conversations = [];
  let activeConversationId = null;

  // Predefined keyword responses for offline simulation
  const keywordKnowledge = [
    { keywords: ['hello', 'hi', 'hey'], response: "Hello! I am your Nexus OS Copilot synthesizer. How can I assist your workflow today?" },
    { keywords: ['python'], response: "Here is a Python threat analysis snippet:\n```python\nimport os\n\ndef scan_process_logs(log_path):\n    with open(log_path, 'r') as f:\n        logs = f.readlines()\n    return [log for log in logs if 'CRITICAL' in log]\n```" },
    { keywords: ['ai', 'machine learning', 'ml'], response: "Machine Learning models optimize weight vectors through backpropagation and loss minimization algorithms like Adam or SGD." },
    { keywords: ['cybersecurity', 'security'], response: "Nexus Risk Horizon detected low drift variance. Recommended action: Enforce 2FA and apply token rotation on gateway proxies." },
    { keywords: ['html', 'css', 'javascript', 'js'], response: "You can build dynamic UIs with standard Web APIs:\n```js\ndocument.querySelector('#btn').addEventListener('click', () => {\n  console.log('Synthesized!');\n});\n```" },
    { keywords: ['explain', 'help'], response: "I can synthesize web components, review pipeline security, and execute local data analysis tasks." },
    { keywords: ['thanks', 'thank you'], response: "You're welcome! Systems ready for next command." }
  ];

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const newChatBtn = document.getElementById('newChatBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const historyList = document.getElementById('historyList');
  const searchInput = document.getElementById('searchInput');
  const activeChatTitle = document.getElementById('activeChatTitle');
  const heroScreen = document.getElementById('heroScreen');
  const messagesList = document.getElementById('messagesList');
  const messagesContainer = document.getElementById('messagesContainer');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');

  // Initialization
  init();

  function init() {
    setupEventListeners();
    createNewConversation();
  }

  function setupEventListeners() {
    // Sidebar Controls
    if (toggleSidebarBtn) toggleSidebarBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));
    if (newChatBtn) newChatBtn.addEventListener('click', () => createNewConversation());
    if (clearAllBtn) clearAllBtn.addEventListener('click', () => clearAllConversations());
    if (clearChatBtn) clearChatBtn.addEventListener('click', () => clearCurrentMessages());

    // Search Filter
    if (searchInput) {
      searchInput.addEventListener('input', (e) => filterHistory(e.target.value.toLowerCase()));
    }

    // Input Auto-grow & Send Button Enabling Logic
    chatInput.addEventListener('input', updateSendButtonState);

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        triggerSend();
      }
    });

    // Handle Direct Form Submission & Build Button Click
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerSend();
    });

    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerSend();
    });

    // Suggestion Cards Direct Click Handler
    document.querySelectorAll('.suggestion-card').forEach(card => {
      card.addEventListener('click', () => {
        const prompt = card.getAttribute('data-prompt');
        if (prompt) {
          chatInput.value = prompt;
          updateSendButtonState();
          triggerSend();
        }
      });
    });

    // Settings Modal
    if (settingsBtn) settingsBtn.addEventListener('click', () => settingsModal.classList.add('open'));
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('open'));
  }

  function updateSendButtonState() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + 'px';
    
    const hasText = chatInput.value.trim().length > 0;
    if (hasText) {
      sendBtn.removeAttribute('disabled');
    } else {
      sendBtn.setAttribute('disabled', 'true');
    }
  }

  function triggerSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    sendMessage(text);
  }

  // Conversation System
  function createNewConversation() {
    const id = 'conv_' + Date.now();
    const newConv = {
      id,
      title: 'New Session',
      messages: [],
      createdAt: new Date()
    };
    conversations.unshift(newConv);
    switchConversation(id);
    renderSidebar();
  }

  function switchConversation(id) {
    activeConversationId = id;
    const conv = getActiveConv();
    if (!conv) return;

    activeChatTitle.textContent = conv.title;
    renderMessages();
    renderSidebar();
  }

  function getActiveConv() {
    return conversations.find(c => c.id === activeConversationId);
  }

  function clearAllConversations() {
    conversations = [];
    createNewConversation();
  }

  function clearCurrentMessages() {
    const conv = getActiveConv();
    if (conv) {
      conv.messages = [];
      renderMessages();
    }
  }

  function filterHistory(term) {
    document.querySelectorAll('.history-item').forEach(item => {
      const text = item.querySelector('.history-item-title').textContent.toLowerCase();
      item.style.display = text.includes(term) ? 'flex' : 'none';
    });
  }

  // Messaging & Assistant Simulation Logic
  function sendMessage(text) {
    const conv = getActiveConv();
    if (!conv) return;

    // Auto Title Generation on First Message
    if (conv.messages.length === 0) {
      conv.title = text.length > 25 ? text.substring(0, 25) + '...' : text;
      activeChatTitle.textContent = conv.title;
    }

    // Add User Message
    conv.messages.push({ role: 'user', text });
    
    // Clear Input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    sendBtn.setAttribute('disabled', 'true');

    renderMessages();

    // Typing Indicator and AI Response
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const reply = generateSimulatedReply(text);
      conv.messages.push({ role: 'assistant', text: reply });
      renderMessages();
      renderSidebar();
    }, 1000);
  }

  function generateSimulatedReply(input) {
    const clean = input.toLowerCase();
    for (const item of keywordKnowledge) {
      if (item.keywords.some(kw => clean.includes(kw))) {
        return item.response;
      }
    }
    return `Synthesized response for: "${input}". Pipeline state executing with 0.00ms latency.`;
  }

  // DOM Rendering
  function renderSidebar() {
    historyList.innerHTML = '';
    conversations.forEach(conv => {
      const item = document.createElement('div');
      item.className = `history-item ${conv.id === activeConversationId ? 'active' : ''}`;
      item.innerHTML = `
        <span class="history-item-title">${escapeHtml(conv.title)}</span>
        <button class="history-item-delete" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.closest('.history-item-delete')) {
          e.stopPropagation();
          deleteConversation(conv.id);
        } else {
          switchConversation(conv.id);
        }
      });

      historyList.appendChild(item);
    });
  }

  function deleteConversation(id) {
    conversations = conversations.filter(c => c.id !== id);
    if (conversations.length === 0) {
      createNewConversation();
    } else if (activeConversationId === id) {
      switchConversation(conversations[0].id);
    } else {
      renderSidebar();
    }
  }

  function renderMessages() {
    const conv = getActiveConv();
    messagesList.innerHTML = '';

    if (!conv || conv.messages.length === 0) {
      heroScreen.style.display = 'flex';
      return;
    }

    heroScreen.style.display = 'none';

    conv.messages.forEach(msg => {
      const row = document.createElement('div');
      row.className = `message-row ${msg.role}`;

      if (msg.role === 'user') {
        row.innerHTML = `<div class="user-bubble">${escapeHtml(msg.text)}</div>`;
      } else {
        row.innerHTML = `
          <div class="assistant-card">
            <div class="assistant-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div class="assistant-content">
              <div class="assistant-text">${formatCodeBlocks(escapeHtml(msg.text))}</div>
              <div class="msg-actions">
                <button class="action-icon-btn copy-btn" title="Copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></button>
                <button class="action-icon-btn" title="Like"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg></button>
              </div>
            </div>
          </div>
        `;

        const copyBtn = row.querySelector('.copy-btn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(msg.text);
          });
        }
      }

      messagesList.appendChild(row);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const row = document.createElement('div');
    row.id = 'typingRow';
    row.className = 'message-row assistant';
    row.innerHTML = `
      <div class="assistant-card">
        <div class="assistant-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div class="typing-indicator">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    messagesList.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingRow = document.getElementById('typingRow');
    if (typingRow) typingRow.remove();
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatCodeBlocks(str) {
    return str.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  }

});
