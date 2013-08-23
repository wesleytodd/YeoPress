module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			site: ['test/site/*', 'test/site/.*', '!test/site/.gitkeep']
		},
		test: {
			unit: {
				src: ['test/git.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['clean', 'test']);

	// Test runner task
	grunt.registerMultiTask('test', function() {
		var done = this.async(),
			total = 0,
			complete = 0;
		for (var f in this.filesSrc) {
			total++;
			grunt.util.spawn({
				cmd: 'node',
				args: [this.filesSrc[f], '--color'],
			}, function() {
				complete++;
				if (complete == total) done();
			}).stdout.pipe(process.stdout);
		}
	});
}
