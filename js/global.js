require.config({
	baseUrl : '<%= contentDir %>/themes/<%= theme.dir %>/js'
});
require(['jquery'], function($) {
	console.log('Working!!');
});
