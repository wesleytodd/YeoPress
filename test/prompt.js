var prompt = require('../util/prompt');

var obj = {
	test : 'My object'
};

var input = prompt([
	{
		name : 'name',
		description : 'What is your name?',
		message : 'Your name is required',
		required : true
	},
	{
		name : 'age',
		description : 'How old are you?',
		pattern : /^\d+$/
	},
	{
		name : 'website',
		description : 'What is your website?',
		before : function(value) {
			value = value.replace(/\/+$/g, '');
			if (!/^http[s]?:\/\//.test(value)) {
				value = 'http://' + value;
			}
			return value;
		}
	},
	{
		name : 'like',
		description : 'Do you like me?',
		pattern : /^(?:y(?:es)?|n(?:o)?)$/i,
		default : 'y',
		before : function(value) {
			value = value.toLowerCase();
			if (value === 'y' || value === 'yes') {
				return true;
			} else {
				return false;
			}
		}
	}
], obj);

input.on('done', function(input) {
	console.log(obj);
});
