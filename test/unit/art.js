var art = require('../../util/art'),
	assert = require('assert');

describe('util/art.js', function() {

	it('should have the welcome message', function() {
		assert.ok(art.wp, 'did not have the welcome message');
	});

	it('should have the "here we go" message', function() {
		assert.ok(art.go, 'did not have the "here we go" message');
	});

	it('should have the "wawa" message', function() {
		assert.ok(art.wawa, 'did not have the "wawa" message');
	});

});
