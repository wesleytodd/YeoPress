var git = require('../util/git')
	assert = require('assert'),
	fs = require('fs'),
	test = require('./lib/runner');

// cd into test dir
fs.mkdirSync('test/tmp');
process.chdir('test/tmp');

// These tests are dependant on eachother, so the order matters
// I know this is bad...but it wasn't worth the effort to make each standalone

test('Should initalize a git repository in the current directory', function(done) {
	git.init().on('close', function() {
		fs.exists('.git', function(exists) {
			assert(exists, 'Did not initalize git repository');
			done();
		});
	});
});

test('Should checkout a new branch or a repository', function(done) {
	git.checkout(['-b', 'test']).on('close', function() {
		fs.readFile('.git/HEAD', {encoding:'utf8'}, function(err, content) {
			if (err) throw err;
			assert((content.indexOf('test') !== -1), 'Did not correctly switch to branch');
			done();
		});
	});
});

test('Should add files to be committed', function(done) {
	fs.writeFile('test1.txt', 'Test file', function() {
		git.add().on('close', function() {
			fs.readFile('.git/index', {encoding:'utf8'}, function(err, content) {
				if (err) throw err;
				assert((content.indexOf('test1.txt') !== -1), 'Did not correctly stage files');
				done();
			});
		});
	});
});

test('Should commit added files', function(done) {
	git.commit('Test Commit').on('close', function() {
		fs.readFile('.git/COMMIT_EDITMSG', {encoding:'utf8'}, function(err, content) {
			if (err) throw err;
			assert((content.indexOf('Test Commit') !== -1), 'Did not commit');
			done();
		});
	});
});

test('Should add and commit new files', function(done) {
	fs.writeFile('test2.txt', 'Test file', function() {
		git.addAllAndCommit('Test Add and Commit').on('close', function() {
			fs.readFile('.git/COMMIT_EDITMSG', {encoding:'utf8'}, function(err, content) {
				if (err) throw err;
				assert((content.indexOf('Test Add and Commit') !== -1), 'Did not commit');
				done();
			});
		});
	});
});

test('Should add a submodule', function(done) {
	git.submoduleAdd('git@github.com:wesleytodd/YeoPress.git', 'submodule', function() {
		fs.exists('submodule', function(exists) {
			assert(exists, 'Did not initalize submodule');
			fs.exists('submodule/.git', function(exists) {
				assert(exists, 'Did not initalize submodule');
				done();
			});
		});
	});
}, 20000);

test.go();
