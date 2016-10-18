var fs = require('fs');
var path = require('path');

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var architectures = [
  'darwin-x64',
  'linux-armv7l',
  'linux-ia32',
  'linux-x64',
  'mas-x64',
  'win32-ia32',
  'win32-x64'
];

if (!fs.existsSync(path.join(process.cwd(), 'tmpPackages'))) {
  fs.mkdirSync(path.join(process.cwd(), 'tmpPackages'));
}

if (!fs.existsSync(path.join(process.cwd(), 'docs', 'builds'))) {
  fs.mkdirSync(path.join(process.cwd(), 'docs', 'builds'));
}

for (var i = 0; i < architectures.length; i++) {
  var arch = 'plaster-' + architectures[i];
  var tmpDir = path.join(process.cwd(), 'tmpPackages', arch);
  deleteFolderRecursive(tmpDir);
  var zipPath = path.join(process.cwd(), 'docs', 'builds', arch + '.zip');
  fs.unlinkSync(zipPath);
}
