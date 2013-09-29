/**================================
 * Setting up the basics
 **===============================*/

// Requirements
var util         = require('util'),
	fs           = require('fs'),
	yeoman       = require('yeoman-generator'),
	wrench       = require('wrench'),
	chalk        = require('chalk'),
	prompt       = require('../util/prompt'),
	git          = require('../util/git'),
	wordpress    = require('../util/wordpress'),
	art          = require('../util/art'),
	Logger       = require('../util/log');

// Export the module
module.exports = Generator;

// Extend the base generator
function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	// Log level option
	this.option('log', {
		desc: 'The log verbosity level: [ verbose | log | warn | error ]',
		defaults: 'log',
		alias: 'l',
		name: 'level'
	});

	// Enable advanced features
	this.option('advanced', {
		desc: 'Makes advanced features available',
		alias: 'a'
	});

	// Setup the logger
	this.logger = Logger({
		level: this.options.log
	});

	// Log the options
	this.logger.verbose('\nOptions:', this.options);

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
	this.logger.log(art.wp);
	
	var currentWpVer;
	wordpress.getCurrentVersion(function(ver) {
		currentWpVer = ver;
		getInput();
	});

	// Get the input
	var me = this;
	function getInput() {
		prompt.ask(require('./prompts')(me.options.advanced), {
			confirm: {
				message: 'Does this all look correct?',
				before: chalk.red('\n--------------------------------'),
				after: chalk.red('--------------------------------\n'),
			},
			overrideDefaults: {
				wpVer: currentWpVer
			}
		}, function(err, input) {
			// If an error occured, log it and try again
			if (err) {
				me.logger.error(err);
				me.logger.log(art.wawa);
				return getInput();
			}

			// Save the users input
			me.userInput = input;
			me.logger.verbose('User Input:', me.userInput);
			me.logger.log(art.go);
			done();
		});
	}

};

// .gitignore
Generator.prototype.justIgnoreMe = function() {
	if (this.userInput.useGit) {
		this.logger.verbose('Copying .gitignore file');
		this.copy('gitignore.tmpl', '.gitignore');
		this.logger.verbose('Done copying .gitignore file');
	}
};

// Git setup
Generator.prototype.gitIsTheShit = function() {

	// Using Git?  Init it...
	if (this.userInput.useGit) {
		var done = this.async(),
			me = this;

		this.logger.verbose('Starting to setup Git');
		git.init(function() {
			me.logger.verbose('Git init complete');
			git.addAllAndCommit('Initial Commit', function() {
				me.logger.verbose('Git add and commit complete');
				done();
			});
		});
	}

};

// Setup Vagrant config
Generator.prototype.heIsSuchAVagrant = function() {

	if (this.userInput.useVagrant) {
		this.logger.log(chalk.green('Setting Up Vagrant'));
		this.logger.verbose('Copying vagrant file');
		this.template('Vagrantfile', 'Vagrantfile');
		this.logger.verbose('Copying puppet files');
		this.directory('puppet', 'puppet');
		this.logger.verbose('Finished setting up Vagrant');
	}

};

// Install wordpress
Generator.prototype.wordWhatUp = function() {

	var done = this.async(),
		me   = this;

	if (this.userInput.submodule) {
		this.logger.verbose('Installing WordPress ' + this.userInput.wpVer + 'as a submodule');
		git.submoduleAdd(wordpress.repo, this.userInput.wpDir, function() {
			me.logger.verbose('Submodule added');
			var cwd = process.cwd();
			process.chdir(me.userInput.wpDir);
			me.logger.verbose('Checking out WP version');
			git.checkout([me.userInput.wpVer], function() {
				process.chdir(cwd);
				me.logger.verbose('WordPress installed');
				done();
			});
		});

	} else {

		this.logger.verbose('Installing WordPress ' + this.userInput.wpVer + ' normally');
		this.remote('wordpress', 'wordpress', this.userInput.wpVer, function(err, remote) {
			remote.directory('.', me.userInput.wpDir);
			me.logger.verbose('WordPress installed');
			done();
		});

	}

};

// Setup custom directory structure
Generator.prototype.somethingsDifferent = function() {

	if (this.userInput.submodule || this.userInput.customDirs) {

		var me = this,
			done = this.async();

		this.logger.verbose('Copying index.php');
		this.template('index.php.tmpl', 'index.php');

		this.logger.verbose('Setting up the content directory');
		this.remote('wordpress', 'wordpress', this.userInput.wpVer, function(err, remote) {
			remote.directory('wp-content', me.userInput.contentDir);
			me.logger.verbose('Content directory setup');
			done();
		});

	}

};

// wp-config.php
Generator.prototype.muHaHaHaConfig = function() {

	var done = this.async(),
		me   = this;

	this.logger.verbose('Getting salt keys');
	wordpress.getSaltKeys(function(saltKeys) {
		me.logger.verbose('Salt keys:', saltKeys);
		me.userInput.saltKeys = saltKeys;
		me.logger.verbose('Copying wp-config');
		me.template('wp-config.php.tmpl', 'wp-config.php');
		done();
	});

};

// Check that the database exists, create it otherwise
Generator.prototype.hazBaseData = function() {

	var done = this.async(),
		me = this;

	wordpress.createDBifNotExists(done).on('error', function(err) {
		me.logger.warn('Cannot access database');
		me.logger.warn('Make sure you create the database and update the credentials in the wp-config.php');
		done();
	});

};

// Set some permissions
/* @TODO Thinking that maybe permissions should be left up to the user 
   BUT, it seems that the theme stuff needs some permissions set to work....
*/
Generator.prototype.thisIsSparta = function() {

	if (fs.existsSync('.')) {
		this.logger.log('Setting Permissions: 0755 on .');
		wrench.chmodSyncRecursive('.', 0755);
		this.logger.verbose('Done setting permissions on .');
	}

	if (fs.existsSync(this.userInput.contentDir)) {
		this.logger.log('Setting Permissions: 0775 on ' + this.userInput.contentDir);
		wrench.chmodSyncRecursive(this.userInput.contentDir, 0775);
		this.logger.verbose('Done setting permissions on ' + this.userInput.contentDir);
	}

};
/**/

// Commit the wordpress stuff
Generator.prototype.commitThisToMemory = function() {

	if (this.userInput.useGit) {
		var done = this.async(),
			me = this;

		this.logger.verbose('Committing WP to Git');
		git.addAllAndCommit('Setup WordPress', function() {
			me.logger.verbose('Done committing');
			done();
		}).on('error', function(e) {
			me.logger.error(e);
			done();
		});
	}

};

// Install and activate the theme
Generator.prototype.dumbledoreHasStyle = function() {

	if (this.userInput.theme) {
		var done = this.async()
			me = this;

		this.logger.verbose('Starting to install theme');
		wordpress.installTheme(this, this.userInput, function() {
			/* @TODO You need to run the install before doing this
			   see if I can get yeopress to do that.
		    */
			//wordpress.activateTheme(me.userInput.themeDir, done);
			me.logger.verbose('Theme install complete');
			done();
		});
	}

};

// Setup theme
Generator.prototype.dummyYouHaveToPlugItInFirst = function() {

	if (this.userInput.theme) {
		this.logger.verbose('Starting theme setup');
		wordpress.setupTheme(this, this.userInput, this.async());
		this.logger.verbose('Theme setup complete');
	}

};

// Commit again with the template
Generator.prototype.gitMeMOARCommits = function() {

	if (this.userInput.git) {
		var done = this.async();
		this.logger.verbose('Committing template to Git');
		git.addAllAndCommit('Installed Template', function() {
			this.logger.verbose('Comnmit complete');
			done();
		});
	}

};

// All done
Generator.prototype.oopsIPeedMyself = function() {
	this.logger.log(chalk.bold.green('\nAll Done!!\n--------------------\n'));
	this.logger.log('I tried my best to set things up, but I\'m only human right? **wink wink**\nSo, you should probably check your `wp-config.php` to make sure all the settings work on your environment.');
	this.logger.log('Have fun pressing your words!\n');
};
