var util = require('util'),
	chalk = require('chalk');

// The supported severity levels
var severityLevels = ['verbose', 'log', 'warn', 'error'];

var Logger = function(options) {
	if (!(this instanceof Logger))
		return new Logger(options);

	options = options || {};

	this.level             = options.level || 'error';

	this.verbosePrefix       = options.verbosePrefix || '>> ';
	this.verbosePrefixTheme  = options.verbosePrefixTheme || chalk.gray.bold;
	this.verboseMessageTheme = options.verboseMessageTheme || chalk.white;
	this.verboseStream       = options.verboseStream || process.stdout;

	this.logPrefix         = options.logPrefix || '';
	this.logPrefixTheme    = options.logPrefixTheme || chalk.cyan.bold;
	this.logMessageTheme   = options.logMessageTheme || chalk.white;
	this.logStream         = options.logStream || process.stdout;

	this.warnPrefix        = options.warnPrefix || '>> ';
	this.warnPrefixTheme   = options.warnPrefixTheme || chalk.yellow.bold;
	this.warnMessageTheme  = options.warnMessageTheme || chalk.white;
	this.warnStream        = options.warnStream || process.stdout;

	this.errorPrefix       = options.errorPrefix || 'Error: ';
	this.errorPrefixTheme  = options.errorPrefixTheme || chalk.red.bold;
	this.errorMessageTheme = options.errorMessageTheme || chalk.red;
	this.errorStream       = options.errorStream || process.stderr;

};

severityLevels.forEach(function(fnc) {
	Logger.prototype[fnc] = function() {
		if (severityLevels.indexOf(fnc) >= severityLevels.indexOf(this.level)) {
			var args = arguments;
			for (var i = 0; i < args.length; i++) {
				var prefix = this[fnc + 'PrefixTheme'](this[fnc + 'Prefix']);

				var message;
				if (typeof args[i] === 'object') {
					message = this[fnc + 'MessageTheme'](util.inspect(args[i]));
				} else {
					message = this[fnc + 'MessageTheme'](args[i]+'');
				}

				if (typeof console[fnc + 'Stream'] === 'function') {
					this[fnc + 'Stream'].write(prefix + message);
				} else {
					console.log(prefix + message);
				}
			}
		}
	};
});

module.exports = Logger;
