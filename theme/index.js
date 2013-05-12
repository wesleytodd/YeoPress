/**================================
 * Setting up the basics
 **===============================*/

// Requirements
var util         = require('util'),
	yeoman       = require('yeoman-generator'),
	prompt       = require('../util/prompt'),
	wordpress    = require('../util/wordpress'),
	prompts      = require('../wordpress/prompts'),
	art          = require('../util/art');


// Export the module
module.exports = Generator;

// Extend the base generator
function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
};
util.inherits(Generator, yeoman.generators.Base);

// Prompts
Generator.prototype.themePrompts = function() {

	var done = this.async();

	// Display welcome message
	console.log(art.wp);

	// Object for user input
	this.userInput = {};

	// Do the prompts
	prompt([prompts.theme], this.userInput, function(i) {
		if (i.theme) {
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
				prompt(nextPrompts, input, function() {
					done();
				});
			});
		} else {
			done();
		}
	});

};

Generator.prototype.installTheme = function() {

	if (this.userInput.theme) {
		wordpress.installTheme(this, this.userInput, this.async());
	}

};

Generator.prototype.setupTheme = function() {

	if (this.userInput.theme) {
		wordpress.setupTheme(this, this.userInput, this.async());
	}

}

Generator.prototype.setupTheme = function() {
	console.log('Theme installed. Have fun styling!!'.green)
}
