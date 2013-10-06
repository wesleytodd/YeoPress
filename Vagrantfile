# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  # Box Config
  config.vm.box = "precise32"
  config.vm.box_url = "http://files.vagrantup.com/precise32.box"

  # Apache
  config.vm.network :forwarded_port, guest: 80, host: 8089
  config.vm.network :forwarded_port, guest: 443, host: 4434
  # MySQL
  config.vm.network :forwarded_port, guest: 3306, host: 3307

  # Set Timezone
  config.vm.provision :shell,
    :inline => "echo America/Chicago | sudo tee /etc/timezone && sudo dpkg-reconfigure --frontend noninteractive tzdata"

  # Provision Box
  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = "puppet/manifests"
    puppet.manifest_file = "default.pp"
	puppet.module_path = "puppet/modules"
  end

  # Synced Folder
  config.vm.synced_folder "test/site", "/home/vagrant/www"
  config.vm.synced_folder ".", "/home/vagrant/generator-wordpress"

end
