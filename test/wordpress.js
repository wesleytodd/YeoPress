var wordpress = require('../util/wordpress');

wordpress.getSaltKeys().on('end', function(keys) {
	console.log(keys);
});
wordpress.getCurrentVersion().on('close', function(ver) {
	console.log(ver);
});
wordpress.getDbCredentials().on('done', function(creds) {
	console.log(creds);
});
wordpress.getContentDir().on('done', function(dir) {
	console.log(dir);
});
wordpress.activateTheme('yeopress', function() {
	console.log(arguments);
});
