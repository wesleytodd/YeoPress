module.exports = function(grunt) {
	grunt.initConfig({
		'watch' : {
			sass : {
				files : ['scss/**/*.scss'],
				tasks : 'sass'
			}
		},
		'sass' : {
			build : {
				files : {
					'css' : 'scss'
				},
				options : {
					style : 'compressed'
				}
			},
			dev : {
				files : {
					'css' : 'scss'
				},
				options : {
					style : 'expanded'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
};
