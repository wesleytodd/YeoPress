var _c = require('chalk');
var async = require('async');
var domain = require('domain');

var testTimeout = 5000;

var CHK = '\u2713';
var EX = '\u2717';

var allTests = [];
var total = passed = failed = 0;

var errorMessage = function(title, e) {
	var msg = [
		_c.red(EX) + ' ' + title,
		_c.red('-----------------------'),
		_c.cyan('Message: ') + e.message
	];
	if (typeof e.expected !== 'undefined' && typeof e.actual !== 'undefined') {
		msg.push(
			_c.cyan('Expected: ') + e.expected,
			_c.cyan('Actual: ') + e.actual
		);
	}
	msg.push(_c.red('-----------------------'));
	
	console.log(msg.join('\n'));
};

var successMessage = function(title) {
	console.log(_c.green(CHK) + ' ' + title);
};

var totalsMessage = function() {
	console.log([
		_c.bold('\nTOTALS') + '\n---------------',
		_c.green('  ' + CHK + ' ' + String(passed) + ' Passed'),
		_c.red('  ' + EX + ' ' + String(failed) + ' Failed'),
		'    ' + total + ' Total\n'
	].join('\n'));
};

var test = function(title, fnc, timeout) {
	allTests.push(function(done) {
		var to = setTimeout(function() {
			errorMessage(title, {
				message : 'Test timed out'
			});
			d.dispose();
		}, timeout || testTimeout);

		var doneCalled = false;
		var doneFnc = function() {
			if (!doneCalled) {
				doneCalled = true;
				done();
			}
		};
		var d = domain.create();
		d.on('error', function(e) {
			clearTimeout(to);
			failed++;
			errorMessage(title, e);
			doneFnc();
		});
		d.run(function() {
			total++;
			fnc(function() {
				clearTimeout(to);
				passed++;
				successMessage(title);
				doneFnc();
			}, d);
		});
	});
};

test.go = function() {
	async.series(allTests, totalsMessage);
};

module.exports = test;
