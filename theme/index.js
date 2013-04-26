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

	// Display welcome message
	console.log(art.wp);
	
};
