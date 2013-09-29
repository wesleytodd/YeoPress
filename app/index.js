/**================================
 * Setting up the basics
 **===============================*/

// Requirements
var util         = require('util'),
	fs           = require('fs'),
	path         = require('path'),
	yeoman       = require('yeoman-generator'),
	wrench       = require('wrench'),
	chalk        = require('chalk'),
	prompt       = require('../util/prompt'),
	git          = require('../util/git'),
	wordpress    = require('../util/wordpress'),
	spawn        = require('../util/spawn'),
	art          = require('../util/art'),
	prompts      = require('./prompts');

// Export the module
module.exports = Generator;

// Extend the base generator
function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
};
util.inherits(Generator, yeoman.generators.Base);

/**================================
 * Easy as 1, 2, 3...err....9 maybe 10 or 11
 **===============================*/

// Ask the user what they want done
Generator.prototype.ohTellMeWhatYouWantWhatYouReallyReallyWant = function() {

	// This is an async step
	var done = this.async();

	// Display welcome message
	console.log(art.wp);
	
	var currentWpVer;
	wordpress.getCurrentVersion(function(ver) {
		currentWpVer = ver;
		getInput();
	});

	// Get the input
	var me = this;
	function getInput() {
		prompt.ask(prompts, {
			confirm: {
				message: 'Does this all look correct?',
				before: chalk.red('\n--------------------------------'),
				after: chalk.red('--------------------------------\n'),
			},
			overrideDefaults: {
				wpVer: currentWpVer
			}
		}, function(err, input) {
			if (err) {
				console.error(err);
				getInput();
			}
			me.userInput = input;
			done();
		});
	}

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
		console.log(chalk.green('Setting Up Vagrant'));
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

		console.log(this.userInput);
		this.remote('wordpress', 'wordpress', this.userInput.wpVer, function(err, remote) {
			remote.directory('.', me.userInput.wpDir);
			done();
		});

	}

};

// Setup custom directory structure
Generator.prototype.somethingsDifferent = function() {

	if (this.userInput.submodule || this.userInput.customDirs) {

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
		console.log(chalk.red('Database does not exist, or the credentials are wrong!'));
		console.log('Make sure you create the database and update the credentials in the wp-config.php');
		done();
	});

};

// Set some permissions
/* @TODO Thinking that maybe permissions should be left up to the user 
   BUT, it seems that the theme stuff needs some permissions set to work....
*/
Generator.prototype.thisIsSparta = function() {

	if (fs.existsSync('.')) {
		console.log(chalk.green('Setting Permissions: 0755 on .'));
		wrench.chmodSyncRecursive('.', 0755);
	}

	if (fs.existsSync(this.userInput.contentDir)) {
		console.log(chalk.green('Setting Permissions: 0775 on ' + this.userInput.contentDir));
		wrench.chmodSyncRecursive(this.userInput.contentDir, 0775);
	}

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
	console.log(chalk.bold.green('\nAll Done!!\n--------------------\n'));
	console.log('I tried my best to set things up, but I\'m only human right? **wink wink**\nSo, you should probably check your `wp-config.php` to make sure all the settings work on your environment.');
	console.log('Have fun pressing your words!\n');
};
