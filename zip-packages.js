var fs = require('fs');
var path = require('path');
var archiver = require('archiver');

function makeZipFile(arch) {
  var archive = archiver('zip');
  var zipPath = path.join(process.cwd(), 'docs', 'builds', arch + '.zip');
  var output = fs.createWriteStream(zipPath);

  output.on('close', function() {
    console.log(zipPath + ' finalized. ' + archive.pointer() + ' bytes');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  var tmpDir = path.join(process.cwd(), 'tmpPackages', arch);
  archive.directory(tmpDir, false, {date: new Date()});
  archive.finalize();
}

var architectures = [
  'darwin-x64',
  'linux-armv7l',
  'linux-ia32',
  'linux-x64',
  'mas-x64',
  'win32-ia32',
  'win32-x64'
];

for (var i = 0; i < architectures.length; i++) {
  makeZipFile('plaster-' + architectures[i]);
}
