<?php
$release = isset($release) ? $release : '';
$currentFile = basename($_SERVER['SCRIPT_NAME']);
$requestPath = trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '', '/');
$toolPages = ["tap_pad.php", "bpm_calculator.php", "metronome.php", "turntable.php", "bpm_circle.php", "bpm_curve.php", "circle_of_fifths.php", "player.php", "piano.php", "audio_calculator.php", "blockchain.php", "icons.php", "tuner.php", "visualizer.php", "reference.php", "notepad.php"];
$toolSlugs = array_map(function ($toolPage) {
  return pathinfo($toolPage, PATHINFO_FILENAME);
}, $toolPages);
$hasModules = in_array($currentFile, $toolPages, true) || in_array($requestPath, $toolSlugs, true);
$releaseFile = $release . ".php";
$releaseHref = in_array($releaseFile, $toolPages, true) ? "/" . $release : "/" . $releaseFile;
$availableModules = isset($availableModules) && is_array($availableModules)
  ? array_values(array_unique($availableModules))
  : ['tool', 'controls', 'timeline', 'panel'];
$hasPlaylistModule = in_array('playlist', $availableModules, true);
?>

<div id="release-burger-container">

  <button id="toggle-release-button" class="square" title="Release menu" aria-label="Release menu">
    <svg class="icons" role="img">
      <use href="/icons.svg#<?php echo $release; ?>"></use>
    </svg>
  </button>

  <div id="release-toc" class="release-toc-container">

    <button class="toc-button" data-href="<?php echo $releaseHref; ?>" title="Release" aria-label="Release">
      <svg class="icons" role="img">
        <use href="/icons.svg#release"></use>
      </svg>
      RELEASE
    </button>

    <button class="toc-button" data-href="/help.php?r=<?php echo $release; ?>" title="Help" aria-label="Help">
      <svg class="icons" role="img">
        <use href="/icons.svg#help"></use>
      </svg>
      HELP
    </button>

    <button class="toc-button" data-href="/history.php?r=<?php echo $release; ?>" title="History" aria-label="History">
      <svg class="icons" role="img">
        <use href="/icons.svg#clock"></use>
      </svg>
      HISTORY
    </button>

    <button class="toc-button" data-href="/about.php?r=<?php echo $release; ?>" title="About" aria-label="About">
      <svg class="icons" role="img">
        <use href="/icons.svg#about"></use>
      </svg>
      ABOUT
    </button>

    <?php if ($hasModules): ?>

      <div class="toc-spacer"></div>

      <?php if (in_array('tool', $availableModules, true)): ?>
      <button class="toc-button" id="tool-toggle-toc-button" title="Tool" aria-label="Tool">
        <svg class="icons" role="img">
          <use href="/icons.svg#tool"></use>
        </svg>
        TOOL
      </button>
      <?php endif; ?>

      <?php if (in_array('controls', $availableModules, true)): ?>
      <button class="toc-button" id="controls-toggle-toc-button" title="Controls" aria-label="Controls">
        <svg class="icons" role="img">
          <use href="/icons.svg#controls"></use>
        </svg>
        CONTROLS
      </button>
      <?php endif; ?>

      <?php if (in_array('meters', $availableModules, true)): ?>
      <button class="toc-button" id="meters-toggle-toc-button" title="Meters" aria-label="Meters">
        <svg class="icons" role="img">
          <use href="/icons.svg#meter"></use>
        </svg>
        METERS
      </button>
      <?php endif; ?>

      <?php if (in_array('timeline', $availableModules, true)): ?>
      <button class="toc-button" id="timeline-toggle-toc-button" title="Timeline" aria-label="Timeline">
        <svg class="icons" role="img">
          <use href="/icons.svg#timeline"></use>
        </svg>
        TIMELINE
      </button>
      <?php endif; ?>

      <?php if ((isset($hasPlaylist) && $hasPlaylist) || $hasPlaylistModule): ?>

      <button class="toc-button" id="playlist-toggle-toc-button" title="Playlist" aria-label="Playlist">
        <svg class="icons" role="img">
          <use href="/icons.svg#view_list"></use>
        </svg>
        PLAYLIST
      </button>

      <?php endif; ?>

      <?php if (in_array('panel', $availableModules, true)): ?>
      <button class="toc-button" id="panel-toggle-toc-button" title="Panel" aria-label="Panel">
        <svg class="icons" role="img">
          <use href="/icons.svg#panel"></use>
        </svg>
        PANEL
      </button>
      <?php endif; ?>

    <?php endif; ?>

    <div class="toc-footer">
      <button id="release-close-button" class="square transparent" title="Close" aria-label="Close">
        <svg class="icons" role="img">
          <use href="/icons.svg#close"></use>
        </svg>
      </button>
    </div>

  </div>

</div>