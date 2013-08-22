class apache::mod::status {
  apache::mod { 'status': }
  # Template uses no variables
  file { 'status.conf':
    ensure  => file,
    path    => "${apache::mod_dir}/status.conf",
    content => template('apache/mod/status.conf.erb'),
    require => Exec["mkdir ${apache::mod_dir}"],
    before  => File[$apache::mod_dir],
    notify  => Service['httpd'],
  }
}
