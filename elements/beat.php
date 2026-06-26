<?php
$selectedBeatSound = $selectedBeatSound ?? 'click';
$beatSounds = [
  'click' => 'Click',
  'kick' => 'Kick',
  'sine' => 'Sine',
  'square' => 'Square',
  'sawtooth' => 'Sawtooth',
  'triangle' => 'Triangle',
  'piano' => 'Piano'
];

foreach ($beatSounds as $value => $label) {
  $selected = $selectedBeatSound === $value ? ' selected' : '';
  echo "<option value=\"{$value}\"{$selected}>{$label}</option>\n";
}
