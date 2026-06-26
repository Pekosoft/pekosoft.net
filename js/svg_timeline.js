// Shared SVG timeline helpers
// pekosoft.net/js/svg_timeline.js

(function () {
  function isOptionsObject(value) {
    return !!value && typeof value === "object" && !("nodeType" in value);
  }

  function getHeight(svgOrOptions, minHeightArg) {
    const options = isOptionsObject(svgOrOptions) ? svgOrOptions : null;
    const svg = options && "svg" in options
      ? svgOrOptions.svg
      : svgOrOptions;
    const minHeight = options && "minHeight" in options
      ? options.minHeight
      : minHeightArg;
    if (!svg) return minHeight;
    const measured = Math.round(svg.clientHeight || minHeight);
    return Math.max(minHeight, measured);
  }

  function syncViewBox(svgOrOptions, widthArg, heightArg) {
    const options = isOptionsObject(svgOrOptions) ? svgOrOptions : null;
    const svg = options && "svg" in options
      ? svgOrOptions.svg
      : svgOrOptions;
    const width = options && "width" in options
      ? options.width
      : widthArg;
    const height = options && "height" in options
      ? options.height
      : heightArg;
    if (!svg) return;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  }

  function createRafScheduler(callback) {
    let rafId = null;
    return function schedule() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        rafId = null;
        callback();
      });
    };
  }

  function observeResize(options) {
    const {
      svg,
      container,
      onResize,
      includeWindowResize = true,
      includeSvgResize = true,
      includeContainerClassResize = true
    } = options || {};

    if (!svg || typeof onResize !== "function") {
      return () => {};
    }

    const scheduleResize = createRafScheduler(onResize);
    const cleanups = [];

    if (includeWindowResize) {
      window.addEventListener("resize", scheduleResize);
      cleanups.push(() => window.removeEventListener("resize", scheduleResize));
    }

    if (includeSvgResize && typeof ResizeObserver === "function") {
      const svgObserver = new ResizeObserver(() => scheduleResize());
      svgObserver.observe(svg);
      cleanups.push(() => svgObserver.disconnect());
    }

    if (includeContainerClassResize && container && typeof MutationObserver === "function") {
      const classObserver = new MutationObserver(() => scheduleResize());
      classObserver.observe(container, { attributes: true, attributeFilter: ["class"] });
      cleanups.push(() => classObserver.disconnect());
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }

  window.PekoSvgTimeline = {
    getHeight,
    resolveHeight: getHeight,
    syncViewBox,
    setViewBox: syncViewBox,
    observeResize
  };
})();

// END OF FILE
