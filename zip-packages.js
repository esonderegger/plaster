var fs = require('fs');
var path = require('path');
var archiver = require('archiver');
var pjson = require('./package.json');

function makeAppImageZip() {
  var archive = archiver('zip');
  var zipFilename = 'plaster-' + pjson.version + '-linux.zip';
  var zipPath = path.join(process.cwd(), 'dist', zipFilename);
  var output = fs.createWriteStream(zipPath);

  output.on('close', function() {
    console.log(zipPath + ' finalized. ' + archive.pointer() + ' bytes');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  var srcFilename = 'plaster-' + pjson.version + '-x86_64.AppImage';
  var srcPath = path.join(process.cwd(), 'dist', srcFilename);
  archive.file(srcPath, {
    date: new Date(),
    name: srcFilename
  });
  archive.finalize();
}

makeAppImageZip();
