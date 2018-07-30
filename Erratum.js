
'use strict';

function isString(s) {
  return typeof(s) === 'string';
}

function isObject(o) {
  return typeof(o) === 'object' && o !== null;
}

function isError(e) {
  return e instanceof Error;
}

class Erratum extends Error {
  
  constructor(data, message) {

    if (isString(data)) {
      message = data;
      data = null;
    }

    super(message);

    Object.assign(this, this.constructor.defaults);

    let wrappedError;

    if (isObject(data)) {
      if (isError(data)) {
        wrappedError = data;
      } else {
        Object.assign(this, data);
        if (isError(this.err)) {
          wrappedError = this.err;
          delete this.err;
        }
        if (isError(this.error)) {
          wrappedError = this.error;
          delete this.error;
        }
      } 
    }

    Object.defineProperty(this, 'name', {
      enumerable: false,
      value: this.constructor.name
    });

    Object.defineProperty(this, 'message', {
      enumerable: false,
      value: message
    });

    Error.captureStackTrace(this, this.constructor);

    if (isError(wrappedError)) {
      Object.defineProperty(this, 'wrappedError', {
        enumerable: false,
        value: wrappedError
      })
      this.stack += '\nCaused By: ' + wrappedError.stack;
    }

  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
  
  toJSON() {
    return {...this, message: this.message, name: this.name};
  }

  static get defaults() {
    return {};
  }

  static assert(check, data, message) {
    if (!check) {
      throw new this(data, message);
    }
  }

}

module.exports = Erratum;
