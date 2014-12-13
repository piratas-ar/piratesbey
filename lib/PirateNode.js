/** Controls the elastic search server daemon for this node.
 * @param {String} rootDir Elastic search root directory. Cannot be null.
 * @constructor
 */
module.exports = function PirateNode(rootDir) {

  /** Default name for the distributed cluster.
   */
  var CLUSTER_NAME = "piratesbey";

  /** Name of the current name.
   */
  var NODE_NAME = "pirate-" + Math.ceil(Math.random() * Date.now());

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

  /** Current node instance.
   * @type {Object}
   */
  var node = new events.EventEmitter();

  /** Elastic search client, it's available once the server is started.
   * @type {Object}
   */
  var client;

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
        name: NODE_NAME
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
            host: 'localhost:9200',
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
    }
  });
};
