module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        files: ['public/js/**/*.js','app.js','routes/**/*.js'],
        options: {
            ignores: ['public/js/lib/*.js','src/lib/*.js']
        }
    },
    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: ['dev'],
          nodeArgs: ['--debug'],
          ignoredFiles: ['README.md', 'node_modules/**'],
          watchedExtensions: ['js'],
          watchedFolders: ['routes','.'],
          delayTime: 1,
          legacyWatch: true,
          cwd: __dirname
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['nodemon:dev']);

};

