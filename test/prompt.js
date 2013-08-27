/*
   @TODO Write some actual tests here
var prompt = require('../util/prompt');
	assert = require('assert'),
	test = require('./lib/runner');

test('A really shitty test for prompts.  This should be re-written to actually be a test...', function(done) {
	var obj = {
		test : 'My object'
	};

	prompt([
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
	], obj, function(input) {
		assert(obj.name, 'Object was not defined.');
		done();
	});

}, -1);

test.go();
*/
