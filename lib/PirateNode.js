/** Controls the elastic search server daemon for this node.
 * @param {String} rootDir Elastic search root directory. Cannot be null.
 * @param {Object} config Application context configuration. Cannot be null.
 * @constructor
 */
module.exports = function PirateNode(rootDir, config) {

  /** Default name for the distributed cluster.
   */
  var CLUSTER_NAME = "piratesbey";

  /** Name of the torrents index.
   */
  var INDEX_NAME = "torrents";

  /** Name of the current name.
   */
  var NODE_NAME = "pirate-" + Math.ceil(Math.random() * Date.now());

  /** Document mapping for torrents.
   */
  var TORRENT_DOCUMENT_MAPPING = {
    _id: {
      type: "string",
      path: "hash",
      index: "not_analyzed"
    },
    properties: {
      hash: { type: "string", index: "not_analyzed" },
      uploaded: { type : "date", index: "not_analyzed" },
      size: { type: "long", index: "not_analyzed" },
      source: { type: "string", analyzer: "english" },
      nfo: { type: "string", analyzer: "english" }
    }
  };

  /** Key to identified when the server is started.
   */
  var START_TRIGGER = "[" + NODE_NAME + "] started";

  /** Node's events API.
   * @type {Object}
   */
  var events = require('events');

  /** Utility to build mixins.
   * @type {Function}
   */
  var extend = require("extend");

  /** Node's file system API.
   * @type {Object}
   */
  var fs = require("fs");

  /** Node's path API.
   * @type {Object}
   */
  var path = require("path");

  /** Spawns new processes, used to run elastic search daemon.
   * @type {Function}
   */
  var spawn = require("child_process").spawn;

  /** Elastic search official API.
   * @type {Object}
   */
  var elasticsearch = require("elasticsearch");

  /** Lightweight HTTP client.
   * @type {Function}
   */
  var request = require("request");

  /** Current node instance.
   * @type {Object}
   */
  var node = new events.EventEmitter();

  /** Elastic search client, it's available once the server is started.
   * @type {Object}
   */
  var client;

  /** Creates the river to import data from MySQL to the torrents index.
   * @param {Function} callback Takes an error as parameter. Cannot be null.
   */
  var createRiver = function (callback) {
    request({
      uri: "http://" + config.bindAddress + ":9200/_river/my_mysql_river/_meta",
      method: "PUT",
      json: true,
      body: {
        type : "jdbc",
        jdbc : {
          url: "jdbc:" + config.dataSource.url,
          user: config.dataSource.user,
          password: config.dataSource.password,
          sql: "select * from torrents",
          index: INDEX_NAME,
          type: "torrent",
          index_settings: {
            index : {
              number_of_shards: 5,
              number_of_replicas: 1
            }
          },
          type_mapping: {
            torrent: TORRENT_DOCUMENT_MAPPING
          }
        }
      }
    }, function (err, response, body) {
      callback(err);
    });
  };

  /** Prepares and triggers the river to import data from MySQL to the torrents
   * index.
   * @param {Function} callback Takes an error as parameter. Cannot be null.
   */
  var triggerRiver = function (callback) {
    console.log("Importing data from MySQL into index...");

    request({
      uri: "http://" + config.bindAddress + ":9200/_river/my_mysql_river",
      method: "DELETE"
    }, function (err) {
      if (err) {
        return callback(err);
      }
      setTimeout(function () {
        createRiver(callback);
      }, 2000);
    })
  };

  /** Determines whether the index exists.
   * @param {Function} callback Takes an error the a boolean indicating if the
   *    index exists or not. Cannot be null.
   */
  var indexExists = function (callback) {
    client.indices.exists({
      index: INDEX_NAME
    }, callback);
  };

  /** Deletes the torrents index.
   * @param {Function} callback Takes an error as parameter. Cannot be null.
   */
  var deleteIndex = function (callback) {
    client.indices.delete({
      index: INDEX_NAME
    }, callback);
  };

  // Constructor method.
  (function __constructor() {
    // Prepares configuration.
    var configFile = path.join(rootDir, "config", "elasticsearch.json");
    var config = {};

    if (fs.existsSync(configFile)) {
      config = JSON.parse(fs.readFileSync(configFile).toString());
    }

    config = extend(config, {
      cluster: {
        name: CLUSTER_NAME
      },
      node: {
        name: NODE_NAME,
        master: config.master
      },
      network: {
        bind_host: config.bindAddress,
        publish_host: config.bindAddress
      }
    });
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  }());

  return extend(node, {
    /** Initializes this node.
     * @param {Function} callback Invoked when the server is initialized. Cannot
     *    be null.
     */
    start: function (callback) {
      var esProcess;

      esProcess = spawn(path.join(rootDir, "bin", "elasticsearch"));

      esProcess.stdout.on('data', function (data) {
        if (data.toString().indexOf(START_TRIGGER) > -1) {
          client = new elasticsearch.Client({
            host: config.bindAddress + ":9200",
            log: false,
            sniffOnStart: true,
            sniffInterval: 60000
          });
          callback();
        }
      });

      esProcess.stderr.on('data', function (data) {
        node.emit("error", data);
      });
    },

    /** Shut downs this node.
     * @param callback Invoked when the node is already down. Cannot be null.
     */
    shutdown: function (callback) {
      client.nodes.shutdown(callback);
    },

    /** Regenerates the index for torrents and imports data from mysql.
     * @param {Function} callback Takes an error as parameter. Cannot be null.
     */
    setupIndex: function (callback) {
      indexExists(function (err, exists) {
        if (err) {
          return callback(err);
        }
        if (exists) {
          deleteIndex(function (err) {
            if (err) {
              return callback(err);
            }
            triggerRiver(callback);
          });
        } else {
          triggerRiver(callback);
        }
      });
    }
  });
};
