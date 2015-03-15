var assert = require('chai').assert;
var concat = require('concat-stream');
var Transform = require('stream').Transform;

var keev = require('..');

describe('keev', function () {
  it('is a not a stream, but can create them', function () {
    assert.isFunction(keev);

    var db = keev();
    assert.isObject(db);

    assert(db.createStream() instanceof Transform);
  });

  it('passes complete objects through', function (done) {
    var dbStream = keev().createStream();

    dbStream.pipe(concat(function (result) {
      assert.equal(2, result.length);
      assert.deepEqual(result[0], {a: 1});
      assert.deepEqual(result[1], {b: 2,c: 3 });
      done();
    }));

    dbStream.write({a: 1});
    dbStream.write({b: 2, c: 3});
    dbStream.end();
  });

  it('remembers values when queried', function (done) {
    var dbStream = keev().createStream();
    
    dbStream.pipe(concat(function (result) {
      assert.equal(2, result.length);
      assert.deepEqual(result[0], {a: 1});
      assert.deepEqual(result[1], {a: 1});
      done();
    }));

    dbStream.write({a: 1});
    dbStream.write({a: null});
    dbStream.end();
  });

  it('supports deletion', function (done) {
    var dbStream = keev().createStream();

    dbStream.pipe(concat(function (result) {
      assert.equal(3, result.length);
      assert.deepEqual(result[0], {a: 1});
      assert.deepEqual(result[1], {a: undefined});
      assert.deepEqual(result[2], {a: undefined});
      done();
    }));

    dbStream.write({a: 1});
    dbStream.write({a: undefined});
    dbStream.write({a: null});

    dbStream.end();
  });

  it('querying for missing values returns key with undefined as value', function(done) {
    var dbStream = keev().createStream();


    dbStream.pipe(concat(function(result) {
      assert.equal(1, result.length);
      assert.deepEqual(result[0], {a: undefined});
      done();
    }));

    dbStream.write({a: null});
    dbStream.end();
  });

  it('deletion of missing key does nothing', function (done) {
    var dbStream = keev().createStream();

    dbStream.pipe(concat(function (result) {
      assert.equal(2, result.length);
      assert.deepEqual(result[0], {a: undefined});
      assert.deepEqual(result[1], {a: undefined});
      done();
    }));

    dbStream.write({a: undefined});
    dbStream.write({a: null });
    dbStream.end();
  });
});
