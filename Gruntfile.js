/*
 * grunt-hashify
 * https://github.com/suprMax/grunt-hashify
 *
 * Copyright (c) 2013 Max Degterev
 * `I dont give a shit` license
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Clean up previous testrunner results
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    hashify: {
      default_options: {
        options: {
          basedir: 'tmp/'
        },
        files: {
          'tmp/default_options.json': ['test/fixtures/style.css', 'test/fixtures/script.js']
        }
      },
      no_dest: {
        options: {
          complete: function(hashes) {
            grunt.file.write('tmp/no_dest_result.json', JSON.stringify(hashes));
            // return null, so if the task attempts to use the return value it should trigger an error
            return null;
          }
        },
        src: ['test/fixtures/style.css']
      },
      raw: {
        options: {
          complete: function(hashes) {
            grunt.file.write('tmp/raw.json', JSON.stringify(hashes));
            return null;
          }
        },
        src: ['test/fixtures/raw']
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'hashify', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
