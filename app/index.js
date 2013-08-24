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
	prompts      = require('./prompts');

// Export the module
module.exports = Generator;

// Extend the base generator
function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
	if (typeof options.advanced !== 'undefined' && options.advanced) {
		prompt.advanced();
	}
};
util.inherits(Generator, yeoman.generators.Base);

/**================================
 * Easy as 1, 2, 3...err....9 maybe 10 or 11
 **===============================*/

// Ask the user what they want done
Generator.prototype.ohTellMeWhatYouWantWhatYouReallyReallyWant = function() {

	// Display welcome message
	console.log(art.wp);
	
	// Get the input
	getInput.call(this, this.async());

};

// .gitignore
Generator.prototype.justIgnoreMe = function() {
	
	if (this.userInput.useGit) {
		this.copy('gitignore.tmpl', '.gitignore');
	}

};

// Git setup
Generator.prototype.gitIsTheShit = function() {

	// Using Git?  Init it...
	if (this.userInput.useGit) {

		var done = this.async();

		git.init(function() {
			git.addAllAndCommit('Initial Commit', function() {
				done();
			});
		});
	}

};

// Setup Vagrant config
Generator.prototype.heIsSuchAVagrant = function() {

	if (this.userInput.useVagrant) {
		console.log('Setting Up Vagrant'.green);
		this.template('Vagrantfile', 'Vagrantfile');
		this.directory('puppet', 'puppet');
	}

};

// Install wordpress
Generator.prototype.wordWhatUp = function() {

	var done = this.async(),
		me   = this;

	if (this.userInput.submodule) {

		git.submoduleAdd(wordpress.repo, this.userInput.wpDir, function() {
			var cwd = process.cwd();
			process.chdir(me.userInput.wpDir);
			git.checkout([me.userInput.wpVer], function() {
				process.chdir(cwd);
				done();
			});
		});

	} else {

		this.remote('wordpress', 'wordpress', this.userInput.wpVer, function(err, remote) {
			remote.directory('.', me.userInput.wpDir);
			done();
		});

	}

};

// Setup custom directory structure
Generator.prototype.somethingsDifferent = function() {

	if (this.userInput.customDirs) {

		var me = this,
			done = this.async();

		this.template('index.php.tmpl', 'index.php');

		this.remote('wordpress', 'wordpress', this.userInput.wpVer, function(err, remote) {
			remote.directory('wp-content', me.userInput.contentDir);
			done();
		});

	}

};

// wp-config.php
Generator.prototype.muHaHaHaConfig = function() {

	var done = this.async(),
		me   = this;

	wordpress.getSaltKeys(function(saltKeys) {
		me.userInput.saltKeys = saltKeys;
		me.template('wp-config.php.tmpl', 'wp-config.php');
		done();
	});

};

// Check that the database exists, create it otherwise
Generator.prototype.hazBaseData = function() {

	var done = this.async();

	wordpress.createDBifNotExists(done).on('error', function(err) {
		console.log('Database does not exist, or crendetials are wrong!'.red);
		console.log('Make sure you create the database and update the credentials in the wp-config.php');
		done();
	});

};

// Set some permissions
/* @TODO Thinking that maybe permissions should be left up to the user 
   BUT, it seems that the theme stuff needs some permissions set to work....
*/
Generator.prototype.youAreNotAllowd = function() {

	console.log('Setting Permissions: 0755 on .'.green);
	wrench.chmodSyncRecursive('.', 0755);

	console.log(('Setting Permissions: 0775 on ' + this.userInput.contentDir).green);
	wrench.chmodSyncRecursive(this.userInput.contentDir, 0775);

};
/**/

// Commit the wordpress stuff
Generator.prototype.commitThisToMemory = function() {


	if (this.userInput.useGit) {

		var done = this.async();

		git.addAllAndCommit('Setup WordPress', function() {
			done();
		}).on('error', function(e) {
			console.error(e);
			done();
		});

	}

};

// Install and activate the theme
Generator.prototype.dumbledoreHasStyle = function() {

	if (this.userInput.theme) {

		var done = this.async()
			me = this;

		wordpress.installTheme(this, this.userInput, function() {
			/* @TODO You need to run the install before doing this
			   see if I can get yeopress to do that.
		    */
			//wordpress.activateTheme(me.userInput.themeDir, done);
			done();
		});

	}

};

// Setup theme
Generator.prototype.dummyYouHaveToPlugItInFirst = function() {

	if (this.userInput.theme) {
		wordpress.setupTheme(this, this.userInput, this.async());
	}

};

// Commit again with the template
Generator.prototype.gitMeMOARCommits = function() {


	if (this.userInput.git) {

		var done = this.async();

		git.addAllAndCommit('Installed Template', function() {
			done();
		});

	}

};

// All done
Generator.prototype.oopsIPeedMyself = function() {
	console.log('All Done!!'.green);
};

/**================================
 * The prompt code is ulgy...so I put it at the bottom
 **===============================*/

// Calls the prompt method
// This can be called recursivly if the user messes up the input
function getInput(done) {
	var me = this;
	promptForData.call(me, function(input) {
		me.userInput = input;
		confirmInput.call(me, done);
	});
};

// Diaply the prompts and get the information
var promptForData = function(done) {

	// All the data will be attached to this object
	var input = {},
		me = this;

	wordpress.getCurrentVersion(function(ver) {
		prompts.wpVer.default = ver;
		input.wpVer = ver;

		prompt([
			prompts.url,
			prompts.tablePrefix,
			prompts.dbHost,
			prompts.dbName,
			prompts.dbUser,
			prompts.dbPass,
			prompts.wpVer,
			prompts.useVagrant,
			prompts.useGit
		], input, function(i) {
			var port = i.url.match(/:[\d]+$/);
			if (port !== null) {
				input.port = port[0];
			} else {
				input.port = '';
			}
			if (i.useGit) {
				prompt([prompts.submodule], input, function(i) {
					if (i.submodule) {
						input.customDirs = true;
					}
					ignoreWPCore();
				});
			} else {
				ignoreWPCore();
			}
		});
	});

	function ignoreWPCore() {
		if (input.useGit && !input.submodule) {
			prompt([prompts.ignoreWPCore], input, function() {
				customDir();
			});
		}

		else {
			customDir();
		}
	}

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
	logConfirmation('WordPress version', this.userInput.wpVer);
	logConfirmation('WordPress install directory', this.userInput.wpDir);
	logConfirmation('WordPress content directory', this.userInput.contentDir);
	logConfirmation('Initialize a Git repo', ((this.userInput.useGit) ? 'Yes' : 'No'));
	logConfirmation('Install WordPress as a Git submodule', ((this.userInput.submodule) ? 'Yes' : 'No'));
	logConfirmation('Add WordPress Core files to .gitignore?', ((this.userInput.ignoreWPCore) ? 'Yes' : 'No'));
	if (this.userInput.theme) {
		logConfirmation('Theme install directory', path.join(this.userInput.contentDir, 'themes', this.userInput.themeDir));
	}

	console.log('----------------------------'.red);

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
