
Erratum
=======

Erratum is a simple extension of the native Error class supporting string formatting, additional properties and further subclassing.

Breaking changes
----------------

Erratum has been rewritten with the `1.x` release, extending the native `Error` class to better support error specialization.  

While the basic `erratum()` API remains unchanged, versions `1.x` do not have the `erratum.wrap` feature anymore.

API
---

The API is comprised of only one function: `Erratum([data], message, [args...])`. It can be used both as a factory function and as a constructor and always returns an `Erratum` instance.

- **data**: [optional] additional data
- **message**: the error message, optionally with `utils.format()` formatting tags
- **args**: [optional] formatting arguments

Here's a quick example:

    var Erratum = require('erratum');
    
    var err = Erratum({statusCode: 500}, 'The %s is: %s', 'answer', 42);
    // var err = new Erratum({statusCode: 500}, 'The %s is: %s', 'answer', 42);
    
    err instanceof Error                   // true
    err instanceof Erratum                 // true
    err.statusCode === 500                 // true
    err.message === 'This answer is: 42';  // true

The `Erratum` function supports extension through child classes. These will inherit all `Erratum` features.  

    function ExtendedErratum() {
      Erratum.apply(this, arguments);
      // Custom stuff goes here.
    }
    
    util.inherits(ExtendedErratum, Erratum);
    
    var err = new ExtendedErratum({statusCode: 500}, 'The answer is: %s', 42);
        
    err instanceof Error                   // true
    err instanceof Erratum                 // true
    err instanceof ExtendedErratum         // true
    err.statusCode === 500                 // true
    err.message === 'This answer is: 42';  // true

Subclassing is also supported through the static `.extend()` method:

    var ExtendedErratum = Erratum.extend();
    
    var err = new ExtendedErratum({statusCode: 500}, 'The answer is: %s', 42);
        
    err instanceof Error                   // true
    err instanceof Erratum                 // true
    err instanceof ExtendedErratum         // true
    err.statusCode === 500                 // true
    err.message === 'This answer is: 42';  // true

The implementation of the `extend()` method follows `Backbone.js`' own
implementation of such feature. 

Check the tests in `test/main.js` for more examples.

### Error wrapping

If `data` is an instance of `Error` or has either the `err` property
or the `error` property set to an instance of `Error`, the stack of the 
new error returned by `Erratum()` will incorporate the stack of the 
provided error. The latter will be available at `Erratum#wrapperError`.
 
```
> var someError = new Error('Something went wrong.');
> throw new Erratum({err: someError}, 'Yes, something definitely went wrong.');

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
    
Test
----

    $ mocha
    
License
-------

See [LICENSE](./LICENSE).
