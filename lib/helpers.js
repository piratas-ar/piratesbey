exports.magnet = function(hash, size) {
  var out = "<a href=\"";
  out = out+"magnet:?xt=urn:btih:"+hash+'&tr=udp://tracker.publicbt.com:80/announce&tr=udp://tracker.istole.it:80/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tracker.ccc.de:80&tr=udp://open.demonii.com:1337';
  out = out + '"><img src="img/';

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

exports.pagination = function(results, query, from) {
  if ( typeof from == 'undefined' )
    from = 0;
  page_size = 10;
  current_page = Math.floor(from/page_size);
  total_pages = Math.floor(results.total / page_size);
  out = '' + results.total + ' results ';
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

// No quieren andar los partials asi que la cabeceo con un helper punto com
exports.header = function(is_home) {
  if (is_home) {
    return '';
  }

  out = '<header class="row">'+
'  <div class="col-sm-4">'+
'    <a href="/"><img src="img/thepiratesbey-hor.png" alt="The Pirate\'s Bey" /></a>'+
'  </div>'+
'  <form action="/search" method="get" id="search">'+
'    <div class="col-sm-5 top-margin">'+
'      <input id="top-search-field" class="form-control" type="text" name="q" placeHolder="Pirate Search" />'+
'  </div><div class="col-sm-3 top-margin">'+
'      <input type="submit" accesskey="s" value="Pirate Search" title="Pirate Search"></input>'+
'    </form></div>'+
'</header>';

  return out;
};
