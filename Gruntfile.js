module.exports = function(grunt) {
	grunt.initConfig({
		regarde : {
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
		jshint : {
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
		sass : {
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
		},
		bower : {
			all : {
				rjsConfig : 'js/global.js'
			}
		},
		requirejs : {
			compile : {
				options : {
					name : 'global',
					baseUrl : 'js',
					mainConfigFile : 'js/global.js',
					out : 'js/optimized.js'
				}
			}
		}
	});

	grunt.registerTask('default', ['livereload-start', 'regarde']);

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('setup', function() {
		var done = this.async();
		var bower = require('bower').commands;
		bower.install().on('end', function(data) {
			done();
		}).on('data', function(data) {
			console.log(data);
		}).on('error', function(err) {
			console.error(err);
			done();
		});
	});
};
