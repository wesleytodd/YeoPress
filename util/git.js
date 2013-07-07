var spawn = require('./spawn'),
	EventEmitter = require('events').EventEmitter;

function init(args, callback) {
	if (typeof args === 'function') {
		callback = args;
		args = [];
	}
	if (typeof args === 'undefined') args = [];
	args.unshift('init');
	var p = spawn('git', args, {
		error : 'Repository failed to initalize',
		success : 'Repository successfully initalized'
	});
	if (typeof callback === 'function') {
		p.on('close', callback);
	}
	return p;
};

function checkout(args, callback) {
	if (typeof args === 'undefined') args = [];
	args.unshift('checkout');
	var p = spawn('git', args, {
		error : 'Failed to complete checkout'
	});
	if (typeof callback === 'function') {
		p.on('close', callback);
	}
	return p;
};

function add(files, args) {
	if (typeof files === 'undefined') files = '.';
	if (typeof args === 'undefined') args = [];
	args.unshift('add');
	args.push(files);
	return spawn('git', args, {
		error : 'Git add failed'
	});
};

function commit(message, args) {
	if (typeof args === 'undefined') args = [];
	args.unshift('commit', '-m', message);
	return spawn('git', args, {
		success : 'Commit: ' + message,
		error : 'Commit failed: ' + message
	});
};

function addAllAndCommit(message, callback) {
	var ee = new EventEmitter();
	add().on('close', function() {
		add('.', ['-u']).on('close', function() {
			commit(message).on('close', function() {
				ee.emit('close');
			}).on('error', function() {
				ee.emit('error', err);
			});
		}).on('error', function(err) {
			ee.emit('error', err);
		});
	}).on('error', function(err) {
		ee.emit('error', err);
	});
	if (typeof callback == 'function') {
		ee.on('close', callback);
	}
	return ee;
};

function submoduleAdd(repo, path, callback) {
	var args = ['submodule', 'add', repo, path];
	var p = spawn('git', args, {
		start : 'Adding submodule: ' + repo,
		success : 'Submodule successfully added!!',
		error : 'Adding submodule failed.'
	});
	if (typeof callback === 'function') {
		p.on('close', callback);
	}
	return p;
};

function submoduleInit(submodule) {
	var args = ['submodule', 'init', submodule];
	return spawn('git', args, {
		error : 'An error occured while updating submodule'
	});
};

function submoduleUpdate(submodule) {
	var args = ['submodule', 'update', submodule];
	return spawn('git', args, {
		error : 'An error occured while updating submodule'
	});
};

function submoduleInitAndUpdate(submodule) {
	var eventEmitter = new EventEmitter();
	submoduleInit(submodule).on('close', function() {
		submoduleUpdate(submodule).on('close', function() {
			eventEmitter.emit('close');
		}).on('error', function(err) {
			eventEmitter.emit('error', err);
		});
	}).on('error', function(err) {
		eventEmitter.emit('error', err);
	});
	return eventEmitter;
};

function submoduleAddInitAndUpdate(repo, path) {
	var eventEmitter = new EventEmitter();
	submoduleAdd(repo, path).on('close', function() {
		submoduleInitAndUpdate().on('close', function() {
			eventEmitter.emit('close');
		}).on('error', function(err) {
			eventEmitter.emit('error', err);
		});
	}).on('error', function(err) {
		eventEmitter.emit('error', err);
	});
	return eventEmitter;
};

function listRemoteTags(repo) {
	var eventEmitter = new EventEmitter(),
		data = '';
	spawn('git', ['ls-remote', '--tags', repo], {
		error : 'Failed to get remote tags'
	}).on('error', function(err) {
		eventEmitter.emit('error', err);
	}).on('close', function() {
		eventEmitter.emit('close', data);
	}).stdout.on('data', function(d) {
		data += d;
		eventEmitter.emit('data', d);
	});
	return eventEmitter;
};

module.exports = {
	init : init,
	checkout : checkout,
	add : add,
	commit : commit,
	addAllAndCommit : addAllAndCommit,
	submoduleAdd : submoduleAdd,
	submoduleInit : submoduleInit,
	submoduleUpdate : submoduleUpdate,
	submoduleInitAndUpdate : submoduleInitAndUpdate,
	submoduleAddInitAndUpdate : submoduleAddInitAndUpdate,
	listRemoteTags : listRemoteTags
};
