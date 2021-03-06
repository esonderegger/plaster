var childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
import createWaveform from './waveform-create.js';

function ffmpegPath() {
  if (os.type() === 'Darwin') {
    return path.join(__dirname, 'compiled', 'ffmpeg_mac');
  }
  if (os.type() === 'Windows_NT') {
    return path.join(__dirname, 'compiled', 'ffmpeg.exe');
  }
  if (os.type() === 'Linux') {
    return path.join(__dirname, 'compiled', 'ffmpeg_linux');
  }
  return false;
}

function ffprobePath() {
  if (os.type() === 'Darwin') {
    return path.join(__dirname, 'compiled', 'ffprobe_mac');
  }
  if (os.type() === 'Windows_NT') {
    return path.join(__dirname, 'compiled', 'ffprobe.exe');
  }
  if (os.type() === 'Linux') {
    return path.join(__dirname, 'compiled', 'ffprobe_linux');
  }
  return false;
}

function isAudioOrVideo(ffprobeResult) {
  for (var i = 0; i < ffprobeResult.streams.length; i++) {
    if (ffprobeResult.streams[i].hasOwnProperty('duration')) {
      return true;
    }
  }
  return false;
}

function durationFromFfprobe(ffprobeResult) {
  for (var i = 0; i < ffprobeResult.streams.length; i++) {
    if (ffprobeResult.streams[i].codec_type === 'audio') {
      return ffprobeResult.streams[i].duration;
    }
  }
  for (var j = 0; j < ffprobeResult.streams.length; j++) {
    if (ffprobeResult.streams[j].hasOwnProperty('duration')) {
      return ffprobeResult.streams[j].duration;
    }
  }
  return 0.0;
}

function handleUnknownFile(srcPath, destDir, handleChange,
    snackbar, loadWaveform) {
  var opts = [
    '-v',
    'quiet',
    '-print_format',
    'json',
    '-show_streams',
    srcPath
  ];
  var stdoutText = '';
  var ff = childProcess.spawn(ffprobePath(), opts);
  snackbar('investigating file...', null);
  ff.stdout.on('data', function(data) {
    stdoutText += data;
  });
  ff.on('exit', (code, signal) => {
    var ffprobeJson = {streams: []};
    var fileIsAudioVideo = false;
    var bestGuessDuration = 0.0;
    try {
      ffprobeJson = JSON.parse(stdoutText);
      fileIsAudioVideo = isAudioOrVideo(ffprobeJson);
      bestGuessDuration = durationFromFfprobe(ffprobeJson);
    } catch (ex) {
      snackbar(ex, 4000);
    }
    if (fileIsAudioVideo) {
      measureLoudness(srcPath, destDir, handleChange, snackbar, loadWaveform);
      handleChange('duration', bestGuessDuration);
    } else {
      snackbar('this does not appear to be an audio or video file.', 4000);
    }
  });
}

function measureLoudness(srcPath, destDir, handleChange,
    snackbar, loadWaveform) {
  var opts = [
    '-i',
    srcPath,
    '-af',
    'loudnorm=I=-18:TP=-1.0:LRA=9:print_format=json',
    '-f',
    'null',
    '-'
  ];
  var stderrText = '';
  var ff = childProcess.spawn(ffmpegPath(), opts);
  snackbar('measuring loudness...', null);
  ff.stderr.on('data', function(data) {
    stderrText += data;
  });
  ff.on('exit', (code, signal) => {
    var jsonStartIndex = stderrText.lastIndexOf('{');
    var jsonString = stderrText.slice(jsonStartIndex);
    var measuredJson = JSON.parse(jsonString);
    secondPass(srcPath, destDir, measuredJson, handleChange,
      snackbar, loadWaveform);
  });
}

function secondPass(srcPath, destDir, loudnessInfo, handleChange,
    snackbar, loadWaveform) {
  if (!fs.existsSync(path.join(destDir, 'media'))) {
    fs.mkdirSync(path.join(destDir, 'media'));
  }
  var outPath = path.join(destDir, 'media', path.parse(srcPath).name + '.mp3');
  var afString = 'measured_I=' + loudnessInfo.input_i +
    ':measured_LRA=' + loudnessInfo.input_lra +
    ':measured_TP=' + loudnessInfo.input_tp +
    ':measured_thresh=' + loudnessInfo.input_thresh +
    ':offset=' + loudnessInfo.target_offset +
    ':linear=true:print_format=summary';
  var opts = [
    '-i',
    srcPath,
    '-af',
    'loudnorm=I=-18:TP=-1.0:LRA=9:' + afString,
    '-codec:a',
    'libmp3lame',
    '-b:a',
    '192k',
    outPath
  ];
  var ff = childProcess.spawn(ffmpegPath(), opts);
  snackbar('encoding to mp3...');
  ff.on('close', (code, signal) => {
    var stats = fs.statSync(outPath);
    handleChange('fileurl', outPath);
    handleChange('filesize', stats.size);
    handleChange('filetype', 'audio/mpeg');
    snackbar('creating waveform...');
    createWaveform(outPath, function() {
      snackbar('successfully encoded file.', 3000);
      loadWaveform();
    });
  });
}

export default function encodeAudio(
    srcPath,
    destDir,
    handleChange,
    snackbar,
    loadWaveform) {
  handleUnknownFile(srcPath, destDir, handleChange, snackbar, loadWaveform);
}
