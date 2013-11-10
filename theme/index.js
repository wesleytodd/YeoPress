/**================================
 * Setting up the basics
 **===============================*/

// Requirements
var util         = require('util'),
	yeoman    = require('yeoman-generator'),
	path      = require('path'),
	wordpress = require('../util/wordpress'),
	prompts   = require('../app/prompts'),
	art       = require('../util/art');


// Export the module
module.exports = Generator;

// Extend the base generator
function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
	console.log('This feature is not yet fully working.  Please take a detour to your left.');
	process.exit();
};
util.inherits(Generator, yeoman.generators.Base);

// Prompts
Generator.prototype.themePrompts = function() {

	var done = this.async()
		me = this;

	// Display welcome message
	console.log(art.wp);

	// Object for user input
	this.userInput = {};

	// Do the prompts
	prompt([prompts.themeDir, prompts.themeType], this.userInput, function(i) {
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
		prompt(nextPrompts, me.userInput, function() {
			done();
		});
	});

};

// Install theme
Generator.prototype.installTheme = function() {

	var done = this.async(),
		me = this;

	wordpress.getContentDir().on('done', function(contentDir) {
		me.userInput.contentDir = contentDir;
		wordpress.installTheme(me, me.userInput, done);
	});

};

// Run theme setup task
Generator.prototype.setupTheme = function() {
	wordpress.setupTheme(this, this.userInput, this.async());
};

// Activate theme
Generator.prototype.activateTheme = function() {
	wordpress.activateTheme(this.userInput.themeDir, this.async());
};

// Done
Generator.prototype.allDone = function() {
	console.log('Theme installed and activated. Have fun styling!!'.green)
};
