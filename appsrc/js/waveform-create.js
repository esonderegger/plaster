const fs = require('fs');

function reduceSamples(audioData, channelNum) {
  var out = [];
  var chunkified = chunkify(
    audioData.getChannelData(channelNum),
    800,
    audioData.length
  );
  for (var i = 0; i < chunkified.length; i++) {
    out.push(arrayMin(chunkified[i]));
    out.push(arrayMax(chunkified[i]));
  }
  return out;
}

function chunkify(a, n, len) {
  var out = [];
  var i = 0;
  var size;
  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, i += size));
    }
  } else {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, i += size));
    }
  }
  return out;
}

function arrayMin(arr) {
  var len = arr.length;
  var min = Infinity;
  while (len--) {
    if (arr[len] < min) {
      min = arr[len];
    }
  }
  return min;
}

function arrayMax(arr) {
  var len = arr.length;
  var max = -Infinity;
  while (len--) {
    if (arr[len] > max) {
      max = arr[len];
    }
  }
  return max;
}

export default function createWaveform(audioSrc, callback) {
  var audioCtx = new window.AudioContext();
  var waveForms = [];
  fs.readFile(audioSrc, function(err, data) {
    if (err) {
      console.error(err);
    }
    var arraybuffer = Uint8Array.from(data).buffer;
    audioCtx.decodeAudioData(arraybuffer, function(decodedData) {
      for (var i = 0; i < decodedData.numberOfChannels; i++) {
        waveForms.push(reduceSamples(decodedData, i));
      }
      var outPath = audioSrc + '.json';
      fs.writeFile(outPath, JSON.stringify(waveForms), function(err) {
        if (err !== null) {
          console.error(err);
        }
        callback();
      });
    });
  });
}
