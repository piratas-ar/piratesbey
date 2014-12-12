var path = require("path");
var fs = require("fs");
var express = require('express');
var exphbs  = require('express-handlebars');

app = express();

// Global configuration.
app.engine('html', exphbs({ defaultLayout: 'main.html' }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(express.cookieParser());
app.use(express.bodyParser({
  keepExtensions: true,
  uploadDir: __dirname + '/tmp'
}));

app.use(express.static(path.join(__dirname, "views", "/assets")));

// Loads all application files.
fs.readdir(path.join(__dirname, "app"), function (err, files) {
  if (err) {
    throw new Error("Cannot load app files: " + err);
  }
  files.forEach(function (file) {
    var fullPath = path.join(__dirname, "app", file);
    var endpoint;

    if (fs.statSync(fullPath).isFile()) {
      require(fullPath);
    }
  });
});

app.listen(1337);
