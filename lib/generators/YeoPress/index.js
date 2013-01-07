
var util   = require('util');
var yeoman = require('yeoman');
var git    = require('./tasks/git');

module.exports = Generator;

function Generator() {

	this._config = require('./config');

	yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.gitSetup = function() {
	
	var done = this.async();

	this.prompt([{
		name : 'git',
		message : 'Would you like to initalize a Git repository?',
		default : 'Y'
	}], function(err, input) {
		if (input.git == 'Y') {

			git.init(function() {

				this.prompt([{
					name : 'submodule',
					message : 'Would you like to install WordPress as a submodule?',
					default : 'Y'
				}], function(err, input) {

					if (input.submodule == 'Y') {

						this.prompt([{
							name : 'location',
							message : 'Path to submodule:',
							default : 'wordpress'
						}], function(err, input) {
							git.submoduleAdd(this._config['wordpress-repo'], input.location, done);
						});

					} else {
						// just get wordpress...
						done();
					}

				});

			});

		} else {
			done();
		}
	});
}/**/
