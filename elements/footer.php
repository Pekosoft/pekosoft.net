<div class="footer-spacer"></div>

<?php
$currentPage = basename($_SERVER['SCRIPT_NAME']);

function footerHref($toolFile, $currentPage)
{
  if (in_array($currentPage, ['about.php', 'help.php', 'history.php'], true)) {
    $release = pathinfo($toolFile, PATHINFO_FILENAME);
    return '/' . $currentPage . '?r=' . $release;
  }

  return $toolFile;
}
?>

<div class="footer colored" data-footer-mode="tools">

  <div class="footer-tool-icons">
    <div>
      <a href="<?php echo footerHref('/tap_pad', $currentPage); ?>" title="Tap Pad" aria-label="Tap Pad">
        <svg class="icons">
          <use href="/icons.svg#tap_pad" />
        </svg>
      </a>
    </div>

    <div>
      <a href="<?php echo footerHref('/bpm_calculator', $currentPage); ?>" title="BPM Calculator" aria-label="BPM Calculator">
        <svg class="icons">
          <use href="/icons.svg#bpm_calculator" />
        </svg>
      </a>
    </div>

    <div>
      <a href="<?php echo footerHref('/metronome', $currentPage); ?>" title="Metronome" aria-label="Metronome">
        <svg class="icons">
          <use href="/icons.svg#metronome" />
        </svg>
      </a>
    </div>

    <div>
      <a href="<?php echo footerHref('/turntable', $currentPage); ?>" title="Turntable" aria-label="Turntable">
        <svg class="icons">
          <use href="/icons.svg#turntable" />
        </svg>
      </a>
    </div>
  </div>

  <div class="footer-statusbar-container">
    <div class="footer-statusbar statusbar" role="status" aria-live="polite" data-statusbar data-status-ready="READY: Hover or tap a button for help.">
      <svg class="icons" aria-hidden="true">
        <use href="/icons.svg#about" />
      </svg>
      <span class="status-text" data-status-text>READY: Hover or tap a button for help.</span>
    </div>
    <button class="footer-toggle" type="button" title="Toggle status bar" aria-label="Toggle status bar">Status bar</button>
  </div>
</div>

<script src="/js/index.js?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/index.js'); ?>"></script>
<script src="/js/user.js?v=layout-20260609-<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/user.js'); ?>"></script>
<script src="/js/settings.js?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/settings.js'); ?>"></script>
<script src="/js/swipe.js"></script>
<script src="/js/meters.js"></script>