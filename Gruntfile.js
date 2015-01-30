module.exports = function(grunt) {

	// To support SASS/SCSS or Stylus, just install
	// the appropriate grunt package and it will be automatically included
	// in the build process, Sass is included by default:
	//
	// * for SASS/SCSS support, run `npm install --save-dev grunt-contrib-sass`
	// * for Stylus/Nib support, `npm install --save-dev grunt-contrib-stylus`

	var npmDependencies = require('./package.json').devDependencies;
	var hasSass = npmDependencies['grunt-contrib-sass'] !== undefined;
	var hasStylus = npmDependencies['grunt-contrib-stylus'] !== undefined;

	grunt.initConfig({

		// Watches for changes and runs tasks
		watch : {
			sass : {
				files : ['scss/**/*.scss'],
				tasks : (hasSass) ? ['sass:dev'] : null
			},
			stylus : {
				files : ['stylus/**/*.styl'],
				tasks : (hasStylus) ? ['stylus:dev'] : null
			},
			css : {
				files : ['css/**/*.css'],
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

		// Dev and production build for stylus
		stylus : {
			production : {
				files : [
					{
						src : ['**/*.styl', '!**/_*.styl'],
						cwd : 'stylus',
						dest : 'css',
						ext: '.css',
						expand : true
					}
				],
				options : {
					compress : true
				}
			},
			dev : {
				files : [
					{
						src : ['**/*.styl', '!**/_*.styl'],
						cwd : 'stylus',
						dest : 'css',
						ext: '.css',
						expand : true
					}
				],
				options : {
					compress : false
				}
			},
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
		}

	});

	// Default task
	grunt.registerTask('default', ['watch']);

	// Build task
	grunt.registerTask('build', function() {
		var arr = ['jshint'];

		if (hasSass) {
			arr.push('sass:production');
		}

		if (hasStylus) {
			arr.push('stylus:production');
		}

		arr.push('imagemin:production', 'svgmin:production', 'requirejs:production');

		return grunt.task.run(arr);
	});

	// Template Setup Task
	grunt.registerTask('setup', function() {
		var arr = [];

		if (hasSass) {
			arr.push('sass:dev');
		}

		if (hasStylus) {
			arr.push('stylus:dev');
		}

		arr.push('bower-install');

		return grunt.task.run(arr);
	});

	// Load up tasks
	if (hasSass) {
		grunt.loadNpmTasks('grunt-contrib-sass');
	}

	if (hasStylus) {
		grunt.loadNpmTasks('grunt-contrib-stylus');
	}

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
