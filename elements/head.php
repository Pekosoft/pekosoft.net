<?php
$currentScript = basename($_SERVER['SCRIPT_NAME']);
$requestPath = trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '', '/');
$toolPages = ["tap_pad.php", "bpm_calculator.php", "metronome.php", "turntable.php", "bpm_circle.php", "bpm_curve.php", "circle_of_fifths.php", "drum_machine.php", "player.php", "piano.php", "audio_calculator.php", "blockchain.php", "icons.php", "tuner.php", "visualizer.php", "reference.php", "notepad.php"];
$toolSlugs = array_map(function ($toolPage) {
	return pathinfo($toolPage, PATHINFO_FILENAME);
}, $toolPages);
$releaseName = isset($releaseName) ? $releaseName : '';
$releaseTitleMap = [
	'tap_pad' => 'Tap Pad',
	'tap_pad.php' => 'Tap Pad',
	'bpm_calculator' => 'BPM Calculator',
	'bpm_calculator.php' => 'BPM Calculator',
	'metronome' => 'Metronome',
	'metronome.php' => 'Metronome',
	'turntable' => 'Turntable',
	'turntable.php' => 'Turntable',
	'bpm_circle' => 'BPM Circle',
	'bpm_circle.php' => 'BPM Circle',
	'bpm_curve' => 'BPM Curve',
	'bpm_curve.php' => 'BPM Curve',
	'circle_of_fifths' => 'Circle Of Fifths',
	'circle_of_fifths.php' => 'Circle Of Fifths',
	'drum_machine' => 'Drum Machine',
	'drum_machine.php' => 'Drum Machine',
	'player' => 'Player',
	'player.php' => 'Player',
	'piano' => 'Piano',
	'piano.php' => 'Piano',
	'audio_calculator' => 'Audio Calculator',
	'audio_calculator.php' => 'Audio Calculator',
	'blockchain' => 'Blockchain',
	'blockchain.php' => 'Blockchain',
	'icons' => 'Icons',
	'icons.php' => 'Icons',
	'tuner' => 'Tuner',
	'tuner.php' => 'Tuner',
	'visualizer' => 'Visualizer',
	'visualizer.php' => 'Visualizer',
	'reference' => 'Reference',
	'reference.php' => 'Reference',
	'notepad' => 'Notepad',
	'notepad.php' => 'Notepad',
	'index' => 'Index',
	'index.php' => 'Index',
	'help' => 'Help',
	'help.php' => 'Help',
	'history' => 'History',
	'history.php' => 'History',
	'about' => 'About',
	'about.php' => 'About',
	'settings' => 'Settings',
	'settings.php' => 'Settings',
	'beta' => 'Beta',
	'beta.php' => 'Beta',
	'bitcoin' => 'Buy Us Coffee',
	'bitcoin.php' => 'Buy Us Coffee',
];

if ($releaseName === '') {
	$releaseName = $releaseTitleMap[$requestPath] ?? $releaseTitleMap[$currentScript] ?? '';
}
if ($releaseName === '' && $requestPath !== '') {
	$releaseName = $releaseTitleMap[$requestPath . '.php'] ?? '';
}
if (in_array($currentScript, $toolPages, true) || in_array($requestPath, $toolSlugs, true)) {
	echo "<script>document.documentElement.classList.add('modules-page', 'modules-loading');</script>";
}
$documentTitle = $releaseName ? 'Pekosoft - ' . $releaseName : 'Pekosoft';
?>
<script>
try {
	if (localStorage.getItem('global.layout') !== 'false') {
		document.documentElement.classList.add('layout-two-columns');
	}
} catch (_) {}
</script>
<title><?php echo htmlspecialchars($documentTitle, ENT_QUOTES, 'UTF-8'); ?></title>
<meta charset="utf-8">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" type="text/css" href="/css/index.css?v=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/css/index.css'); ?>">
<link rel="canonical" href="https://pekosoft.net">
<meta name="viewport" content="width=device-width, initial-scale=1">

<meta property="og:title" content="<?php echo htmlspecialchars($documentTitle, ENT_QUOTES, 'UTF-8'); ?>">
<meta property="og:type" content="website">
<meta property="og:url" content="https://pekosoft.net">
<meta property="og:image" content="https://pekosoft.net/png/index.png">
<meta property="og:description" content="Official website for the experimental audio software company Pekosoft.">