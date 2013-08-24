module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			site: ['test/site/*', 'test/site/.*', '!test/site/.gitkeep'],
			test: ['test/tmp']
		},
		test: {
			unit: {
				src: [
					'test/spawn.js',
					'test/git.js',
					'test/prompt.js'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['clean:test', 'test']);

	// Test runner task
	grunt.registerMultiTask('test', function() {
		var done = this.async(),
			async = require('async'),
			testFncs = [];

		for (var f in this.filesSrc) {
			(function(f, filesSrc) {
				testFncs.push(function(done) {
					var p = grunt.util.spawn({
						cmd: 'node',
						args: [filesSrc[f], '--color'],
					}, function() {
						done();
					})
					p.stdout.pipe(process.stdout);
					p.stderr.pipe(process.stderr);
				});
			})(f, this.filesSrc);
		}

		async.series(testFncs, function() {
			done();
		});
	});
}
