<!DOCTYPE html>
<html lang="en">

<head>
  <?php 
  require($_SERVER['DOCUMENT_ROOT'] . "/elements/head.php");
  $release = "settings";
  $releaseName = "Settings";
  $releasePage = "";
  ?>
  <link rel="stylesheet" type="text/css" href="/css/<?php echo $release; ?>.css">
</head>

<body>
  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/toc.php"); ?>

  <div class="three-columns-container">
    <div class="three-columns column-sides column-left hide-on-medium-screen">
      <svg class="speaker" viewBox="0 0 256 512" role="img">
        <use href="/assets.svg#speaker" />
      </svg>
    </div>

    <div class="three-columns column-middle">

  <div class="standard border settings">

    <!-- Checkboxes -->
    <div class="setting-row">
      <input type="checkbox" name="grid" id="grid">
      <label for="grid" title="Background grid" class="checkboxGrid">Grid</label>
    </div>
    <div class="setting-row">
      <input type="checkbox" name="guides" id="guides">
      <label for="guides" title="Timeline guides" class="checkboxGrid">Guides</label>
    </div>
    <!--
    <div class="setting-row">
      <input type="checkbox" name="headers" id="headers">
      <label for="headers" title="Module headers" class="checkboxGrid">Headers</label>
    </div>
    -->
    <div class="setting-row">
      <input type="checkbox" name="layout" id="layout">
      <label for="layout" title="Two modules per row" class="checkboxGrid">Layout</label>
    </div>
    <div class="setting-row">
      <input type="checkbox" name="haptics" id="haptics">
      <label for="haptics" title="Haptic feedback" class="checkboxGrid">Haptics</label>
    </div>
    <div class="setting-row">
      <input type="checkbox" name="toggle-button-text" id="toggle-button-text">
      <label for="toggle-button-text" title="Button text" class="checkboxGrid">Text</label>
    </div>
    <!--
    <div class="setting-row">
      <input type="checkbox" name="toggle-alpha" id="toggle-alpha">
      <label for="toggle-alpha" title="Alpha transparency" class="checkboxGrid">Alpha</label>
    </div>
    -->
    <div class="setting-row">
      <input type="checkbox" name="toggle-bars" id="toggle-bars">
      <label for="toggle-bars" title="Number field bars" class="checkboxLabel">Bars</label>
    </div>
    <div class="setting-row">
      <input type="checkbox" name="toggle-wrap" id="toggle-wrap">
      <label for="toggle-wrap" title="Panel text wrap" class="checkboxLabel">Wrap</label>
    </div>

    <!-- Grid size knob -->
    <div class="setting-row">
      <label title="Grid size" class="settingsLabel">Size:</label>
      <div class="knob-wrap">
        <input type="number" id="grid-size-value" class="knob-value" value="16" readonly>
        <button id="grid-size-knob" class="knob-control" type="button"></button>
      </div>
    </div>

    <!-- Font size selector -->
    <div class="setting-row">
      <label for="font_size_selector" title="Default font size" class="settingsLabel">Font:</label>
      <div class="knob-wrap">
        <select id="font_size_selector">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <button id="font-size-knob" class="knob-control" type="button"></button>
      </div>
    </div>

    <!-- Value Fields -->
    <div class="setting-row">
      <label for="default_bpm" title="Default Beats Per Minute" class="settingsLabel">BPM:</label>
      <div class="knob-wrap">
        <input type="number" id="default_bpm" name="default_bpm" value="120" min="30" max="320" step="1">
        <button id="default-bpm-knob" class="knob-control" type="button"></button>
      </div>
    </div>
    <div class="setting-row">
      <label for="default_rpm" title="Default Rounds Per Minute" class="settingsLabel">RPM:</label>
      <div class="knob-wrap">
        <input type="number" id="default_rpm" name="default_rpm" value="33.333" min="8" max="78" step="0.001" readonly>
        <button id="default-rpm-knob" class="knob-control" type="button"></button>
      </div>
    </div>
    <div class="setting-row">
      <label for="a4_hz" title="Default frequency for A4" class="settingsLabel">A4 Hz:</label>
      <div class="knob-wrap">
        <input type="number" id="a4_hz" name="a4_hz" value="440" min="400" max="480" step="1">
        <button id="a4-hz-knob" class="knob-control" type="button"></button>
      </div>
    </div>
    <div class="setting-row">
      <label for="speed_of_sound" title="Speed Of Sound in meters per second" class="settingsLabel">SOS:</label>
      <div class="knob-wrap">
        <input type="number" id="speed_of_sound" name="speed_of_sound" value="343" min="300" max="380" step="1">
        <button id="speed-of-sound-knob" class="knob-control" type="button"></button>
      </div>
    </div>
    <div class="settings-actions">
      <button id="back-settings-button" class="square" type="button" title="Go back">
        <svg class="icons">
          <use href="/icons.svg#arrow_left" />
        </svg>
        <span class="button-text">BACK</span>
      </button>
      <button id="reset-settings-button" class="square" type="button" title="Reset to default">
        <svg class="icons">
          <use href="/icons.svg#reset" />
        </svg>
        <span class="button-text">RESET</span>
      </button>
    </div>

  </div>

    </div>

    <div class="three-columns column-sides column-right hide-on-medium-screen">
      <svg class="speaker" viewBox="0 0 256 512" role="img">
        <use href="/assets.svg#speaker" />
      </svg>
    </div>
  </div>

  <script src="/js/settings.js"></script>
  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/footer.php"); ?>
</body>

</html>