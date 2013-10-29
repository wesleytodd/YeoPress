// Requirements
var Config = require('../../util/config'),
	assert = require('assert'),
	fs = require('fs'),
	path = require('path'),

	// Directories
	home = process.env.HOME,
	root = process.cwd(),
	fixtures = path.join(process.cwd(), 'test', 'fixtures'),
	tmp = path.join('test', 'tmp'),

	// Test instance
	conf;

describe('util/config.js', function() {

	beforeEach(function() {
		process.env.HOME = root;
		conf = new Config();
	});

	afterEach(function() {
		process.chdir(root);
	});

	after(function() {
		process.env.HOME = home;
		fs.unlink(path.join(tmp, '.data'));
		fs.unlink(path.join(tmp, '.other'));
		fs.unlink(path.join(tmp, '.yeopress'));
	});

	describe('new Config([locals[, globals]])', function() {
		it('should export the Config constructor with all the necessary methods', function() {
			assert.deepEqual(typeof Config, 'function');
			assert.deepEqual(typeof Config.prototype.set, 'function');
			assert.deepEqual(typeof Config.prototype.setGlobal, 'function');
			assert.deepEqual(typeof Config.prototype.get, 'function');
			assert.deepEqual(typeof Config.prototype.write, 'function');
			assert.deepEqual(typeof Config.prototype.load, 'function');
		});

		it('should instantiate a new Config', function() {
			assert.equal(conf.filename, '.yeopress', 'config filename was not .yeopress');
			assert(conf.global, 'config did not have a global property');
			assert(conf.local, 'config did not have a local property');
		});

		it('should load a global settings file', function() {
			process.env.HOME = fixtures;
			conf = new Config();
			assert.equal(conf.global.key, 'val');
		});

		it('should load a local settings file', function() {
			process.env.HOME = fixtures;
			process.chdir(path.join(fixtures, 'dir'));
			conf = new Config();
			assert.equal(conf.local.url, 'yeopress.com');
		});

		it('should override file settings when passed values directly', function() {
			process.env.HOME = fixtures;
			process.chdir(path.join(fixtures, 'dir'));
			conf = new Config({url: 'wesleytodd.com'}, {dbHost: 'local'});
			assert.equal(conf.local.url, 'wesleytodd.com');
			assert.equal(conf.global.dbHost, 'local');
		});
	});

	describe('config.set(key[, val])', function() {

		it('should set a single local value', function() {
			conf.set('key', 'value');
			conf.set('key2', false);
			assert.equal(conf.local.key, 'value');
			assert.equal(conf.local.key2, false);
		});
		
		it('should set a multiple local values', function() {
			conf.set({
				key: 'val',
				key2: 'val2',
				key3: false,
				key4: null
			});
			assert.equal(conf.local.key, 'val');
			assert.equal(conf.local.key2, 'val2');
			assert.equal(conf.local.key3, false);
			assert.equal(conf.local.key4, null);
		});

	});

	describe('config.setGlobal(key[, val])', function() {
		
		it('should set a single global value', function() {
			conf.setGlobal('key', 'value');
			conf.setGlobal('key2', false);
			assert.equal(conf.global.key, 'value');
			assert.equal(conf.global.key2, false);
		});
		
		it('should set a multiple globa values', function() {
			conf.setGlobal({
				key: 'val',
				key2: 'val2',
				key3: false,
				key4: null
			});
			assert.equal(conf.global.key, 'val');
			assert.equal(conf.global.key2, 'val2');
			assert.equal(conf.global.key3, false);
			assert.equal(conf.global.key4, null);
		});

	});

	describe('config.get([key])', function() {

		beforeEach(function() {
			conf.set({
				key: 'val',
				key2: true,
				key3: false,
				key4: null
			});
			conf.setGlobal({
				key2: false,
				key4: 'val4',
				key5: 'val5'
			});
		});

		it('should get a single value', function() {
			assert.equal(conf.get('key'), 'val');
			assert.equal(conf.get('key2'), true);
			assert.equal(conf.get('key3'), false);
			assert.equal(conf.get('key4'), null);
			assert.equal(conf.get('key5'), 'val5');
		});

		it('should get all the values', function() {
			var c = conf.get();
			assert.equal(c.key, 'val');
			assert.equal(c.key2, true);
			assert.equal(c.key3, false);
			assert.equal(c.key4, null);
			assert.equal(c.key5, 'val5');
		});

	});

	describe('config.write([filepath[, data]])', function() {

		it('should write the config to a file', function() {
			process.env.HOME = fixtures;
			process.chdir(tmp);
			conf = new Config();
			conf.write();
			var c = fs.readFileSync('.yeopress', {encoding:'utf8'});
			var f = fs.readFileSync(path.join(fixtures, '.yeopress'), {encoding:'utf8'});
			assert.equal(c.trim(), f.trim());
		});

		it('should write the config to a specific file', function() {
			process.env.HOME = fixtures;
			process.chdir(tmp);
			conf = new Config();
			conf.write('.other');
			var c = fs.readFileSync('.other', {encoding:'utf8'});
			var f = fs.readFileSync(path.join(fixtures, '.yeopress'), {encoding:'utf8'});
			assert.equal(c.trim(), f.trim());
		});	

		it('should write specific data to the file', function() {
			process.chdir(tmp);
			var data = {data:'some other data'};
			conf.write('.data', data);
			var c = fs.readFileSync('.data', {encoding:'utf8'});
			assert.equal(c.trim(), JSON.stringify(data, null, '\t'));
		});	

	});

	describe('config.load([filepath])', function() {

		it('should load a files data', function() {
			process.chdir(path.join(fixtures, 'dir'));
			var c = conf.load();
			assert.equal(c.url, 'yeopress.com');
			c = conf.load(path.join(fixtures, '.yeopress'));
			assert.equal(c.key, 'val');
		});
		
	});

});
