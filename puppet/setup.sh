#!/usr/bin/env bash

echo America/Chicago | sudo tee /etc/timezone && sudo dpkg-reconfigure --frontend noninteractive tzdata

sudo apt-get update
sudo apt-get install -yq git apache2 libapache2-mod-php5 libapache2-mod-auth-mysql php5-mysql make build-essential
sudo aptitude install mysql-server
#
#sudo cp /vagrant/vagrant/templates/ports.conf /etc/apache2/ports.conf
#sudo cp /vagrant/vagrant/templates/vhost /etc/apache2/sites-available/
#sudo a2ensite vhost
#sudo a2dissite defaut
#sudo a2enmod rewrite ssl
#sudo service apache2 restart
#
#git clone https://github.com/joyent/node.git node-source
#cd node-source
#git checkout v0.10.10
#./configure
#make
#sudo make install
#
#sudo npm install -g yo
#
#cd ~/generator-wordpress
#sudo npm link
