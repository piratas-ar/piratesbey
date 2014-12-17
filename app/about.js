app.get("/about.html", function (req, res) {
  res.locals.is_home = false;
  res.render("about.html", {
    header: true
  });
});
