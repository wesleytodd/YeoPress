var art = require('../util/art')
	assert = require('assert'),
	test = require('./lib/runner');

test('It\'s a disco mania!!', function(done) {
	console.log(art.go);
	done();
});

test.go();
