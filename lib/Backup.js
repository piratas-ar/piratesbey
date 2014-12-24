/** Manages TPB data backups.
 *
 * @param {String} dataFile File that contains backup information. Cannot be
 *    null or empty.
 * @constructor
 */
module.exports = function Backup(dataFile) {

  /** Node's file system API.
   * @type {Object}
   */
  var fs = require("fs");

  /** Backup information.
   *
   * @type {Object}
   */
  var backup = JSON.parse(fs.readFileSync(dataFile).toString());

  return {
    /** Name of the environment this backup is from.
     */
    environment: backup.environment,

    /** Versions of this backup.
     */
    versions: backup.versions,

    /** Returns the last saved version of the backup.
     * @return {Object} a version object, or null if there's no backups.
     */
    getLastVersion: function () {
      var versions = backup.versions.sort(function (a, b) {
        var creationTime1 = new Date(a.creationTime);
        var creationTime2 = new Date(b.creationTime);

        return creationTime1 - creationTime2;
      });

      return versions.shift();
    },

    /** Builds the magnet link for the specified version.
     * @param {Object} version Backup version. Cannot be null.
     * @return {String} a valid magnet link, never null or empty.
     */
    getMagnetLink: function (version) {
      var name = "tpb-" + version.creationTime;

      return "magnet:?xt=urn:btih:" + version.infoHash +
        "&dn=" + name +
        "&tr=http%3A%2F%2Fdb.tpb.partidopirata.com.ar%3A12345%2Fannounce";
    }
  };
}