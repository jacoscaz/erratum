
var util = require('util');

function isObject(o) {
  return o !== null && typeof(o) === 'object';
}

function isFunction(f) {
  return typeof(f) === 'function';
}

function extend(a, b) {
  var keys = Object.keys(b);
  for (var i = 0, key = keys[0]; i < keys.length; key = keys[++i]) {
    if (b.hasOwnProperty(key) && b[key] !== undefined) {
      a[key] = b[key];
    }
  }
}

function Erratum() {

  var args = Array.prototype.slice.call(arguments, 0);

  if (!(this instanceof Erratum)) {
    args.unshift(null);
    return new (Erratum.bind.apply(Erratum, args));
  }

  Error.captureStackTrace(this, this.constructor);

  var data = isObject(args[0]) && args[0];

  if (data) {
    args.shift();
    extend(this, data);
  }

  this.name = this.constructor.name;
  this.message = util.format.apply(util, args) + '';
}

util.inherits(Erratum, Error);

module.exports = Erratum;
