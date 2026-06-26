<div class="footer-spacer"></div>

<?php
$currentPage = basename($_SERVER['SCRIPT_NAME']);

function betaFooterHref($toolFile, $currentPage)
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
    <a href="<?php echo betaFooterHref('/player', $currentPage); ?>" title="Player" aria-label="Player">
      <svg class="icons">
        <use href="/icons.svg#player" />
      </svg>
    </a>
  </div>

  <div>
    <a href="<?php echo betaFooterHref('/visualizer', $currentPage); ?>" title="Visualizer" aria-label="Visualizer">
      <svg class="icons">
        <use href="/icons.svg#visualizer" />
      </svg>
    </a>
  </div>

  <div>
    <a href="<?php echo betaFooterHref('/bpm_circle', $currentPage); ?>" title="BPM circle" aria-label="BPM circle">
      <svg class="icons">
        <use href="/icons.svg#bpm_circle" />
      </svg>
    </a>
  </div>

  <div>
    <a href="<?php echo betaFooterHref('/bpm_curve', $currentPage); ?>" title="BPM Curve" aria-label="BPM Curve">
      <svg class="icons">
        <use href="/icons.svg#bpm_curve" />
      </svg>
    </a>
  </div>

  <div>
    <a href="<?php echo betaFooterHref('/circle_of_fifths', $currentPage); ?>" title="Circle Of Fifths" aria-label="Circle Of Fifths">
      <svg class="icons">
        <use href="/icons.svg#circle_of_fifths" />
      </svg>
    </a>
  </div>

  <div>
    <a href="<?php echo betaFooterHref('/reference', $currentPage); ?>" title="Reference" aria-label="Reference">
      <svg class="icons">
          <use href="/icons.svg#reference" />
      </svg>
    </a>
  </div>

  <div>
    <a href="<?php echo betaFooterHref('/tuner', $currentPage); ?>" title="Tuner" aria-label="Tuner">
      <svg class="icons">
        <use href="/icons.svg#tuner" />
      </svg>
    </a>
  </div>

  <div>
    <a href="<?php echo betaFooterHref('/notepad', $currentPage); ?>" title="Notepad" aria-label="Notepad">
      <svg class="icons">
        <use href="/icons.svg#notepad" />
      </svg>
    </a>
  </div>

  <div>
    <a href="<?php echo betaFooterHref('/audio_calculator', $currentPage); ?>" title="Audio Calculator" aria-label="Audio Calculator">
      <svg class="icons">
        <use href="/icons.svg#audio_calculator" />
      </svg>
    </a>
  </div>

  <div>
    <a href="<?php echo betaFooterHref('/piano', $currentPage); ?>" title="Piano" aria-label="Piano">
      <svg class="icons">
        <use href="/icons.svg#piano" />
      </svg>
    </a>
  </div>

  <div>
    <a href="<?php echo betaFooterHref('/icons', $currentPage); ?>" title="Icons" aria-label="Icons">
      <svg class="icons">
        <use href="/icons.svg#icons" />
      </svg>
    </a>
  </div>

</div>

<script src="/js/index.js?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/js/index.js'); ?>"></script>
<script src="/js/user.js"></script>
<script src="/js/swipe.js"></script>
<script src="/js/meters.js"></script>
