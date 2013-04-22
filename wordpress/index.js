var util      = require('util'),
	yeoman    = require('yeoman-generator'),
	git       = require('./helpers/git'),
	prompt    = require('./helpers/prompt'),
	wordpress = require('./helpers/wordpress'),
	exec      = require('./helpers/exec'),
	wrench    = require('wrench'),
	fs        = require('fs'),
	path      = require('path'),
	mysql     = require('mysql');

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
		'       A Yeoman Generator For WordPress'.red,
		''
	].join('\n');

	console.log(welcome);

};

Generator.prototype.askUrl = function() {
	var done = this.async(),
		me = this;
	prompt([{
		name : 'url',
		description : 'What URL will WordPress be installed at (example.com)'
	}], function(err, input) {
		if (err) {
			console.error(err);
		}
		var url = input.url.replace(/\/+$/g, '');
		if (!/^http[s]?:\/\//.test(url)) {
			url = 'http://' + url;
		}
		me.url = url;
		done();
	});
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

Generator.prototype.askForVersion = function() {
	if (!this.submodule) {
		var done = this.async(),
			me = this;
		prompt([{
			name : 'wpversion',
			description : 'What version of WordPress would you like to install?',
			default : 'master'
		}], function(err, input) {
			if (err) {
				console.error(err);
			}
			me.wpversion = input.wpversion;
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
		} else {
			done();
		}
	});
};

Generator.prototype.confirm = function() {
	var done = this.async();
	console.log(); // empty line
	console.log('----------------------------'.red); // empty line
	console.log('WordPress URL: ' + this.url);
	if (this.git) {
		console.log('Initialize a Git repo: Yes');
		if (this.submodule) {
			console.log('Install WordPress as a Git submodule: Yes');
		} else {
			console.log('Install WordPress as a Git submodule: No');
			console.log('Install WordPress version: ' + this.wpversion);
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
		}
		if (input.correct.toUpperCase() != 'Y') {
			console.log('Aborting, please run the generator again to correct the input.');
			process.exit();
		}

		var go = [
			'',
			' __   __  _______  ______    _______      _     _  _______      _______  _______    __ ',
			'|  | |  ||       ||    _ |  |       |    | | _ | ||       |    |       ||       |  |  |',
			'|  |_|  ||    ___||   | ||  |    ___|    | || || ||    ___|    |    ___||   _   |  |  |',
			'|       ||   |___ |   |_||_ |   |___     |       ||   |___     |   | __ |  | |  |  |  |',
			'|       ||    ___||    __  ||    ___|    |       ||    ___|    |   ||  ||  |_|  |  |__|',
			'|   _   ||   |___ |   |  | ||   |___     |   _   ||   |___     |   |_| ||       |   __ ',
			'|__| |__||_______||___|  |_||_______|    |__| |__||_______|    |_______||_______|  |__|',
			''
		].join('\n').rainbow;
		console.log(go);

		done();
	});

};

Generator.prototype.addIgnore = function() {
	if (this.git) {
		this.copy('gitignore.tmpl', '.gitignore');
	}
};

Generator.prototype.setupGit = function() {
	if (this.git) {
		var done = this.async();
		git.init(function() {
			git.addAndCommit('Initial Commit'.green, function() {
				done();
			});
		});
	}
};

Generator.prototype.setupWordPress = function() {
	var done = this.async(),
		me   = this;
	if (this.submodule) {
		console.log('\nSetting up WordPress submodule, this might take a minute...'.green);
		wordpress.setupAsSubmodule(me.wpDir, done);
	} else {
		this.remote('wordpress', 'wordpress', me.wpversion, function(err, remote) {
			remote.directory('.', me.wpDir);
			done();
		});
	}
};

Generator.prototype.setupContentDir = function() {
	if (this.customDirs) {
		var me = this,
			done = this.async();
		this.remote('wordpress', 'wordpress', function(err, remote) {
			remote.directory('wp-content', me.contentDir);
			done();
		});
	}
};

Generator.prototype.setupIndex = function() {
	if (this.customDirs) {
		this.template('index.php', 'index.php');
	}
};

Generator.prototype.wpConfig = function() {
	var done = this.async(),
		me   = this;

	wordpress.getSaltKeys(function(saltKeys) {
		me.saltKeys = saltKeys;
		me.template('wp-config.php', 'wp-config.php');
		done();
	});
};

Generator.prototype.wordPressCommit = function() {
	if (this.git) {
		var done = this.async();
		git.addAndCommit('Setup WordPress'.green, function() {
			done();
		});
	}
};

Generator.prototype.checkAndCreateDatabase = function() {
	var done = this.async(),
		me = this;
	var connection = mysql.createConnection({
		host     : this.db.host,
		user     : this.db.user,
		password : this.db.pass
	});
	connection.connect(function(err) {
		if (err) {
			console.error('Error connecting to database!'.red);
			console.error(err);
			done();
		}
		connection.query('CREATE DATABASE IF NOT EXISTS ' + mysql.escapeId(me.db.name), function(err, rows, fields) {
			if (err) {
				console.error('Error creating database!'.red);
				console.error(err);
				done();
			}
			connection.end(function() {
				console.log('Database Exists!');
				done();
			});
		});
	});
};

Generator.prototype.setupTheme = function() {
	if (this.theme) {
		var done = this.async(),
			me   = this;
		if (this.theme.type == 'git') {
			me.remote(this.theme.user, this.theme.repo, this.theme.branch, function(err, remote) {
				remote.directory('.', path.join(me.contentDir, 'themes', me.theme.dir));
				done();
			});
		} else if (this.theme.type == 'tar') {
			me.tarball(this.theme.url, path.join(this.contentDir, 'themes', this.theme.dir), done);
		}
	}
};

Generator.prototype.initTheme = function() {
	if (this.theme) {
		console.log('Setting Up Theme'.green);
		var me = this,
			done = this.async(),
			themePath = path.join(this.contentDir, 'themes', this.theme.dir),
			themePackageJson = path.join(themePath, 'package.json');
		if (fs.existsSync(themePackageJson)) {
			var oldDir = process.cwd();
			process.chdir(themePath);
			exec('npm install', function(err) {
				if (fs.existsSync('Gruntfile.js')) {
					exec('grunt setup', function(err) {
						console.log('Theme setup!'.green);
						process.chdir(oldDir);
						done();
					});
				} else {
					process.chdir(oldDir);
					done();
				}
			});
		} else {
			done();
		}
	}
};

Generator.prototype.setPermissions = function() {
	console.log('Setting Permissions: 0755 on .'.green);
	wrench.chmodSyncRecursive('.', 0755);
	console.log(('Setting Permissions: 0775 on ' + this.contentDir).green);
	wrench.chmodSyncRecursive(this.contentDir, 0775);
};

Generator.prototype.templateCommit = function() {
	if (this.git) {
		var done = this.async();
		git.addAndCommit('Installed Template'.green, function() {
			done();
		});
	}
};

Generator.prototype.done = function() {
	console.log('All Done!!'.green);
};
