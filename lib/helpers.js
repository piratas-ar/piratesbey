exports.magnet = function(hash, size) {
  size = typeof size !== 'undefined' ? size : 'small';
  var out = "<a href=\"";
  out = out + "magnet:?xt=urn:btih:" + hash +
'&tr=udp://tracker.publicbt.com:80/announce&tr=udp://tracker.istole.it:80/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tracker.ccc.de:80&tr=udp://open.demonii.com:1337'
  out = out + '"><img src="img/'
  if ( size == 'small' ) {
    out = out + 'magnet';
  } else {
    out = out + 'big-download';
  }
  return out + '.png" alt="Download this torrent" /></a>';
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
