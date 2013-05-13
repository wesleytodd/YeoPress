var spawn = require('../util/spawn');

spawn('ls', ['-lah'], {
	start : 'Start',
	error : 'Error',
	success : 'Success'
}).stdout.on('data', function(data) {
	console.log('' + data);
});
