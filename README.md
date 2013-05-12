![image](http://wesleytodd.com/images/yeopress.jpg)

# YeoPress

The officially un-official [Yeoman](https://github.com/yeoman/yeoman) Generator for [WordPress](http://wordpress.org/).  I magically take you from scratching your head wondering where to start, all the way to running the famous 5-minute install.  I have configuration options that will WOW you.  If you use Git, I can *git* you off the ground with WordPress as a submodule just by following a couple of prompts.  Have a custom base theme you always start your projects off with?  You can install that to, either stright from GitHub or by pointing me to a tarball.  Other things I do:

- Custom directory configuration
- Install WordPress as a Git submodule for easy version controled updates
- Theme init hook for when you install a new theme
- Permission setting on install
- Create your database, all you have to do is make me a user
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

## Versions

- **1.0.0:** Re-written from the ground up to be more flexiable.  Refactored checks for database existance, improved the theme installation process, added a separate theme install generator.  There are some API changes that are not reflected in the videos, but they should be minimal.
- **0.2.7:** Added version question.
- **0.2.6:** Mostly Bug fixes.
- **0.2.5:** Fixed gitignore issue with npm.
- **0.2.4:** Added database creation check and changed theme setup process.
- **0.2.3:** Warnings were halting execution, fixed that.
- **0.2.2:** Url bug in confirmation.

## License

Copyright (c) 2013, Wes Todd
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
