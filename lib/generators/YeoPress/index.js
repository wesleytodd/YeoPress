
var util      = require('util');
var yeoman    = require('yeoman');
var git       = require('./helpers/git');
var prompt    = require('./helpers/prompt');
var wordpress = require('./helpers/wordpress');

module.exports = Generator;

function Generator() {

	yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.gitSetup = function() {
	console.log();
	var done = this.async(),
		me = this;
	prompt([{
		name : 'git',
		description : 'Would you like to initalize a Git repository?',
		default : 'Y',
		pattern : /^[yYnN]$/
	}], function(err, input) {
		if (input.git == 'Y') {
			this.git = true;
			git.init(function() {
				git.addAndCommit('Initial Commit', function() {
					done();
				});
			});
		} else {
			this.git = false;
			done();
		}
	});
}/**/

Generator.prototype.gitSubmodule = function() {
	console.log();
	if (this.git) {
		var done = this.async();
		prompt([{
			name : 'submodule',
			description : 'Would you like to install WordPress as a submodule?',
			default : 'Y'
		}], function(err, input) {
			if (input.submodule == 'Y') {
				this.submodule = true;
				prompt([{
					name : 'location',
					description : 'Path to submodule:',
					default : 'wordpress'
				}], function(err, input) {
					wordpress.setupAsSubmodule(input.location, done);
				});
			} else {
				this.submodule = false;
				done();
			}
		});
	}
}

Generator.prototype.basicInstall = function() {
	if (!this.submodule) {
		// export the repo?
	}
}
