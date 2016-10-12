var fs = require('fs');
var sax = require('sax');

export default function podcastParser(filePath, callback) {
  var options = {
    trim: true,
    normalize: true,
    lowercase: true
  };
  var saxStream = sax.createStream(false, options);
  var rssObj = {items: []};
  var currentTagName = '';
  var itemIndex = -1;
  saxStream.on('opentag', function(node) {
    currentTagName = node.name;
    if (currentTagName === 'item') {
      rssObj.items.push({});
      itemIndex++;
    }
    if (currentTagName === 'enclosure') {
      rssObj.items[itemIndex].filesize = node.attributes.length;
      rssObj.items[itemIndex].filetype = node.attributes.type;
      rssObj.items[itemIndex].fileurl = node.attributes.url;
    }
    if (currentTagName === 'itunes:image') {
      if (itemIndex === -1) {
        rssObj.image = node.attributes.href;
      } else {
        rssObj.items[itemIndex].image = node.attributes.href;
      }
    }
  });
  var channelTags = ['link', 'language', 'copyright'];
  var itemTags = ['title', 'description', 'pubdate'];
  var itunesTags = {
    'itunes:author': 'author',
    'itunes:subtitle': 'subtitle',
    'itunes:summary': 'description',
    'itunes:duration': 'duration',
    'itunes:name': 'ownerName',
    'itunes:email': 'ownerEmail'
  };
  function textOrCdata(t) {
    if (channelTags.includes(currentTagName)) {
      rssObj[currentTagName] = t;
    }
    if (itemTags.includes(currentTagName)) {
      if (itemIndex === -1) {
        rssObj[currentTagName] = t;
      } else {
        rssObj.items[itemIndex][currentTagName] = t;
      }
    }
    if (Object.keys(itunesTags).includes(currentTagName)) {
      if (itemIndex === -1) {
        rssObj[itunesTags[currentTagName]] = t;
      } else {
        rssObj.items[itemIndex][itunesTags[currentTagName]] = t;
      }
    }
  }
  function htmlTextContent(inputString) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(inputString, "text/html");
    return doc.body.textContent;
  }
  saxStream.on('text', function(t) {
    textOrCdata(t);
  });
  saxStream.on('cdata', function(t) {
    textOrCdata(htmlTextContent(t));
  });
  saxStream.on('end', function(t) {
    callback(rssObj);
  });
  fs.createReadStream(filePath).pipe(saxStream);
}
