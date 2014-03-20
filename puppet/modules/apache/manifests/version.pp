# Class: apache::version
#
# Try to automatically detect the version by OS
#
class apache::version {
  case $::osfamily {
    'RedHat': {
      if ($::operatingsystem == 'Fedora' and $::operatingsystemrelease >= 18) or ($::operatingsystem != 'Fedora' and $::operatingsystemrelease >= 7) {
        $default = 2.4
      } else {
        $default = 2.2
      }
    }
    'Debian': {
      if $::operatingsystem == 'Ubuntu' and $::operatingsystemrelease >= 13.10 {
        $default = 2.4
      } else {
        $default = 2.2
      }
    }
    'FreeBSD': {
      $default = 2.2
    }
    default: {
      fail("Class['apache::version']: Unsupported osfamily: ${::osfamily}")
    }
  }
}
