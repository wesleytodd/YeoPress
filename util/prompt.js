var prompt = require('prompt'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

prompt.message = '['.grey + '?'.green + ']'.grey;
prompt.delimiter = ' ';

module.exports = function(prompts, obj, callback) {

	if (!util.isArray(prompts)) prompts = [prompts];
	
	var p = [];
	prompt.override = {};
	for (var i in prompts) {
		prompts[i].description = prompts[i].description.white;

		if (prompts[i].advanced && advanced) {
			p.push(prompts[i]);
		} else if (typeof prompts[i].advanced === 'undefined' || !prompts[i].advanced) {
			p.push(prompts[i]);
		} else {
			prompt.override[prompts[i].name] = prompts[i].default;
		}
	}

	var ee = new EventEmitter();

	prompt.start();

	if (typeof obj === 'undefined' || obj === null){
		prompt.get(p, function(err, input) {
			if (err) return ee.emit('error', err);
			ee.emit('done', input);
		});
	} else {
		prompt.addProperties(obj, p, function(err) {
			if (err) return ee.emit('error', err);
			ee.emit('done', obj);
		});
	}

	ee.on('error', function(err) {
		console.error(err);
	});

	if (typeof callback === 'function') {
		ee.on('done', callback);
	}

	return ee;

};

// Turn on advanced prompts?
var advanced = false;
module.exports.advanced = function() {
	advanced = true;
}
