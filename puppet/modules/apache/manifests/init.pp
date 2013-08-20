class apache 
{      
    package 
    { 
        "apache2":
            ensure  => present,
            require => Exec['apt-get update']
    }
    
    service 
    { 
        "apache2":
            ensure      => running,
            enable      => true,
            require     => Package['apache2'],
            subscribe   => [
                File["/etc/apache2/mods-enabled/rewrite.load"],
                File["/etc/apache2/sites-available/default.conf"]
            ],
    }

    file 
    { 
        "/etc/apache2/mods-enabled/rewrite.load":
            ensure  => link,
            target  => "/etc/apache2/mods-available/rewrite.load",
            require => Package['apache2'],
    }

    file 
    { 
        "/etc/apache2/sites-available/default.conf":
            ensure  => present,
            owner => root, group => root,
            source  => "/vagrant/puppet/templates/vhost",
            require => Package['apache2'],
    }

    exec 
    { 
        'sudo a2ensite default.conf':
            require => Package['apache2'],
    }
}
