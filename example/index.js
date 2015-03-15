var stdout = require('stdout');

var db = require('..')();

var dbStream = db.createStream();

dbStream.pipe(stdout()); // Just spit it to the console

// Store a=10
dbStream.write({ a: 10 });
// Query for the value of a
dbStream.write({ a: null });

// Store a="foo"
dbStream.write({ a: "foo" });

// Delete a from store
dbStream.write({ a: undefined });

// Return a: undefined
dbStream.write({ a: null });
