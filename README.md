![image](http://wesleytodd.com/images/yeopress.jpg)

# YeoPress

The officially un-official [Yeoman](https://github.com/yeoman/yeoman) Generator for [WordPress](http://wordpress.org/).  I magically take you from scratching your head wondering where to start, all the way to running the famous 5-minute install.  I have configuration options that will WOW you.  If you use Git, I can *git* you off the ground with WordPress as a submodule just by following a couple of prompts.  Have a custom base theme you always start your projects off with?  You can install that to, either straight from GitHub or by pointing me to a tarball.  Other things I do:

- Custom directory configuration
- Install WordPress as a Git submodule for easy version controlled updates
- Theme init hook for when you install a new theme
- Permission setting on install
- Create your database, all you have to do is make me a user
- Built in Vagrant configuration
- *Coming Soon* Grunt tasks for some other WP tasks

## How To Use

If you do not already have the Yeoman toolset installed do so now, and might as well install me at the same time:

	npm install -g yo generator-wordpress

And run me:

	yo wordpress

Follow my prompts and WA-BAM....ASCII art!!!!

![image](http://wesleytodd.com/images/yeopress-ascii-art.png)

### Visual Learner??

[Watch the video](http://www.youtube.com/watch?v=Em-NMCgNhhY).

ADD Visual Learner?  [Watch the shorter video](http://www.youtube.com/watch?v=WSG0P5VpSUk).

[Also see the wiki](https://github.com/wesleytodd/YeoPress/wiki)

## Themes

Custom themes can be installed from GitHub or a Tarball.  Once installed, they are responsible for their own Gruntfile and related tasks.  A basic example template can be found in the [template branch](https://github.com/wesleytodd/YeoPress/tree/template) of this repo.  The example template comes with a few grunt tasks pre-configured:

- Regarde ([grunt-regarde](https://npmjs.org/package/grunt-regarde))
- Live Reload ([grunt-contrib-livereload](https://npmjs.org/package/grunt-contrib-livereload))
- Sass ([grunt-contrib-sass](https://npmjs.org/package/grunt-contrib-sass))
- JSHint ([grunt-contrib-jshint](https://npmjs.org/package/grunt-contrib-jshint))
- Bower ([grunt-bower-requirejs](https://npmjs.org/package/grunt-bower-requirejs))
- RequireJS ([grunt-contrib-requirejs](https://npmjs.org/package/grunt-contrib-requirejs))

[More information on themes](https://github.com/wesleytodd/YeoPress/wiki/Themes)
