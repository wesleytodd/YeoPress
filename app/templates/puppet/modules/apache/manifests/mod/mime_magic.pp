class apache::mod::mime_magic {
  apache::mod { 'mime_magic': }
  # Template uses no variables
  file { 'mime_magic.conf':
    ensure  => file,
    path    => "${apache::mod_dir}/mime_magic.conf",
    content => template('apache/mod/mime_magic.conf.erb'),
    require => Exec["mkdir ${apache::mod_dir}"],
    before  => File[$apache::mod_dir],
    notify  => Service['httpd'],
  }
}
