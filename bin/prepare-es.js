var fs = require("fs");
var path = require("path");
var unzip = require("extract-zip");
var request = require("request");
var exec = require("child_process").exec;
var findJavaHome = require("find-java-home");

var ES_URL = "https://download.elasticsearch.org/elasticsearch/elasticsearch/" +
  "elasticsearch-1.3.6.zip";
var RIVER_URL = " http://xbib.org/repository" +
  "/org/xbib/elasticsearch/plugin/elasticsearch-river-jdbc/1.3.4.4/" +
  "elasticsearch-river-jdbc-1.3.4.4-plugin.zip"
var MYSQL_DRIVER_URL = "https://dev.mysql.com/get/Downloads/Connector-J/" +
  "mysql-connector-java-5.1.34.tar.gz"
var ES_DIR = path.join(__dirname, "elasticsearch-1.3.6")
var ES_FILE = path.join(__dirname, "elasticsearch-1.3.6.zip");
var MYSQL_DRIVER_FILE = path.join(ES_DIR, "plugins", "jdbc",
  "mysql-connector-java.jar");
var esFileStream;

var installDriver = function () {
  var driverStream = fs.createWriteStream(MYSQL_DRIVER_FILE);

  console.log("Downloading MySQL driver for java.");

  driverStream.on("close", function () {
    console.log("Elastic search ready.")
  });

  request(MYSQL_DRIVER_URL).pipe(driverStream);
};

var installRiver = function (javaHome, callback) {
  var commandLine = path.join(ES_DIR, "bin") + "/plugin --install jdbc --url " +
    RIVER_URL;

  console.log("Installing plugin to import data from MySQL.");

  exec(commandLine, function (err, stdout, stderr) {

    if (err) {
      console.log(stderr);
      throw new Error("Cannot initialize elastic search: " + err);
    }

    callback();
  });
};

var installElasticSearch = function (javaHome) {
  var tryInstallDriver = function () {
    if (fs.existsSync(MYSQL_DRIVER_FILE)) {
      console.log("MySQL JDBC Driver - OK");
    } else {
      installDriver();
    }
  };
  var tryInstallRiver = function () {
    var mustInstallRiver = !fs.existsSync(path.join(ES_DIR, "plugins",
      "jdbc"));

    if (mustInstallRiver) {
      installRiver(javaHome, tryInstallDriver);
    } else {
      console.log("Elastic Search JDBC River - OK");
    }
    return mustInstallRiver;
  };

  if (!tryInstallRiver()) {
    tryInstallDriver();
  }
};

var prepareElasticSearch = function (javaHome, uncompress) {
  if (uncompress) {
    unzip(ES_FILE, { dir: __dirname }, function (err) {
      if (err) {
        throw new Error("Cannot unzip Elastic Search: " + err);
      }
      installElasticSearch(javaHome);
    });
  } else {
    installElasticSearch(javaHome);
  }
};

(function prepareEnvironment() {
  findJavaHome(function (err, javaHome) {

    if (err) {
      throw new Error("Java not found:", err);
    }
    if (javaHome.indexOf("1.7") === -1) {
      throw new Error("Java 1.7 required.");
    }

    if (!fs.existsSync(ES_FILE) && !fs.existsSync(ES_DIR)) {
      console.log("Downloading Elastic Search");

      esFileStream = fs.createWriteStream(ES_FILE);
      esFileStream.on("close", function () {
        prepareElasticSearch(javaHome, true);
      });

      request(ES_URL).pipe(esFileStream)
    } else {
      if (fs.existsSync(ES_DIR)) {
        console.log("Validating elastic search installation")
        prepareElasticSearch(javaHome, false);
      } else {
        console.log("Uncompressing elastic search.")
        prepareElasticSearch(javaHome, true);
      }
    }
  });
}());
