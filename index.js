
'use strict';

function isFunction(f) {
  return typeof(f) === 'function';
}

function isString(s) {
  return typeof(s) === 'string';
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

function inherits(Child, Parent) {
  Child.super_ = Parent;
  Child.prototype = Object.create(Parent.prototype, {
    constructor: {
      value: Child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

/**
 * Taken from the fast-format module by KnowledgeCode
 * https://github.com/knowledgecode/fast-format/blob/master/fast-format.js
 */
function format(string) {
  var i, len, argc = arguments.length, v = (string + '').split('%s'), r = argc ? v[0] : '';
  for (i = 1, len = v.length, argc--; i < len; i++) {
    r += (i > argc ? '%s' : arguments[i]) + v[i];
  }
  return r;
}

function Erratum() {

  var args = Array.prototype.slice.call(arguments, 0);

  if (!(this instanceof Erratum)) {
    args.unshift(null);
    return new (Erratum.bind.apply(Erratum, args));
  }

  var constructor = this.constructor;

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

  this.name = constructor.name;
  this.message = format.apply(null, args) + '';
  this.constructor = constructor;

  Error.captureStackTrace(this, constructor);

  if (this.wrappedError instanceof Error) {
    this.stack += '\nCaused By: ' + this.wrappedError.stack;
  }

}

Erratum.setStackTraceLimit = function(limit) {
  Error.stackTraceLimit = limit;
};

Erratum.extend = function(name, protoProps, staticProps) {

  var Parent = this;
  var Child = null;

  if (!isString(name)) {
    staticProps = protoProps;
    protoProps = name;
    name = null;
  }

  !isObject(protoProps) && (protoProps = {});
  !isObject(staticProps) && (staticProps = {});

  if (Object.hasOwnProperty(protoProps, 'constructor')
    && isFunction(protoProps.constructor)) {

    Child = protoProps.constructor;

  } else {

    Child = function () {
      if (!(this instanceof Child)) {
        return new (Child.bind.apply(Child, arguments));
      }
      Parent.apply(this, arguments);
    };

  }

  name = name || Child.name || Parent.name;
  Object.defineProperty(Child, 'name', {value: name});

  extend(Child, Parent, staticProps);
  inherits(Child, Parent);
  extend(Child.prototype, protoProps);
  
  return Child;
};

inherits(Erratum, Error);

module.exports = Erratum;
