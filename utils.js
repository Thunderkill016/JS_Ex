// Custom Console Emulator
const CustomConsole = {
  log: function (message) {
    const consoleEl = document.getElementById("console-output");
    if (!consoleEl) return;

    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.style.opacity = "0";
    entry.style.animation = "fadeIn 0.2s forwards";

    // Add timestamp
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour12: false });

    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-msg">${message}</span>`;
    consoleEl.appendChild(entry);

    // Auto scroll to bottom
    consoleEl.scrollTop = consoleEl.scrollHeight;
  },

  clear: function () {
    const consoleEl = document.getElementById("console-output");
    if (consoleEl) consoleEl.innerHTML = "";
  },

  success: function (message) {
    this.log(
      `<span style="color: #3fb950; font-weight: bold;">✔ ${message}</span>`,
    );
  },

  info: function (message) {
    this.log(`<span style="color: #58a6ff;">ℹ ${message}</span>`);
  },

  error: function (message) {
    this.log(
      `<span style="color: #f85149; font-weight: bold;">✖ ${message}</span>`,
    );
  },
};

// Mini IDE Logic with CodeMirror
const MiniIDE = {
  editor: null,
  defaultCode: "",
  isRunning: false, // Track whether code is currently executing

  create: function (containerId, initialCode) {
    this.defaultCode = initialCode;
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create the HTML structure
    container.innerHTML = `
      <div class="ide-layout">
        <div class="editor-pane">
            <div class="ide-toolbar">
                <span class="ide-label">JavaScript Editor</span>
                <button class="btn-reset" onclick="MiniIDE.reset()"><span class="btn-icon">⟲</span> Reset</button>
            </div>
            
            <div id="codemirror-container" class="code-editor-wrapper"></div>

            <div class="ide-controls">
                <button class="btn-run-ide" onclick="MiniIDE.run()"><span class="btn-icon">▶</span> Run Code</button>
                <button class="btn-stop-ide" onclick="MiniIDE.stop()"><span class="btn-icon">⏸</span> Stop</button>
            </div>
        </div>

        <div class="console-pane">
            <div class="console-header">
                <span>Console Output</span>
                <div class="console-dots">
                    <div class="dot dot-red"></div>
                    <div class="dot dot-yellow"></div>
                    <div class="dot dot-green"></div>
                </div>
            </div>
            <div id="console-output" class="console-content">
                <div class="log-entry"><span class="log-time">[System]</span> Ready to code...</div>
            </div>
        </div>
      </div>
    `;

    // Initialize CodeMirror
    const cmContainer = document.getElementById("codemirror-container");
    this.editor = CodeMirror(cmContainer, {
      value: initialCode.trim(),
      mode: "javascript",
      theme: "monokai",
      lineNumbers: true,
      autofocus: true,
      tabSize: 2,
      indentUnit: 2,
      lineWrapping: true, // CRITICAL: Enable line wrapping to prevent horizontal overflow
      extraKeys: {
        Tab: function (cm) {
          cm.replaceSelection("  ");
        },
      },
    });
  },

  run: function () {
    try {
      // Clear old timers/intervals from previous run
      this.stop();

      CustomConsole.clear();
      CustomConsole.info("Running code...");

      // Get code from CodeMirror
      const code = this.editor.getValue();

      // Replace console.log with CustomConsole.log
      const wrappedCode = code.replace(/console\.log\(/g, "CustomConsole.log(");

      // Execute code
      eval(wrappedCode);

      this.isRunning = true;
    } catch (error) {
      CustomConsole.log(
        `<span style="color: #f85149; font-weight: bold;">✖ Error: ${error.message}</span>`,
      );
      this.isRunning = false;
    }
  },

  stop: function () {
    // Clear all timers and intervals
    for (let i = 1; i < 99999; i++) {
      window.clearInterval(i);
      window.clearTimeout(i);
    }
    this.isRunning = false;
    CustomConsole.info("Code stopped.");
  },

  reset: function () {
    // Direct reload without confirmation for stability
    // This ensures the button always works without being blocked by popup blockers
    window.location.reload();
  },
};
