class bootstrap 
{
    group 
    { 
        "puppet": 
            ensure => "present", 
    }

    if $virtual == "virtualbox" and $fqdn == '' {
        $fqdn = "localhost"
    }
}
