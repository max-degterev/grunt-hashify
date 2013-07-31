/*
 * grunt-hashify
 * https://github.com/suprMax/grunt-hashify
 *
 * Copyright (c) 2013 Max Degterev
 * `I dont give a shit` license
 *
 * based on Pete Feltham's plugin
 * https://github.com/felthy/grunt-cachebuster
 */

'use strict';

module.exports = function(grunt) {
  var crypto = require('crypto'),
      path = require('path');

  grunt.registerMultiTask('hashify',
    'Generates a file containing file hashes, copy files with md5 as a part of the name.',
    function() {
      // Merge task-specific and/or target-specific options with these defaults.
      var options = this.options({
        length: 32,
        copy: false
       });

      var hashes = (options.hashmap && grunt.file.exists(options.hashmap)) ?
                      grunt.file.readJSON(options.hashmap) : {},
          warnings = false;

      var copyFile = function(original, target, hash) {
        var copy = target.replace('{{hash}}', hash);
        if (options.basedir) copy = options.basedir + '/' + copy;

        grunt.file.copy(original, copy);
        grunt.log.write('File ' + copy.cyan + ' created.\n');

        if (!options.copy) {
          grunt.file.delete(original);
          grunt.log.write('File ' + original.red + ' deleted.\n');
        }
      };

      // Iterate over all specified file groups.
      var parseFileGroup = function(f) {
        f.src.forEach(function(filename) {
          if (grunt.file.exists(filename) && !grunt.file.isDir(filename)) {
            var source = grunt.file.read(filename, { encoding: null }),
                key = options.basedir ? path.relative(options.basedir, filename) : filename;

            var hash = crypto.
                        createHash('md5').
                        update(source).
                        digest('hex').
                        slice(0, options.length);

            hashes[key] = hash;
            if (f.dest) copyFile(filename, f.dest, hash);
          }
          else {
            warnings = true;
            grunt.log.warn('File ' + filename.red + ' not found or is a directory.\n');
          }
        });
      };
      this.files.forEach(parseFileGroup);

      if (typeof options.complete === 'function') {
        hashes = options.complete.call(this, hashes);
      }

      // Hashes might've been nullified by the complete callback
      if (hashes && options.hashmap) {
        grunt.file.write(options.hashmap, JSON.stringify(hashes));
        grunt.log.write('File ' + options.hashmap.cyan + ' created/updated.\n');
      }

      // Print a success message.
      if (warnings) {
        grunt.log.warn('Task finished with warnings.\n');
      } else {
        grunt.log.ok();
      }

  });
};
