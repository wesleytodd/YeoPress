require.config({
	"baseUrl": "<%= userInput.contentDir %>/themes/<%= userInput.themeDir %>/js",
	"paths": {
		"jquery": "vendor/jquery/jquery"
	}
});

require(['jquery'], function($) {
	console.log('Working!!');
});
