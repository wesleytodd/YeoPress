class apache::mod::ssl (
  $ssl_compression = false,
) {
  $session_cache = $::osfamily ? {
    'debian' => '${APACHE_RUN_DIR}/ssl_scache(512000)',
    'redhat' => '/var/cache/mod_ssl/scache(512000)',
  }
  $ssl_mutex = $::osfamily ? {
    'debian' => 'file:${APACHE_RUN_DIR}/ssl_mutex',
    'redhat' => 'default',
  }
  apache::mod { 'ssl': }

  # Template uses $ssl_compression, $session_cache, $ssl_mutex
  file { 'ssl.conf':
    ensure  => file,
    path    => "${apache::mod_dir}/ssl.conf",
    content => template('apache/mod/ssl.conf.erb'),
    require => Exec["mkdir ${apache::mod_dir}"],
    before  => File[$apache::mod_dir],
    notify  => Service['httpd'],
  }
}
