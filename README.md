# grunt-hashify

This grunt task iterates over its source files, calculating the MD5 hash of each, then creates a file containing the
list of filenames and hashes. This file can then be used in your project to generate filenames that contain the MD5
hash of the file's contents, e.g. main-ae65552d65cd19ab4f1996c77915ed42.js, so that even if a sticky cache is used,
clients will always load the latest version of files whenever they change.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-hashify --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-hashify');
```

## The "hashify" task

### Overview
In your project's Gruntfile, add a section named `hashify` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  hashify: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

