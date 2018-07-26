
Erratum
=======

[![Build Status](https://travis-ci.org/jacoscaz/node-erratum.svg?branch=master)](https://travis-ci.org/jacoscaz/node-erratum)

Erratum is an extension of the native Error class that adds support for additional properties, simple assertions and can be extended as any other ES6 class.

API
---

### new Erratum()

```js
new Erratum([data], message)
```
Arguments: 

- **data**: [optional] additional data
- **message**: the error message

Quick example:

```js
const Erratum = require('erratum');
const err = new Erratum({statusCode: 500}, 'The answer is: 42');

err instanceof Error                   // true
err instanceof Erratum                 // true
err.statusCode === 500                 // true
err.message === 'This answer is: 42';  // true
```

### Extending Erratum

`Erratum` can be extended as any other ES6 class.

```js
class ExtendedErratum extends Erratum {};

const err = new ExtendedErratum({statusCode: 500}, 'The answer is: 42');
    
err instanceof Error                   // true
err instanceof Erratum                 // true
err instanceof ExtendedErratum         // true
err.statusCode === 500                 // true
err.message === 'This answer is: 42';  // true
```

### Default values

Classes extending `Erratum` can specify default values to be set on their instances and optionally overridden through the `data` argument.

```js
class ExtendedErratum extends Erratum {
    static get defaults() {
        return {
            ...super.defaults,
            hello: 'world',
            statusCode: 500
        }
    }
};

const err = new ExtendedErratum({statusCode: 400}, 'The answer is: 42');

err.hello === 'world'                  // true
err.statusCode === 500                 // false
err.statusCode === 400                 // true
```

### Error wrapping

If `data` is an instance of `Error` or has either the `err` property or the `error` property set to an instance of `Error`, the stack of the new `Erratum` instance will incorporate the stack of the provided error. The latter will be available through the `wrappedError` property. 

```js
const err = new Error('Something went wrong.');
throw new Erratum({err}, 'Yes, something definitely went wrong.');
```

```
Erratum: Yes, something definitely went wrong.
    at repl:1:7
    at REPLServer.defaultEval (repl.js:262:27)
    at bound (domain.js:287:14)
    at REPLServer.runBound [as eval] (domain.js:300:12)
    at REPLServer.<anonymous> (repl.js:431:12)
    at emitOne (events.js:82:20)
    at REPLServer.emit (events.js:169:7)
    at REPLServer.Interface._onLine (readline.js:211:10)
    at REPLServer.Interface._line (readline.js:550:8)
    at REPLServer.Interface._ttyWrite (readline.js:827:14)
Caused By: Error: Something went wrong.
    at repl:1:17
    at REPLServer.defaultEval (repl.js:262:27)
    at bound (domain.js:287:14)
    at REPLServer.runBound [as eval] (domain.js:300:12)
    at REPLServer.<anonymous> (repl.js:431:12)
    at emitOne (events.js:82:20)
    at REPLServer.emit (events.js:169:7)
    at REPLServer.Interface._onLine (readline.js:211:10)
    at REPLServer.Interface._line (readline.js:550:8)
    at REPLServer.Interface._ttyWrite (readline.js:827:14)
```

### Assertions

`Erratum` and all of its child classes support simple assertions through `Erratum.assert()`.

```js
Erratum.assert(check(), {statusCode: 500}, 'The answer is: 42');
```

Breaking changes
----------------

- **2.x.x**
  - Partial rewrite to update the code to ES6
  - Dropped message formatting in favour of ES6' templates
  - Dropped `Erratum.extend()` in favour of ES6' classes
  - Dropped using the constructor as a factory function (i.e. instantiating without `new`)
- **1.x.x**
  - Complete rewrite, extends the native `Error` class to better support error specialization
  - Dropped `Erratum.wrap()`
    
Test
----

    $ npm test
    
License
-------

See [LICENSE](./LICENSE).
