module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc',
      },
      target: ['app/*.js']
    },
    watch: {
      files: ['<%= eslint.target %>'],
      tasks: ['eslint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.registerTask('default', ['eslint']);
};
