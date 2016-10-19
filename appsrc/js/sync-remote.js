// var level = require('level');
var s3sync = require('s3-sync-aws');
var readdirp = require('readdirp');
// var path = require('path');

function uploadS3(srcPath, settings) {
  // var db = level(path.join(srcPath, 'cache'));
  var db = false;
  var files = readdirp({
    root: srcPath,
    fileFilter: [
      '!.settings.json',
      '!.podcast-local.xml',
      '!.DS_Store'
    ],
    directoryFilter: [
      '!cache'
    ]
  });
  var uploader = s3sync(db, {
    key: settings.s3accesskey,
    secret: settings.s3secretkey,
    bucket: settings.s3bucketname,
    concurrency: 16,
    prefix: ''
  }).on('data', function(file) {
    console.log(file.fullPath + ' -> ' + file.url);
  });
  files.pipe(uploader);
}

export default function syncRemote(srcPath, settings) {
  if (settings.deploytype === 's3') {
    uploadS3(srcPath, settings);
  }
}
