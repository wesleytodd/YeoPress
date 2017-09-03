## Contributions

Contributing to YeoPress is simple.  A Vagrant configuration is bundled with these files, so to get a test server up and running requires a single command.  Make sure you have VirtualBox and Vagrant installed, then run:

	$ vagrant up

Vagrant will provision a new virtual machine, and setup everything you need to run WordPress and Yeoman.

```
$ vagrant ssh
Welcome to your Vagrant-built virtual machine.
$ cd www
$ yo wordpress
```

The virtual machine has port `8080` forwarding to the test site which is located in `test/site`.  So to check things in the browser, you simply open `http://localhost:8080` and you should see your WP install.

If you prefer to work locally without Vagrant, you can link the cloned repository with npm:

```
$ git clone git@github.com:<Your User Name>/YeoPress.git generator-wordpress && cd generator-wordpress
$ sudo npm link
$ cd /path/to/where/you/want/to/test/run/the/generator && yo wordpress
```

Now any changes you make in to the generator will be instantly available when you run the generator.  Also, the `--verbose` flag is very helpful in diagnosing problems.

## Pull Requests

Please make all pull requests to the develop branch.  Example process for making a PR:

1. Fork and clone repo
2. `$ git co -b feature-my-awesome-thing`
3. Makes changes and commit
4. Push changes to GitHub
5. Create PR from `feature-my-awesome-thing` on your repo to `develop` on the main repo
6. Celebrate for giving back to OSS!!

## Contributing to theme

Please make all pull requests to the develop-theme branch.  Example process for making a PR:

1. Fork and clone repo
2. `$ git checkout develop-theme`
3. `$ git checkout -b feature-my-awesome-theme-thing`
4. Makes changes and commit
5. Push changes to GitHub
6. Create PR from `feature-my-awesome-thing` on your repo to `develop` on the main repo
7. Celebrate for giving back to OSS!!

To work on your changes, you will need to push your branch and point the generator at your fork:

```
[?] GitHub username: <Your User Name>
[?] GitHub repository name: YeoPress
[?] Repository branch: <Your Branch>
```
