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

<div class="footer colored">

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

  <div>
    <a href="<?php echo footerHref('/settings.php', $currentPage); ?>" title="Settings" aria-label="Settings">
      <svg class="icons">
        <use href="/icons.svg#settings" />
      </svg>
    </a>
  </div>

</div>

<script src="/js/index.js"></script>
<script src="/js/user.js?v=layout-20260609-<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/user.js'); ?>"></script>
<script src="/js/swipe.js"></script>
<script src="/js/meters.js"></script>