var childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

function ffmpegPath() {
  return path.join(__dirname, 'compiled', 'ffmpeg_mac');
}

export default function encodeAudio(srcPath, destDir, handleChange) {
  var outPath = path.join(destDir, 'media', path.parse(srcPath).name + '.mp3');
  var opts = [
    '-i',
    srcPath,
    '-codec:a',
    'libmp3lame',
    '-b:a',
    '192k',
    outPath
  ];
  var ff = childProcess.spawn(ffmpegPath(), opts);
  ff.on('exit', (code, signal) => {
    var stats = fs.statSync(outPath);
    handleChange('fileurl', outPath);
    handleChange('filesize', stats.size);
    handleChange('filetype', 'audio/mpeg');
  });
}
