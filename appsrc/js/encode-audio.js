var childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function ffmpegPath() {
  if (os.type() === 'Darwin') {
    return path.join(__dirname, 'compiled', 'ffmpeg_mac');
  }
  if (os.type() === 'Windows_NT') {
    return path.join(__dirname, 'compiled', 'ffmpeg.exe');
  }
  console.log(os.type());
  return path.join(__dirname, 'compiled', 'ffmpeg_linux');
}

function measureLoudness(srcPath, destDir, handleChange) {
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
  ff.stderr.on('data', function(data) {
    stderrText += data;
  });
  ff.on('exit', (code, signal) => {
    console.log(stderrText);
    var jsonStartIndex = stderrText.lastIndexOf('{');
    var jsonString = stderrText.slice(jsonStartIndex);
    var measuredJson = JSON.parse(jsonString);
    secondPass(srcPath, destDir, measuredJson, handleChange);
  });
}

function secondPass(srcPath, destDir, loudnessInfo, handleChange) {
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
  var stderrText = '';
  var ff = childProcess.spawn(ffmpegPath(), opts);
  ff.stderr.on('data', function(data) {
    stderrText += data;
  });
  ff.on('exit', (code, signal) => {
    console.log(stderrText);
    var stats = fs.statSync(outPath);
    handleChange('fileurl', outPath);
    handleChange('filesize', stats.size);
    handleChange('filetype', 'audio/mpeg');
  });
}

export default function encodeAudio(srcPath, destDir, handleChange) {
  measureLoudness(srcPath, destDir, handleChange);
}
