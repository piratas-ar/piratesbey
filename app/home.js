app.get("/", function (req, res) {
  res.locals.is_home = true;
  res.render("index.html", {
    header: false
  });
});
