
var util      = require('util'),
	yeoman    = require('yeoman'),
	git       = require('./helpers/git'),
	prompt    = require('./helpers/prompt'),
	wordpress = require('./helpers/wordpress'),
	path      = require('path');

module.exports = Generator;

function Generator() {
	yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.gitSetup = function() {
	console.log(); // print empty line
	var done = this.async(),
		me = this;
	prompt([{
		name : 'git',
		description : 'Would you like to initalize a Git repository? (Y/N)',
		default : 'Y',
		pattern : /^[yYnN]$/
	}], function(err, input) {
		if (input.git.toUpperCase() == 'Y') {
			me.git = true;
			console.log(); // print empty line
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
};

Generator.prototype.gitSubmodule = function() {
	this.submodule = false;
	if (this.git) {
		console.log(); // print empty line
		var done = this.async(),
			me = this;
		prompt([{
			name : 'submodule',
			description : 'Would you like to install WordPress as a submodule?',
			default : 'Y'
		}], function(err, input) {
			if (input.submodule.toUpperCase() == 'Y') {
				me.submodule = true;
				prompt([{
					name : 'location',
					description : 'Path to submodule:',
					default : 'wordpress'
				}], function(err, input) {
					console.log(); // print empty line
					me.wpLocation = input.location;
					wordpress.setupAsSubmodule(input.location, done);
				});
			} else {
				me.submodule = false;
				done();
			}
		});
	}
};

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
};

Generator.prototype.indexFile = function() {
	if (this.submodule) {
		this.template('index.php', 'index.php');
	}
};

Generator.prototype.contentDirectory = function() {
	if (this.submodule && this.contentDir) {
		var me = this,
			done = this.async();
		this.remote('wordpress', 'wordpress', function(err, remote) {
			remote.directory('wp-content', me.contentDir);
			done();
		});
	}
};

Generator.prototype.basicInstall = function() {
	if (!this.submodule) {
		console.log(); // print empty line
		var done = this.async(),
			me = this;
		this.remote('wordpress', 'wordpress', function(err, remote) {
			me.recurse(remote.cachePath, function(file, rootdir, subdir, filename) {
				me.copy(file, path.join(subdir, filename));
			});
			done();
		});
	}
};

Generator.prototype.wordPressCommit = function() {
	if (this.git) {
		var done = this.async();
		git.addAndCommit('Configured WordPress', function() {
			done();
		});
	}
};

Generator.prototype.installTemplate = function() {
	var done = this.async(),
		me = this;
	prompt([{
		name : 'template',
		description : 'Install a custom template?(Y/N)',
		default : 'Y'
	}], function(err, input) {
		if (input.template.toUpperCase() == 'Y') {
			prompt([{
				name : 'type',
				description : 'Template source type (git/tar):',
				default : 'git'
			}], function(err, input) {
				if (input.type.toLowerCase() == 'git') {
					prompt([
						{
							name : 'name',
							description : 'Destination directory (ex. twentytwelve):',
							default : ''
						},
						{
							name : 'user',
							description : 'GitHub username:',
							default : 'wesleytodd'
						},
						{
							name : 'repo',
							description : 'GitHub repository name:',
							default : 'YeoPress'
						},
						{
							name : 'branch',
							description : 'Repository branch:',
							default : 'template'
						}
					], function(err, input) {
						me.remote(input.user, input.repo, input.branch, function(err, remote) {
							if (me.submodule) {
								remote.directory('.', path.join(me.contentDir, 'themes', input.name));
							} else {
								remote.directory('.', path.join('wp-content/themes', input.name));
							}
							done();
						});
					});
				} else if (input.type.toLowerCase() == 'tar') {
					prompt([
						{
							name : 'name',
							description : 'Destination directory (ex. twentytwelve):',
							default : ''
						},
						{
							name : 'url',
							description : 'Remote tarball url (ex. https://github.com/user/repo/tarball/master):',
							default : ''
						}
					], function(err, input) {
						if (me.submodule) {
							var loc = path.join(me.contentDir, 'themes', input.name);
						} else {
							var loc = path.join('wp-content/themes', input.name);
						}
						me.tarball(input.url, loc, done);
					});
				}
			});
		}
	});
};

Generator.prototype.templateCommit = function() {
	if (this.git) {
		var done = this.async();
		git.addAndCommit('Installed Template', function() {
			done();
		});
	}
};
