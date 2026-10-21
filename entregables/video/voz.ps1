param([string]$Folder)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Sabina Desktop')
$synth.Rate = 0
$synth.Volume = 100
$segments = Get-Content -LiteralPath (Join-Path $Folder 'segmentos.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$audioFormat = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(44100, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
foreach ($seg in $segments) {
  $fileName = 'voz_{0:D2}.wav' -f [int]$seg.index
  $synth.SetOutputToWaveFile((Join-Path $Folder $fileName), $audioFormat)
  $synth.Speak([string]$seg.voice)
  $synth.SetOutputToNull()
}
$synth.Dispose()
Write-Output 'Narración sintética local generada con Microsoft Sabina Desktop.'
