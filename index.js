
var util = require('util');

function extend(a, b) {
  var keys = Object.keys(b);
  for (var i = 0, key = keys[0]; i < keys.length; key = keys[++i]) {
    a[key] = b[key];
  }
}

function isObject(o) {
  return o !== null && typeof(o) === 'object';
}

function wrap(ErrorClass) {

  return function() {

    var args = Array.prototype.slice.call(arguments);
    var data = isObject(args[0]) ? args.shift() : null;

    var err = new ErrorClass(util.format.apply(util, args));

    data && extend(err, data);

    return err;

  }

}

module.exports = wrap(Error);
module.exports.wrap = wrap;
