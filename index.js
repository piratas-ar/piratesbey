var path = require("path");
var fs = require("fs");
var express = require('express');
var exphbs  = require('express-handlebars');
var helpers = require('./lib/helpers');
var DataSource = require("./lib/DataSource");
var PirateNode = require("./lib/PirateNode");
var node;
var env = process.env.NODE_ENV;
var shutdown = function () {
  node.shutdown(function () {
    console.log("Bye.");
    process.exit();
  });
};

app = express();

if (env) {
  app.config = JSON.parse(fs.readFileSync("config." + env + ".json").toString());
} else {
  app.config = JSON.parse(fs.readFileSync("config.json").toString());
}

// Global configuration.
app.engine('html', exphbs({ defaultLayout: 'main.html', helpers: helpers }) );
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

node = new PirateNode(path.join(__dirname, "bin", "elasticsearch-1.3.6"),
  app.config);

console.log("Starting elastic search instance...");
node.start(function () {
  var dataSource = new DataSource(app.config);

  process.on('SIGINT', function() {
    console.log("Stopping elastic search node...");
    shutdown();
  });

  console.log('Enviroment: ' + env)

  if (env !== "production" && env != "staging" ) {
    console.log("Loading test data...");

    dataSource.setupDatabase(function (err) {
      if (err) {
        shutdown();
        console.trace(err);
        return;
      }
      console.log("Creating index...");

      node.setupIndex(function (err) {
        if (err) {
          throw err;
        }
        app.search = node.search;
        app.fullSearch = node.fullSearch;
        app.listen(1337);
        console.log("Application ready at http://localhost:1337");
      });
    });
 } else {
/* Descomentar para regenerar indices
   node.setupIndex(function (err) {
      if (err) {
        throw err;
      } */
      app.search = node.search;
      app.fullSearch = node.fullSearch;
      app.listen(1337);
      console.log("Application ready at http://localhost:1337");
//    });
  }
});

node.on("error", function (err) {
  console.log(err.toString());
});
