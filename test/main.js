
var util = require('util');
var should = require('should');
var Erratum = require('../');

describe('Erratum', function() {

  it('should instantiate correctly', function () {
    new Erratum('Answer: 42').should.be.instanceof(Erratum);
  });

  it('should produce instances that are also instances of the Error class', function() {
    new Erratum('Answer: 42').should.be.instanceof(Error);
  });

  it('should set the error name correctly', function() {
    new Erratum('Answer: %s', 42).name.should.equal('Erratum');
  });

  it('should set the error message correctly', function() {
    new Erratum('Answer: 42').message.should.equal('Answer: 42');
  });

  it('should set additional data correctly', function() {
    var data = {num: 17, obj: {}};
    var error = new Erratum(data, 'Answer: 42');
    error.num.should.equal(17);
    error.obj.should.equal(data.obj);
  });

  it('should set the error message and additional data correctly', function() {
    var data = {num: 17, obj: {}};
    var error = new Erratum(data, 'Answer: 42');
    error.message.should.equal('Answer: 42');
    error.num.should.equal(17);
    error.obj.should.equal(data.obj);
  });
  
  it('should support error subclasses correctly', function() {
    class ExtendedErratum extends Erratum {};
    var data = {num: 17, obj: {}};
    var error = new ExtendedErratum(data, 'Answer: 42');
    error.should.be.instanceof(Error);
    error.should.be.instanceof(Erratum);
    error.should.be.instanceof(ExtendedErratum);
    error.message.should.equal('Answer: 42');
    error.num.should.equal(17);
    error.obj.should.equal(data.obj);
    error.name.should.equal(ExtendedErratum.name);
  });

  it('should support simple assertions', function () {
    var data = {num: 17, obj: {}};
    try {
      Erratum.assert(false, data, 'Answer: 42');
    } catch (err) {
      err.should.be.instanceof(Erratum);
      err.message.should.equal('Answer: 42');
      err.num.should.equal(data.num);
      err.obj.should.equal(data.obj);
      return;
    }
    throw new Error('Should not be here.');
  });

  it('should support simple assertions in subclasses', function () {
    class ExtendedErratum extends Erratum {};
    var data = {num: 17, obj: {}};
    try {
      ExtendedErratum.assert(false, data, 'Answer: 42');
    } catch (err) {
      err.should.be.instanceof(ExtendedErratum);
      err.message.should.equal('Answer: 42');
      err.num.should.equal(data.num);
      err.obj.should.equal(data.obj);
      return;
    }
    throw new Error('Should not be here.');
  });

  it('Should support default values', function () {
    class ExtendedErratum extends Erratum {
      static get defaults() {
        return {
          ...super.defaults,
          answer: 42
        };
      }
    }
    var err = new ExtendedErratum('Some message');
    err.answer.should.equal(42);
  });

  it('Should support overriding default values', function () {
    class ExtendedErratum extends Erratum {
      static get defaults() {
        return {
          ...super.defaults,
          answer: 42
        };
      }
    }
    var err = new ExtendedErratum({answer: 17}, 'Some message');
    err.answer.should.equal(17);
  });

});
