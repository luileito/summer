module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },
      lib: {
        src: [
          'lib/csspath.js',
          'lib/textsplitter.js',
          'lib/pagerank.js',
          'lib/textrank.js',
          'lib/naiverank.js',
          'lib/summer.js',
        ],
        dest: 'dist/<%= pkg.name %>.js',
      },
    },

    uglify: {
      options: {
        sourceMap: false,
        banner: '/*! <%= pkg.name %> | <%= pkg.title %> | <%= pkg.author %> | <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      lib: {
        src: [
          '<%= concat.lib.dest %>',
        ],
        dest: 'dist/<%= pkg.name %>.min.js',
      },
    },

    clean: {
      js: [
        '<%= concat.lib.dest %>',
        '!<%= uglify.lib.dest %>',
      ],
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', [
    'concat:lib',
    'uglify:lib',
  ]);

  grunt.registerTask('test', [ 'default' ]);

};
