var assert = require('chai').assert;
var concat = require('concat-stream');
var Transform = require('stream').Transform;

var keev = require('..');

describe('keev', function () {
  it('is a Transform stream', function () {
    assert.isFunction(keev);

    assert(keev() instanceof Transform);
  });

  it('passes complete objects through', function (done) {
    var db = keev();

    db.pipe(concat(function (result) {
      assert.equal(2, result.length);

      assert.deepEqual(result[0], {
        a: 1
      });
      assert.deepEqual(result[1], {
        b: 2,
        c: 3
      });
      done();
    }));

    db.write({
      a: 1
    });

    db.write({
      b: 2,
      c: 3
    });

    db.end();
  });

  it('remembers values when queried', function (done) {
    var db = keev();
    db.pipe(concat(function (result) {
      assert.equal(2, result.length);

      assert.deepEqual(result[0], {
        a: 1
      });

      assert.deepEqual(result[1], {
        a: 1
      });

      done();
    }));

    db.write({
      a: 1
    });

    db.write({
      a: null
    });
    db.end();
  });

  it('supports deletion', function (done) {
    var db = keev();

    db.pipe(concat(function (result) {
      assert.equal(3, result.length);

      assert.deepEqual(result[0], {
        a: 1
      });
      assert.deepEqual(result[1], {a: undefined});
      assert.deepEqual(result[2], {a: undefined});
      done();
    }));

    db.write({
      a: 1
    });

    db.write({
      a: undefined
    });

    db.write({
      a: null
    });

    db.end();
  });

  it('querying for missing values returns key with undefined as value', function(done) {
    var db = keev();

    db.pipe(concat(function(result) {
      assert.equal(1, result.length);
      assert.deepEqual(result[0], {a: undefined});
      done();
    }));

    db.write({a: null});
    db.end();

  });

  it('deletion of missing key does nothing', function (done) {
    var db = keev();

    db.pipe(concat(function (result) {
      assert.equal(2, result.length);
      assert.deepEqual(result[0], {a: undefined});
      assert.deepEqual(result[1], {a: undefined});
      done();
    }));

    db.write({
      a: undefined
    });

    db.write({
      a: null
    });

    db.end();
  });
});
