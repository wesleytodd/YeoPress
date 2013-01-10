
var util      = require('util'),
	yeoman    = require('yeoman'),
	git       = require('./helpers/git'),
	prompt    = require('./helpers/prompt'),
	wordpress = require('./helpers/wordpress');

module.exports = Generator;

function Generator() {

	yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.gitSetup = function() {
	console.log(); // print empty line
	var done = this.async(),
		me = this;
	prompt([{
		name : 'git',
		description : 'Would you like to initalize a Git repository?',
		default : 'Y',
		pattern : /^[yYnN]$/
	}], function(err, input) {
		if (input.git == 'Y') {
			me.git = true;
			git.init(function() {
				git.addAndCommit('Initial Commit', function() {
					done();
				});
			});
		} else {
			me.git = false;
			done();
		}
	});
}

Generator.prototype.gitSubmodule = function() {
	console.log(); // print empty line
	if (this.git) {
		var done = this.async(),
			me = this;
		prompt([{
			name : 'submodule',
			description : 'Would you like to install WordPress as a submodule?',
			default : 'Y'
		}], function(err, input) {
			if (input.submodule == 'Y') {
				me.submodule = true;
				me.wpLocation = input.location;
				prompt([{
					name : 'location',
					description : 'Path to submodule:',
					default : 'wordpress'
				}], function(err, input) {
					wordpress.setupAsSubmodule(input.location, done);
				});
			} else {
				me.submodule = false;
				done();
			}
		});
	}
}

Generator.prototype.basicInstall = function() {
	console.log(); // print empty line
	if (!this.submodule) {
		var done = this.async();
		// export the repo?
	}
}

Generator.prototype.wpConfig = function() {
	console.log(); // print empty line

	var done = this.async(),
		me = this,
		prompts = [
			{
				name : 'template',
				description : 'Config template (wp-config):',
				default : 'wp-config.php'
			}, {
				name : 'tablePrefix',
				description : 'Table prefix:',
				default : 'wp_'
			}, {
				name : 'dbHost',
				description : 'Database host:',
				default : 'localhost'
			}, {
				name : 'dbName',
				description : 'Database name:',
				default : ''
			}, {
				name : 'dbUser',
				description : 'Database user:',
				default : ''
			}, {
				name : 'dbPass',
				description : 'Database password:',
				default : ''
			}
		];

	if (this.submodule) {
		prompts.push({
			name : 'contentDir',
			description : 'Name for the content directory:',
			default : 'content'
		});
	}

	prompt(prompts, function(err, input) {
		me.tablePrefix = input.tablePrefix;
		me.dbHost      = input.dbHost;
		me.dbName      = input.dbName;
		me.dbUser      = input.dbUser;
		me.dbPass      = input.dbPass;
		if (me.submodule) {
			me.contentDir = input.contentDir;
		}
		wordpress.getSaltKeys(function(saltKeys) {
			me.saltKeys = saltKeys;
			me.template(input.template, 'wp-config.php');
			done();
		});
	});
}








