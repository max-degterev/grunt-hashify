/*
 * grunt-cachebuster
 * https://github.com/felthy/grunt-cachebuster
 *
 * Copyright (c) 2013 Pete Feltham
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var crypto = require('crypto'),
      path = require('path');

  grunt.registerMultiTask('hashify',
    'Generates a file containing file hashes, copies files with md5 as part of the name, partial updates of hashmap possible.',
    function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      length: 32,
      copy: true,
      keep_original: true
     });

    var basedir = null;
    if (options.basedir) basedir = path.resolve(options.basedir);

    var createFileCopy = function(original, target, hash) {
      var filename = path.basename(original),
          ext = path.extname(filename),
          copy = null;

      if (ext) {
        copy = path.basename(filename, ext) + '-' + hash + ext;
      }
      else {
        copy = filename + '-' + hash;
      }

      grunt.file.copy(original, target + '/' + copy);
      grunt.log.write('Created copy of a file: "' + copy + '".\n');

      if (!options.keep_original) {
        grunt.file.delete(original);
        grunt.log.write('Deleted original file: "' + original + '".\n');
      }
    };

    // Iterate over all specified file groups.
    var _this = this;
    var parseFileGroup = function(f) {
      if (f.dest) {
        grunt.log.write('Generating hashes file "' + f.dest + '".\n');
      }
      else {
        grunt.log.write('Copying files without saving the hashmap.\n');
      }
      var warnings = false,
          hashes = {};

      // Let's read current file if it exists
      if (f.dest && grunt.file.exists(f.dest)) hashes = grunt.file.readJSON(f.dest);

      // Concat specified files.
      f.src.forEach(function(filename) {
        if (grunt.file.exists(filename)) {
          if (!grunt.file.isDir(filename)) {
            var source = grunt.file.read(filename, {
              encoding: null
            });
            var hash = crypto.
              createHash('md5').
              update(source).
              digest('hex').
              slice(0, options.length);

            var key = filename;
            if (basedir) {
              key = path.relative(basedir, filename);
            }

            hashes[key] = hash;

            if (options.copy && basedir) createFileCopy(filename, basedir, hash);
          }
        } else {
          grunt.log.warn('Source file "' + filename + '" not found.\n');
          warnings = true;
        }
      });

      if (typeof options.complete === 'function') {
        hashes = options.complete.call(_this, hashes);
      }

      if (f.dest) grunt.file.write(f.dest, JSON.stringify(hashes));

      // Print a success message.
      if (warnings) {
        grunt.log.warn('Hashmap file "' + f.dest + '" created, with warnings.');
      } else {
        grunt.log.ok();
      }
    };
    this.files.forEach(parseFileGroup);
  });
};
