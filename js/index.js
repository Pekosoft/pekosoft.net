// Pekosoft Index
// pekosoft.net/js/index.js

function syncPekosoftViewport() {
  const viewport = window.visualViewport;
  const height = viewport ? viewport.height : window.innerHeight;
  const offsetTop = viewport ? viewport.offsetTop : 0;
  const bottomGap = viewport ? window.innerHeight - viewport.offsetTop - viewport.height : 0;
  const root = document.documentElement;

  if (Number.isFinite(height) && height > 0) {
    const roundedHeight = Math.round(height);
    root.style.setProperty('--visual-viewport-height', `${roundedHeight}px`);
    root.style.setProperty('--module-viewport-height', `${roundedHeight}px`);
  }

  if (Number.isFinite(offsetTop) && offsetTop >= 0) {
    root.style.setProperty('--visual-viewport-offset-top', `${Math.round(offsetTop)}px`);
  }

  if (Number.isFinite(bottomGap)) {
    root.style.setProperty('--visual-viewport-bottom-gap', `${Math.max(0, Math.round(bottomGap))}px`);
  }
}

window.syncPekosoftViewport = syncPekosoftViewport;
syncPekosoftViewport();
window.addEventListener('resize', syncPekosoftViewport);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', syncPekosoftViewport);
  window.visualViewport.addEventListener('scroll', syncPekosoftViewport);
}

// Function to toggle the TOC visibility

function toggleMenu() {
  const toc = document.getElementById('toc');
  toc.classList.toggle('toc-open');
}

// Function to close the TOC when clicked outside

document.addEventListener('click', function (event) {
  const toc = document.getElementById('toc');
  const burger = document.querySelector('#burger-container');

  const isClickInsideToc = toc.contains(event.target);
  const isClickOnBurger = burger.contains(event.target);

  // If click is outside of TOC and not on the burger icon, close the TOC
  if (!isClickInsideToc && !isClickOnBurger && toc.classList.contains('toc-open')) {
    toc.classList.remove('toc-open');
  }
});

// Function to close the TOC when ESC key is pressed

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const toc = document.getElementById('toc');
    if (toc.classList.contains('toc-open')) {
      toc.classList.remove('toc-open');
    }
  }
});

// Function to toggle the Release TOC visibility

function toggleReleaseMenu() {
  const releaseToc = document.getElementById('release-toc');
  if (!releaseToc) return;

  releaseToc.classList.toggle('release-toc-open');
  document.body.classList.toggle('release-toc-active', releaseToc.classList.contains('release-toc-open'));
}

// Function to close the Release TOC when clicked outside

document.addEventListener('click', function (event) {
  const releaseToc = document.getElementById('release-toc');
  const releaseBurger = document.querySelector('#release-burger-container');

  if (!releaseToc || !releaseBurger) return;

  const isClickInsideReleaseToc = releaseToc.contains(event.target);
  const isClickOnReleaseBurger = releaseBurger.contains(event.target);

  // If click is outside of Release TOC and not on the burger icon, close the Release TOC
  if (!isClickInsideReleaseToc && !isClickOnReleaseBurger && releaseToc.classList.contains('release-toc-open')) {
    releaseToc.classList.remove('release-toc-open');
    document.body.classList.remove('release-toc-active');
  }
});

// Function to close the Release TOC when ESC key is pressed

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const releaseToc = document.getElementById('release-toc');
    if (!releaseToc) return;

    if (releaseToc.classList.contains('release-toc-open')) {
      releaseToc.classList.remove('release-toc-open');
      document.body.classList.remove('release-toc-active');
    }
  }
});

// Function to collapse/expand DIVs

function toggleDiv(containerId) {
  const contentContainer = document.getElementById(containerId); // Get the relevant container

  if (contentContainer.classList.contains('collapsed')) {
    contentContainer.classList.remove('collapsed');
  } else {
    contentContainer.classList.add('collapsed');
  }
}

// Function to count rows in tables

function CountRows() {
  const table = document.getElementById('filter_table');
  const rowsShown = document.getElementById('rows_shown');

  if (!table || !rowsShown) return 0;

  const rows = Array.from(table.querySelectorAll('tr'));
  const visibleRows = rows.filter((row) => row.offsetParent !== null);
  const rowCount = Math.max(visibleRows.length - 1, 0);

  rowsShown.textContent = String(rowCount);
  return rowCount;
}

// Function to toggle light mode/dark mode

function toggleMode() {
  const htmlElement = document.documentElement;
  htmlElement.classList.toggle('invert-colors');

  // Store mode preference in local storage
  if (htmlElement.classList.contains('invert-colors')) {
    localStorage.setItem('global.mode', 'dark');
  } else {
    localStorage.setItem('global.mode', 'light');
  }
}

function markActiveFooterLink() {
  const footerLinks = document.querySelectorAll('.footer a[href]');
  if (!footerLinks.length) return;

  const normalizeFooterPath = (pathname) => {
    const path = pathname.replace(/\/$/, '') || '/index.php';
    return path.replace(/\.php$/, '');
  };

  const currentUrl = new URL(window.location.href);
  const currentPath = normalizeFooterPath(currentUrl.pathname);
  const contextPages = new Set(['/about', '/help', '/history']);
  const currentRelease = currentUrl.searchParams.get('r') || '';

  footerLinks.forEach(link => {
    const linkUrl = new URL(link.getAttribute('href') || '', window.location.origin);
    const linkPath = normalizeFooterPath(linkUrl.pathname);

    let isCurrent = false;
    if (contextPages.has(currentPath)) {
      const linkRelease = linkUrl.searchParams.get('r') || '';
      isCurrent = linkPath === currentPath && linkRelease === currentRelease;
    } else {
      isCurrent = linkPath === currentPath;
    }

    link.classList.toggle('current', isCurrent);
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function syncFooterGap() {
  const footers = document.querySelectorAll('.footer');
  footers.forEach(footer => {
    const items = Array.from(footer.children);
    if (items.length < 2) return;

    footer.style.setProperty('--footer-gap', '12px');

    const footerStyles = getComputedStyle(footer);
    const contentWidth = footer.clientWidth - parseFloat(footerStyles.paddingLeft) - parseFloat(footerStyles.paddingRight);
    const itemWidth = Math.max(...items.map(item => item.getBoundingClientRect().width));
    const minimumGap = 12;

    if (!Number.isFinite(contentWidth) || !Number.isFinite(itemWidth) || contentWidth <= 0 || itemWidth <= 0) return;

    const visibleItems = Math.min(items.length, Math.floor((contentWidth + minimumGap) / (itemWidth + minimumGap)));
    if (visibleItems < 2 || visibleItems >= items.length) return;

    const fittedGap = (contentWidth - visibleItems * itemWidth) / (visibleItems - 1);
    footer.style.setProperty('--footer-gap', `${Math.max(minimumGap, fittedGap).toFixed(3)}px`);
  });
}

function ensurePekosoftFilename(filename) {
  const safeName = String(filename || '').trim();
  if (!safeName) return 'pekosoft_file';
  return safeName.toLowerCase().startsWith('pekosoft_')
    ? safeName
    : `pekosoft_${safeName}`;
}

window.ensurePekosoftFilename = ensurePekosoftFilename;

document.addEventListener('pointerdown', function (event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest('button[id$="decrease-button"], button[id$="increase-button"]');
  if (button && !button.disabled) {
    button.focus({ preventScroll: true });
  }
}, true);

function bindPekosoftRangeButtons(slider, decreaseButton, increaseButton, options = {}) {
  if (!slider || !decreaseButton || !increaseButton) return null;

  const holdDelay = Math.max(0, Number(options.holdDelay) || 350);
  const repeatDelay = Math.max(16, Number(options.repeatDelay) || 80);
  let holdTimer = null;
  let repeatTimer = null;
  let didRepeat = false;

  function step(direction) {
    direction > 0 ? slider.stepUp() : slider.stepDown();
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function stopRepeating() {
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);
    holdTimer = null;
    repeatTimer = null;
  }

  function bind(button, direction) {
    button.addEventListener('pointerdown', function (event) {
      if (event.button !== 0 || button.disabled) return;
      didRepeat = false;
      try {
        button.setPointerCapture?.(event.pointerId);
      } catch (_) {
        // Capture may be unavailable for synthetic or accessibility pointers.
      }
      holdTimer = setTimeout(function () {
        didRepeat = true;
        step(direction);
        repeatTimer = setInterval(function () {
          step(direction);
        }, repeatDelay);
      }, holdDelay);
    });

    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (eventName) {
      button.addEventListener(eventName, stopRepeating);
    });

    button.addEventListener('click', function (event) {
      if (didRepeat) {
        event.preventDefault();
        didRepeat = false;
        return;
      }
      step(direction);
    });
  }

  bind(decreaseButton, -1);
  bind(increaseButton, 1);

  return { destroy: stopRepeating };
}

window.bindPekosoftRangeButtons = bindPekosoftRangeButtons;

function triggerDownloadFromCanvas(canvas, filename) {
  if (!canvas) return;

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = ensurePekosoftFilename(filename);
  link.click();
}

function buildTimelineBitmap(timelineContainer) {
  if (!timelineContainer) return null;

  const canvases = Array.from(timelineContainer.querySelectorAll("canvas"))
    .filter((canvas) => canvas.id !== "timeline-ruler")
    .filter((canvas) => {
      const style = getComputedStyle(canvas);
      return style.display !== "none" && style.visibility !== "hidden" && canvas.width > 0 && canvas.height > 0;
    });

  if (canvases.length) {
    const baseCanvas = canvases.reduce((largest, current) => {
      const largestArea = largest.width * largest.height;
      const currentArea = current.width * current.height;
      return currentArea > largestArea ? current : largest;
    });

    const width = baseCanvas.width || baseCanvas.clientWidth || 1;
    const height = baseCanvas.height || baseCanvas.clientHeight || 1;
    const output = document.createElement("canvas");
    output.width = width;
    output.height = height;
    const ctx = output.getContext("2d");
    if (!ctx) return null;

    const layers = canvases.filter((canvas) => canvas.width === width && canvas.height === height);
    layers.forEach((canvas) => {
      ctx.drawImage(canvas, 0, 0);
    });

    return output;
  }

  const svgCandidates = Array.from(timelineContainer.querySelectorAll(".timeline-scroll svg, svg"))
    .filter((svgEl) => {
      if (svgEl.classList.contains("icons")) return false;
      const style = getComputedStyle(svgEl);
      if (style.display === "none" || style.visibility === "hidden") return false;

      const viewBox = svgEl.viewBox && svgEl.viewBox.baseVal ? svgEl.viewBox.baseVal : null;
      const viewArea = viewBox && viewBox.width > 0 && viewBox.height > 0 ? viewBox.width * viewBox.height : 0;
      const clientArea = Math.max(1, svgEl.clientWidth) * Math.max(1, svgEl.clientHeight);
      return viewArea > 0 || clientArea > (32 * 32);
    });

  if (!svgCandidates.length) return null;

  const svg = svgCandidates.reduce((largest, current) => {
    const largestBox = largest.viewBox && largest.viewBox.baseVal ? largest.viewBox.baseVal : null;
    const currentBox = current.viewBox && current.viewBox.baseVal ? current.viewBox.baseVal : null;
    const largestArea = largestBox && largestBox.width > 0 && largestBox.height > 0
      ? largestBox.width * largestBox.height
      : Math.max(1, largest.clientWidth) * Math.max(1, largest.clientHeight);
    const currentArea = currentBox && currentBox.width > 0 && currentBox.height > 0
      ? currentBox.width * currentBox.height
      : Math.max(1, current.clientWidth) * Math.max(1, current.clientHeight);
    return currentArea > largestArea ? current : largest;
  });

  const box = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal : null;
  const width = Math.max(1, Math.round(box && box.width ? box.width : (svg.clientWidth || 800)));
  const height = Math.max(1, Math.round(box && box.height ? box.height : (svg.clientHeight || 256)));
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;

  const cloned = svg.cloneNode(true);
  if (!cloned.getAttribute("xmlns")) {
    cloned.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  cloned.setAttribute("width", String(width));
  cloned.setAttribute("height", String(height));

  const data = new XMLSerializer().serializeToString(cloned);
  const url = URL.createObjectURL(new Blob([data], { type: "image/svg+xml;charset=utf-8" }));

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ctx = output.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }
      URL.revokeObjectURL(url);
      resolve(output);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function setupTimelineSaveButton() {
  const timelineContainer = document.getElementById("timeline-container");
  if (!timelineContainer) return;

  const footer = timelineContainer.querySelector(".module-footer");
  if (!footer || footer.querySelector(".timeline-save-button")) return;

  const hasCanvas = !!timelineContainer.querySelector("canvas");
  const hasSvg = !!timelineContainer.querySelector("svg");
  if (!hasCanvas && !hasSvg) return;

  const saveButton = document.createElement("button");
  saveButton.className = "square timeline-save-button";
  saveButton.title = "Save bitmap";
  saveButton.innerHTML = `
    <svg class="icons"><use href="/icons.svg#photo" /></svg>
    <span class="button-text">SAVE</span>`;

  saveButton.addEventListener("click", async () => {
    const release = getReleaseFromPath();
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const filename = `${release}_timeline_${day}-${month}-${year}_${hours}-${minutes}-${seconds}.png`;
    const bitmap = await buildTimelineBitmap(timelineContainer);
    if (!bitmap) return;
    triggerDownloadFromCanvas(bitmap, filename);
  });

  footer.appendChild(saveButton);
}

function getStatusTargetLabel(target) {
  if (!target) return null;

  const tooltip = target.getAttribute('title')?.trim();
  if (!tooltip) return null;

  const isLabel = target.tagName && target.tagName.toLowerCase() === 'label';

  if (isLabel) {
    const labelName = (target.textContent || '').trim().replace(/:\s*$/, '').toUpperCase() || 'LABEL';
    const sentenceTooltip = /[.!?]$/.test(tooltip) ? tooltip : `${tooltip}.`;
    return `${labelName}: ${sentenceTooltip}`;
  }

  const buttonText = target.querySelector('.button-text')?.textContent?.trim();
  const ariaLabel = target.getAttribute('aria-label')?.trim();
  const idText = target.id ? target.id.replace(/-button$/i, '').toUpperCase() : '';
  const fallback = (target.textContent || '').trim().split(/\s+/).slice(0, 2).join(' ').toUpperCase();
  const nameRaw = buttonText || ariaLabel || idText || fallback || 'BUTTON';
  const name = String(nameRaw).toUpperCase();

  const sentenceTooltip = /[.!?]$/.test(tooltip) ? tooltip : `${tooltip}.`;

  return `${name}: ${sentenceTooltip}`;
}

function createControlsStatusBar() {
  const bar = document.createElement('div');
  bar.className = 'module-footer wrapper colored statusbar';
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-live', 'polite');
  bar.setAttribute('data-statusbar', '');
  bar.setAttribute('data-status-ready', 'READY: Hover or tap a button for help.');

  bar.innerHTML = `
    <svg class="icons" aria-hidden="true">
      <use href="/icons.svg#about" />
    </svg>
    <span class="status-text" data-status-text>READY: Hover or tap a button for help.</span>`;

  return bar;
}

function ensureControlsStatusBars() {
  const controlsContainers = document.querySelectorAll('#controls-container.container');
  if (!controlsContainers.length) return;

  controlsContainers.forEach((container) => {
    const hasBar = container.querySelector(':scope > [data-statusbar]');
    if (hasBar) return;

    container.appendChild(createControlsStatusBar());
  });
}

function setupStatusBars() {
  const bars = document.querySelectorAll('[data-statusbar]');
  if (!bars.length) return;

  const statusTargetSelector = 'button[title], a[title], label[title]';

  bars.forEach((bar) => {
    const textNode = bar.querySelector('[data-status-text]');
    if (!textNode) return;

    const ready = bar.getAttribute('data-status-ready') || 'READY';
    const root = document;
    let tapTimer = null;

    const setReady = () => {
      textNode.textContent = ready;
    };

    const showFromTarget = (target) => {
      const label = getStatusTargetLabel(target);
      if (label) {
        textNode.textContent = label;
      }
    };

    setReady();

    root.addEventListener('mouseover', (event) => {
      const target = event.target.closest(statusTargetSelector);
      if (!target) return;
      if (tapTimer) {
        clearTimeout(tapTimer);
        tapTimer = null;
      }
      showFromTarget(target);
    });

    root.addEventListener('mouseout', (event) => {
      const fromButton = event.target.closest(statusTargetSelector);
      if (!fromButton) return;
      const toButton = event.relatedTarget && event.relatedTarget.closest ? event.relatedTarget.closest(statusTargetSelector) : null;
      if (toButton === fromButton) return;
      setReady();
    });

    root.addEventListener('focusin', (event) => {
      const target = event.target.closest(statusTargetSelector);
      if (!target) return;
      if (tapTimer) {
        clearTimeout(tapTimer);
        tapTimer = null;
      }
      showFromTarget(target);
    });

    root.addEventListener('focusout', (event) => {
      const fromButton = event.target.closest(statusTargetSelector);
      if (!fromButton) return;
      const toButton = event.relatedTarget && event.relatedTarget.closest ? event.relatedTarget.closest(statusTargetSelector) : null;
      if (toButton === fromButton) return;
      setReady();
    });

    root.addEventListener('click', (event) => {
      const target = event.target.closest(statusTargetSelector);
      if (!target) return;

      showFromTarget(target);
      if (tapTimer) clearTimeout(tapTimer);
      tapTimer = window.setTimeout(() => {
        setReady();
        tapTimer = null;
      }, 1200);
    });

    root.addEventListener('pointerdown', (event) => {
      const target = event.target.closest(statusTargetSelector);
      if (!target) return;
      showFromTarget(target);
    });
  });
}

const SITE_PLAY_STORAGE_KEY = 'global.site_play_active';
const SITE_PLAY_TIMER_MS = 2500;
const SITE_PLAY_SEQUENCE = [
  '/index.php',
  '/tap_pad',
  '/bpm_calculator',
  '/metronome',
  '/turntable',
  '/beta.php',
  '/player',
  '/visualizer',
  '/bpm_circle',
  '/bpm_curve',
  '/circle_of_fifths',
  '/drum_machine',
  '/reference',
  '/tuner',
  '/notepad',
  '/audio_calculator',
  '/piano',
  '/icons',
  '/help.php?r=index',
  '/help.php?r=tap_pad',
  '/help.php?r=bpm_calculator',
  '/help.php?r=metronome',
  '/help.php?r=turntable',
  '/help.php?r=player',
  '/help.php?r=visualizer',
  '/help.php?r=bpm_circle',
  '/help.php?r=bpm_curve',
  '/help.php?r=circle_of_fifths',
  '/help.php?r=drum_machine',
  '/help.php?r=reference',
  '/help.php?r=tuner',
  '/help.php?r=notepad',
  '/help.php?r=audio_calculator',
  '/help.php?r=piano',
  '/help.php?r=icons',
  '/help.php?r=settings',
  '/history.php?r=index',
  '/history.php?r=tap_pad',
  '/history.php?r=bpm_calculator',
  '/history.php?r=metronome',
  '/history.php?r=turntable',
  '/history.php?r=player',
  '/history.php?r=visualizer',
  '/history.php?r=bpm_circle',
  '/history.php?r=bpm_curve',
  '/history.php?r=circle_of_fifths',
  '/history.php?r=drum_machine',
  '/history.php?r=reference',
  '/history.php?r=tuner',
  '/history.php?r=notepad',
  '/history.php?r=audio_calculator',
  '/history.php?r=piano',
  '/history.php?r=icons',
  '/history.php?r=settings',
  '/about.php?r=index',
  '/about.php?r=tap_pad',
  '/about.php?r=bpm_calculator',
  '/about.php?r=metronome',
  '/about.php?r=turntable',
  '/about.php?r=player',
  '/about.php?r=visualizer',
  '/about.php?r=bpm_circle',
  '/about.php?r=bpm_curve',
  '/about.php?r=circle_of_fifths',
  '/about.php?r=drum_machine',
  '/about.php?r=reference',
  '/about.php?r=tuner',
  '/about.php?r=notepad',
  '/about.php?r=audio_calculator',
  '/about.php?r=piano',
  '/about.php?r=icons',
  '/about.php?r=settings',
  '/settings.php',
  '/bitcoin.php'
];

let sitePlayTimer = null;

function normalizePageRef(ref) {
  const url = new URL(ref, window.location.origin);
  let path = url.pathname.replace(/\/$/, '');
  if (!path) path = '/index.php';
  const query = url.searchParams.toString();
  return query ? `${path}?${query}` : path;
}

function getCurrentPageRef() {
  const current = normalizePageRef(window.location.pathname + window.location.search);
  if (SITE_PLAY_SEQUENCE.includes(current)) return current;

  const currentPath = normalizePageRef(window.location.pathname);
  return SITE_PLAY_SEQUENCE.includes(currentPath) ? currentPath : current;
}

function isSitePlayActive() {
  return localStorage.getItem(SITE_PLAY_STORAGE_KEY) === 'true';
}

function setSitePlayActive(active) {
  if (active) {
    localStorage.setItem(SITE_PLAY_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(SITE_PLAY_STORAGE_KEY);
  }
}

function getNextSitePlayHref() {
  const current = getCurrentPageRef();
  const currentIndex = SITE_PLAY_SEQUENCE.indexOf(current);
  if (currentIndex < 0) return SITE_PLAY_SEQUENCE[0];
  if (currentIndex >= SITE_PLAY_SEQUENCE.length - 1) return SITE_PLAY_SEQUENCE[0];
  return SITE_PLAY_SEQUENCE[currentIndex + 1];
}

function updatePlayButtonState() {
  const button = document.getElementById('play-site-button');
  if (!button) return;

  const active = isSitePlayActive();
  button.classList.toggle('button-on', active);
  button.setAttribute('title', 'Play all pages');
  button.setAttribute('aria-label', 'Play all pages');
  button.innerHTML = '<svg class="icons" role="img"><use href="/icons.svg#play"></use></svg>Play';
}

function stopSitePlay() {
  if (sitePlayTimer) {
    clearTimeout(sitePlayTimer);
    sitePlayTimer = null;
  }
  setSitePlayActive(false);
  updatePlayButtonState();
}

function startSitePlay() {
  setSitePlayActive(true);
  updatePlayButtonState();
  const first = SITE_PLAY_SEQUENCE[0];
  if (getCurrentPageRef() !== first) {
    window.location.href = first;
    return;
  }
  window.location.href = getNextSitePlayHref();
}

function scheduleSitePlayAdvance() {
  if (!isSitePlayActive()) return;

  const next = getNextSitePlayHref();
  if (!next) return;

  if (sitePlayTimer) {
    clearTimeout(sitePlayTimer);
  }

  sitePlayTimer = window.setTimeout(() => {
    window.location.href = next;
  }, SITE_PLAY_TIMER_MS);
}

function setupSitePlayMode() {
  const button = document.getElementById('play-site-button');

  const shouldIgnoreInteractionTarget = (target) => {
    if (!(target instanceof Element)) return false;
    return !!target.closest('#play-site-button');
  };

  const isNavigationTarget = (target) => {
    if (!(target instanceof Element)) return false;

    const link = target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.toLowerCase().startsWith('javascript:')) {
        return false;
      }
      return true;
    }

    const navButton = target.closest('button[data-href]');
    if (navButton) return true;

    return false;
  };

  const stopOnNavigationIntent = (event) => {
    if (!isSitePlayActive()) return;
    if (shouldIgnoreInteractionTarget(event.target)) return;
    if (!isNavigationTarget(event.target)) return;
    stopSitePlay();
  };

  const stopOnFormSubmit = (event) => {
    if (!isSitePlayActive()) return;
    if (!(event.target instanceof HTMLFormElement)) return;
    stopSitePlay();
  };

  if (button) {
    button.addEventListener('click', () => {
      if (isSitePlayActive()) {
        stopSitePlay();
      } else {
        startSitePlay();
      }
    });
  }

  document.addEventListener('click', stopOnNavigationIntent, true);
  document.addEventListener('submit', stopOnFormSubmit, true);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!isSitePlayActive()) return;
    stopSitePlay();
  });

  updatePlayButtonState();
  scheduleSitePlayAdvance();
}

// Check for mode preference on page load
document.addEventListener('DOMContentLoaded', function () {
  const mode = localStorage.getItem('global.mode');
  const toggleMenuButton = document.getElementById('toggle-menu-button');
  const toggleMenuCloseButton = document.getElementById('toggle-menu-close-button');
  const toggleModeButton = document.getElementById('toggle-mode-button');
  const toggleFullscreenButton = document.getElementById('toggle-fullscreen-button');

  if (toggleMenuButton) {
    toggleMenuButton.addEventListener('click', toggleMenu);
  }

  if (toggleMenuCloseButton) {
    toggleMenuCloseButton.addEventListener('click', toggleMenu);
  }

  if (toggleModeButton) {
    toggleModeButton.addEventListener('click', toggleMode);
  }

  if (toggleFullscreenButton) {
    toggleFullscreenButton.addEventListener('click', toggleFullscreen);
  }

  if (mode === 'dark') {
    document.documentElement.classList.add('invert-colors');
  }

  markActiveFooterLink();
  syncFooterGap();
  setupTimelineSaveButton();
  ensureControlsStatusBars();
  setupStatusBars();
  setupSitePlayMode();
});

window.addEventListener('resize', syncFooterGap);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', syncFooterGap);
}

// Function to toggle fullscreen mode

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

// Function to attach data-href buttons in release TOC

document.addEventListener("DOMContentLoaded", () => {
  const releaseToggle = document.getElementById("toggle-release-button");
  const releaseToc = document.getElementById("release-toc");
  const releaseCloseButton = document.getElementById("release-close-button");

  if (releaseToggle && releaseToc) {
    releaseToggle.addEventListener("click", toggleReleaseMenu);
  }

  if (releaseCloseButton) {
    releaseCloseButton.addEventListener("click", toggleReleaseMenu);
  }

  document.querySelectorAll(".toc-button[data-href]").forEach(btn => {
    btn.addEventListener("click", () => {
      location.href = btn.dataset.href;
    });
  });
});

// END OF FILE
