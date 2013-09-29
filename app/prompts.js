// Advanced prompts?
var advanced = process.argv.indexOf('--advanced') !== -1;

module.exports = [{
	question: 'URL WordPress will be installed at (ex. example.com)',
	key: 'url',
	required: true,
	after: function(value) {
		value = value.replace(/\/+$/g, '');
		if (!/^http[s]?:\/\//.test(value)) {
			value = 'http://' + value;
		}
		return value;
	}
}, {
	question: 'WordPress Version',
	key: 'wpVer',
	required: true,
	depends: advanced
}, {
	question: 'Table prefix',
	key: 'tablePrefix',
	required: true,
	default: 'wp_'
}, {
	question: 'Database host',
	key: 'dbHost',
	required: true,
	default: 'localhost'
}, {
	question: 'Database name',
	key: 'dbName',
	required: true
}, {
	question: 'Database user',
	name: 'dbUser',
	required: true
}, {
	question: 'Database password',
	key: 'dbPass',
	required: true
}, {
	question: 'Use Git?',
	key: 'useGit',
	default: 'N',
	boolean: true
}, {
	question: 'Would you like to install WordPress as a submodule?',
	key: 'submodule',
	default: 'N',
	boolean: true,
	depends: function(res) {
		return !!res.useGit;
	}
}, {
	question: 'Would you like to install WordPress with the custom directory structure?',
	key: 'customDirs',
	default: 'N',
	boolean: true,
	depends: function(res) {
		return !res.useGit || !res.submodule;
	}
}, {
	question: 'WordPress install directory',
	key: 'wpDir',
	required: true,
	default: 'wordpress',
	depends: function(res) {
		return !!res.submodule || !!res.customDirs;
	}
}, {
	question: 'WordPress content directory',
	key: 'contentDir',
	required: true,
	default: 'content',
	depends: function(res) {
		return !!res.submodule || !!res.customDirs;
	}
}, {
	question: 'Add WordPress Core files to .gitignore?',
	key: 'ignoreWPCore',
	default: 'N',
	required: true,
	boolean: true
}, {
	question: 'Install a custom theme?',
	key: 'theme',
	default: 'Y',
	boolean: true
}, {
	question: 'Destination directory (ex. twentytwelve)',
	key: 'themeDir',
	required: true,
	depends: function(res) {
		return !!res.theme;
	}
}, {
	question: 'Theme source type (git/tar)',
	key: 'themeType',
	required: true,
	validate: /^(?:git|tar)$/,
	default: 'git',
	depends: function(res) {
		return !!res.theme;
	}
}, {
	question: 'GitHub username',
	key: 'user',
	required: true,
	default: 'wesleytodd',
	depends: function(res) {
		return !!res.theme && res.themeType == 'git';
	}
}, {
	question: 'GitHub repository name',
	key: 'repo',
	required: true,
	default: 'YeoPress',
	depends: function(res) {
		return !!res.theme && res.themeType == 'git';
	}
}, {
	question: 'Repository branch',
	key: 'branch',
	required: true,
	default: 'template',
	depends: function(res) {
		return !!res.theme && res.themeType == 'git';
	}
}, {
	question: 'Remote tarball url (ex. https://github.com/user/repo/tarball/master)',
	key: 'tarballUrl',
	required: true,
	depends: function(res) {
		return !!res.theme && res.themeType == 'tar';
	}
}, {
	question: 'Use Vagrant?',
	key: 'useVagrant',
	required: true,
	depends: advanced,
	default: 'N',
	boolean: true
}];
