module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc',
      },
      target: ['library/*.js', 'app/*.js']
    },
    browserify: {
      standalone: {
        src: ['library/main.js'],
        dest: 'app/csio-webrtc-app.js'
      },
      options: {
        transform: [['babelify', {'presets': ['es2015']}]],
        browserifyOptions: {
          standalone: 'CsioWebrtcApp'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! Grunt Uglify <%= grunt.template.today("yyyy-mm-dd") %> */ '
      },
      build: {
        files: {
          'app/csio-webrtc-app.min.js': ['app/csio-webrtc-app.js']
        }
      }
    },
    watch: {
      files: ['<%= eslint.target %>'],
      tasks: ['eslint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('linter', ['eslint']);
  grunt.registerTask('build', ['browserify', 'uglify']);
};
