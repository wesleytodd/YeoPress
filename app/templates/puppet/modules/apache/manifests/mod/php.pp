class apache::mod::php {
  if ! defined(Class['apache::mod::prefork']) {
    fail('apache::mod::php requires apache::mod::prefork; please enable mpm_module => \'prefork\' on Class[\'apache\']')
  }
  apache::mod { 'php5': }
  file { 'php5.conf':
    ensure  => file,
    path    => "${apache::mod_dir}/php5.conf",
    content => template('apache/mod/php5.conf.erb'),
    require => [
      Class['apache::mod::prefork'],
      Exec["mkdir ${apache::mod_dir}"],
    ],
    before  => File[$apache::mod_dir],
    notify  => Service['httpd'],
  }
}
