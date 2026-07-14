// Pekosoft System
// pekosoft.net/js/system.js

const systemPage = document.getElementById("system-page");
const systemUpdateButton = document.getElementById("system-update-button");
const systemCopyButton = document.getElementById("system-copy-button");
const systemClockHour = document.getElementById("system-clock-hour");
const systemClockMinute = document.getElementById("system-clock-minute");
const systemClockSecond = document.getElementById("system-clock-second");
const systemCalendarGrid = document.getElementById("system-calendar-grid");
let renderedCalendarMonth = "";

function getSystemElement(id) {
  return document.getElementById(`system-${id}`);
}

function setSystemValue(id, value) {
  const element = getSystemElement(id);
  if (!element) return;
  element.textContent = value || "Unavailable";
}

function formatBoolean(value) {
  return value ? "Yes" : "No";
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "Unavailable";
  return value.toFixed(3);
}

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function formatLocalTime(date) {
  const hours = padDatePart(date.getHours());
  const minutes = padDatePart(date.getMinutes());
  const seconds = padDatePart(date.getSeconds());
  return `${hours}:${minutes}:${seconds} ${formatLocalDate(date)}`;
}

function formatHeroTime(date) {
  const hours = padDatePart(date.getHours());
  const minutes = padDatePart(date.getMinutes());
  const seconds = padDatePart(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

function formatLocalDate(date) {
  const day = padDatePart(date.getDate());
  const month = padDatePart(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatHeroDate(date) {
  const weekday = date.toLocaleString("en-US", { weekday: "long" });
  return `${weekday} ${formatLocalDate(date)}`;
}

function getIsoWeek(date) {
  const weekDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = weekDate.getUTCDay() || 7;
  weekDate.setUTCDate(weekDate.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(weekDate.getUTCFullYear(), 0, 1));
  return Math.ceil((((weekDate - yearStart) / 86400000) + 1) / 7);
}

function getOperatingSystem() {
  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";

  if (/Windows NT 10\.0/i.test(userAgent)) return "Windows 10 / 11";
  if (/Windows NT 6\.3/i.test(userAgent)) return "Windows 8.1";
  if (/Windows NT 6\.2/i.test(userAgent)) return "Windows 8";
  if (/Windows NT 6\.1/i.test(userAgent)) return "Windows 7";
  if (/Mac OS X/i.test(userAgent)) return `macOS ${userAgent.match(/Mac OS X ([\d_]+)/i)?.[1]?.replace(/_/g, ".") || ""}`.trim();
  if (/Android/i.test(userAgent)) return `Android ${userAgent.match(/Android ([\d.]+)/i)?.[1] || ""}`.trim();
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS / iPadOS";
  if (/Linux/i.test(platform) || /Linux/i.test(userAgent)) return "Linux";

  return platform || "Unavailable";
}

function getBrowser() {
  const userAgent = navigator.userAgent || "";
  const matchers = [
    ["Edge", /Edg\/([\d.]+)/],
    ["Chrome", /Chrome\/([\d.]+)/],
    ["Firefox", /Firefox\/([\d.]+)/],
    ["Safari", /Version\/([\d.]+).*Safari/]
  ];

  for (const [name, regex] of matchers) {
    const match = userAgent.match(regex);
    if (match) return `${name} ${match[1]}`;
  }

  return navigator.appName || "Unavailable";
}

function getCpu() {
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  const cpuSource = `${platform} ${userAgent}`;
  const architecture = /Win64|x64|x86_64|amd64/i.test(cpuSource) ? "x64" : platform;

  if (architecture) return `CPU vendor/model unavailable (${architecture})`;
  return "CPU vendor/model unavailable";
}

function getCpuCores() {
  return navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} logical cores` : "Unavailable";
}

function collectSystemInfo() {
  const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB or more` : "Unavailable";
  const cpu = getCpu();
  const cores = getCpuCores();
  const screenSize = window.screen ? `${screen.width} x ${screen.height}` : "Unavailable";
  const viewport = `${window.innerWidth} x ${window.innerHeight}`;
  const color = window.screen ? `${screen.colorDepth}-bit` : "Unavailable";
  const languages = navigator.languages && navigator.languages.length ? navigator.languages.join(", ") : navigator.language;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unavailable";
  const localTime = formatLocalTime(new Date());
  const touchPoints = navigator.maxTouchPoints || 0;

  return {
    cpu,
    cores,
    ram: memory,
    os: getOperatingSystem(),
    browser: getBrowser(),
    ip: systemPage?.dataset.clientIp || "Unavailable",
    screen: screenSize,
    viewport,
    "pixel-ratio": formatNumber(window.devicePixelRatio || 1),
    color,
    language: languages,
    "time-zone": timeZone,
    "hero-time-zone": timeZone,
    "local-time": localTime,
    online: formatBoolean(navigator.onLine),
    cookies: formatBoolean(navigator.cookieEnabled),
    touch: touchPoints ? `${touchPoints} touch points` : "No",
    "user-agent": navigator.userAgent || "Unavailable"
  };
}

function renderSystemInfo() {
  const info = collectSystemInfo();
  Object.keys(info).forEach((key) => setSystemValue(key, info[key]));
}

function renderCalendarMonth(date) {
  if (!systemCalendarGrid) return;

  const year = date.getFullYear();
  const month = date.getMonth();
  const monthKey = `${year}-${month}`;

  if (renderedCalendarMonth !== monthKey) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const rows = Math.ceil(daysInMonth / 7);

    systemCalendarGrid.textContent = "";

    for (let row = 0; row < rows; row++) {
      const rowStartDay = (row * 7) + 1;
      const weekCell = document.createElement("div");
      weekCell.className = "system-calendar-week";
      weekCell.textContent = padDatePart(getIsoWeek(new Date(year, month, rowStartDay)));
      systemCalendarGrid.appendChild(weekCell);

      const spacerCell = document.createElement("div");
      spacerCell.className = "system-calendar-spacer";
      systemCalendarGrid.appendChild(spacerCell);

      for (let column = 0; column < 7; column++) {
        const day = rowStartDay + column;
        const cell = document.createElement("div");
        cell.className = day <= daysInMonth ? "system-calendar-day" : "system-calendar-day system-calendar-empty";

        if (day <= daysInMonth) {
          const dayNumber = document.createElement("div");
          dayNumber.className = "system-calendar-daynum";
          dayNumber.textContent = padDatePart(day);
          cell.dataset.day = day;
          cell.appendChild(dayNumber);
        }

        systemCalendarGrid.appendChild(cell);
      }
    }

    renderedCalendarMonth = monthKey;
  }

  systemCalendarGrid.querySelectorAll(".system-calendar-today").forEach((cell) => {
    cell.classList.remove("system-calendar-today");
  });

  const todayCell = systemCalendarGrid.querySelector(`.system-calendar-day[data-day="${date.getDate()}"]`);
  if (todayCell) todayCell.classList.add("system-calendar-today");
}

function renderLocalTime() {
  const date = new Date();
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  setSystemValue("local-time", formatLocalTime(date));
  setSystemValue("hero-local-time", formatHeroTime(date));
  setSystemValue("hero-local-date", formatHeroDate(date));
  renderCalendarMonth(date);

  if (systemClockHour) systemClockHour.style.transform = `rotate(${(hours * 30) + (minutes * 0.5)}deg)`;
  if (systemClockMinute) systemClockMinute.style.transform = `rotate(${(minutes * 6) + (seconds * 0.1)}deg)`;
  if (systemClockSecond) systemClockSecond.style.transform = `rotate(${seconds * 6}deg)`;
}

function getSystemInfoText() {
  const rows = Array.from(document.querySelectorAll(".system-row"));
  return rows.map((row) => {
    const label = row.querySelector("span")?.textContent.trim() || "";
    const value = row.querySelector("strong")?.textContent.trim() || "";
    return `${label} ${value}`;
  }).join("\n");
}

function copySystemInfo() {
  const text = getSystemInfoText();
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text);
}

renderSystemInfo();
renderLocalTime();
window.addEventListener("resize", renderSystemInfo);
window.addEventListener("online", renderSystemInfo);
window.addEventListener("offline", renderSystemInfo);
systemUpdateButton?.addEventListener("click", renderSystemInfo);
systemCopyButton?.addEventListener("click", copySystemInfo);
setInterval(renderLocalTime, 1000);

// END OF FILE
