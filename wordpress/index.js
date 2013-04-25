/**================================
 * Setting up the basics
 **===============================*/

// Requirements
var util         = require('util'),
	fs           = require('fs'),
	path         = require('path'),
	yeoman       = require('yeoman-generator'),
	wrench       = require('wrench'),
	git          = require('../util/git'),
	prompt       = require('../util/prompt'),
	wordpress    = require('../util/wordpress'),
	spawn        = require('../util/spawn'),
	art          = require('../util/art'),
	prompts      = require('./prompts')

// Export the module
module.exports = Generator;

// Extend the base generator
function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
};
util.inherits(Generator, yeoman.generators.Base);

/**================================
 * Easy as 1, 2, 3...
 **===============================*/

// Step 1: Ask the user what they want done
Generator.prototype.ohTellMeWhatYouWantWhatYouReallyReallyWant = function() {

	// Display welcome message
	console.log(art.wp);
	
	// Get the input
	getInput.call(this, this.async());

};

// Step 2: Install and setup WordPress
Generator.prototype.pressThoseWords = function() {

	// This one might take a while
	var done = this.async();

	// Using Git?  Init it...
	if (this.userInput.git) {
		setupGit();
	}
	
};

// Step 3: Install the theme
Generator.prototype.dumbledoreHasStyle = function() {
	
};

/**================================
 * Where the actualy magic happens
 **===============================*/

// Calls the prompt method
// This can be called recursivly if the user messes up the input
function getInput(done) {
	var me = this;
	promptForData(function(input) {
		me.userInput = input;
		confirmInput.call(me, done);
	});
};

// Diaply the prompts and get the information
var promptForData = function(done) {

	// All the data will be attached to this object
	var input = {};

	prompt([
		prompts.url,
		prompts.tablePrefix,
		prompts.dbHost,
		prompts.dbName,
		prompts.dbUser,
		prompts.dbPass,
		prompts.useGit
	], input, function(i) {
		if (i.useGit) {
			prompt([prompts.submodule], input, function(i) {
				if (i.submodule) {
					input.customDirs = true;
				}
				customDir();
			});
		} else {
			customDir();
		}
	});

	function customDir() {
		if (!input.customDirs) {
			prompt([prompts.customDirs], input, function(i) {
				if (i.customDirs) {
					customInstallLocations();
				} else {
					input.wpDir = '.';
					input.contentDir = 'wp-content';
					installTheme();
				}
			});
		} else {
			customInstallLocations();
		}
	}

	function customInstallLocations() {
		prompt([prompts.wpDir, prompts.contentDir], input, function() {
			installTheme();
		});
	}

	function installTheme() {
		prompt([prompts.theme], input, function(i) {
			if (i.theme) {
				prompt([prompts.themeDir, prompts.themeType], input, function(i) {
					var nextPrompts = [];
					switch(i.themeType) {
						case 'git' :
							nextPrompts = [
								prompts.themeGitUser,
								prompts.themeGitRepo,
								prompts.themeGitBranch
							];
							break;
						case 'tar' :
							nextPrompts = [
								prompts.themeTarUrl
							];
							break;
					}
					prompt(nextPrompts, input, function() {
						done(input);
					});
				});
			} else {
				done(input);
			}
		});
	}
};

function confirmInput(done) {

	var me  = this;

	console.log('\n----------------------------'.red);

	logConfirmation('WordPress URL', this.userInput.url);
	logConfirmation('Database table prefix', this.userInput.tablePrefix);
	logConfirmation('Database host', this.userInput.dbHost);
	logConfirmation('Database name', this.userInput.dbName);
	logConfirmation('Database user', this.userInput.dbUser);
	logConfirmation('Database password', this.userInput.dbPass);
	logConfirmation('WordPress install directory', this.userInput.wpDir);
	logConfirmation('WordPress content directory', this.userInput.contentDir);
	logConfirmation('Initialize a Git repo', ((this.userInput.useGit) ? 'Yes' : 'No'));
	logConfirmation('Install WordPress as a Git submodule', ((this.userInput.submodule) ? 'Yes' : 'No'));
	if (this.userInput.theme) {
		logConfirmation('Theme install directory', path.join(this.userInput.contentDir, 'themes', this.userInput.themeDir));
	}

	console.log('----------------------------\n'.red);

	prompt([prompts.correct], null, function(input) {
		if (!input.correct) {
			console.log(art.wawa);
			getInput.call(me, done);
		} else {
			console.log(art.go);
			done();
		}
	});

};

function logConfirmation(msg, val) {
	console.log(msg.bold.grey + ': '.bold.grey + val.cyan);
};

/*function setupGit(done) {
	this.copy('gitignore.tmpl', '.gitignore');
	git.init(function() {
		git.addAllAndCommit('Initial Commit', function() {
			done();
		});
	});
};

/*Generator.prototype.gitIgnore = function() {
	if (this.userInput.git) {
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
		this.remote('wordpress', 'wordpress', function(err, remote) {
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

*/
