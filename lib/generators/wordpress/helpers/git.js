
var exec = require('../helpers/exec');

module.exports.init = function(done) {
	exec('git init', {
		start   : 'Initalizing Git Repository',
		success : 'Repository Initalized',
		error   : 'Repository Failed Initalized: '
	}, function(){
		done();
	});
};

module.exports.submoduleAdd = function(repo, path, done) {
	exec('git submodule add ' + repo + ' ' + path, {
		start : 'Adding submodule: ' + repo,
		success : 'Submodule successfully added!!',
		error : 'Adding submodule failed.'
	}, function() {
		done();
	});
};

module.exports.submoduleInit = function(done) {
	exec('git submodule init', {
		error : 'An error occured while initalizing submodules:'
	}, function() {
		done();
	});
};

module.exports.submoduleUpdate = function(done) {
	exec('git submodule update', {
		error : 'An error occured while updating submodules:'
	}, function() {
		done();
	});
};

module.exports.checkout = function(toCheckout, done) {
	exec('git checkout ' + toCheckout, {
		error : 'Failed to checkout ' + toCheckout
	}, function() {
		done();
	});
};

module.exports.add = function(files, done) {
	if (typeof files == 'function') {
		done = files;
		files = '.';
	}
	exec('git add "' + files + '"', {
		error : 'Git Add Failed'
	}, function() {
		done();
	});
}

module.exports.commit = function(message, done) {
	exec('git commit -m "' + message + '"', {
		success : 'Git Commit: ' + message,
		error : 'Commit Failed: ' + message
	}, function() {
		done();
	});
};

module.exports.addAndCommit = function(message, done) {
	module.exports.add(function() {
		module.exports.commit(message, done);
	});
};
