var spawn = require('child_process').spawn,
	util = require('util');

module.exports = function execute(command, messages, args, options) {

	if (typeof command === 'undefined') throw new TypeError('A command must be specified.');

	if (!util.isArray(args)) {
		options = args;
		args = undefined;
	}
	if (util.isArray(messages)) {
		args = messages;
		messages = {};
	}
	if (typeof messages !== 'undefined'
		&& typeof messages.start === 'undefined'
		&& typeof messages.error === 'undefined'
		&& typeof messages.success === 'undefined') {
		options = messages;
		messages = {};
	}

	if (typeof messages === 'undefined') messages = {};

	if (typeof messages.start !== 'undefined') console.log(messages.start);

	var p = spawn(command, args, options);

	p.on('error', function(err) {
		if (typeof messages.error !== 'undefined') {
			console.error(messages.error, err);
		} else {
			console.error(err);
		}
	});

	p.on('close', function() {
		if (typeof messages.success !== 'undefined') {
			console.log(messages.success);
		}
	});

	return p;
}
