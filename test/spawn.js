var spawn = require('../util/spawn'),
	assert = require('assert'),
	test = require('./lib/runner');

test('Should spawn a task', function(done) {
	spawn('ls').on('close', function() {
		assert(true, 'How am I not myself?');
		done();
	});
});

test('Spawn a task with arguments', function(done) {
	spawn('ls', ['-lah']).on('close', function() {
		assert(true, 'How am I not myself?  Wack!!');
		done();
	});
});

test('Spawn a task with options', function(done) {
	spawn('ls', {
		cwd : 'test'
	}).on('close', function() {
		assert(true, 'How am I not myself?  Wack!!');
		done();
	}).stdout.on('data', function(d) {
		assert(((''+d).indexOf('spawn.js') !== -1), 'Did not take arguments');
	});
});

test('Spawn a task with messages and display them', function(done) {
	var p = spawn('ls', {
		start : 'start',
		success : 'success'
	}).on('close', function() {
		done();
	});
});

test.go();
