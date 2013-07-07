# Default path
Exec 
{
  path => ["/usr/bin", "/bin", "/usr/sbin", "/sbin", "/usr/local/bin", "/usr/local/sbin"]
}

exec 
{ 
    'apt-get update':
        command => '/usr/bin/apt-get update',
        require => Exec['add php54 apt-repo']
}

package 
{ 
	"make":
		ensure  => present,
		require => Exec['apt-get update']
}

package 
{ 
	"build-essential":
		ensure  => present,
		require => Exec['apt-get update']
}

exec
{
	"yo":
		command => "sudo npm install -g yo",
		require => Exec['make-install-node'],
		timeout => 0
}

exec
{
	"link-yeopress":
		cwd => '/home/vagrant/generator-wordpress',
		command => "sudo npm link",
		require => Exec['yo']
}

include bootstrap
include apache
include php54
include php
include mysql
include git
include nodejs
