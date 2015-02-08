/**================================
 * Setting up the basics
 **===============================*/

// Requirements
var util = require('util'),
	path = require('path'),
	fs = require('fs'),
	yeoman = require('yeoman-generator'),
	wrench = require('wrench'),
	chalk = require('chalk'),
	mkdirp = require('mkdirp'),
	git = require('simple-git')(),
	wp = require('wp-util'),
	wordpress = require('../util/wordpress'),
	art = require('../util/art'),
	Logger = require('../util/log'),
	Config = require('../util/config');

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

	// Shortcut for --log=verbose
	this.option('verbose', {
		desc: 'Verbose logging',
		alias: 'v'
	});
	if (this.options.verbose) {
		this.options.log = 'verbose';
	}

	// Setup the logger
	this.logger = Logger({
		level: this.options.log
	});

	// Log the options
	try {
		this.logger.verbose('\nOptions: ' + JSON.stringify(this.options, null, '  '));
	} catch(e) {
		// This is here because when a generator is run by selecting it after running `yo`,
		// the options is a circular data structure, causing an error when converting to json.
		// Verbose cannot be called this way, so there is no need to log anything.
	}

	// Load the config files
	this.conf = new Config();

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
	this.logger.log(art.wp, {logPrefix: ''});
	
	// Get the current version number of wordpress
	this.logger.verbose('Getting current WP version');
	wordpress.getCurrentVersion(function(err, ver) {
		if (err) this.logger.warn('Error getting WP versions.  Falling back to ' + ver);
		this.logger.verbose('Got current WP version: ' + ver);
		this.conf.set('wpVer', ver);
		getInput();
	}.bind(this));

	// Get the input
	var getInput = function getInput() {
		this.prompt(require('./prompts')(this.options.advanced, this.conf.get()), function(input) {
			this.prompt([{
				message: 'Does this all look correct?',
				name: 'confirm',
				type: 'confirm'
			}], function(i) {
				if (i.confirm) {
					// Set port
					var portRegex = /:[\d]+$/;
					var port = input.url.match(portRegex);
					if (port) input.port = port[0].replace(':', '');

					// Remove port from url
					input.url = input.url.replace(portRegex, '');

					// Set customDirs to true if installing as a submodule
					if (input.submodule) {
						input.customDirs = true;
					}

					// Set dirs if custom dir's is not set
					if (!input.customDirs) {
						input.wpDir = '.';
						input.contentDir = 'wp-content';
					}

					// Create a wordpress site instance
					this.wpSite = new wp.Site({
						contentDirectory: input.contentDir,
						wpBaseDirectory: input.wpDir,
						databaseCredentials: {
							host: input.dbHost,
							user: input.dbUser,
							password: input.dbPass,
							name: input.dbName,
							prefix: input.tablePrefix,
						}
					});

					// Save the users input
					this.conf.set(input);
					this.logger.verbose('User Input: ' + JSON.stringify(this.conf.get(), null, '  '));
					this.logger.log(art.go, {logPrefix: ''});
					done();
				} else {
					console.log();
					getInput();
				}
			}.bind(this));
		}.bind(this));
	}.bind(this);

};

// .gitignore
Generator.prototype.justIgnoreMe = function() {
	if (this.conf.get('git')) {
		this.logger.verbose('Copying .gitignore file');
		this.fs.copyTpl(this.templatePath('gitignore.tmpl'), this.destinationPath('.gitignore'), { conf: this.conf });
	}
};

// Git setup and initial commit of WP stuff
Generator.prototype.gitIsTheShit = function() {

	// Using Git? Init it...
	if (this.conf.get('git')) {
		var done = this.async();

		this.logger.log('Initializing Git');
		git.init(function(err) {
			if (err) this.logger.error(err);

			this.logger.verbose('Git init complete');
			done();
		}.bind(this));
	}

};

// Setup Vagrant config
Generator.prototype.heIsSuchAVagrant = function() {

	if (this.conf.get('vagrant')) {
		this.logger.log('Setting up Vagrant');
		this.logger.verbose('Copying vagrant file');
		this.fs.copyTpl(this.templatePath('Vagrantfile'), this.destinationPath('Vagrantfile'), this);
		this.logger.verbose('Copying puppet files');
		this.fs.copy(this.templatePath('puppet/'), this.destinationPath('puppet/'));
		this.fs.copyTpl(this.templatePath('puppet/manifests/default.pp'), this.destinationPath('puppet/manifests/default.pp'), this);
		this.logger.verbose('Finished setting up Vagrant');
	}

};

// Install wordpress
Generator.prototype.wordWhatUp = function() {

	var done = this.async();

	if (this.conf.get('submodule')) {
		this.logger.log('Installing WordPress ' + this.conf.get('wpVer') + ' as a submodule (be patient)');
		git.submoduleAdd(wordpress.repo, this.conf.get('wpDir'), function(err) {
			if (err) this.logger.error(err);

			this.logger.verbose('Submodule added');
			var cwd = process.cwd();
			git._baseDir = this.conf.get('wpDir');
			this.logger.verbose('Checking out WP version ' + this.conf.get('wpVer'));
			git.checkout(this.conf.get('wpVer'), function(err) {
				if (err) this.logger.error(err);
				git._baseDir = cwd;
				this.logger.verbose('WordPress installed');
				done();
			}.bind(this));
		}.bind(this));

	} else {

		this.logger.log('Installing WordPress ' + this.conf.get('wpVer'));
		this.remote('wordpress', 'wordpress', this.conf.get('wpVer'), function(err, remote) {
			remote.directory('.', this.conf.get('wpDir'));
			this.logger.log('WordPress installed');
			done();
		}.bind(this));

	}
	
};

// Setup custom directory structure
Generator.prototype.somethingsDifferent = function() {

	if (this.conf.get('submodule') || this.conf.get('customDirs')) {

		this.logger.verbose('Copying index.php');
		this.fs.copyTpl(this.templatePath('index.php.tmpl'), this.destinationPath('index.php'), { conf: this.conf });

		this.logger.log('Setting up the content directory');
		this.remote('wordpress', 'wordpress', this.conf.get('wpVer'), function(err, remote) {
			remote.directory('wp-content', this.conf.get('contentDir'));
			this.logger.verbose('Content directory setup');
		}.bind(this));

	}

};

// wp-config.php
Generator.prototype.muHaHaHaConfig = function() {

	var done = this.async();

	this.logger.log('Getting salt keys');
	wp.misc.getSaltKeys(function(err, saltKeys) {
		if (err) {
			this.logger.error('Failed to get salt keys, remember to change them.');
		}
		this.logger.verbose('Salt keys: ' + JSON.stringify(saltKeys, null, '  '));
		this.conf.set('saltKeys', saltKeys);
		this.logger.verbose('Copying wp-config');
		this.fs.copyTpl(this.templatePath('wp-config.php.tmpl'), this.destinationPath('wp-config.php'), { conf: this.conf });
		done();
	}.bind(this));

};

// local-config.php
Generator.prototype.localConf = function() {
	if (this.conf.get('createLocalConfig')) {
		this.logger.verbose('Copying local-config');
		this.fs.copyTpl(this.templatePath('local-config.php.tmpl'), this.destinationPath('local-config.php'), { conf: this.conf });
	}
};

// Create Language directory
Generator.prototype.doveIlBagno = function() {

	// Only do this if the user specified a language
	if (this.conf.get('wpLang')) {
		this.logger.log('Setting up locale files');
		wp.locale.getLanguage(this.conf.get('wpLang'), this.conf.get('contentDir'), function (err) {
			if (err) this.logger.error(err);
		}.bind(this));
	}

};

// Write all these newly created files to disk so that the rest of the generator doesn't fail
Generator.prototype.doNotFearCommitment = function() {

	var done = this.async();

	this.logger.log('Writing WP files to disk')

	this.fs.commit(function (err) {
		if (err) this.logger.error(err);

		this.logger.verbose('Done WP writing files');
		done();
	}.bind(this));
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

	if (fs.existsSync(this.conf.get('contentDir'))) {
		this.logger.log('Setting Permissions: 0775 on ' + this.conf.get('contentDir'));
		wrench.chmodSyncRecursive(this.conf.get('contentDir'), 0775);
		this.logger.verbose('Done setting permissions on ' + this.conf.get('contentDir'));
	}

};

// Commit the wordpress stuff
Generator.prototype.commitThisToMemory = function() {

	if (this.conf.get('git')) {
		var done = this.async();

		this.logger.verbose('Committing WP to Git');
		git.add('.', function(err) {
			if (err) this.logger.error(err);
		}.bind(this)).commit('Installed wordpress', function(err, d) {
			if (err) this.logger.error(err);
			this.logger.verbose('Done committing: ' + JSON.stringify(d, null, '  '));
			done();
		}.bind(this));
	}

};

// Check that the database exists, create it otherwise
Generator.prototype.hazBaseData = function() {

	var done = this.async();
	this.wpSite.database.createIfNotExists(function(err) {
		if (err) {
			this.logger.warn('Cannot access database');
			this.logger.warn('Make sure you create the database and update the credentials in the wp-config.php');
		}
		done();
	}.bind(this));

};

// Install and activate the theme
Generator.prototype.dumbledoreHasStyle = function() {

	if (this.conf.get('installTheme')) {
		var done = this.async();

		this.logger.log('Starting to install theme');
		wordpress.installTheme(this, this.conf.get(), function() {
			//@TODO You need to run the install before doing this
			//see if I can get yeopress to do that.
			//wordpress.activateTheme(this.conf.get(), done);
			this.logger.verbose('Theme install complete');
			done();
		}.bind(this));
	}

};

// Write all the newly downloaded theme files to disk
Generator.prototype.gandalfGotThemSkillzTho = function() {

	if (this.conf.get('installTheme')) {
		var done = this.async();

		this.logger.log('Writing theme files to disk')

		this.fs.commit(function (err) {
			if (err) this.logger.error(err);

			this.logger.verbose('Done writing theme files');
			done();
		}.bind(this));
	}

};

// Setup theme
Generator.prototype.dummyYouHaveToPlugItInFirst = function() {

	if (this.conf.get('installTheme')) {
		this.logger.log('Starting theme setup');
		wordpress.setupTheme(this, this.conf.get(), this.async());
		this.logger.verbose('Theme setup complete');
	}

};

// Commit again with the template
Generator.prototype.gitMeMOARCommits = function() {

	if (this.conf.get('git') && this.conf.get('installTheme')) {
		var done = this.async();

		this.logger.verbose('Committing theme to Git');
		git.add('.', function(err) {
			if (err) this.logger.error(err);
		}.bind(this)).commit('Installed theme', function(err, d) {
			if (err) this.logger.error(err);

			this.logger.verbose('Done committing: ', JSON.stringify(d, null, '  '));
			done();
		}.bind(this));
	}

};

// Run vagrant up
Generator.prototype.vagrantUp = function() {
	if (this.conf.get('vagrant')) {
		var done = this.async();
		this.logger.log('Running vagrant up');
		var child = require('child_process').exec('vagrant up', function(err) {
			if (err) return this.logger.error(err);
			this.logger.verbose('Finished running Vagrant');
			done();
		}.bind(this));
		child.on('error', function(err) {
			process.stderr.write(err);
		});
		child.stdout.on('data', function(data) {
			process.stdout.write(data);
		});
		child.stderr.on('data', function(err) {
			process.stderr.write(err);
		});
	}
};

// Save settings to .yeopress file
Generator.prototype.saveDaSettings = function() {
	this.logger.log('Writing .yeopress file');
	this.fs.writeJSON(this.destinationPath('.yeopress'), this.conf.get(), null, '\t');

	// just go ahead and write this one to disk so we don't get a
	// weird "create .yeopress" at termination
	this.fs.commit(function (err) {
		if (err) this.logger.error(err);

		this.logger.verbose('Done writing .yeopress file');
	}.bind(this));
};

// All done
Generator.prototype.oopsIPeedMyself = function() {
	this.logger.log(chalk.bold.green('\nAll Done!!\n------------------------\n'), {logPrefix: ''});
	this.logger.log('I tried my best to set things up, but I\'m only human right? **wink wink**\nSo, you should probably check your `wp-config.php` to make sure all the settings work on your environment.', {logPrefix: ''});
	this.logger.log('Have fun pressing your words!\n', {logPrefix: ''});
};
