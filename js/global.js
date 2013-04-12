require.config({
	"baseUrl": "<%= contentDir %>/themes/<%= theme.dir %>/js",
	"paths": {
		"jquery": "vendor/jquery/jquery"
	}
});

require(['jquery'], function($) {
	console.log('Working!!');
});
