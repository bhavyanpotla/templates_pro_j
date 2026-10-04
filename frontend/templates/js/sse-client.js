// frontend/js/sse-client.js

class AgentStreamClient {
  constructor(onStateUpdate) {
    this.onStateUpdate = onStateUpdate;
    this.eventSource = null;
    this.init();
  }

  init() {
    // Connect to FastAPI SSE stream
    this.eventSource = new EventSource('/api/stream');

    this.eventSource.onmessage = (event) => {
      try {
        const state = JSON.parse(event.data);
        if (this.onStateUpdate) {
          this.onStateUpdate(state);
        }
      } catch (err) {
        console.error("Error parsing SSE agent state:", err);
      }
    };

    this.eventSource.onerror = (err) => {
      console.warn("SSE connection interrupted. Retrying...", err);
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
