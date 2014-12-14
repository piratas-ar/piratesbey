app.get("/torrent", function (req, res) {
  var hash = req.param("h");
  var query = "hash:" + hash;

  app.search(query, {}, function (err, results) {
    var torrent;

    if (err) {
      res.send(500, err);
    } else {
      torrent = results.hits.hits && results.hits.hits.shift();
      res.render("torrent.html", {
        torrent: torrent && torrent._source
      });
    }
  });
});
