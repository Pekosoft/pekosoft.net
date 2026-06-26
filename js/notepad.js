// Pekosoft Notepad
// pekosoft.net/js/notepad.js

function clearTextarea() {
  document.getElementById("Textarea").value = "";
  localStorage.removeItem('notepad.text');
}

function copyToClipboard() {
  var textarea = document.getElementById("Textarea");
  textarea.select();
  document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
  const clearButton = document.getElementById('notepad-clear-button');
  const speechButton = document.getElementById('notepad-speech-button');
  const copyButton = document.getElementById('notepad-copy-button');
  const textarea = document.getElementById('Textarea');
  const STORAGE_KEY = 'notepad.text';

  if (textarea) {
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (savedText !== null) {
      textarea.value = savedText;
    }

    textarea.addEventListener('input', function () {
      localStorage.setItem(STORAGE_KEY, textarea.value);
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

  if (copyButton) {
    copyButton.addEventListener('click', copyToClipboard);
  }

  window.addEventListener('beforeunload', function () {
    stopSpeech();
  });
});

// END OF FILE
