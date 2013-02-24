
var util      = require('util'),
	yeoman    = require('yeoman-generator'),
	git       = require('./helpers/git'),
	prompt    = require('./helpers/prompt'),
	wordpress = require('./helpers/wordpress'),
	path      = require('path');

module.exports = Generator;

function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function() {
	
	var welcome = [
		'',
		'                  YeoPress'.red.bold,
		'',
		'              ..::::::::::::..             '.grey,
		'          .:::'.grey + '    ' + ':::::::'.cyan + '    ' + ':::..         '.grey,
		'        .:'.grey + '    ' + ':::::::::::::::'.cyan + '    ' + ':..       '.grey,
		'      .:'.grey + '   ' + ':::::::::::::::::::::'.cyan + '   ' + ':.      '.grey,
		'     .:'.grey + '  ' + '::::::::::::::::::::::'.cyan + '     ' + ':..    '.grey,
		'    .:'.grey + '  ' + '::::::::::::::::::::::'.cyan + '       ' + '::.   '.grey,
		'   .:'.grey + '         ' + '::'.cyan + '          ' + '::::'.cyan + '        ' + ':..  '.grey,
		'  .:'.grey + '       ' + '::::::::'.cyan + '     ' + ':::::::'.cyan + '        ' + ':.  '.grey,
		'  :'.grey + '  ' + ':'.cyan + '      ' + ':::::::'.cyan + '      ' + ':::::::'.cyan + '     ' + ':'.cyan + '  ' + ':. '.grey,
		' .:'.grey + '  ' + '::'.cyan + '     ' + '::::::::'.cyan + '     ' + ':::::::'.cyan + '    ' + '::'.cyan + '  ' + ':. '.grey,
		' ::'.grey + '  ' + ':::'.cyan + '     ' + ':::::::'.cyan + '      ' + ':::::::'.cyan + '   ' + '::'.cyan + '  ' + ':: '.grey,
		' :'.grey + '  ' + '::::'.cyan + '     ' + '::::::::'.cyan + '     ' + ':::::::'.cyan + '   ' + ':::'.cyan + ' ' + ':: '.grey,
		' ::'.grey + ' ' + ':::::'.cyan + '     ' + ':::::::'.cyan + '      ' + '::::::'.cyan + '  ' + '::::'.cyan + ' ' + ':: '.grey,
		' ::'.grey + '  ' + '::::'.cyan + '     ' + '::::::'.cyan + '       ' + '::::::'.cyan + ' ' + '::::'.cyan + '  ' + ':. '.grey,
		' .:'.grey + '  ' + ':::::'.cyan + '     ' + ':::::'.cyan + ' ' + '::'.cyan + '     ' + '::::'.cyan + '  ' + '::::'.cyan + '  ' + ':. '.grey,
		'  :'.grey + '  ' + '::::::'.cyan + '     ' + ':::'.cyan + ' ' + ':::'.cyan + '     ' + '::::'.cyan + ' ' + ':::::'.cyan + '  ' + ':. '.grey,
		'  .:'.grey + '  ' + ':::::'.cyan + '     ' + '::'.cyan + '  ' + '::::'.cyan + '     ' + '::'.cyan + '  ' + '::::'.cyan + '  ' + ':.  '.grey,
		'   .:'.grey + '  ' + ':::::'.cyan + '     ' + ':'.cyan + ' ' + '::::::'.cyan + '    ' + '::'.cyan + ' ' + '::::'.cyan + '  ' + '::.  '.grey,
		'   .::'.grey + '  ' + '::::'.cyan + '       ' + '::::::'.cyan + '       ' + ':::'.cyan + '  ' + '::.   '.grey,
		'     .:'.grey + '  ' + '::::'.cyan + '     ' + '::::::::'.cyan + '     ' + ':::'.cyan + '  ' + '::.    '.grey,
		'      .:'.grey + '   ' + '::'.cyan + '     ' + '::::::::'.cyan + '    ' + '::'.cyan + '   ' + ':.      '.grey,
		'       .::'.grey + '       ' + '::::::::::'.cyan + '      ' + '::.       '.grey,
		'         ..::'.grey + '     ' + ':::::::'.cyan + '     ' + '::..         '.grey,
		'            ..:::'.grey + '         ' + ':::..            '.grey,
		'                ...:::::...                '.grey,
		'',
		'            A Yeoman Generator For WordPress'.red,
		''
	].join('\n');

	console.log(welcome);

};

Generator.prototype.askForGit = function() {
	var done = this.async(),
		me = this;
	prompt([{
		name : 'git',
		description : 'Would you like to initalize a Git repository?',
		default : 'Y'
	}], function(err, input) {
		if (err) {
			console.error(err);
			return;
		}
		if (input.git.toUpperCase() == 'Y') {
			me.git = true;
		} else {
			me.git = false;
		}
		done();
	});
};

Generator.prototype.askForSubmodule = function() {
	if (this.git) {
		var done = this.async(),
			me = this;
		prompt([{
			name : 'submodule',
			description : 'Would you like to install WordPress as a submodule?',
			default : 'N'
		}], function(err, input) {
			if (err) {
				console.error(err);
				return;
			}
			if (input.submodule.toUpperCase() == 'Y') {
				me.submodule = true;
				me.customDirs = true;
			} else {
				me.submodule = false;
			}
			done();
		});
	}
};

Generator.prototype.askForCustomDirs = function() {
	if (typeof this.customDirs === 'undefined') {
		var done = this.async(),
			me = this;
		prompt([{
			name : 'customDir',
			description : 'Would you like to install WordPress with the custom directory structure?',
			default : 'N'
		}], function(err, input) {
			if (err) {
				console.error(err);
				return;
			}
			if (input.customDir.toUpperCase() == 'Y') {
				me.customDirs = true;
			} else {
				me.customDirs = false;
			}
			done();
		});
	}
};

Generator.prototype.askForWPInstallDir = function() {
	if (this.customDirs) {
		var done = this.async(),
			me = this;
		prompt([
			{
				name : 'wpDir',
				description : 'WordPress install directory:',
				default : 'wordpress'
			},
			{
				name : 'contentDir',
				description : 'WordPress content directory:',
				default : 'content'
			}
		], function(err, input) {
			if (err) {
				console.error(err);
				return;
			}
			me.wpDir = input.wpDir;
			me.contentDir = input.contentDir;
			done();
		});
	} else {
		this.wpDir = '.';
		this.contentDir = 'wp-content';
	}
};

Generator.prototype.askForConfigSettings = function() {
	var done = this.async(),
		me = this;
	prompt([
		{
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
	], function(err, input) {
		if (err) {
			console.error(err);
			return;
		}
		me.db = {
			prefix : input.tablePrefix,
			host : input.dbHost,
			name : input.dbName,
			user : input.dbUser,
			pass : input.dbPass
		};
		done();
	});
};

Generator.prototype.askForTheme = function() {
	var done = this.async(),
		me = this;
	prompt([{
		name : 'theme',
		description : 'Install a custom theme?',
		default : 'Y'
	}], function(err, input) {
		if (err) {
			console.error(err);
			return;
		}
		if (input.theme.toUpperCase() == 'Y') {
			prompt([{
				name : 'type',
				description : 'Theme source type (git/tar):',
				default : 'git'
			}], function(err, input) {
				if (input.type.toLowerCase() == 'git') {
					prompt([
						{
							name : 'dir',
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
						me.theme = {
							type : 'git',
							dir : input.dir,
							user : input.user,
							repo : input.repo,
							branch : input.branch
						};
						done();
					});
				} else if (input.type.toLowerCase() == 'tar') {
					prompt([
						{
							name : 'dir',
							description : 'Destination directory (ex. twentytwelve):',
							default : ''
						},
						{
							name : 'url',
							description : 'Remote tarball url (ex. https://github.com/user/repo/tarball/master):',
							default : ''
						}
					], function(err, input) {
						me.theme = {
							type : 'tar',
							dir : input.dir,
							url : input.url
						};
						done();
					});
				}
			});
		}
	});
};

Generator.prototype.confirm = function() {
	var done = this.async();
	console.log(); // empty line
	console.log('----------------------------'.red); // empty line
	if (this.git) {
		console.log('Initialize a Git repo: Yes');
		if (this.submodule) {
			console.log('Install WordPress as a Git submodule: Yes');
		} else {
			console.log('Install WordPress as a Git submodule: No');
		}
	} else {
		console.log('Initialize a Git repo: No');
	}
	console.log('WordPress install directory: ' + this.wpDir);
	if (this.customDirs) {
		console.log('WordPress content directory: ' + this.contentDir);
	}
	console.log('Database table prefix: ' + this.db.prefix);
	console.log('Database host: ' + this.db.host);
	console.log('Database name: ' + this.db.name);
	console.log('Database user: ' + this.db.user);
	console.log('Database password: ' + this.db.pass);
	if (this.theme) {
		console.log('Theme install directory: ' + path.join(this.contentDir, 'themes', this.theme.dir));
	}

	console.log('----------------------------'.red); // empty line
	console.log(); // empty line
	prompt([{
			name : 'correct',
			description : 'Does everything look correct?',
			default : 'Y'
	}], function(err, input) {
		if (err) {
			console.error(err);
			return;
		}
		if (input.correct.toUpperCase() != 'Y') {
			console.log('Aborting, please run the generator again to correct the input.');
			process.exit();
		}
		done();
	});

};



/*
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
			remote.directory('.');
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
*/
