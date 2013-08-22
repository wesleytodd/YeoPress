class apache::mod::disk_cache {
  $cache_root = $::osfamily ? {
    'debian' => '/var/cache/apache2/mod_disk_cache',
    'redhat' => '/var/cache/mod_proxy',
  }
  Class['apache::mod::proxy'] -> Class['apache::mod::disk_cache']
  Class['apache::mod::cache'] -> Class['apache::mod::disk_cache']

  apache::mod { 'disk_cache': }
  # Template uses $cache_proxy
  file { 'disk_cache.conf':
    ensure  => file,
    path    => "${apache::mod_dir}/disk_cache.conf",
    content => template('apache/mod/disk_cache.conf.erb'),
    require => Exec["mkdir ${apache::mod_dir}"],
    before  => File[$apache::mod_dir],
    notify  => Service['httpd'],
  }
}
