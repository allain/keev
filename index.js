var util = require('util');

var Transform = require('stream').Transform;

module.exports = Keev;

function Keev(options) {
  if (!(this instanceof Keev))
    return new Keev(options);

  options = options || {};

  var store = options.store || require('./lib/memory-store.js')();
  var putAll = store.putAll.bind(store);
  var getAll = store.getAll.bind(store);

  this.createStream = function() {
    var stream = new Transform({objectMode: true});

    stream._transform = function (obj, enc, cb) {
      var changeMap = {};
      var getKeys = [];

      Object.keys(obj).forEach(function (key) {
        var value = obj[key];

        if (value === null) {
          getKeys.push(key);
        } else {
          changeMap[key] = value;
        }
      });

      putAll(changeMap, function(err) {
        if (err) return cb(err);

        getAll(getKeys, function(err, getAllResult) {
          if (err) return cb(err);

          var result = obj;
          Object.keys(getAllResult).forEach(function(key) {
            result[key] = getAllResult[key];
          });
          cb(null, result);
        });
      });
    };
    return stream;
  };
}
