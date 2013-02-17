
var prompt = require('prompt');

prompt.message = '['.white + '?'.green + ']'.white + ' ';
prompt.delimiter = '';

module.exports = function(prompts, callback) {
	if (!(prompts instanceof Array)) prompts = [prompts];
	
	props = {};
	prompts.forEach(function(v) {
		v.description = v.description.grey;
		props[v.name] = v;
	});

	prompt.start();
	prompt.get({ properties : props}, callback);

};
