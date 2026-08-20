// Pekosoft Notepad
// pekosoft.net/js/notepad.js

function clearTextarea() {
  var textarea = document.getElementById("Textarea");
  textarea.value = "";
  localStorage.removeItem('notepad.text');
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function copyToClipboard() {
  var textarea = document.getElementById("Textarea");
  textarea.select();
  document.execCommand("copy");
}

function downloadText() {
  var textarea = document.getElementById("Textarea");
  var text = textarea.value;
  if (!text) return;

  var now = new Date();
  var day = String(now.getDate()).padStart(2, "0");
  var month = String(now.getMonth() + 1).padStart(2, "0");
  var year = String(now.getFullYear());
  var hours = String(now.getHours()).padStart(2, "0");
  var minutes = String(now.getMinutes()).padStart(2, "0");
  var seconds = String(now.getSeconds()).padStart(2, "0");
  var filename = `pekosoft_notepad_${day}-${month}-${year}_${hours}-${minutes}-${seconds}.txt`;
  var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");

  link.href = url;
  link.download = typeof window.ensurePekosoftFilename === "function"
    ? window.ensurePekosoftFilename(filename)
    : filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', function () {
  const clearButton = document.getElementById('notepad-clear-button');
  const speechButton = document.getElementById('notepad-speech-button');
  const downloadButton = document.getElementById('notepad-download-button');
  const copyButton = document.getElementById('notepad-copy-button');
  const textarea = document.getElementById('Textarea');
  const STORAGE_KEY = 'notepad.text';

  function updateDownloadButtonState() {
    if (downloadButton) downloadButton.disabled = !textarea.value;
  }

  if (textarea) {
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (savedText !== null) {
      textarea.value = savedText;
    }
    updateDownloadButtonState();

    textarea.addEventListener('input', function () {
      localStorage.setItem(STORAGE_KEY, textarea.value);
      updateDownloadButtonState();
    });
  }

  let currentUtterance = null;
  let isSpeaking = false;

  function setSpeechState(active) {
    isSpeaking = active;
    if (!speechButton) return;
    speechButton.classList.toggle('button-on', active);
    speechButton.setAttribute('aria-pressed', active ? 'true' : 'false');
    speechButton.title = active ? 'Stop speaking' : 'Speak text';
  }

  function stopSpeech() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    currentUtterance = null;
    setSpeechState(false);
  }

  function startSpeech() {
    if (!window.speechSynthesis || !textarea) return;

    const textInput = textarea.value.trim();
    if (!textInput) {
      setSpeechState(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textInput);
    currentUtterance = utterance;

    utterance.onend = function () {
      if (currentUtterance !== utterance) return;
      currentUtterance = null;
      setSpeechState(false);
    };

    utterance.onerror = function () {
      if (currentUtterance !== utterance) return;
      currentUtterance = null;
      setSpeechState(false);
    };

    window.speechSynthesis.speak(utterance);
    setSpeechState(true);
  }

  if (clearButton) {
    clearButton.addEventListener('click', clearTextarea);
  }

  if (speechButton) {
    speechButton.setAttribute('aria-pressed', 'false');
    speechButton.addEventListener('click', function () {
      if (isSpeaking) {
        stopSpeech();
      } else {
        startSpeech();
      }
    });
  }

  if (downloadButton) {
    downloadButton.addEventListener('click', downloadText);
  }

  if (copyButton) {
    copyButton.addEventListener('click', copyToClipboard);
  }

  window.addEventListener('beforeunload', function () {
    stopSpeech();
  });
});

// END OF FILE
