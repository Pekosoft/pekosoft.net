<!DOCTYPE html>
<html lang="en">

<head>
  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/head.php"); ?>
  <?php
  $release = "beta";
  $releaseName = "Beta";
  $releasePage = "";
  ?>
  <link rel="stylesheet" type="text/css" href="/css/<?php echo $release; ?>.css">
</head>

<body>
  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/toc.php"); ?>

  <div class="standard">
    <h1>TESTS AND IDEAS - NOT FOR REAL USE</h1>
  </div>

  <div class="standard beta-links">

    <div class="beta-link-row">
      <svg class="icons">
        <use href="/icons.svg#player" />
      </svg>
      <div class="beta-link-title">
        <a href="/player" title="Player" aria-label="Player">
          PLAYER
        </a>
      </div>
    </div>

    <div class="beta-link-row">
      <svg class="icons">
        <use href="/icons.svg#visualizer" />
      </svg>
      <div class="beta-link-title">
        <a href="/visualizer" title="Visualizer" aria-label="Visualizer">
          VISUALIZER
        </a>
      </div>
    </div>

    <div class="beta-link-row">
      <svg class="icons">
        <use href="/icons.svg#bpm_circle" />
      </svg>
      <div class="beta-link-title">
        <a href="/bpm_circle" title="BPM circle" aria-label="BPM circle">
          BPM CIRCLE
        </a>
      </div>
    </div>

    <div class="beta-link-row">
      <svg class="icons">
        <use href="/icons.svg#bpm_curve" />
      </svg>
      <div class="beta-link-title">
        <a href="/bpm_curve" title="BPM Curve" aria-label="BPM Curve">
          BPM CURVE
        </a>
      </div>
    </div>

    <div class="beta-link-row">
      <svg class="icons">
        <use href="/icons.svg#circle_of_fifths" />
      </svg>
      <div class="beta-link-title">
        <a href="/circle_of_fifths" title="Circle Of Fifths" aria-label="Circle Of Fifths">
          CIRCLE OF FIFTHS
        </a>
      </div>
    </div>

    <div class="beta-link-row">
      <svg class="icons">
          <use href="/icons.svg#reference" />
      </svg>
      <div class="beta-link-title">
        <a href="/reference" title="Reference" aria-label="Reference">
          REFERENCE
        </a>
      </div>
    </div>

    <div class="beta-link-row">
      <svg class="icons">
        <use href="/icons.svg#tuner" />
      </svg>
      <div class="beta-link-title">
        <a href="/tuner" title="Tuner" aria-label="Tuner">
          TUNER
        </a>
      </div>
    </div>

    <div class="beta-link-row">
      <svg class="icons">
        <use href="/icons.svg#notepad" />
      </svg>
      <div class="beta-link-title">
        <a href="/notepad" title="Notepad" aria-label="Notepad">
          NOTEPAD
        </a>
      </div>
    </div>

    <div class="beta-link-row">
      <svg class="icons">
        <use href="/icons.svg#audio_calculator" />
      </svg>
      <div class="beta-link-title">
        <a href="/audio_calculator" title="Audio Calculator" aria-label="Audio Calculator">
          AUDIO CALCULATOR
        </a>
      </div>
    </div>

    <div class="beta-link-row">
      <svg class="icons">
        <use href="/icons.svg#piano" />
      </svg>
      <div class="beta-link-title">
        <a href="/piano" title="Piano" aria-label="Piano">
          PIANO
        </a>
      </div>
    </div>

    <div class="beta-link-row">
      <svg class="icons">
        <use href="/icons.svg#icons" />
      </svg>
      <div class="beta-link-title">
        <a href="/icons" title="Icons" aria-label="Icons">
          ICONS
        </a>
      </div>
    </div>

  </div>

  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/beta_footer.php"); ?>
</body>

</html>