<?php
$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
if (!in_array($requestPath, ['/', '/index.php'], true)) {
  require($_SERVER['DOCUMENT_ROOT'] . '/404.php');
  exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <?php
  require($_SERVER['DOCUMENT_ROOT'] . "/elements/head.php");
  $release = "index";
  $releaseName = "Index";
  $releasePage = "";
  ?>
  <meta name="keywords" content="Pekosoft, BPM, BPM software, BPM experiments, audio software, audio web apps, audio web tools, online audio tools">
  <meta name="description" content="Official website for the experimental audio software company Pekosoft.">
</head>

<body>
  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/toc.php"); ?>

  <div class="releases">

    <div class="item">
      <a href="/tap_pad" title="Tap Pad">
        <svg class="large-icon" role="img" aria-label="Tap Pad">
          <use href="/icons.svg#tap_pad" />
        </svg>
      </a>
    </div>

    <div class="item">
      <a href="/bpm_calculator" title="BPM Calculator">
        <svg class="large-icon" role="img" aria-label="BPM Calculator">
          <use href="/icons.svg#bpm_calculator" />
        </svg>
      </a>
    </div>

    <div class="item">
      <a href="/metronome" title="Metronome">
        <svg class="large-icon" role="img" aria-label="Metronome">
          <use href="/icons.svg#metronome" />
        </svg>
      </a>
    </div>

    <div class="item">
      <a href="/turntable" title="Turntable">
        <svg class="large-icon" role="img" aria-label="Turntable">
          <use href="/icons.svg#turntable" />
        </svg>
      </a>
    </div>

  </div>

  <div class="standard padded border">
    <h1>
      <a href="/tap_pad" title="Tap Pad">Tap Pad - For tapping tempo.</a><br>

      <a href="/bpm_calculator" title="BPM Calculator">BPM Calculator - For tempo calculations.</a><br>

      <a href="/metronome" title="Metronome">Metronome - For keeping time.</a><br>

      <a href="/turntable" title="Turntable">Turntable - For visualizing RPM.</a>
    </h1>

  </div>

  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/footer.php"); ?>
</body>

</html>