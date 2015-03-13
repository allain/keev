module.exports = function () {
  var map = {};

  return {
    get: function (key, cb) {
      process.nextTick(function () {
        cb(null, map[key]);
      });
    },

    put: function (key, val, cb) {
      map[key] = val;
      process.nextTick(function () {
        cb(null);
      });
    },

    remove: function (key, cb) {
      delete map[key];
      process.nextTick(function () {
        cb(null);
      });
    }
  };
};
