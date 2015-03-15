module.exports = function () {
  var map = {};

  return {
    getAll: function (keys, cb) {
      process.nextTick(function () {
        var result = {};

        keys.forEach(function(key) {
          result[key] = map[key];
        });

        cb(null, result);
      });
    },

    putAll: function (obj, cb) {
      process.nextTick(function () {
        Object.keys(obj).forEach(function(key) {
          var val = obj[key];
          if (val === undefined) {
            delete map[key];
          } else {
            map[key] = val;
          }
        });

        cb(null);
      });
    }
  };
};
