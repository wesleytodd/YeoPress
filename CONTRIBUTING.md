## Contributions

Contributing to YeoPress is simple.  A Vargrant configuration is bundled with these files, so to get a test server up and running requires a single command.  Make sure you have VirtualBox and Vagrant installed, then run:

	$ vagrant up

Vagrant will provision a new virtual machine, setup everything you need to run WordPress and Yeoman.  The virtual machine has port `8080` forwarding to the test site which is located in `test/site`.  So to check things in the browser, you an simple open `http://localhost:8080` and you should see your WP install.


