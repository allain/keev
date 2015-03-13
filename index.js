var util = require('util');
var async = require('async');

var Transform = require('stream').Transform;

util.inherits(Keev, Transform);

module.exports = Keev;

function Keev(options) {
  if (!(this instanceof Keev))
    return new Keev(options);

  options = options || {};
  options.objectMode = true;

  Transform.call(this, options);

  var store = options.store || require('./lib/memory-store.js')();

  // If the store does not implement batch method, then implement them using single ones

  store.putAll = store.putAll || function (obj, cb) {
    async.each(Object.keys(obj), function (key, cb) {
      store.put(key, obj[key], cb);
    }, cb);
  };

  store.getAll = store.getAll || function (keys, cb) {
    var result = {};

    async.each(keys, function (key, cb) {
      store.get(key, function (err, val) {
        if (err) return cb(err);

        result[key] = val;
        cb();
      });
    }, function (err) {
      if (err) return cb(err);

      cb(null, result);
    });
  };

  store.removeAll = store.removeAll || function (keys, cb) {
    async.each(keys, function (key, cb) {
      store.remove(key, cb);
    }, cb);
  };

  this._transform = function (obj, enc, cb) {
    var putMap = {};
    var getKeys = [];
    var removeKeys = [];

    Object.keys(obj).forEach(function (key) {
      var value = obj[key];

      if (value === undefined) {
        //Delete
        removeKeys.push(key);
      } else if (value === null) {
        // Query
        getKeys.push(key);
      } else {
        putMap[key] = value;
      }
    });

    async.parallel({
      putAllResult: function (cb) {
        store.putAll(putMap, cb);
      },
      removeAllResult: function (cb) {
        store.removeAll(removeKeys, cb);
      },
      getAllResult: function (cb) {
        store.getAll(getKeys, cb);
      },
    }, function (err, results) {
      if (err) return cb(err);

      var result = putMap;
      Object.keys(results.getAllResult).forEach(function (key) {
        var value = results.getAllResult[key];
        if (value !== undefined) {
          result[key] = value;
        }
      });

      cb(null, result);
    });
  };
}
