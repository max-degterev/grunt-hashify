/*
 * grunt-cachebuster
 * https://github.com/felthy/grunt-cachebuster
 *
 * Copyright (c) 2013 Pete Feltham
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var crypto = require('crypto');
  var path = require('path');

  var formatJSON = function(hashes, banner) {
    return banner + JSON.stringify(hashes);
  };

  grunt.registerMultiTask('hashify', 'Generates a file containing file hashes.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      banner: '',
      length: 32
    });

    var basedir = null;
    if (options.basedir) {
      basedir = path.resolve(options.basedir);
    }

    // Iterate over all specified file groups.
    var _this = this;
    this.files.forEach(function(f) {
      grunt.log.write('Generating hashes file "' + f.dest + '"...');
      var warnings = false;
      var hashes = {};
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
          }
        } else {
          grunt.log.warn('Source file "' + filename + '" not found.');
          warnings = true;
        }
      });

      if (typeof options.complete === 'function') {
        hashes = options.complete.call(_this, hashes);
      }

      if (f.dest && hashes) {
        // Write the destination file.
        grunt.file.write(f.dest, formatJSON(hashes, options.banner));
      } else {
        grunt.verbose.writeln('Not writing output file.');
      }

      // Print a success message.
      if (warnings) {
        grunt.log.warn('Cachebuster file "' + f.dest + '" created, with warnings.');
      } else {
        grunt.log.ok();
      }
    });
  });
};
