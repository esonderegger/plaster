var ID3Writer = require('browser-id3-writer');
var fs = require('fs');

function writeTag(podObj, itemIndex, snackbar) {
  var itemObj = podObj.items[itemIndex];
  // snackbar('writing ID3 tag for ' + itemObj.fileurl);
  var songBuffer = fs.readFileSync(itemObj.fileurl);
  var coverBuffer = fs.readFileSync(podObj.image);
  var itemDate = new Date(itemObj.pubdate);
  var track = podObj.items.length - itemIndex + '/' + podObj.items.length;
  var writer = new ID3Writer(songBuffer);
  writer.setFrame('TIT2', itemObj.title)
        .setFrame('TPE1', [podObj.author])
        .setFrame('TPE2', podObj.author)
        .setFrame('TALB', podObj.title)
        .setFrame('TYER', itemDate.getFullYear())
        .setFrame('TRCK', track)
        .setFrame('APIC', coverBuffer);
  writer.addTag();
  var taggedSongBuffer = new Buffer(writer.arrayBuffer);
  fs.writeFileSync(itemObj.fileurl, taggedSongBuffer);
  // snackbar('ID3 tag complete: ' + itemObj.fileurl);
}

export default function id3Tag(podObj, itemIndex, snackbar) {
  writeTag(podObj, itemIndex, snackbar);
}
