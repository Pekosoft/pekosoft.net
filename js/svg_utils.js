// Shared SVG utilities
// pekosoft.net/js/svg_utils.js

(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function snapCoordinate(value, strokeWidth = 1) {
    if (!isFiniteNumber(value)) return value;
    const width = isFiniteNumber(strokeWidth) ? Math.max(1, Math.abs(strokeWidth)) : 1;
    const isOddStroke = Math.round(width) % 2 === 1;
    if (isOddStroke) {
      return Math.floor(value) + 0.5;
    }
    return Math.round(value);
  }

  function createElement(name) {
    return document.createElementNS(SVG_NS, name);
  }

  function setAttributes(element, attributes) {
    if (!element || !attributes) return element;
    Object.entries(attributes).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      element.setAttribute(key, String(value));
    });
    return element;
  }

  function appendTitle(element, text) {
    if (!element || !text) return element;
    const title = createElement("title");
    title.textContent = String(text);
    element.appendChild(title);
    return element;
  }

  function createLine(options) {
    const {
      x1,
      y1,
      x2,
      y2,
      stroke,
      color,
      strokeWidth = 1,
      width,
      crisp = true,
      snap = true,
      title = ""
    } = options || {};

    const resolvedStroke = stroke ?? color;
    const resolvedStrokeWidth = isFiniteNumber(width) ? width : strokeWidth;

    const sx1 = snap ? snapCoordinate(x1, resolvedStrokeWidth) : x1;
    const sy1 = snap ? snapCoordinate(y1, resolvedStrokeWidth) : y1;
    const sx2 = snap ? snapCoordinate(x2, resolvedStrokeWidth) : x2;
    const sy2 = snap ? snapCoordinate(y2, resolvedStrokeWidth) : y2;

    const line = createElement("line");
    setAttributes(line, {
      x1: sx1,
      y1: sy1,
      x2: sx2,
      y2: sy2,
      stroke: resolvedStroke,
      "stroke-width": resolvedStrokeWidth,
      "shape-rendering": crisp ? "crispEdges" : undefined,
      "vector-effect": "non-scaling-stroke",
      "stroke-linecap": "butt"
    });
    appendTitle(line, title);
    return line;
  }

  function createCircle(options) {
    const {
      cx,
      cy,
      r,
      fill,
      stroke,
      strokeWidth,
      title = ""
    } = options || {};

    const circle = createElement("circle");
    setAttributes(circle, {
      cx,
      cy,
      r,
      fill,
      stroke,
      "stroke-width": strokeWidth
    });
    appendTitle(circle, title);
    return circle;
  }

  function createPath(options) {
    const {
      d,
      points = [],
      stroke,
      color,
      strokeWidth = 1,
      width,
      fill = "none",
      crisp = true,
      title = ""
    } = options || {};

    const resolvedStroke = stroke ?? color;
    const resolvedStrokeWidth = isFiniteNumber(width) ? width : strokeWidth;

    const resolvedD = typeof d === "string"
      ? d
      : points
        .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
        .join(" ");

    const path = createElement("path");
    setAttributes(path, {
      d: resolvedD,
      fill,
      stroke: resolvedStroke,
      "stroke-width": resolvedStrokeWidth,
      "shape-rendering": crisp ? "crispEdges" : undefined,
      "vector-effect": "non-scaling-stroke",
      "stroke-linecap": "butt",
      "stroke-linejoin": "miter"
    });
    appendTitle(path, title);
    return path;
  }

  function createText(options) {
    const {
      x,
      y,
      text,
      fill,
      color,
      fontSize = 12,
      size,
      fontFamily = "Arial, sans-serif",
      textAnchor = "start",
      anchor
    } = options || {};

    const resolvedFill = fill ?? color;
    const resolvedFontSize = isFiniteNumber(size) ? size : fontSize;
    const resolvedTextAnchor = anchor || textAnchor;

    const label = createElement("text");
    setAttributes(label, {
      x,
      y,
      fill: resolvedFill,
      "font-size": resolvedFontSize,
      "font-family": fontFamily,
      "text-anchor": resolvedTextAnchor
    });
    label.textContent = text || "";
    return label;
  }

  window.PekoSvgUtils = {
    createElement,
    setAttributes,
    appendTitle,
    snapCoordinate,
    createLine,
    createCircle,
    createPath,
    createText
  };
})();

// END OF FILE
