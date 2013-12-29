require.config({
	"baseUrl": "<%= conf.get('contentDir') %>/themes/<%= conf.get('themeDir') %>/js",
	"paths": {
		"jquery": "vendor/jquery/jquery"
	}
});

require(['jquery'], function($) {
	console.log('Working!!');
});
