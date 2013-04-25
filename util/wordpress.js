var https = require('https'),
	fs = require('fs'),
	mysql = require('mysql'),
	exec = require('child_process').exec,
	git = require('./git'),
	EventEmitter = require('events').EventEmitter,
	wordpressRepo = "git://github.com/WordPress/WordPress.git";

function getSaltKeys() {
	var ee = new EventEmitter(),
		keys = '';
	https.get("https://api.wordpress.org/secret-key/1.1/salt/", function(res) {
		res.on('data', function(d) {
			keys += d.toString();
		}).on('end', function() {
			ee.emit('end', keys);
		});
	});
	return ee;
}

function getCurrentVersion() {
	var ee = new EventEmitter(),
		latestVersion = '3.5.1';

	git.listRemoteTags(wordpressRepo).on('data', function(tagsList) {
		tagList = '' + tagsList;
		tagList = tagList.split('\n');
		tagList.pop();
		var lastTag = tagList.pop();
		lastTag = /\d\.\d\.\d/ig.exec(lastTag);
		if (lastTag !== null) {
			latestVersion = lastTag[0];
		}
		ee.emit('close', latestVersion);
	});

	return ee;
};

function loadConfig() {
	var ee = new EventEmitter();

	function readConfig(path) {
		fs.readFile(path, {encoding:'utf8'}, function(err, contents) {
			if (err) return ee.emit('error', err);
			ee.emit('done', contents);
		});
	}

	fs.exists('wp-config.php', function(exists) {
		if (exists) {
			readConfig('wp-config.php');
		} else {
			fs.exists('../wp-config.php', function(exists) {
				if (exists) {
					readConfig('../wp-config.php');
				} else {
					return ee.emit('error', 'Config file does not exist.');
				}
			});
		}
	});

	return ee;
};

function getDbCredentials() {
	var ee = new EventEmitter();

	loadConfig().on('done', function(contents) {
		var db = {};
		db.name = contents.match(/define\(["']DB_NAME["'],[\s]*["'](.*)["']\)/)[1];
		db.user = contents.match(/define\(["']DB_USER["'],[\s]*["'](.*)["']\)/)[1];
		db.pass = contents.match(/define\(["']DB_PASSWORD["'],[\s]*["'](.*)["']\)/)[1];
		db.host = contents.match(/define\(["']DB_HOST["'],[\s]*["'](.*)["']\)/)[1];
		ee.emit('done', db);
	}).on('error', function(err) {
		ee.emit('error', ee);
	});

	return ee;
};

function createDBifNotExists() {
	var ee = new EventEmitter();

	getDbCredentials().on('done', function(db) {

		var connection = mysql.createConnection({
			host     : db.host,
			user     : db.user,
			password : db.pass
		});

		connection.connect(function(err) {
			if (err) return ee.emit('error', err);

			connection.query('CREATE DATABASE IF NOT EXISTS ' + mysql.escapeId(db.name), function(err, rows, fields) {
				if (err) return ee.emit('error', err);
				connection.end(function() {
					ee.emit('done');
				});
			});

		});

	});

	return ee;
};

function getContentDir() {
	var ee = new EventEmitter();

	function checkSimpleContentLocations() {
		fs.exists('wp-content', function(exists) {
			if (exists) {
				fs.realpath('wp-content', function(err, path) {
					if (err) erroree.emit('error', err);
					ee.emit('done', path);
				});
			} else {
				fs.exists('content', function(exists) {
					if (exists) {
						fs.realpath('content', function(err, path) {
							if (err) erroree.emit('error', err);
							ee.emit('done', path);
						});
					} else {
						ee.emit('error', 'Cannot determine content directory.');
					}
				});
			}
		});
	}

	loadConfig().on('done', function(contents) {
		var matches = contents.match(/define\(["']WP_CONTENT_DIR["'],[\s]*(.*)\)/);
		if (matches && matches[1]) {

			exec('php -r "echo ' + matches[1] + ';"', function(err, stdout) {
				if (err) return checkSimpleContentLocations();

				fs.exists(stdout, function(exists) {
					if (exists) {
						ee.emit('done', stdout);
					} else {
						checkSimpleContentLocations();
					}
				});
			});

		} else {
			checkSimpleContentLocations();
		}
	}).on('error', function(err) {
		checkSimpleContentLocations();
	});

	return ee;
};

module.exports = {
	getSaltKeys : getSaltKeys,
	getCurrentVersion : getCurrentVersion,
	getDbCredentials : getDbCredentials,
	createDBifNotExists : createDBifNotExists,
	loadConfig : loadConfig,
	getContentDir : getContentDir
};
