app.get("/search", function (req, res) {
  var query = req.param("q");
  var from = req.param("f");

  app.fullSearch(query, { from: from, size: 25}, function (err, results) {
    res.locals.is_home = false;
    if (err) {
      res.send(500, err);
    } else {
      res.render("search.html", {
        results: {
          total: results.hits.total,
          hits: results.hits.hits && results.hits.hits.map(function (result) {
            return result._source;
          })
        },
        query: query,
        from: from
      });
    }
  });
});
