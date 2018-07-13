
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
      
      data = isError(data) 
        ? {wrappedError: data} 
        : {...data};

      if (isError(data.err)) {
        data.wrappedError = data.err;
        delete data.err;
      } 

      if (isError(data.error)) {
        data.wrappedError = data.error;
        delete data.error;
      }
      
      Object.assign(this, data);
    }

    this.name = this.constructor.name;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);

    if (this.wrappedError instanceof Error) {
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
