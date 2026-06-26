<?php
$currentScript = basename($_SERVER['SCRIPT_NAME']);
$requestPath = trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '', '/');
$toolPages = ["tap_pad.php", "bpm_calculator.php", "metronome.php", "turntable.php", "bpm_circle.php", "bpm_curve.php", "circle_of_fifths.php", "player.php", "piano.php", "audio_calculator.php", "blockchain.php", "icons.php", "tuner.php", "visualizer.php", "reference.php", "notepad.php"];
$toolSlugs = array_map(function ($toolPage) {
	return pathinfo($toolPage, PATHINFO_FILENAME);
}, $toolPages);
if (in_array($currentScript, $toolPages, true) || in_array($requestPath, $toolSlugs, true)) {
	echo "<script>document.documentElement.classList.add('modules-page', 'modules-loading');</script>";
}
?>
<script>
try {
	if (localStorage.getItem('global.layout') !== 'false') {
		document.documentElement.classList.add('layout-two-columns');
	}
} catch (_) {}
</script>
<title>Pekosoft</title>
<meta charset="utf-8">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" type="text/css" href="/css/index.css?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/css/index.css'); ?>">
<link rel="canonical" href="https://pekosoft.net">
<meta name="viewport" content="width=device-width, initial-scale=1">

<meta property="og:title" content="Pekosoft">
<meta property="og:type" content="website">
<meta property="og:url" content="https://pekosoft.net">
<meta property="og:image" content="https://pekosoft.net/png/index.png">
<meta property="og:description" content="Official website for the experimental audio software company Pekosoft.">