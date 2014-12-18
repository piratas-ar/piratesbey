var i18n = require("i18n");

exports.magnet = function(hash, size) {
  var out = "<a href=\"";
  out = out+"magnet:?xt=urn:btih:"+hash+'&tr=udp://tracker.publicbt.com:80/announce&tr=udp://tracker.istole.it:80/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tracker.ccc.de:80&tr=udp://open.demonii.com:1337';
  out = out + '"><img src="img/';

  if ( size == 'small' ) {
    out = out + 'magnet';
  } else {
    out = out + 'big-download';
  }

  return out + '.png" alt="' + i18n.__("main.download") + '" /></a>';
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

exports.pagination = function(results, query, from) {
  if ( typeof from == 'undefined' )
    from = 0;
  page_size = 25;
  current_page = Math.floor(from/page_size);
  total_pages = Math.floor(results.total / page_size);
  out = ''+results.total+' '+i18n.__("main.results")+' ';
  done_dots = true;
  for (i=0; i < total_pages; i++) {
    if ( i < 8 || (current_page+4 > i && current_page-4 < i) || i > total_pages-4 ) {
      if ( current_page == i ) {
        out = out + ' <a href="search?q=' +query+ '&f=' +(i*page_size)+ '"><strong>' +(i+1)+ '</strong></a> ';
      } else {
        out = out + ' <a href="search?q=' +query+ '&f=' +(i*page_size)+ '">' +(i+1)+ '</a> ';
      }
      done_dots = false;
    } else {
      if ( ! done_dots ) {
        out = out + ' ... ';
        done_dots = true;
      }
    }
  }
  return out;
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
