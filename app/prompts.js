// Boolean answer regexp
var boolRegex = /^(?:y(?:es)?|n(?:o)?)$/i,
	boolFilter = function(value) {
		value = value.toLowerCase();
		if (value === 'y' || value === 'yes') return true;
		return false;
	};

module.exports = {

	url : {
		name : 'url',
		description : 'URL WordPress will be installed at (ex. example.com):',
		required : true,
		before : function(value) {
			value = value.replace(/\/+$/g, '');
			if (!/^http[s]?:\/\//.test(value)) {
				value = 'http://' + value;
			}
			return value;
		}
	},

	wpVer : {
		name : 'wpVer',
		description : 'WordPress Version:',
		required : true,
		advanced : true
	},

	tablePrefix : {
		name : 'tablePrefix',
		description : 'Table prefix:',
		required : true,
		default : 'wp_'
	},

	dbHost : {
		name : 'dbHost',
		description : 'Database host:',
		required : true,
		default : 'localhost'
	},

	dbName : {
		name : 'dbName',
		description : 'Database name:',
		required : true
	},

	dbUser : {
		name : 'dbUser',
		description : 'Database user:',
		required : true
	},

	dbPass : {
		name : 'dbPass',
		description : 'Database password:',
		required : true
	},

	useGit : {
		name : 'useGit',
		description : 'Use Git?',
		default : 'N',
		pattern : boolRegex,
		before : boolFilter
	},

	submodule : {
		name : 'submodule',
		description : 'Would you like to install WordPress as a submodule?',
		default : 'N',
		pattern : boolRegex,
		before : boolFilter
	},

	customDirs : {
		name : 'customDirs',
		description : 'Would you like to install WordPress with the custom directory structure?',
		default : 'N',
		pattern : boolRegex,
		before : boolFilter
	},

	wpDir : {
		name : 'wpDir',
		description : 'WordPress install directory:',
		required : true,
		default : 'wordpress'
	},

	contentDir : {
		name : 'contentDir',
		description : 'WordPress content directory:',
		required : true,
		default : 'content'
	},

	ignoreWPCore : {
		name : 'ignoreWPCore',
		description : 'Add WordPress Core files to .gitignore?',
		default : 'N',
		required : true,
		pattern : boolRegex,
		before : boolFilter
	},

	theme : {
		name : 'theme',
		description : 'Install a custom theme?',
		default : 'Y',
		pattern : boolRegex,
		before : boolFilter
	},

	themeDir : {
		name : 'themeDir',
		description : 'Destination directory (ex. twentytwelve):',
		required : true
	},

	themeType : {
		name : 'themeType',
		description : 'Theme source type (git/tar):',
		required : true,
		pattern : /^(?:git|tar)$/,
		default : 'git',
	},

	themeGitUser : {
		name : 'user',
		description : 'GitHub username:',
		required : true,
		default : 'wesleytodd'
	},

	themeGitRepo : {
		name : 'repo',
		description : 'GitHub repository name:',
		required : true,
		default : 'YeoPress'
	},

	themeGitBranch : {
		name : 'branch',
		description : 'Repository branch:',
		required : true,
		default : 'template'
	},

	themeTarUrl : {
		name : 'tarballUrl',
		description : 'Remote tarball url (ex. https://github.com/user/repo/tarball/master):',
		required : true
	},

	useVagrant : {
		name : 'useVagrant',
		description : 'Use Vagrant?',
		required : true,
		advanced : true,
		default : 'N',
		pattern : boolRegex,
		before : boolFilter
	},

	correct : {
		name : 'correct',
		description : 'Does everything look correct?',
		default : 'Y',
		pattern : boolRegex,
		before : boolFilter
	}

};
