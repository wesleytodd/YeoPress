
var git = require('./git');
var exec = require('./exec');

var wordpressRepo = "git://github.com/WordPress/WordPress.git";

module.exports.setupAsSubmodule = function(location, done) {
	git.submoduleAdd(wordpressRepo, location, function() {
		module.exports.getCurrentVersion(function(ver) {
			var cwd = process.cwd();
			process.chdir(location);
			git.checkout(ver, function() {
				process.chdir(cwd);
				git.addAndCommit('Added WordPress ' + ver + 'as a submodule at ./' + location, done);
			});
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
