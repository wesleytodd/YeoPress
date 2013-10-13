/**================================
 * Installs a WordPress plugin
 **===============================*/

// Requirements
var util         = require('util'),
	path         = require('path'),
	yeoman       = require('yeoman-generator'),
	prompt       = require('../util/prompt'),
	wordpress    = require('../util/wordpress'),
	art          = require('../util/art'),
	Logger       = require('../util/log'),
	Config       = require('../util/config');

// Export the module
module.exports = Generator;

// Extend the base generator
function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	// Not functioning
	console.log('This sub-generator is not functioning until yeoman supports zip extraction');
	process.exit();

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
	this.logger.verbose('\nOptions: ' + JSON.stringify(this.options, null, '  '));

	// Load the config files
	this.conf = new Config();


};
util.inherits(Generator, yeoman.generators.Base);

// Nice and simple
Generator.prototype.plugItInPlugItIn = function() {

	var done = this.async(),
		me = this;

	// Display welcome message
	this.logger.log(art.wp, {logPrefix: ''});
	
	(function getInput() {
		prompt.ask('Plugins to install (ex. wordpress-importer, wp-custom-admin-bar)', {
			after: function(input) {
				var plugins = [],
					items = input.split(',');
				for (var i in items) {
					plugins.push(items[i].trim());
				}
				return plugins;
			}
		}, function(err, plugins) {
			if (err) {
				me.logger.error(err);
				me.logger.log(art.wawa, {logPrefix: ''});
				return getInput();
			}

			var len = plugins.length;
			var next = function(i) {
				installPlugin(plugins[i], function() {
					if (i < len - 1) {
						next(++i);
					} else {
						done();
					}
				});
			};
			next(0);
		});
	})();

	function installPlugin(plugin, cb) {
		me.tarball('http://downloads.wordpress.org/plugin/' + plugin + '.zip', path.join(me.conf.get('contentDir'), 'plugins', plugin), cb);
	}

};
