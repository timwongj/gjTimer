module.exports = function(grunt) {

  grunt.loadTasks('grunt/tasks');

  grunt.registerTask('default', ['jshint', 'karma', 'clean', 'copy', 'concat', 'uglify', 'less:development', 'watch']);
  grunt.registerTask('prod', ['clean', 'copy', 'concat', 'uglify', 'less:production']);

};