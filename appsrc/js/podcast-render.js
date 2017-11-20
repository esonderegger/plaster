const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
import moment from 'moment';

const escape = {
  '&': '&#x26;',
  '<': '&#x3C;',
  '>': '&#x3E;',
};

const badChars = /[&<>]/g;
const possible = /[&<>]/;

function escapeChar(chr) {
  return escape[chr];
}

function customEscapeExpression(string) {
  if (typeof string !== 'string') {
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string === null) {
      return '';
    } else if (!string) {
      return String(string);
    }
    string = String(string);
  }
  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

handlebars.Utils.escapeExpression = customEscapeExpression;

function renderPodcastFile(directory, podcastState, filename) {
  var hbsPath = path.join(__dirname, 'podcast-template.hbs');
  var hbsTemplate = handlebars.compile(fs.readFileSync(hbsPath, "utf8"));
  var DATE_RFC2822 = "ddd, DD MMM YYYY HH:mm:ss ZZ";
  podcastState.buildDate = moment().format(DATE_RFC2822);
  var outPath = path.join(directory, filename);
  fs.writeFile(outPath, hbsTemplate(podcastState), function(err) {
    if (err !== null) {
      console.error(err);
    }
  });
}

function renderLocal(directory, podcastState) {
  var podcastCopy = JSON.parse(JSON.stringify(podcastState));
  podcastCopy.prefixUrl = '';
  renderPodcastFile(directory, podcastCopy, '.podcast-local.xml');
}

function renderRemote(directory, podcastState, prefixUrl) {
  if (!prefixUrl.endsWith('/')) {
    prefixUrl += '/';
  }
  var podcastCopy = JSON.parse(JSON.stringify(podcastState));
  podcastCopy.image = prefixUrl + path.basename(podcastCopy.image);
  podcastCopy.prefixUrl = prefixUrl;
  for (var i = 0; i < podcastCopy.items.length; i++) {
    var filename = path.basename(podcastCopy.items[i].fileurl);
    podcastCopy.items[i].fileurl = prefixUrl + 'media/' + filename;
  }
  renderPodcastFile(directory, podcastCopy, 'podcast.xml');
}

export default function podcastRender(directory, podcastState, prefixUrl) {
  renderLocal(directory, podcastState);
  renderRemote(directory, podcastState, prefixUrl);
}
