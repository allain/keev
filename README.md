# keev

Minimalist Key Value store with a Streaming api.

[![build status](https://secure.travis-ci.org/allain/keev.png)](http://travis-ci.org/allain/keev)

## Installation

This module is installed via npm:

``` bash
$ npm install keev
```

## Example Usage

``` js
var stdout = require('stdout');

var db = require('keev')();

db.pipe(stdout()); // Just spit it to the console

db.write({ a: 10 }); // Store a=10
db.write({ a: null }); // Query for the value of a
db.write({ a: "foo" }); // Store a="foo"
db.write({ a: undefined }); // Delete a from store
db.write({ a: null }); // Succeeds in not returning the key a
```

## API

```var db = require('keev')({options});```

`options.store` is a factory function for creating stores. If a store it not given, it will assume a memory store.

A store must implement:

`get(key, cb)`
> where cb is a callback that with the signature (err, value).
> If no value is found, it should return undefined, but not
> error.

`put(key, value, cb)`
> where cb is a callback that with the signature (err).
> Key must be a string and value must be JSON serializable


`remove(key, cb)`
> where cb is a callback that with the signature (err).

Optionally a store may implement `getAll`, `putAll`, `removeAll`, which perform batch bersion of the above method.
