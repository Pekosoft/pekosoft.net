<?php
$selectedToneType = $selectedToneType ?? 'sine';
$toneTypes = [
  'sine' => 'Sine',
  'square' => 'Square',
  'sawtooth' => 'Sawtooth',
  'triangle' => 'Triangle',
  'piano' => 'Piano'
];

foreach ($toneTypes as $value => $label) {
  $selected = $selectedToneType === $value ? ' selected' : '';
  echo "<option value=\"{$value}\"{$selected}>{$label}</option>\n";
}
