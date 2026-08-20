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

<div class="footer footer-standard colored">

  <div class="footer-status statusbar" role="status" aria-live="polite" data-statusbar data-status-ready="Ready: Hover or tap element for help.">
    <svg class="icons" aria-hidden="true">
      <use href="/icons.svg#about" />
    </svg>
    <span class="status-text" data-status-text>Ready: Hover or tap element for help.</span>
  </div>

  <div class="footer-tools" aria-hidden="true">
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

  <button id="toggle-tools-button" class="square icon-only" title="Show tools" aria-label="Show tools" aria-pressed="false">
    <svg class="icons" aria-hidden="true">
      <use href="/icons.svg#tool" />
    </svg>
  </button>
</div>

<script src="/js/index.js?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/index.js'); ?>"></script>
<script src="/js/user.js?v=layout-20260609-<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/user.js'); ?>"></script>
<script src="/js/settings.js?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/settings.js'); ?>"></script>
<script src="/js/swipe.js"></script>
<script src="/js/meters.js"></script>