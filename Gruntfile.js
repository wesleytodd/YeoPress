module.exports = function(grunt) {
	grunt.initConfig({
		'regarde' : {
			sass : {
				files : ['scss/**/*.scss'],
				tasks : ['sass:dev']
			},
			js : {
				files : ['js/**/*.js'],
				tasks : ['jshint']
			},
			reload : {
				files : ['**/*'],
				tasks : ['livereload']
			}
		},
		'jshint' : {
			all : ['js/*.js']
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
};
