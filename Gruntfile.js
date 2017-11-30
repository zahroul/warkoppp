module.exports = function run(grunt) {
  grunt.initConfig({
    sass: {
      options: {
        outputStyle: 'compressed',
        sourceMap: true,
      },
      dist: {
        files: {
          'css/app.css': 'css/app.scss',
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.registerTask('default', ['sass']);
};
