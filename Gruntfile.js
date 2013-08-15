module.exports = function(grunt) {

	grunt.initConfig({

		// Watches for changes and runs tasks
		watch : {
			sass : {
				files : ['scss/**/*.scss'],
				tasks : ['sass:dev'],
				options : {
					livereload : true
				}
			},
			js : {
				files : ['js/**/*.js'],
				tasks : ['jshint'],
				options : {
					livereload : true
				}
			},
			php : {
				files : ['**/*.php'],
				options : {
					livereload : true
				}
			}
		},

		// JsHint your javascript
		jshint : {
			all : ['js/*.js', '!js/modernizr.js', '!js/*.min.js', '!js/vendor/**/*.js'],
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

		// Dev and production build for sass
		sass : {
			production : {
				files : [
					{
						src : ['**/*.scss', '!**/_*.scss'],
						cwd : 'scss',
						dest : 'css',
						ext : '.css',
						expand : true
					}
				],
				options : {
					style : 'compressed'
				}
			},
			dev : {
				files : [
					{
						src : ['**/*.scss', '!**/_*.scss'],
						cwd : 'scss',
						dest : 'css',
						ext : '.css',
						expand : true
					}
				],
				options : {
					style : 'expanded'
				}
			}
		},

		// Bower task sets up require config
		bower : {
			all : {
				rjsConfig : 'js/global.js'
			}
		},

		// Require config
		requirejs : {
			production : {
				options : {
					name : 'global',
					baseUrl : 'js',
					mainConfigFile : 'js/global.js',
					out : 'js/optimized.min.js'
				}
			}
		},

		// Image min
		imagemin : {
			production : {
				files : [
					{
						expand: true,
						cwd: 'images',
						src: '**/*.{png,jpg,jpeg}',
						dest: 'images'
					}
				]
			}
		},

		// SVG min
		svgmin: {
			production : {
				files: [
					{
						expand: true,
						cwd: 'images',
						src: '**/*.svg',
						dest: 'images'
					}
				]
			}
		},

	});

	// Default task
	grunt.registerTask('default', ['watch']);

	// Build task
	grunt.registerTask('build', ['jshint', 'sass:production', 'imagemin:production', 'svgmin:production', 'requirejs:production']);

	// Template Setup Task
	grunt.registerTask('setup', ['sass:dev', 'bower-install'])

	// Load up tasks
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-svgmin');

	// Run bower install
	grunt.registerTask('bower-install', function() {
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
