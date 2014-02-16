module.exports = function(advanced, defaults) {

	// Validate required
	var requiredValidate = function(value) {
		if (value == '') {
			return 'This field is required.';
		}
		return true;
	};
	// When advanced
	var advancedWhen = function() {
		return advanced;
	};

	return [
		{
			message: 'WordPress URL',
			name: 'url',
			default: defaults.url || null,
			validate: requiredValidate,
			filter: function(value) {
				value = value.replace(/\/+$/g, '');
				if (!/^http[s]?:\/\//.test(value)) {
					value = 'http://' + value;
				}
				return value;
			}
		}, {
			message: 'WordPress Version',
			name: 'wpVer',
			default: defaults.wpVer || null,
			validate: requiredValidate,
			when: advancedWhen,
		}, {
			message: 'Table prefix',
			name: 'tablePrefix',
			default: defaults.tablePrefix || 'wp_',
			validate: requiredValidate
		}, {
			message: 'Database host',
			name: 'dbHost',
			default: defaults.dbHost || 'localhost',
			validate: requiredValidate
		}, {
			message: 'Database name',
			name: 'dbName',
			default: defaults.dbName || null,
			validate: requiredValidate
		}, {
			message: 'Database user',
			name: 'dbUser',
			default: defaults.dbUser || null,
			validate: requiredValidate
		}, {
			message: 'Database password',
			name: 'dbPass',
			default: defaults.dbPass || null
		}, {
			message: 'Language',
			name: 'wpLang',
			default: defaults.wplang || null,
			when: advancedWhen,
		}, {
			message: 'Use Git?',
			name: 'git',
			default: defaults.git || 'N',
			type: 'confirm'
		}, {
			message: 'Would you like to install WordPress as a submodule?',
			name: 'submodule',
			type: 'confirm',
			default: defaults.submodule || false,
			when: function(res) {
				return !!res.git;
			}
		}, {
			message: 'Would you like to install WordPress with the custom directory structure?',
			name: 'customDirs',
			type: 'confirm',
			default: defaults.customDirs || false,
			when: function(res) {
				return !res.git || !res.submodule;
			}
		}, {
			message: 'WordPress install directory',
			name: 'wpDir',
			default: defaults.wpDir || 'wordpress',
			when: function(res) {
				return !!res.submodule || !!res.customDirs;
			}
		}, {
			message: 'WordPress content directory',
			name: 'contentDir',
			default: defaults.contentDir || 'content',
			validate: requiredValidate,
			when: function(res) {
				return !!res.submodule || !!res.customDirs;
			}
		}, {
			message: 'Create local-config.php?',
			name: 'createLocalConfig',
			type: 'confirm',
			default: defaults.createLocalConfig || false,
			when: advancedWhen
		}, {
			message: 'Block external WP requests?',
			name: 'blockExternalRequests',
			type: 'confirm',
			default: defaults.blockExternalRequests || false,
			when: advancedWhen
		}, {
			message: 'Add wp-config.php to .gitignore?',
			name: 'ignoreWPConfig',
			type: 'confirm',
			default: defaults.ignoreWPConfig || false,
			validate: requiredValidate,
			when: function(res) {
				return (advanced && !!res.git);
			}
		}, {
			message: 'Add WordPress Core files to .gitignore?',
			name: 'ignoreWPCore',
			type: 'confirm',
			default: defaults.ignoreWPCore || false,
			validate: requiredValidate,
			when: function(res) {
				return (advancedWhen() && !!res.git);
			}
		}, {
			message: 'Use Vagrant?',
			name: 'vagrant',
			type: 'confirm',
			default: defaults.vagrant || false,
			when: advancedWhen,
			validate: requiredValidate
		}, {
			message: 'Install a custom theme?',
			name: 'installTheme',
			type: 'confirm',
			default: (typeof defaults.installTheme !== 'undefined') ? defaults.installTheme : true
		}, {
			message: 'Destination directory',
			name: 'themeDir',
			default: defaults.themeDir || 'yeopress',
			validate: requiredValidate,
			when: function(res) {
				return !!res.installTheme;
			}
		}, {
			message: 'Theme source type (git/tar)',
			name: 'themeType',
			default: defaults.themeType || 'git',
			validate: function(value) {
				if (value != '' && /^(?:git|tar)$/.test(value)) {
					return true;
				}
				return false;
			},
			when: function(res) {
				return !!res.installTheme;
			}
		}, {
			message: 'GitHub username',
			name: 'themeUser',
			default: defaults.themeUser || 'wesleytodd',
			validate: requiredValidate,
			when: function(res) {
				return !!res.installTheme && res.themeType == 'git';
			}
		}, {
			message: 'GitHub repository name',
			name: 'themeRepo',
			default: defaults.themeRepo || 'YeoPress',
			validate: requiredValidate,
			when: function(res) {
				return !!res.installTheme && res.themeType == 'git';
			}
		}, {
			message: 'Repository branch',
			name: 'themeBranch',
			default: defaults.themeBranch || 'template',
			validate: requiredValidate,
			when: function(res) {
				return !!res.installTheme && res.themeType == 'git';
			}
		}, {
			message: 'Remote tarball url',
			name: 'themeTarballUrl',
			default: defaults.themeTarballUrl || 'https://github.com/wesleytodd/YeoPress/archive/template.tar.gz',
			validate: requiredValidate,
			when: function(res) {
				return !!res.installTheme && res.themeType == 'tar';
			}
		}
	];
};
