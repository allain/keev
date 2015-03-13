var keev = require('..');
var stdout = require('stdout');

var db = keev();
db.pipe(stdout());

// Created
db.write({
  a: 10
});

// Read
db.write({
  a: null
});

// Update
db.write({
  a: "foo"
});

// Delete
db.write({
  a: undefined
});

// Read missing record
db.write({
  a: null
});
