module.exports = function(grunt) {
	grunt.initConfig({
		'watch' : {
			sass : {
				files : ['scss/**/*.scss'],
				tasks : 'sass:dev'
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
					'css/all.css' : 'scss/*'
				},
				options : {
					style : 'expanded'
				}
			}
		}
	});

	grunt.registerTask('default', ['watch']);

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
