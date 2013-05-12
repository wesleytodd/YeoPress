# YeoPress Default Theme

This base theme is packed full of goodies to get your WordPress development process off the ground.  Not only does it come with a decent amount of WP Theme files, it also gets you setup with a `Gruntfile` with some goodies like LiveReload, Sass compilation and RequireJS support.

Once you have run the setup process with YeoPress, you are ready to start working with your theme.  So change directory into the theme directory and run grunt:

	$ cd wp-content/themes/your-theme-name-chosen-at-setup
	$ grunt

This will fire up the watch task which will listen for changes in your files and trigger the appropriate update tasks and will reload the browser via LiveReload.

## RequireJS

This theme integrates RequireJS for Javascript dependency management and lazy-loading.  There are two tasks built into the `Gruntfile` to help manage and build your require configuration: `bower` & `requirejs`.

### Bower Task

	$ grunt bower

The `bower` task will take any packages installed via Bower, and add them to the require config.  There is one caveat at the moment, because the `Gruntfile` is in the theme and not in the root of the site, the `baseDir` setting causes this task to build incorrect paths.  All that needs to be done is to remove the initial `../`'s that are added.  For example, here is the config after running the task:

	"baseUrl": "content/themes/yeopress/js",
	"paths": {
		"jquery": "../../../../js/vendor/jquery/jquery"
	}

What we really wanted was just the part that reads `vendor/jquery/jquery`, so just remove the part we don't need and you will be good to go:

	"baseUrl": "content/themes/yeopress/js",
	"paths": {
		"jquery": "vendor/jquery/jquery"
	}

### RequireJS Task

	$ grunt requirejs

The second task, `requirejs` is used to build an optimized require file.  By default the optimized file is output to `js/optimized.js`, but this can be changed in the `Gruntfile`.  For more information on how to configure this setting see [here](https://npmjs.org/package/grunt-contrib-requirejs) and [here](http://requirejs.org/docs/optimization.html).

## Build Task

	$ grunt build

This task builds an optimized version of the theme for production.  It runs the following tasks:

- jshint
- sass:production
- imagemin:production
- svgmin:production
- requirejs:production

For the image min tasks, the files are saved directly over the original files.  The sass production builds minified css for the live site in the css directory.  The only one that will take some configuration and a change to your php is the requirejs task.  This task generates optimized files using the `r.js` tool, and comes packaged to output one file called `optimized.min.js` which you would then need to enqueue through the WordPress `functions.php` file.
