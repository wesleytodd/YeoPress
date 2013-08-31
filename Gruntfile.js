module.exports = function(grunt) {

	// Configuration
	grunt.initConfig({
		clean: {
			site: ['test/site/*', 'test/site/.*', '!test/site/.gitkeep'],
			test: ['test/tmp'],
			cache: {
				options: {force: true},
				src: [
					// Wordpress
					process.env.HOME + '/.yeoman/cache/wordpress',
					// Yeopress default theme
					process.env.HOME + 'wesleytodd/YeoPress']
			}
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

	// Load external tasks
	grunt.loadNpmTasks('grunt-contrib-clean');

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
