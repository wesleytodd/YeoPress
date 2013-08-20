## Contributions

Contributing to YeoPress is simple.  A Vagrant configuration is bundled with these files, so to get a test server up and running requires a single command.  Make sure you have VirtualBox and Vagrant installed, then run:

	$ vagrant up

Vagrant will provision a new virtual machine, setup everything you need to run WordPress and Yeoman.  The virtual machine has port `8080` forwarding to the test site which is located in `test/site`.  So to check things in the browser, you simply open `http://localhost:8080` and you should see your WP install.

## Pull Requests

Please make all pull requests to the develop branch.  Example process for making a PR:

1. Fork and clone repo
2. `$ git co -b feature-my-awesome-thing`
3. Makes changes and commit
4. Push changes to GitHub
5. Create PR from `feature-my-awesome-thing` on your repo to `develop` on the main repo
6. Celebrate for giving back to OSS!!
