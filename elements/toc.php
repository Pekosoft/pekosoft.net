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

  <button id="toggle-mode-button" class="square" title="Toggle dark mode" aria-label="Toggle dark mode">
    <svg class="icons" role="img">
      <use href="/icons.svg#moon" />
    </svg>
  </button>

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

  <button id="toggle-fullscreen-button" class="square" title="Toggle full screen" aria-label="Toggle full screen">
    <svg class="icons" role="img">
      <use href="/icons.svg#full_screen" />
    </svg>
  </button>

</div>