var fs = require('fs'),
	wordpress = require('../util/wordpress');

wordpress.getLanguage('tmp', 'es_ES', function(err) {
	console.error(err);
	console.log('All done');
});

//wordpress.downloadLanguageFile('es_ES', 'admin', 'mo', function(err, res) {
//	if (err) return console.error(err);
//	var f = fs.createWriteStream('tmp/es_ES.mo');
//	res.pipe(f);
//});
//wordpress.getSaltKeys().on('end', function(keys) {
//	console.log(keys);
//});
//wordpress.getCurrentVersion().on('close', function(ver) {
//	console.log(ver);
//});
//wordpress.getDbCredentials().on('done', function(creds) {
//	console.log(creds);
//});
//wordpress.getContentDir().on('done', function(dir) {
//	console.log(dir);
//});
//wordpress.activateTheme('yeopress', function() {
//	console.log(arguments);
//});
