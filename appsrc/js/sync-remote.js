// var level = require('level');
var scpclient = require('scp2');
var s3sync = require('s3-sync-aws');
var readdirp = require('readdirp');
var fs = require('fs');
// var path = require('path');

function uploadScp(srcPath, settings, snackbar) {
  snackbar('Publishing to ' + settings.sftphost);
  var scpSettings = {
    host: settings.sftphost,
    username: settings.sftpuser,
    path: settings.sftppath
  };
  if (settings.sftpuseprivatekey) {
    scpSettings.privateKey = fs.readFileSync(settings.sftpprivatekeyloc);
  } else {
    scpSettings.password = settings.sftppass;
  }
  scpclient.scp(srcPath, scpSettings, function(err) {
    if (err) {
      snackbar('There was a problem connecting to ' + settings.sftphost);
    }
  })
  .on('error', function(err) {
    console.error(err);
    snackbar('There was a problem publishing to ' + settings.sftphost);
  })
  .on('end', function() {
    snackbar('The podcast was successfully published.');
  });
}

function uploadS3(srcPath, settings, snackbar) {
  // var db = level(path.join(srcPath, 'cache'));
  snackbar('Publishing to Amazon S3...');
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
    snackbar('Publishing: ' + file.url);
  });
  files.pipe(uploader);
}

export default function syncRemote(srcPath, settings, snackbar) {
  if (settings.deploytype === 's3') {
    uploadS3(srcPath, settings, snackbar);
  }
  if (settings.deploytype === 'sftp') {
    uploadScp(srcPath, settings, snackbar);
  }
}
