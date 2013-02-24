
var prompt = require('prompt');

prompt.message = '';
prompt.delimiter = '';

module.exports = function(prompts, callback) {
	if (!(prompts instanceof Array)) prompts = [prompts];
	
	props = {};
	prompts.forEach(function(v) {
		v.description = v.description.white;
		props[v.name] = v;
	});

	prompt.start();
	prompt.get({ properties : props}, callback);

};
