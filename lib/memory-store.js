module.exports = function () {
  var map = {};

  return {
    get: function (key, cb) {
      process.nextTick(function () {
        cb(null, map[key]);
      });
    },

    put: function (key, val, cb) {
      if (val === undefined) {
        delete map[key];
      } else {
        map[key] = val;
      }

      process.nextTick(function () {
        cb(null);
      });
    }
  };
};
