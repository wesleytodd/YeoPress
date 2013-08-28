# Define: php::pear::module
#
# Installs the defined php pear component
#
# Variables:
# [*use_package*]
#   (default="yes") - Tries to install pear module with the relevant package
#   If set to "no" it installs the module via pear command
#
# [*preferred_state*]
#   (default="stable") - Define which preferred state to use when installing
#   Pear modules via pear via command line (when use_package=no)
#
# [*alldeps*]
#   (default="false") - Define if all the available (optional) modules should
#   be installed. (when use_package=no)
#
# Usage:
# php::pear::module { packagename: }
# Example:
# php::pear::module { Crypt-CHAP: }
#
define php::pear::module ( 
  $service         = $php::service,
  $use_package     = 'yes',
  $preferred_state = 'stable',
  $alldeps         = false,
  ) {

  include php::pear

  case $use_package {
    yes: {
      package { "pear-${name}":
        name => $::operatingsystem ? {
          ubuntu  => "php-${name}",
          debian  => "php-${name}",
          default => "pear-${name}",
          },
        ensure => present,
        notify => Service[$service],
      }
    }
    default: {
      exec { "pear-${name}":
        command => $alldeps ? {
          true  => "pear -d preferred_state=${preferred_state} install --alldeps ${name}",
          false => "pear -d preferred_state=${preferred_state} install ${name}",
        },
        unless  => "pear info ${name}",
        path    => $php::pear::path,
        require => Package[$php::pear::package],
      }
    }
  } # End Case
  
}
