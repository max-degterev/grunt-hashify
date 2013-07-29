'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.hashify = {
  // setUp: function(done) {
  //   // setup here if necessary
  //   done();
  // },
  default_options: function(test) {
    var actual = grunt.file.read('tmp/default_options.json');
    var expected = grunt.file.read('test/expected/default_options.json');

    test.equal(actual, expected, 'Should generate a JSON file with default options');

    var originalFile = grunt.file.read('test/fixtures/script.js');
    var hashMap = grunt.file.readJSON('tmp/default_options.json');
    var copiedFile = grunt.file.read('tmp/script-' + hashMap["../test/fixtures/script.js"] + '.js');

    test.equal(originalFile, copiedFile, 'Should copy original file for cachebusting');
    test.done();
  },
  no_dest: function(test) {
    var actual = grunt.file.read('tmp/no_dest_result.json');

    test.equal(actual, '{"test/fixtures/style.css":"614494e1320c83d6456525c5a80744d7"}',
    'no_dest complete handler in Gruntfile.js should have written tmp/no_dest_result');
    test.done();
  },
  raw: function(test) {
    var actual = grunt.file.read('tmp/raw.json');
    var expected = grunt.file.read('test/expected/raw.json');

    test.equal(actual, expected, 'Should generate a JSON file for raw content');
    test.done();
  }
};
