var prompt = require('prompt'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

prompt.message = '['.grey + '?'.green + ']'.grey;
prompt.delimiter = ' ';

module.exports = function(prompts, obj, callback) {

	if (!util.isArray(prompts)) prompts = [prompts];
	
	for (var i in prompts) {
		prompts[i].description = prompts[i].description.white;
	}

	var ee = new EventEmitter();

	prompt.start();

	if (typeof obj === 'undefined' || obj === null){
		prompt.get(prompts, function(err, input) {
			if (err) return ee.emit('error', err);
			ee.emit('done', input);
		});
	} else {
		prompt.addProperties(obj, prompts, function(err) {
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

}
