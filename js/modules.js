// Modules Toggles
// pekosoft.net/js/modules.js

const moduleIds = ["tool", "controls", "timeline", "playlist", "panel", "meters"];
const legacyModuleIds = ["tool", "meters", "controls", "timeline", "playlist", "panel"];
const moduleOrderStorageKey = "global.module_order";

const moduleConfig = {
  tool:     { icon: "tool",     title: "Tool" },
  meters:   { icon: "meter",    title: "Meters" },
  controls: { icon: "controls", title: "Controls" },
  timeline: { icon: "timeline", title: "Timeline" },
  playlist: { icon: "view_list", title: "Playlist" },
  panel:    { icon: "panel",    title: "Panel" }
};

function toggleModule(id) {
  const container = document.getElementById(id + "-container");
  const pageButton = document.getElementById(id + "-toggle");
  const tocButton = document.getElementById(id + "-toggle-toc-button");

  if (!container) return;

  const isNowHidden = container.classList.toggle("hidden");
  const stateKey = "module_" + id + "_state";
  const savedState = localStorage.getItem(stateKey);
  const hasModuleViewState =
    container.classList.contains("module-minimized") ||
    container.classList.contains("module-maximized") ||
    savedState === "minimized" ||
    savedState === "maximized";

  if (isNowHidden || hasModuleViewState) {
    container.classList.remove("module-minimized", "module-maximized");
    container.querySelector(".module-minimize-btn")?.classList.remove("button-on");
    container.querySelector(".module-maximize-btn")?.classList.remove("button-on");
    localStorage.setItem(stateKey, "normal");
  }

  if (pageButton) {
    pageButton.classList.toggle("button-on", !isNowHidden);
  }
  if (tocButton) {
    tocButton.classList.toggle("button-on", !isNowHidden);
  }

  localStorage.setItem("module_" + id, isNowHidden ? "hidden" : "visible");
  syncMaximizedModuleState();
}

function normalizeModuleOrder(order) {
  const seen = new Set();
  const normalized = [];

  (Array.isArray(order) ? order : []).forEach((id) => {
    if (moduleIds.includes(id) && !seen.has(id)) {
      seen.add(id);
      normalized.push(id);
    }
  });

  moduleIds.forEach((id) => {
    if (!seen.has(id)) {
      seen.add(id);
      normalized.push(id);
    }
  });

  return normalized;
}

function isLegacyModuleOrder(order) {
  return Array.isArray(order) &&
    order.length === legacyModuleIds.length &&
    order.every((id, index) => id === legacyModuleIds[index]);
}

function loadModuleOrder() {
  try {
    const saved = JSON.parse(localStorage.getItem(moduleOrderStorageKey) || "null");
    if (isLegacyModuleOrder(saved)) {
      saveModuleOrder(moduleIds);
      return normalizeModuleOrder(moduleIds);
    }
    return normalizeModuleOrder(saved);
  } catch (_) {
    return normalizeModuleOrder(moduleIds);
  }
}

function saveModuleOrder(order) {
  localStorage.setItem(moduleOrderStorageKey, JSON.stringify(normalizeModuleOrder(order)));
}

function isTwoColumnLayoutEnabled() {
  return localStorage.getItem("global.layout") === "true";
}

function isTwoColumnLayoutActive() {
  return isTwoColumnLayoutEnabled() && window.matchMedia("(min-width: 960px)").matches;
}

function syncModuleViewportHeight() {
  if (typeof window.syncPekosoftViewport === "function") {
    window.syncPekosoftViewport();
    return;
  }

  const viewport = window.visualViewport;
  const height = viewport ? viewport.height : window.innerHeight;
  const offsetTop = viewport ? viewport.offsetTop : 0;
  const bottomGap = viewport ? window.innerHeight - viewport.offsetTop - viewport.height : 0;
  if (!Number.isFinite(height) || height <= 0) return;
  const root = document.documentElement;
  const roundedHeight = Math.round(height);
  root.style.setProperty("--visual-viewport-height", `${roundedHeight}px`);
  root.style.setProperty("--module-viewport-height", `${roundedHeight}px`);
  if (Number.isFinite(offsetTop) && offsetTop >= 0) {
    root.style.setProperty("--visual-viewport-offset-top", `${Math.round(offsetTop)}px`);
  }
  if (Number.isFinite(bottomGap)) {
    root.style.setProperty("--visual-viewport-bottom-gap", `${Math.max(0, Math.round(bottomGap))}px`);
  }
}

function syncMaximizedModuleState() {
  const hasMaximizedModule = !!document.querySelector(".container.module-maximized");
  document.documentElement.classList.toggle("module-view-maximized", hasMaximizedModule);
}

function disableMinimizeForTwoColumnLayout() {
  if (!isTwoColumnLayoutActive()) return;

  moduleIds.forEach((id) => {
    const container = document.getElementById(id + "-container");
    if (!container) return;

    container.classList.remove("module-minimized");
    const minimizeBtn = container.querySelector(".module-minimize-btn");
    if (minimizeBtn) {
      minimizeBtn.classList.remove("button-on");
      minimizeBtn.classList.add("grey");
      minimizeBtn.disabled = true;
      minimizeBtn.setAttribute("aria-disabled", "true");
      minimizeBtn.title = "Minimize";
    }
    localStorage.setItem("module_" + id + "_state", "normal");
  });
}

function getCurrentModuleOrder() {
  return moduleIds
    .map((id) => document.getElementById(id + "-container"))
    .filter(Boolean)
    .sort((left, right) => {
      const position = left.compareDocumentPosition(right);
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    })
    .map((container) => container.id.replace(/-container$/, ""));
}

function applyModuleOrder(order) {
  const normalized = normalizeModuleOrder(order);
  const body = document.body;
  const bodyAnchor = document.querySelector(".footer-spacer") || document.querySelector(".footer") || null;

  normalized.forEach((id) => {
    const container = document.getElementById(id + "-container");
    if (container && container.parentNode === body) {
      body.insertBefore(container, bodyAnchor);
    }
  });

  const releaseToc = document.getElementById("release-toc");
  if (!releaseToc) return;

  const tocFooter = releaseToc.querySelector(".toc-footer");
  normalized.forEach((id) => {
    const button = document.getElementById(id + "-toggle-toc-button");
    if (button && releaseToc.contains(button)) {
      releaseToc.insertBefore(button, tocFooter);
    }
  });
}

function restoreModuleStates() {
  moduleIds.forEach((id) => {
    const container = document.getElementById(id + "-container");
    const pageButton = document.getElementById(id + "-toggle");
    const tocButton = document.getElementById(id + "-toggle-toc-button");
    const state = localStorage.getItem("module_" + id);

    const isVisible = state !== "hidden";

    if (container) container.classList.toggle("hidden", !isVisible);
    if (pageButton) pageButton.classList.toggle("button-on", isVisible);
    if (tocButton) tocButton.classList.toggle("button-on", isVisible);
  });
}

function createModuleHeader(id) {
  const cfg = moduleConfig[id] || { icon: "tool", title: id };
  const header = document.createElement("div");
  header.className = "module-header";
  header.innerHTML = `
    <div class="module-header-left">
      <button class="module-icon-btn square icon-only" title="Module options" aria-label="Module options" aria-expanded="false">
        <svg class="icons" aria-hidden="true"><use href="/icons.svg#${cfg.icon}" /></svg>
      </button>
      <span class="module-title">${cfg.title}</span>
      <div class="module-header-actions" hidden>
        <button class="module-minimize-btn square icon-only" title="Minimize">
          <svg class="icons"><use href="/icons.svg#triangle_down" /></svg>
        </button>
        <button class="module-maximize-btn square icon-only" title="Maximize">
          <svg class="icons"><use href="/icons.svg#maximize" /></svg>
        </button>
        <button class="module-fullscreen-btn square icon-only" title="Fullscreen">
          <svg class="icons"><use href="/icons.svg#full_screen" /></svg>
        </button>
        <button class="module-close-btn square icon-only" title="Close">
          <svg class="icons"><use href="/icons.svg#close" /></svg>
        </button>
      </div>
    </div>
    <div class="module-header-right">
      <button class="module-more-btn square icon-only" title="More" aria-expanded="false">
        <svg class="icons"><use href="/icons.svg#more" /></svg>
      </button>
    </div>`;
  return header;
}

function createModuleIconPanel(id) {
  const panel = document.createElement("div");
  panel.className = "module-icon-panel";
  panel.id = id + "-icon-panel";
  panel.hidden = true;
  return panel;
}

function setupModuleHeader(id) {
  const container = document.getElementById(id + "-container");
  if (!container) return;

  const header = createModuleHeader(id);
  container.prepend(header);
  const iconPanel = createModuleIconPanel(id);
  header.insertAdjacentElement("afterend", iconPanel);

  if (typeof setupModuleDrag === "function") {
    setupModuleDrag(container, header, id);
  }

  const iconBtn = header.querySelector(".module-icon-btn");
  const titleEl = header.querySelector(".module-title");
  const actions = header.querySelector(".module-header-actions");
  const moreBtn = header.querySelector(".module-more-btn");
  const minimizeBtn = header.querySelector(".module-minimize-btn");
  const maximizeBtn = header.querySelector(".module-maximize-btn");
  const fullscreenBtn = header.querySelector(".module-fullscreen-btn");
  const closeBtn = header.querySelector(".module-close-btn");

  actions.id = id + "-module-actions";
  iconBtn.setAttribute("aria-controls", actions.id);
  moreBtn.setAttribute("aria-controls", iconPanel.id);

  function updateIconPanelInset() {
    const body = container.querySelector(":scope > .module-body");
    if (!body) return;

    const containerRect = container.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const bodyStyle = getComputedStyle(body);
    const borderTop = parseFloat(bodyStyle.borderTopWidth) || 0;
    const borderRight = parseFloat(bodyStyle.borderRightWidth) || 0;
    const borderBottom = parseFloat(bodyStyle.borderBottomWidth) || 0;
    const borderLeft = parseFloat(bodyStyle.borderLeftWidth) || 0;
    const topInset = Math.max(0, bodyRect.top - containerRect.top + borderTop);
    const rightInset = Math.max(0, containerRect.right - bodyRect.right + borderRight);
    const bottomInset = Math.max(0, containerRect.bottom - bodyRect.bottom + borderBottom);
    const leftInset = Math.max(0, bodyRect.left - containerRect.left + borderLeft);

    iconPanel.style.setProperty("--module-panel-top", `${topInset}px`);
    iconPanel.style.setProperty("--module-panel-right", `${rightInset}px`);
    iconPanel.style.setProperty("--module-panel-bottom", `${bottomInset}px`);
    iconPanel.style.setProperty("--module-panel-left", `${leftInset}px`);
  }

  function updateMinimizeButtonState() {
    const disabled = isTwoColumnLayoutActive();
    minimizeBtn.classList.toggle("grey", disabled);
    minimizeBtn.disabled = disabled;
    minimizeBtn.setAttribute("aria-disabled", disabled ? "true" : "false");
    minimizeBtn.title = disabled ? "Minimize" : "Minimize";
  }

  function collapseMore() {
    actions.hidden = true;
    titleEl.hidden = false;
    iconBtn.classList.remove("button-on");
    iconBtn.setAttribute("aria-expanded", "false");
  }

  function collapseIconPanel() {
    iconPanel.hidden = true;
    container.classList.remove("module-icon-panel-open");
    moreBtn.classList.remove("button-on");
    moreBtn.setAttribute("aria-expanded", "false");
  }

  function expandIconPanel() {
    if (container.classList.contains("module-minimized")) return;
    updateIconPanelInset();
    iconPanel.hidden = false;
    container.classList.add("module-icon-panel-open");
    moreBtn.classList.add("button-on");
    moreBtn.setAttribute("aria-expanded", "true");
  }

  iconBtn.addEventListener("click", () => {
    const isOpen = !actions.hidden;
    actions.hidden = isOpen;
    titleEl.hidden = !isOpen;
    iconBtn.classList.toggle("button-on", !isOpen);
    iconBtn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
    updateMinimizeButtonState();
  });

  moreBtn.addEventListener("click", () => {
    if (iconPanel.hidden) {
      expandIconPanel();
    } else {
      collapseIconPanel();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (container.contains(target)) return;

    collapseIconPanel();
    collapseMore();
  });

  minimizeBtn.addEventListener("click", () => {
    if (isTwoColumnLayoutActive()) return;
    const isMinimized = container.classList.toggle("module-minimized");
    container.classList.remove("module-maximized");
    minimizeBtn.classList.toggle("button-on", isMinimized);
    maximizeBtn.classList.remove("button-on");
    collapseIconPanel();
    localStorage.setItem("module_" + id + "_state", isMinimized ? "minimized" : "normal");
    collapseMore();
    syncMaximizedModuleState();
  });

  maximizeBtn.addEventListener("click", () => {
    const isMaximized = container.classList.toggle("module-maximized");
    container.classList.remove("module-minimized");
    maximizeBtn.classList.toggle("button-on", isMaximized);
    minimizeBtn.classList.remove("button-on");
    collapseIconPanel();
    localStorage.setItem("module_" + id + "_state", isMaximized ? "maximized" : "normal");
    collapseMore();
    syncMaximizedModuleState();
  });

  fullscreenBtn.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement === container) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen error:", err);
    }

    fullscreenBtn.classList.toggle("button-on", document.fullscreenElement === container);
    collapseMore();
  });

  document.addEventListener("fullscreenchange", () => {
    fullscreenBtn.classList.toggle("button-on", document.fullscreenElement === container);
  });

  closeBtn.addEventListener("click", () => {
    toggleModule(id);
    collapseIconPanel();
    collapseMore();
  });

  window.addEventListener("resize", () => {
    updateMinimizeButtonState();
    if (!iconPanel.hidden) updateIconPanelInset();
  });

  const savedState = localStorage.getItem("module_" + id + "_state");
  if (savedState === "minimized" && !isTwoColumnLayoutActive()) {
    container.classList.add("module-minimized");
    minimizeBtn.classList.add("button-on");
  } else if (savedState === "maximized") {
    container.classList.add("module-maximized");
    maximizeBtn.classList.add("button-on");
  }

  updateMinimizeButtonState();
  syncMaximizedModuleState();
}

function getReleaseFromPath() {
  const path = window.location.pathname || "/";
  if (path === "/" || path.endsWith("/")) return "index";
  const last = path.split("/").pop() || "index.php";
  return last.replace(/\.php$/i, "") || "index";
}

function applyPanelWrap(textareas, enabled) {
  textareas.forEach((textarea) => {
    const preview = textarea.parentElement?.querySelector(".panel-syntax-preview");
    if (enabled) {
      textarea.wrap = "soft";
      textarea.style.whiteSpace = "pre-wrap";
      textarea.style.overflowX = "hidden";
      if (preview) preview.style.whiteSpace = "pre-wrap";
    } else {
      textarea.wrap = "off";
      textarea.style.whiteSpace = "pre";
      textarea.style.overflowX = "hidden";
      if (preview) preview.style.whiteSpace = "pre";
    }
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function highlightMarkup(rawText) {
  const escaped = escapeHtml(rawText);

  return escaped.replace(/&lt;!--[\s\S]*?--&gt;|&lt;\/?[\w:-]+[\s\S]*?&gt;/g, (token) => {
    if (token.startsWith("&lt;!--")) {
      return `<span class="panel-syntax-token-comment">${token}</span>`;
    }

    const tagMatch = token.match(/^(&lt;\/?)([\w:-]+)([\s\S]*?)(\/??&gt;)$/);
    if (!tagMatch) return token;

    const open = `<span class="panel-syntax-token-punc">${tagMatch[1]}</span>`;
    const tagName = `<span class="panel-syntax-token-tag">${tagMatch[2]}</span>`;
    const close = `<span class="panel-syntax-token-punc">${tagMatch[4]}</span>`;

    const attrs = tagMatch[3].replace(
      /([\w:-]+)(\s*=\s*)(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g,
      (_, name, eq, value) => `<span class="panel-syntax-token-attr">${name}</span><span class="panel-syntax-token-eq">${eq}</span><span class="panel-syntax-token-string">${value}</span>`
    );

    return `${open}${tagName}${attrs}${close}`;
  });
}

function highlightPlainTail(rawText) {
  const tokenRegex = /(\b\d+(?:\.\d+)?(?:ms|hz|bpm|kb|mb|gb|%)?\b|\{[^}\n]*\}|\[[^\]\n]*\]|\|)/gi;
  let result = "";
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(rawText)) !== null) {
    result += escapeHtml(rawText.slice(lastIndex, match.index));

    if (match[0] === "|") {
      result += `<span class="panel-syntax-token-punc">${escapeHtml(match[0])}</span>`;
    } else if (match[0].startsWith("[")) {
      const timestampMatch = match[0].match(/^\[(\d{2})(:\d{2}:\d{2}(?:\.\d{3})?)\]$/);
      if (timestampMatch) {
        const [, hour, rest] = timestampMatch;
        result += `<span class="panel-syntax-token-punc">[</span><span class="panel-syntax-token-hour">${escapeHtml(hour)}</span><span class="panel-syntax-token-tag">${escapeHtml(rest)}</span><span class="panel-syntax-token-punc">]</span>`;
      } else {
        result += `<span class="panel-syntax-token-tag">${escapeHtml(match[0])}</span>`;
      }
    } else if (match[0].startsWith("{")) {
      result += `<span class="panel-syntax-token-tag">${escapeHtml(match[0])}</span>`;
    } else {
      result += `<span class="panel-syntax-token-string">${escapeHtml(match[0])}</span>`;
    }

    lastIndex = tokenRegex.lastIndex;
  }

  result += escapeHtml(rawText.slice(lastIndex));
  return result;
}

function highlightPianoRecordingLine(line) {
  const match = line.match(/^(\d+(?:\.\d+)?ms)(:\s+)(start|stop)(\s+)([A-G](?:#|b)?\d+)$/i);
  if (!match) {
    return highlightPlainTail(line);
  }

  const [, msValue, separator, action, spacing, noteValue] = match;
  return `${
    `<span class="panel-syntax-token-ms">${escapeHtml(msValue)}</span>` +
    `<span class="panel-syntax-token-punc">${escapeHtml(separator)}</span>` +
    `${escapeHtml(action)}` +
    `${escapeHtml(spacing)}` +
    `<span class="panel-syntax-token-note">${escapeHtml(noteValue)}</span>`
  }`;
}

function highlightPlainText(rawText) {
  return rawText
    .split("\n")
    .map((line) => {
      if (/^\d+(?:\.\d+)?ms:\s+(?:start|stop)\s+[A-G](?:#|b)?\d+$/i.test(line)) {
        return highlightPianoRecordingLine(line);
      }

      if (/^\[\d{2}:\d{2}:\d{2}(?:\.\d{3})?\]/.test(line)) {
        return highlightPlainTail(line);
      }

      const keyMatch = line.match(/^(\s*[^:\n]{1,80})(:\s*)(.*)$/);
      if (!keyMatch) {
        return highlightPlainTail(line);
      }

      const key = `<span class="panel-syntax-token-attr">${escapeHtml(keyMatch[1])}</span>`;
      const sep = `<span class="panel-syntax-token-punc">${escapeHtml(keyMatch[2])}</span>`;
      const tail = highlightPlainTail(keyMatch[3]);
      return `${key}${sep}${tail}`;
    })
    .join("\n");
}

function preservePanelTrailingLine(rawText, highlightedText) {
  return rawText.endsWith("\n")
    ? `${highlightedText}<span class="panel-syntax-trailing-line">&#8203;</span>`
    : highlightedText;
}

function setupPanelSyntaxHighlighting() {
  const panelContainer = document.getElementById("panel-container");
  if (!panelContainer) return;

  const textareas = Array.from(panelContainer.querySelectorAll("textarea"));
  if (!textareas.length) return;

  textareas.forEach((textarea) => {
    if (textarea.parentElement?.classList.contains("panel-syntax-editor")) return;

    const editor = document.createElement("div");
    editor.className = "panel-syntax-editor";

    const preview = document.createElement("pre");
    preview.className = "panel-syntax-preview";
    preview.setAttribute("aria-hidden", "true");

    textarea.classList.add("panel-syntax-textarea");
    textarea.parentNode.insertBefore(editor, textarea);
    editor.appendChild(preview);
    editor.appendChild(textarea);

    const syncPreviewScroll = () => {
      preview.scrollTop = textarea.scrollTop;
      preview.scrollLeft = textarea.scrollLeft;
    };

    const syncPreview = () => {
      const value = textarea.value || "";
      const looksLikeMarkup = /<[\w!/?]/.test(value);
      const highlighted = looksLikeMarkup ? highlightMarkup(value) : highlightPlainText(value);
      preview.innerHTML = preservePanelTrailingLine(value, highlighted);
      syncPreviewScroll();
      requestAnimationFrame(syncPreviewScroll);
      textarea.dataset.panelSyntaxLastValue = value;
    };

    textarea.addEventListener("input", syncPreview);
    textarea.addEventListener("scroll", syncPreviewScroll);
    textarea.addEventListener("select", () => requestAnimationFrame(syncPreviewScroll));

    // Some pages update panel textareas programmatically (no input event);
    // keep the syntax overlay synced with those updates.
    window.setInterval(() => {
      if (!textarea.isConnected) return;
      const currentValue = textarea.value || "";
      if (textarea.dataset.panelSyntaxLastValue !== currentValue) {
        syncPreview();
        return;
      }

      if (preview.scrollTop !== textarea.scrollTop || preview.scrollLeft !== textarea.scrollLeft) {
        syncPreviewScroll();
      }
    }, 200);

    syncPreview();
  });
}

function setupPanelWrapToggle() {
  const panelContainer = document.getElementById("panel-container");
  if (!panelContainer) return;

  const textareas = Array.from(panelContainer.querySelectorAll("textarea"));
  if (!textareas.length) return;

  const footers = Array.from(panelContainer.querySelectorAll(":scope > .module-footer"));
  if (!footers.length) return;

  const release = getReleaseFromPath();
  const wrapStorageKey = `${release}.panel_wrap`;
  const syntaxColorStorageKey = `${release}.panel_syntax_color`;
  const savedWrapSetting = localStorage.getItem(wrapStorageKey);
  const savedSyntaxColorSetting = localStorage.getItem(syntaxColorStorageKey);
  const globalWrapDefault = localStorage.getItem("global.wrap") === "true";
  const isWrapOn = savedWrapSetting === null ? globalWrapDefault : savedWrapSetting === "true";
  const isSyntaxColorOn = savedSyntaxColorSetting !== "false";

  applyPanelWrap(textareas, isWrapOn);
  panelContainer.classList.toggle("panel-syntax-color-off", !isSyntaxColorOn);

  footers.forEach((footer, index) => {
    const copyButton = footer.querySelector("#copy-button");

    const placePanelFooterButton = (button) => {
      if (copyButton && copyButton.parentElement === footer) {
        footer.insertBefore(button, copyButton);
        return;
      }
      footer.appendChild(button);
    };

    let wrapButton = footer.querySelector(".panel-wrap-button");
    if (!wrapButton) {
      wrapButton = document.createElement("button");
      wrapButton.className = "square panel-wrap-button";
      wrapButton.id = index === 0 ? "panel-wrap-button" : `panel-wrap-button-${index + 1}`;
      wrapButton.title = "Toggle text wrap";
      wrapButton.innerHTML = `
      <svg class="icons"><use href="/icons.svg#wrap_text" /></svg>
      <span class="button-text">WRAP</span>`;

      wrapButton.addEventListener("click", () => {
        const nextState = !wrapButton.classList.contains("button-on");
        localStorage.setItem(wrapStorageKey, nextState ? "true" : "false");
        applyPanelWrap(textareas, nextState);
        footers.forEach((f) => {
          const btn = f.querySelector(".panel-wrap-button");
          if (btn) btn.classList.toggle("button-on", nextState);
        });
      });
    }
    wrapButton.classList.toggle("button-on", isWrapOn);
    placePanelFooterButton(wrapButton);

    let colorButton = footer.querySelector(".panel-syntax-color-button");
    if (!colorButton) {
      colorButton = document.createElement("button");
      colorButton.className = "square panel-syntax-color-button";
      colorButton.id = index === 0 ? "panel-syntax-color-button" : `panel-syntax-color-button-${index + 1}`;
      colorButton.title = "Toggle syntax color";
      colorButton.innerHTML = `
      <svg class="icons"><use href="/icons.svg#alpha" /></svg>
      <span class="button-text">COLOR</span>`;

      colorButton.addEventListener("click", () => {
        const nextState = !colorButton.classList.contains("button-on");
        localStorage.setItem(syntaxColorStorageKey, nextState ? "true" : "false");
        panelContainer.classList.toggle("panel-syntax-color-off", !nextState);
        footers.forEach((f) => {
          const btn = f.querySelector(".panel-syntax-color-button");
          if (btn) btn.classList.toggle("button-on", nextState);
        });
      });
    }
    colorButton.classList.toggle("button-on", isSyntaxColorOn);
    placePanelFooterButton(colorButton);
  });
}

async function copyTimelineCanvasToClipboard(timelineContainer) {
  const bitmapBuilder = typeof window.buildTimelineBitmap === "function" ? window.buildTimelineBitmap : null;
  if (!bitmapBuilder) return;
  const canvas = await bitmapBuilder(timelineContainer);
  if (!canvas) return;
  if (!navigator.clipboard || typeof navigator.clipboard.write !== "function" || typeof ClipboardItem === "undefined") return;

  const blob = await new Promise((resolve) => {
    canvas.toBlob((result) => resolve(result), "image/png");
  });
  if (!blob) return;

  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": blob })
  ]);
}

function setupTimelineCopyButton() {
  const timelineContainer = document.getElementById("timeline-container");
  if (!timelineContainer) return;
  const currentPath = (window.location.pathname || "").toLowerCase();
  const isPlayerTimeline = currentPath.endsWith("/player.php") || currentPath === "/player.php";

  const hasCanvas = timelineContainer.querySelector("canvas");
  const hasSvg = timelineContainer.querySelector("svg");
  if (!hasCanvas && !hasSvg) return;

  const footers = Array.from(timelineContainer.querySelectorAll(":scope > .module-footer"));
  if (!footers.length) return;

  footers.forEach((footer, index) => {
    if (footer.querySelector(".timeline-copy-button")) return;

    const copyButton = document.createElement("button");
    copyButton.className = "square timeline-copy-button";
    copyButton.id = index === 0 ? "timeline-copy-button" : `timeline-copy-button-${index + 1}`;
    copyButton.title = isPlayerTimeline ? "Copy to clipboard" : "Copy bitmap";
    copyButton.innerHTML = `
      <svg class="icons"><use href="/icons.svg#copy" /></svg>
      <span class="button-text">COPY</span>`;

    copyButton.addEventListener("click", async () => {
      try {
        if (isPlayerTimeline && typeof window.copyTimelineAudioToClipboard === "function") {
          await window.copyTimelineAudioToClipboard();
          return;
        }
        await copyTimelineCanvasToClipboard(timelineContainer);
      } catch (error) {
        console.warn("Timeline canvas copy failed:", error);
      }
    });

    footer.appendChild(copyButton);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  syncModuleViewportHeight();
  moduleIds.forEach(id => setupModuleHeader(id));
  applyModuleOrder(loadModuleOrder());
  restoreModuleStates();
  disableMinimizeForTwoColumnLayout();
  syncMaximizedModuleState();
  document.documentElement.classList.remove("modules-loading");

  requestAnimationFrame(() => {
    setupPanelSyntaxHighlighting();
    setupPanelWrapToggle();
    setupTimelineCopyButton();
  });

  const map = {
    "tool-toggle-toc-button": () => toggleModule("tool"),
    "meters-toggle-toc-button": () => toggleModule("meters"),
    "controls-toggle-toc-button": () => toggleModule("controls"),
    "timeline-toggle-toc-button": () => toggleModule("timeline"),
    "playlist-toggle-toc-button": () => toggleModule("playlist"),
    "panel-toggle-toc-button": () => toggleModule("panel")
  };

  Object.entries(map).forEach(([id, handler]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
  });
});

window.addEventListener("resize", syncModuleViewportHeight);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", syncModuleViewportHeight);
  window.visualViewport.addEventListener("scroll", syncModuleViewportHeight);
}

// END OF FILE
