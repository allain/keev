var util = require('util');
var each = require('async-each');
var parallel = require('run-parallel');

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
    each(Object.keys(obj), function (key, cb) {
      store.put(key, obj[key], cb);
    }, cb);
  };

  store.getAll = store.getAll || function (keys, cb) {
    var result = {};

    each(keys, function (key, cb) {
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

  this._transform = function (obj, enc, cb) {
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

    parallel({
      putAllResult: function (cb) {
        store.putAll(changeMap, cb);
      },
      getAllResult: function (cb) {
        store.getAll(getKeys, cb);
      },
    }, function (err, results) {
      if (err) return cb(err);

      var result = obj;

      Object.keys(results.getAllResult).forEach(function (key) {
        result[key] = results.getAllResult[key];
      });

      cb(null, result);
    });
  };
}
