var spawn = require('./spawn'),
	EventEmitter = require('events').EventEmitter;

function init(args) {
	if (typeof args === 'undefined') args = [];
	args.unshift('init');
	return spawn('git', args, {
		start : 'Initalizing git repository',
		error : 'Repository failed to initalize',
		success : 'Repository successfully initalized'
	});
};

function checkout(args) {
	if (typeof args === 'undefined') args = [];
	args.unshift('checkout');
	return spawn('git', args, {
		error : 'Failed to complete checkout'
	});
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
		error : 'Commit failed: ' + message
	});
};

function addAllAndCommit(message) {
	var eventEmitter = new EventEmitter();
	add().on('close', function() {
		add('.', ['-u']).on('close', function() {
			commit(message).on('close', function() {
				eventEmitter.emit('close');
			}).on('error', function() {
				eventEmitter.emit('error', err);
			});
		}).on('error', function(err) {
			eventEmitter.emit('error', err);
		});
	}).on('error', function(err) {
		eventEmitter.emit('error', err);
	});
	return eventEmitter;
};

function submoduleAdd(repo, path) {
	var args = ['submodule', 'add', repo, path];
	return spawn('git', args, {
		start : 'Adding submodule: ' + repo,
		success : 'Submodule successfully added!!',
		error : 'Adding submodule failed.'
	});
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
	var eventEmitter = new EventEmitter();
	spawn('git', ['ls-remote', '--tags', repo], {
		error : 'Failed to get remote tags'
	}).on('error', function(err) {
		eventEmitter.emit('error', err);
	}).stdout.on('data', function(d) {
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
