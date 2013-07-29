# grunt-hashify

This grunt task iterates over its source files, calculating the MD5 hash of each, then creates a file containing the
list of filenames and hashes. It can also create a copy of original filename with hash as part of the name and works with
pre-existing hashmap files extending them so partial updates are possible.

## Getting Started
This plugin requires Grunt `~0.4.0`
Deal with it.

Installation:
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
      basedir: 'tmp/', // All hashmap paths are gonna be relative to this. Also iused to fopy files to
      copy: false, // Create a copy with hash in filename?
      keep_original: true // If a copy created, keep original file?
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

