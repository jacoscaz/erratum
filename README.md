
Erratum
=======

Erratum is a simple factory function for `Error` and the other native 
error classes that supports string formatting and additional properties.

API
---

    var erratum = require('erratum');
    
    var err = erratum({statusCode: 500}, 'This is an %s.', 'error');
    
    err instanceof Error                  // true
    err.statusCode === 500                // true
    err.message === 'This is an error.';  // true
    
Erratum uses the `Error` class by default. To use a different class, 
call the included `wrap` function.

    var erratum = require('erratum');
    var typeErratum = erratum.wrap(TypeError);
    
    typeErratum('The answer it always %s.', 42);
    
Test
----

    node test.js
    
License
-------

See [LICENSE](./LICENSE).
