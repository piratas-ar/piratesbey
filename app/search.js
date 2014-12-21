app.get("/search", function (req, res) {
  var PAGE_SIZE = 25;

  var query = req.param("q");
  var from = req.param("f");

  app.fullSearch(query, { from: from, size: 25}, function (err, results) {
    var totalPages;
    var currentPage;
    var pages = [];
    var i;

    if (err) {
      res.send(500, err);
    } else {

      if (results.hits.total > 0) {
        totalPages = Math.floor(results.hits.total / PAGE_SIZE);
        currentPage = Math.floor((from || 1) / totalPages);

        for (i = 0; i < totalPages; i++) {
          pages.push({
            number: i + 1,
            from: i * PAGE_SIZE,
            selected: currentPage === i
          });
        }
      }

      res.render("search.html", {
        results: {
          total: results.hits.total,
          hits: results.hits.hits && results.hits.hits.map(function (result) {
            return result._source;
          })
        },
        paginator: {
          pages: pages,
          current: currentPage
        },
        query: query,
        from: from,
        is_home: false
      });
    }
  });
});
