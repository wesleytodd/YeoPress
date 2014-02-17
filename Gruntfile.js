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
					process.env.HOME + 'wesleytodd/YeoPress'
				]
			}
		},

		connect: {
			coverage: {
				options: {
					port: 9001,
					keepalive: true,
					base: 'test/coverage/lcov-report',
					open: true
				}
			}
		},

		simplemocha: {
			unit: {
				src: ['test/unit/*.js']
			}
		}

	});

	// Run the test and generate the coverage report
	grunt.registerTask('istanbul', function() {
		var done = this.async();
		require('child_process').exec('npm run-script test --coverage', function(err, stdout, stderr) {
			console.error(stderr);
			console.log(stdout);
			console.log('\n\nView test coverage here:');
			console.log('---------------------------');
			console.log('http://localhost:9001');
			done();
		});
	});

	// Register composite tasks
	grunt.util._({
		'default': ['watch'],
		'coverage': ['istanbul', 'connect:coverage']
	}).map(function(task, name) {
		grunt.registerTask(name, task);
	});

	// Register npm tasks
	[
		'grunt-contrib-clean',
		'grunt-contrib-connect',
		//'grunt-contrib-watch',
		'grunt-simple-mocha'
	].forEach(grunt.loadNpmTasks);

}
