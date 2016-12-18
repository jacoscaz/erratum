
var util = require('util');
var should = require('should');
var Erratum = require('../');

describe('Erratum', function() {

  it('should instantiate correctly when used as a function', function () {
    Erratum('Answer: 42').should.be.instanceof(Erratum);
  });

  it('should instantiate when used as a constructor', function () {
    (new Erratum('Answer: 42')).should.be.instanceof(Erratum);
  });

  it('should produce instances that are also instances of the Error class', function() {
    Erratum('Answer: 42').should.be.instanceof(Error);
  });

  it('should set the error name correctly', function() {
    Erratum('Answer: %s', 42).name.should.equal('Erratum');
  });

  it('should set the error message correctly', function() {
    Erratum('Answer: 42').message.should.equal('Answer: 42');
  });

  it('should format the error message correctly', function() {
    Erratum('%s: %s', 'Answer', 42).message.should.equal('Answer: 42');
  });

  it('should set additional data correctly', function() {
    var data = {num: 17, obj: {}};
    var error = Erratum(data, 'Answer: 42');
    error.num.should.equal(17);
    error.obj.should.equal(data.obj);
  });

  it('should format the error message and set additional data correctly', function() {
    var data = {num: 17, obj: {}};
    var error = Erratum(data, '%s: %s', 'Answer', 42);
    error.message.should.equal('Answer: 42');
    error.num.should.equal(17);
    error.obj.should.equal(data.obj);
  });
  
  it('should support error subclasses correctly', function() {
    function ExtendedErratum() {
      Erratum.apply(this, arguments);
    }
    util.inherits(ExtendedErratum, Erratum);
    var data = {num: 17, obj: {}};
    var error = new ExtendedErratum(data, '%s: %s', 'Answer', 42);
    error.should.be.instanceof(Error);
    error.should.be.instanceof(Erratum);
    error.should.be.instanceof(ExtendedErratum);
    error.message.should.equal('Answer: 42');
    error.num.should.equal(17);
    error.obj.should.equal(data.obj);
    error.name.should.equal(ExtendedErratum.name);
  });

  it('should support error subclasses correctly [extend]', function() {
    var ExtendedErratumA = Erratum.extend('ExtendedA');
    var ExtendedErratumB = ExtendedErratumA.extend('ExtendedB');
    var data = {num: 17, obj: {}};
    var errorA = new ExtendedErratumA(data, '%s: %s', 'Answer', 42);
    var errorB = new ExtendedErratumB(data, '%s: %s', 'Answer', 42);
    errorA.should.be.instanceof(Error);
    errorA.should.be.instanceof(Erratum);
    errorA.should.be.instanceof(ExtendedErratumA);
    errorA.name.should.equal(ExtendedErratumA.name);
    errorA.message.should.equal('Answer: 42');
    errorA.num.should.equal(17);
    errorA.obj.should.equal(data.obj);
    errorB.should.be.instanceof(Error);
    errorB.should.be.instanceof(Erratum);
    errorB.should.be.instanceof(ExtendedErratumA);
    errorB.should.be.instanceof(ExtendedErratumB);
    errorB.message.should.equal('Answer: 42');
    errorB.num.should.equal(17);
    errorB.obj.should.equal(data.obj);
  });

  it('should support simple assertions through Erratum.assert()', function () {
    var data = {num: 17, obj: {}};
    try {
      Erratum.assert(false, data, '%s: %s', 'Answer', 42);
    } catch (err) {
      err.should.be.instanceof(Erratum);
      err.message.should.equal('Answer: 42');
      err.num.should.equal(data.num);
      err.obj.should.equal(data.obj);
      return;
    }
    throw new Error('Should not be here.');
  });

  it('should support simple assertions in subclasses Subclass.assert()', function () {
    var ExtendedErratum = Erratum.extend('ExtendedErratum');
    var data = {num: 17, obj: {}};
    try {
      ExtendedErratum.assert(false, data, '%s: %s', 'Answer', 42);
    } catch (err) {
      err.should.be.instanceof(ExtendedErratum);
      err.message.should.equal('Answer: 42');
      err.num.should.equal(data.num);
      err.obj.should.equal(data.obj);
      return;
    }
    throw new Error('Should not be here.');
  });

});
