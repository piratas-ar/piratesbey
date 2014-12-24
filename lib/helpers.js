var i18n = require("i18n");
var path = require("path");
var Backup = require("./Backup")

exports.magnet = function(hash, size) {
  return "magnet:?xt=urn:btih:" + hash +
    "&tr=udp://tracker.publicbt.com:80/announce" +
    "&tr=udp://tracker.openbittorrent.com:80/announce" +
    "&tr=udp://tracker.ccc.de:80&tr=udp://open.demonii.com:1337";
};

exports.size = function(bytes, options) {
  if ( bytes > 1024 * 1024 * 1024 * 1024 ) {
    return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + ' TB';
  } else if ( bytes > 1024 * 1024 * 1024 ) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  } else if ( bytes > 1024 * 1024 ) {
    return (bytes / (1024 * 1024)).toFixed(0) + ' MB';
  } else if ( bytes > 1024 ) {
    return (bytes / 1024).toFixed(0) + ' KB';
  } else {
    return bytes.toFixed(0) + ' B';
  }
};

exports.formatDate = function(datetime, format) {
  date = new Date(datetime)
  return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
};

/** Retrieves a translated message.
 */
exports.__ = function () {
  return i18n.__.apply(this, arguments);
};

/** Retrieves a translated message.
 */
exports.__n = function () {
  return i18n.__n.apply(this, arguments);
};

exports.databaseMagnet = function () {
  var backup = new Backup(path.join(__dirname, "..", "backups.json"));
  var lastVersion = backup.getLastVersion();

  return backup.getMagnetLink(lastVersion);
};
