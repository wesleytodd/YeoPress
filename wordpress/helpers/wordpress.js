
var git = require('./git'),
	exec = require('./exec'),
	https = require('https');

var wordpressRepo = "git://github.com/WordPress/WordPress.git";
var wordpressArchive = "https://github.com/WordPress/WordPress/archive/";
var saltURL = "https://api.wordpress.org/secret-key/1.1/salt/";

module.exports.setupAsSubmodule = function(location, done) {
	git.submoduleAdd(wordpressRepo, location, function() {
		module.exports.getCurrentVersion(function(ver) {
			module.exports.checkoutVersion(location, ver, function() {
				git.addAndCommit('Added WordPress ' + ver + ' as a submodule @ ./' + location, done);
			});
		});
	});
};

module.exports.updateVersion = function(location, done) {
	module.exports.getCurrentVersion(function(ver) {
		module.exports.checkoutVersion(location, ver, function() {
			console.log('WordPress updated to version ' + ver);
		});
	});
};

module.exports.getCurrentVersion = function(done) {
	var me = this;
	var latestVersion = '3.5';
	exec('git ls-remote --tags ' + wordpressRepo + ' | tail -n 1', function(err, stdout, stderr){
		var pattern = /\d\.\d\.\d/ig;
		var match = pattern.exec(stdout);
		if (match !== null) {
			latestVersion = match[0];
			console.log('WordPress version: ' + latestVersion);
		} else {
			latestVersion = latestVersion;
		}
		done(latestVersion);
	});
};

module.exports.checkoutVersion = function(location, ver, done) {
	var cwd = process.cwd();
	process.chdir(location);
	git.checkout(ver, function() {
		process.chdir(cwd);
		done();
	});
};

module.exports.getSaltKeys = function(done) {
	var keys;
	https.get(saltURL, function(res) {
		res.on('data', function(d) {
			keys = d.toString();
		}).on('end', function() {
			done(keys);
		});
	});
}
