var git = require('../util/git');

var init = git.init();

init.on('close', function() {
	var checkout = git.checkout(['-b', 'test']);
	checkout.on('close', function() {
		var add = git.addAllAndCommit('Test');
		add.on('close', function() {
			var sub = git.submoduleAddInitAndUpdate('git@github.com:wesleytodd/Thoughts.git', 'thoughts');
			sub.on('close', function() {
				console.log('All working');
			});
		});
	})
});
