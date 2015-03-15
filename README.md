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

var dbStream = db.createStream();

dbStream.pipe(stdout()); // Just spit it to the console

dbStream.write({ a: 10 }); // Store a=10
dbStream.write({ a: null }); // Query for the value of a
dbStream.write({ a: "foo" }); // Store a="foo"
dbStream.write({ a: undefined }); // Delete a from store
dbStream.write({ a: null }); // Succeeds in not returning the key a
```

## API

```var db = require('keev')({options});```

`options.store` is a an object with the following methods. If a store it not given, it will assume a memory store.

A store must implement:

`getAll(keys, cb)`
> where cb is a callback that with the signature (err, obj).
> For each key passed in the object will have a property, if a value is not found, it's value will be undefined.

`putAll(obj, cb)`
> where cb is a callback that with the signature (err).
> For each key in the object, the store should delete the key if the value given is undefined, or set it otherwise.
