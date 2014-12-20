var path = require("path");
var fs = require("fs");
var express = require('express');
var exphbs  = require('express-handlebars');
var hbs = exphbs.create({
  defaultLayout: 'main.html',
  helpers: require('./lib/helpers'),
  partialsDir: __dirname + "/views/partials"
});
var DataSource = require("./lib/DataSource");
var PirateNode = require("./lib/PirateNode");
var extend = require("extend");
var i18n = require("i18n");
var async = require("async");

var node;
var env = process.env.NODE_ENV || "development";
var configFile = path.join(__dirname, "config." + env + ".json");
var dataSource;
var initProcs = [];

var shutdown = function () {
  if (app.config.search.start) {
    node.shutdown(function () {
      console.log("Bye.");
      process.exit();
    });
  } else {
    console.log("Bye.");
    process.exit();
  }
};

console.log('Enviroment: ' + env)

app = express();
app.config = JSON.parse(fs.readFileSync("config.json").toString());

if (fs.existsSync(configFile)) {
  app.config = extend(app.config,
    JSON.parse(fs.readFileSync(configFile).toString()));
}

// Views configuration.
app.engine('html', hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.locals = {
  header: true
};

// Middlewares
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

// Internationalization config.
i18n.configure({
  locales: ["en", "es"],
  directory: __dirname + "/lang",
  objectNotation: true,
  cookie: "lang",
  indent: "  "
});
app.use(i18n.init);
app.use(require("./app/langMiddleware"));

node = new PirateNode(path.join(__dirname, "bin", "elasticsearch-1.3.6"),
  app.config);

process.on('SIGINT', function() {
  console.log("Stopping elastic search node...");
  shutdown();
});
node.on("error", function (err) {
  console.log(err.toString());
});

if (app.config.search.start) {
  initProcs.push(function (callback) {
    console.log("Starting elastic search instance...");
    node.start(callback);
  });
} else {
  initProcs.push(function (callback) {
    console.log("Connecting to elastic search instance...");
    node.initialize();
    process.nextTick(callback);
  });
}

if (app.config.regenerateDatabase) {
  dataSource = new DataSource(app.config);

  initProcs.push(function (callback) {
    console.log("Creating database...");
    dataSource.setupDatabase(callback);
  });
}
if (app.config.regenerateIndex) {

  initProcs.push(function (callback) {
    console.log("Creating index...");
    node.setupIndex(callback);
  });
}

async.series(initProcs, function (err) {
  if (err) {
    shutdown();
    console.trace(err);
  } else {
    app.search = node.search;
    app.fullSearch = node.fullSearch;
    app.listen(1337);
    console.log("Application ready at http://localhost:1337");
  }
});
