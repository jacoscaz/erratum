
var util = require('util');
var assert = require('assert');
var erratum = require('./');

var errB = erratum('The answer is always %s.', 42);
assert(errB instanceof Error, 'Err is not an instance of Error.');
assert(errB.message === 'The answer is always 42.', 'Unexpected message.');

var errA = erratum({code: 42}, 'Hello %s, this is an %s.', 'stranger', 'error');
assert(errA instanceof Error, 'Err is not an instance of Error.');
assert(errA.message === 'Hello stranger, this is an error.', 'Unexpected message.');
assert(errA.code === 42, 'Bad code.');

console.log('\n\n\n');
console.log('>> YAY! Everything checks out.');
console.log('\n\n\n');
