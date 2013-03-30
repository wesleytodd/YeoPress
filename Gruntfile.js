module.exports = function(grunt) {
	grunt.initConfig({
		'regarde' : {
			sass : {
				files : ['scss/**/*.scss'],
				tasks : ['sass:dev', 'livereload']
			},
			js : {
				files : ['js/**/*.js'],
				tasks : ['jshint', 'livereload']
			},
			php : {
				files : ['**/*.php'],
				tasks : ['livereload']
			}
		},
		'jshint' : {
			all : ['js/*.js', '!js/modernizr.js', '!js/vendor/**/*.js'],
			options : {
				browser: true,
				curly: false,
				eqeqeq: false,
				eqnull: true,
				expr: true,
				immed: true,
				newcap: true,
				noarg: true,
				smarttabs: true,
				sub: true,
				undef: false
			}
		},
		'sass' : {
			build : {
				files : {
					'css/global.css' : 'scss/global.scss'
				},
				options : {
					style : 'compressed'
				}
			},
			dev : {
				files : {
					'css/global.css' : 'scss/global.scss'
				},
				options : {
					style : 'expanded'
				}
			}
		}
	});

	grunt.registerTask('default', ['livereload-start', 'regarde']);

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.loadNpmTasks('grunt-regarde');

	grunt.registerTask('setup', function() {
		var exec = require('child_process').exec;
		exec('jam install && sass scss/global.scss css/global.css', function(err) {
			if (err) {
				console.error(err);
			}
		}).stdout.on('data', function(message) {
			console.log(message);
		});
	});
};
