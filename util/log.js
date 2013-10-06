var util = require('util'),
	chalk = require('chalk');

// Utility extend
function extend(obj) {
	var args = Array.prototype.slice.call(arguments, 1);
	for (var i = 0, len = args.length; i < len; i++) {
		if (args[i]) {
			for (var prop in args[i]) {
				obj[prop] = args[i][prop];
			}
		}
	}
    return obj;
};

// The supported severity levels
var severityLevels = ['verbose', 'log', 'warn', 'error'];

var Logger = function(options) {
	if (!(this instanceof Logger)) return new Logger(options);
	this.options = extend({}, Logger.defaultOptions, options);
};

Logger.defaultOptions = {
	level               : 'error',
	verbosePrefix       : '>> ',
	verbosePrefixTheme  : chalk.gray.bold,
	verboseMessageTheme : chalk.white,
	verboseStream       : process.stdout,
	logPrefix           : '',
	logPrefixTheme      : chalk.cyan.bold,
	logMessageTheme     : chalk.white,
	logStream           : process.stdout,
	warnPrefix          : '>> ',
	warnPrefixTheme     : chalk.yellow.bold,
	warnMessageTheme    : chalk.white,
	warnStream          : process.stdout,
	errorPrefix         : 'Error: ',
	errorPrefixTheme    : chalk.red.bold,
	errorMessageTheme   : chalk.red,
	errorStream         : process.stderr
};

severityLevels.forEach(function(fnc) {
	Logger.prototype[fnc] = function() {
		if (severityLevels.indexOf(fnc) >= severityLevels.indexOf(this.options.level)) {
			var args = arguments;
			for (var i = 0; i < args.length; i++) {
				var prefix = this.options[fnc + 'PrefixTheme'](this.options[fnc + 'Prefix']);

				var message;
				if (typeof args[i] === 'object') {
					message = this.options[fnc + 'MessageTheme'](util.inspect(args[i]));
				} else {
					message = this.options[fnc + 'MessageTheme'](args[i]+'');
				}

				if (typeof this.options[fnc + 'Stream'] === 'function') {
					this.options[fnc + 'Stream'].write(prefix + message);
				} else if (typeof console[fnc] === 'function') {
					console[fnc](prefix + message);
				} else {
					console.log(prefix + message);
				}
			}
		}
	};
});

module.exports = Logger;
