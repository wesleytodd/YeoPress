var exec   = require('child_process').exec;

module.exports = execute;

var maxBuffer = 500 * 1024;

function execute(command, messages, options, callback) {
	if (typeof command == 'undefined' || typeof messages == 'undefined') {
		throw TypeError('Requires minimum of two arguments, a command and a callback');
	}

	if (typeof options == 'undefined') {
		callback = messages;
		messages = undefined;
	} else if (typeof callback == 'undefined') {
		callback = options;
		options = undefined;
	}

	if (typeof messages == 'undefined') {
		messages = {};
	}

	if (typeof messages.start != 'undefined') {
		console.log(messages.start);
	}
	var fnc = function(err, stdout, stderr) {
		if (err === null) {
			if (typeof messages.success != 'undefined') {
				console.log(messages.success);
			}
			callback(arguments);
		} else {
			if (typeof messages.error != 'undefined') {
				console.error(messages.error, err);
			} else {
				console.error(err);
			}
			process.exit();
		}
	}
	if (typeof options == 'undefined') {
		exec(command, {
			maxBuffer : maxBuffer
		}, fnc);
	} else {
		options.maxBuffer = options.maxBuffer || maxBuffer;
		exec(command, options, fnc);
	}
}
