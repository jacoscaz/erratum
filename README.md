
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
    
Check the tests in `test/main.js` for more examples.
    
Test
----

    $ mocha
    
License
-------

See [LICENSE](./LICENSE).
