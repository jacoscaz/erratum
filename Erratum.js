
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

    if (isObject(data)) {
      
      if (isError(data)) {
        this.wrappedError = data;
      } else {
        Object.assign(this, data);
      }

      if (isError(this.err)) {
        this.wrappedError = this.err;
        delete this.err;
      } 

      if (isError(this.error)) {
        this.wrappedError = this.error;
        delete this.error;
      }
      
    }

    this.name = this.constructor.name;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);

    if (isError(this.wrappedError)) {
      this.stack += '\nCaused By: ' + this.wrappedError.stack;
    }

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
