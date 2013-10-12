module.exports = function(advanced) {
	return [
		{
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
			key: 'dbUser',
			required: true
		}, {
			question: 'Database password',
			key: 'dbPass',
			required: true
		}, {
			question: 'Use Git?',
			key: 'git',
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
			question: 'Block external WP requests?',
			key: 'blockExternalRequests',
			default: 'N',
			boolean: true,
			depends: advanced
		},{
			question: 'Add WordPress Core files to .gitignore?',
			key: 'ignoreWPCore',
			default: 'N',
			required: true,
			boolean: true,
			depends: function(res) {
				return (advanced && !!res.useGit);
			}
		}, {
			question: 'Use Vagrant?',
			key: 'vagrant',
			required: true,
			depends: advanced,
			default: 'N',
			boolean: true
		}, {
			question: 'Install a custom theme?',
			key: 'installTheme',
			default: 'Y',
			boolean: true
		}, {
			question: 'Destination directory (ex. twentytwelve)',
			key: 'themeDir',
			required: true,
			depends: function(res) {
				return !!res.installTheme;
			}
		}, {
			question: 'Theme source type (git/tar)',
			key: 'themeType',
			required: true,
			validate: /^(?:git|tar)$/,
			default: 'git',
			depends: function(res) {
				return !!res.installTheme;
			}
		}, {
			question: 'GitHub username',
			key: 'themeUser',
			required: true,
			default: 'wesleytodd',
			depends: function(res) {
				return !!res.installTheme && res.themeType == 'git';
			}
		}, {
			question: 'GitHub repository name',
			key: 'themeRepo',
			required: true,
			default: 'YeoPress',
			depends: function(res) {
				return !!res.installTheme && res.themeType == 'git';
			}
		}, {
			question: 'Repository branch',
			key: 'themeBranch',
			required: true,
			default: 'template',
			depends: function(res) {
				return !!res.installTheme && res.themeType == 'git';
			}
		}, {
			question: 'Remote tarball url (ex. https://github.com/user/repo/tarball/master)',
			key: 'themeTarballUrl',
			required: true,
			depends: function(res) {
				return !!res.theme && res.themeType == 'tar';
			}
		}
	];
};
