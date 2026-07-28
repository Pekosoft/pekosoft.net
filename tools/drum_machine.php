<!DOCTYPE html>
<html lang="en">

<head>
  <?php
  require($_SERVER['DOCUMENT_ROOT'] . "/elements/head.php");
  $release = "drum_machine";
  $releaseName = "Drum Machine";
  $releasePage = "";
  $availableModules = ["tool", "controls", "timeline", "panel", "meters"];
  ?>
  <meta name="keywords" content="drum machine, step sequencer, beat maker, rhythm machine, online drum machine">
  <link rel="stylesheet" type="text/css" href="/css/<?php echo $release; ?>.css?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/css/' . $release . '.css'); ?>">
</head>

<body>
  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/toc.php"); ?>

  <div id="tool-container" class="container">
    <div class="module-body drum-machine-view border no-swipe">
      <div id="sequencer-grid" class="sequencer-grid" role="group" aria-label="16-step drum sequencer"></div>
    </div>
    <div class="module-footer wrapper colored">
      <button id="undo-button" class="square" title="Undo pattern change" aria-label="Undo pattern change">
        <svg class="icons" role="img"><use href="/icons.svg#undo" /></svg>
        <span class="button-text">UNDO</span>
      </button>
      <button id="redo-button" class="square" title="Redo pattern change" aria-label="Redo pattern change">
        <svg class="icons" role="img"><use href="/icons.svg#redo" /></svg>
        <span class="button-text">REDO</span>
      </button>
      <button id="shift-left-button" class="square" title="Shift pattern left" aria-label="Shift pattern left">
        <svg class="icons" role="img"><use href="/icons.svg#chevron_left" /></svg>
        <span class="button-text">LEFT</span>
      </button>
      <button id="shift-right-button" class="square" title="Shift pattern right" aria-label="Shift pattern right">
        <svg class="icons" role="img"><use href="/icons.svg#chevron_right" /></svg>
        <span class="button-text">RIGHT</span>
      </button>
      <button id="random-button" class="square" title="Randomize pattern" aria-label="Randomize pattern">
        <svg class="icons" role="img"><use href="/icons.svg#random" /></svg>
        <span class="button-text">RANDOM</span>
      </button>
      <button id="clear-button" class="square" title="Clear pattern" aria-label="Clear pattern">
        <svg class="icons" role="img"><use href="/icons.svg#close" /></svg>
        <span class="button-text">CLEAR</span>
      </button>
    </div>
  </div>

  <div id="controls-container" class="container">
    <div class="module-body controls border">
      <div class="controls-buttons wrapper">
        <button id="play-button" class="square" title="Toggle playback">
          <svg class="icons"><use href="/icons.svg#play" /></svg>
          <span class="button-text">PLAY</span>
        </button>
        <button id="stop-button" class="square" title="Stop playback">
          <svg class="icons"><use href="/icons.svg#stop" /></svg>
          <span class="button-text">STOP</span>
        </button>
        <button id="tap-button" class="square" title="Tap tempo">
          <svg class="icons"><use href="/icons.svg#tap_pad" /></svg>
          <span class="button-text">TAP</span>
        </button>
        <button id="toggle-sound-button" class="square" title="Toggle sound">
          <svg class="icons"><use href="/icons.svg#sound" /></svg>
          <span class="button-text">SOUND</span>
        </button>
        <button id="haptic-button" class="square" title="Toggle haptic feedback">
          <svg class="icons"><use href="/icons.svg#haptic" /></svg>
          <span class="button-text">HAPTIC</span>
        </button>
        <button id="reset-button" class="square" title="Reset to default">
          <svg class="icons"><use href="/icons.svg#reset" /></svg>
          <span class="button-text">RESET</span>
        </button>
      </div>

      <div class="controls-values wrapper">
        <div class="pair">
          <label for="bpm-input" title="Beats per minute">BPM:</label>
          <input type="number" id="bpm-input" min="30" max="320" step="1" value="120">
        </div>
        <div class="pair">
          <label for="swing-input" title="Swing amount">Swing:</label>
          <input type="number" id="swing-input" min="0" max="50" step="1" value="0">
        </div>
        <div class="pair">
          <label for="pattern-select" title="Pattern preset">Pattern:</label>
          <select id="pattern-select">
            <option value="basic">Basic</option>
            <option value="four_floor">Four On Floor</option>
            <option value="breakbeat">Breakbeat</option>
            <option value="electro">Electro</option>
            <option value="empty">Empty</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="pair">
          <label for="kit-select" title="Drum kit">Kit:</label>
          <select id="kit-select">
            <option value="classic">Classic</option>
            <option value="deep">Deep</option>
            <option value="tight">Tight</option>
            <option value="bright">Bright</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="pair">
          <label for="length-select" title="Pattern length">Length:</label>
          <select id="length-select">
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="12">12</option>
            <option value="16" selected>16</option>
          </select>
        </div>
        <div class="pair">
          <label for="voice-select" title="Selected voice">Voice:</label>
          <select id="voice-select">
            <option value="kick">Kick</option>
            <option value="snare">Snare</option>
            <option value="hat">Hi-hat</option>
            <option value="perc">Perc</option>
          </select>
        </div>
        <div class="pair">
          <label for="pitch-input" title="Voice pitch">Pitch:</label>
          <input type="number" id="pitch-input" step="1">
        </div>
        <div class="pair">
          <label for="decay-input" title="Voice decay in milliseconds">Decay:</label>
          <input type="number" id="decay-input" step="1">
        </div>
        <div class="pair">
          <label for="tone-input" title="Voice tone">Tone:</label>
          <input type="number" id="tone-input" min="0" max="100" step="1">
        </div>
        <div class="pair">
          <label for="level-input" title="Voice level">Level:</label>
          <input type="number" id="level-input" min="0" max="100" step="1">
        </div>
        <div class="pair">
          <label for="pan-input" title="Voice pan">Pan:</label>
          <input type="number" id="pan-input" min="-100" max="100" step="1">
        </div>
      </div>

      <div class="controls-sliders">
        <div class="controls-slider-block">
          <div class="range-input-wrapper">
            <button id="tempo-decrease-button" class="square icon-only colored" title="Decrease BPM" aria-label="Decrease BPM">
              <svg class="icons" role="img"><use href="/icons.svg#chevron_left" /></svg>
            </button>
            <input type="range" id="tempo-slider" min="30" max="320" step="1" value="120" aria-label="Tempo">
            <button id="tempo-increase-button" class="square icon-only colored" title="Increase BPM" aria-label="Increase BPM">
              <svg class="icons" role="img"><use href="/icons.svg#chevron_right" /></svg>
            </button>
          </div>
        </div>
        <div class="controls-slider-block">
          <div class="range-input-wrapper">
            <button id="swing-decrease-button" class="square icon-only colored" title="Decrease swing" aria-label="Decrease swing">
              <svg class="icons" role="img"><use href="/icons.svg#chevron_left" /></svg>
            </button>
            <input type="range" id="swing-slider" class="labeled-range" data-label="S W I N G" min="0" max="50" step="1" value="0" aria-label="Swing">
            <button id="swing-increase-button" class="square icon-only colored" title="Increase swing" aria-label="Increase swing">
              <svg class="icons" role="img"><use href="/icons.svg#chevron_right" /></svg>
            </button>
          </div>
        </div>
        <div class="controls-slider-block">
          <div class="range-input-wrapper">
            <button id="volume-decrease-button" class="square icon-only colored" title="Decrease volume" aria-label="Decrease volume">
              <svg class="icons" role="img"><use href="/icons.svg#chevron_left" /></svg>
            </button>
            <input type="range" id="volume-slider" min="0" max="100" step="1" value="80" aria-label="Volume">
            <button id="volume-increase-button" class="square icon-only colored" title="Increase volume" aria-label="Increase volume">
              <svg class="icons" role="img"><use href="/icons.svg#chevron_right" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="timeline-container" class="container">
    <div class="module-body canvas-container border">
      <canvas id="drum-roll" role="img" aria-label="Drum Machine playback timeline"></canvas>
    </div>
    <div class="module-footer wrapper colored">
      <button id="timeline-guides-button" title="Toggle playback guides">
        <svg class="icons" role="img"><use href="/icons.svg#guides" /></svg>
        <span class="button-text">GUIDES</span>
      </button>
    </div>
  </div>

  <div id="panel-container" class="container">
    <div class="module-body standard border">
      <textarea id="pattern-text" spellcheck="false" aria-label="Drum Machine pattern data" placeholder="Drum Machine pattern data will appear here."></textarea>
    </div>
    <div class="module-footer wrapper colored">
      <button id="open-button" class="square" title="Open pattern">
        <svg class="icons"><use href="/icons.svg#open" /></svg>
        <span class="button-text">OPEN</span>
      </button>
      <button id="save-button" class="square" title="Save pattern">
        <svg class="icons"><use href="/icons.svg#download" /></svg>
        <span class="button-text">SAVE</span>
      </button>
      <button id="apply-button" class="square" title="Apply pattern data">
        <svg class="icons"><use href="/icons.svg#check" /></svg>
        <span class="button-text">APPLY</span>
      </button>
      <button id="copy-button" class="square" title="Copy pattern">
        <svg class="icons"><use href="/icons.svg#copy" /></svg>
        <span class="button-text">COPY</span>
      </button>
    </div>
    <input type="file" id="file-input" accept="application/json,.json,.txt">
  </div>

  <?php require($_SERVER['DOCUMENT_ROOT'] . "/meters.php"); ?>

  <script src="/js/modules.js?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/modules.js'); ?>"></script>
  <script src="/js/drag.js?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/drag.js'); ?>"></script>
  <script src="/js/audio.js?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/audio.js'); ?>"></script>
  <script src="/js/<?php echo $release; ?>.js?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/' . $release . '.js'); ?>"></script>
  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/beta_footer.php"); ?>
</body>

</html>