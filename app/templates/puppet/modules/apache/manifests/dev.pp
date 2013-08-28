class apache::dev {
  include apache::params
  $packages = $apache::params::dev_packages
  package { $packages:
    ensure  => present,
    require => Package['httpd'],
  }
}
