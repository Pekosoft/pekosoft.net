  <?php
  $releaseName = isset($releaseName) ? $releaseName : '';
  $releasePage = isset($releasePage) ? $releasePage : '';
  ?>

    <div class="top-heading colored">

  <div>
    <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/burger.php"); ?>
  </div>

  <div>
    <a href="/">
      <svg class="assets" viewBox="0 0 512 101.87" role="img">
        <use href="/assets.svg#logo" />
      </svg>
    </a>
  </div>

  <div id="settings-menu-container">
    <button id="toggle-settings-panel-button" class="square" title="Settings" aria-label="Settings" aria-expanded="false">
      <svg class="icons" role="img">
        <use href="/icons.svg#settings" />
      </svg>
    </button>

    <div id="settings-panel" class="settings-panel">
      <button id="toggle-mode-button" class="toc-button" title="Toggle dark mode" aria-label="Toggle dark mode">
        <svg class="icons" role="img">
          <use href="/icons.svg#moon" />
        </svg>
        Dark mode
      </button>

      <button id="toggle-fullscreen-button" class="toc-button" title="Toggle full screen" aria-label="Toggle full screen">
        <svg class="icons" role="img">
          <use href="/icons.svg#full_screen" />
        </svg>
        Fullscreen
      </button>

      <button id="play-site-button" class="toc-button" title="Play all pages" aria-label="Play all pages">
        <svg class="icons" role="img">
          <use href="/icons.svg#play" />
        </svg>
        Play
      </button>

      <button id="toggle-footer-button" class="toc-button" title="Toggle status bar" aria-label="Toggle status bar" aria-pressed="true">
        <svg class="icons" role="img">
          <use href="/icons.svg#bars" />
        </svg>
        Status bar
      </button>

      <div class="settings-panel-content">
        <div class="setting-row"><input type="checkbox" name="grid" id="grid"><label for="grid" title="Background grid" class="checkboxGrid">Grid</label></div>
        <div class="setting-row"><input type="checkbox" name="grid-white" id="grid-white"><label for="grid-white" title="White background grid" class="checkboxGrid">Grid white</label></div>
        <div class="setting-row"><input type="checkbox" name="guides" id="guides"><label for="guides" title="Timeline guides" class="checkboxGrid">Guides</label></div>
        <div class="setting-row"><input type="checkbox" name="headers" id="headers"><label for="headers" title="Module headers" class="checkboxGrid">Headers</label></div>
        <div class="setting-row"><input type="checkbox" name="layout" id="layout"><label for="layout" title="Two modules per row" class="checkboxGrid">Layout</label></div>
        <div class="setting-row"><input type="checkbox" name="haptics" id="haptics"><label for="haptics" title="Haptic feedback" class="checkboxGrid">Haptics</label></div>
        <div class="setting-row"><input type="checkbox" name="toggle-button-text" id="toggle-button-text"><label for="toggle-button-text" title="Button text" class="checkboxGrid">Text</label></div>
        <div class="setting-row"><input type="checkbox" name="toggle-alpha" id="toggle-alpha"><label for="toggle-alpha" title="Alpha transparency" class="checkboxGrid">Alpha</label></div>
        <div class="setting-row"><input type="checkbox" name="toggle-bars" id="toggle-bars"><label for="toggle-bars" title="Number field bars" class="checkboxLabel">Bars</label></div>
        <div class="setting-row"><input type="checkbox" name="toggle-wrap" id="toggle-wrap"><label for="toggle-wrap" title="Panel text wrap" class="checkboxLabel">Wrap</label></div>

        <div class="setting-row">
          <label title="Grid size" class="settingsLabel">Size:</label>
          <div class="knob-wrap"><input type="number" id="grid-size-value" class="knob-value" value="16" readonly><button id="grid-size-knob" class="knob-control" type="button"></button></div>
        </div>
        <div class="setting-row">
          <label for="font_size_selector" title="Default font size" class="settingsLabel">Font:</label>
          <div class="knob-wrap"><select id="font_size_selector"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select><button id="font-size-knob" class="knob-control" type="button"></button></div>
        </div>
        <div class="setting-row">
          <label for="default_bpm" title="Default Beats Per Minute" class="settingsLabel">BPM:</label>
          <div class="knob-wrap"><input type="number" id="default_bpm" name="default_bpm" value="120" min="30" max="320" step="1"><button id="default-bpm-knob" class="knob-control" type="button"></button></div>
        </div>
        <div class="setting-row">
          <label for="default_rpm" title="Default Rounds Per Minute" class="settingsLabel">RPM:</label>
          <div class="knob-wrap"><input type="number" id="default_rpm" name="default_rpm" value="33.333" min="8" max="78" step="0.001" readonly><button id="default-rpm-knob" class="knob-control" type="button"></button></div>
        </div>
        <div class="setting-row">
          <label for="a4_hz" title="Default frequency for A4" class="settingsLabel">A4 Hz:</label>
          <div class="knob-wrap"><input type="number" id="a4_hz" name="a4_hz" value="440" min="400" max="480" step="1"><button id="a4-hz-knob" class="knob-control" type="button"></button></div>
        </div>
        <div class="setting-row">
          <label for="speed_of_sound" title="Speed Of Sound in meters per second" class="settingsLabel">SOS:</label>
          <div class="knob-wrap"><input type="number" id="speed_of_sound" name="speed_of_sound" value="343" min="300" max="380" step="1"><button id="speed-of-sound-knob" class="knob-control" type="button"></button></div>
        </div>

        <div class="settings-actions">
          <button id="reset-settings-button" class="square" type="button" title="Reset to default"><svg class="icons"><use href="/icons.svg#reset" /></svg><span class="button-text">RESET</span></button>
        </div>
      </div>

      <div class="settings-panel-close">
        <button id="toggle-settings-panel-close-button" class="square transparent" title="Close" aria-label="Close">
          <svg class="icons" role="img">
            <use href="/icons.svg#close" />
          </svg>
        </button>
      </div>
    </div>
  </div>

</div>

<div class="heading colored">

  <div>
    <?php if (empty($hideReleaseMenu)) require($_SERVER['DOCUMENT_ROOT'] . "/elements/release_burger.php"); ?>
    <?php if (!empty($hideReleaseMenu) && !empty($release)): ?>
      <span class="standalone-release-icon" aria-hidden="true">
        <svg class="icons" role="img">
          <use href="/icons.svg#<?php echo $release; ?>"></use>
        </svg>
      </span>
    <?php endif; ?>
  </div>

  <div>
    <h1 class="release-title">
      <?php echo $releaseName; ?>
      <span><?php echo $releasePage; ?></span>
    </h1>
  </div>

  <div></div>

</div>