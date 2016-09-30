
var util = require('util');

function isFunction(f) {
  return typeof(f) === 'function';
}

function isObject(o) {
  return o !== null && (isFunction(o) || typeof(o) === 'object');
}

function extend(target) {
  var sources = Array.prototype.slice.call(arguments, 1);
  for (var s = 0, source = sources[0]; s < sources.length; source = sources[s++]) {
    if (isObject(source)) {
      for (var i = 0, keys = Object.keys(source), key = keys[0]; i < keys.length; key = keys[++i]) {
        if (source.hasOwnProperty(key) && source[key] !== undefined) {
          target[key] = source[key];
        }
      }
    }
  }
  return target;
}

function Erratum() {

  var args = Array.prototype.slice.call(arguments, 0);

  if (!(this instanceof Erratum)) {
    args.unshift(null);
    return new (Erratum.bind.apply(Erratum, args));
  }

  var data = isObject(args[0]) && args[0];

  if (data) {

    args.shift();

    if (data instanceof Error) {
      data = {wrappedError: data};
    }

    if (data.err) {
      data.wrappedError = data.err;
      delete data.err;
    }

    if (data.error) {
      data.wrappedError = data.error;
      delete data.error;
    }

    extend(this, data);
  }

  this.name = this.constructor.name;
  this.message = util.format.apply(util, args) + '';

  Error.captureStackTrace(this, this.constructor);

  if (this.wrappedError instanceof Error) {
    this.stack += '\nCaused By: ' + this.wrappedError.stack;
  }

}

Erratum.setStackTraceLimit = function(limit) {
  Error.stackTraceLimit = limit;
};

Erratum.extend = function(protoProps, staticProps) {

  var parent = this;
  var child;

  if (protoProps && Object.hasOwnProperty(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){
      return parent.apply(this, arguments);
    };
  }

  extend(child, parent, staticProps);

  child.prototype = Object.create(parent.prototype);

  extend(child.prototype, protoProps);

  child.__super__ = parent.prototype;

  return child;
};

util.inherits(Erratum, Error);

module.exports = Erratum;
