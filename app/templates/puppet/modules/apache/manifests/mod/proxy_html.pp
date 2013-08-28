class apache::mod::proxy_html {
  Class['apache::mod::proxy'] -> Class['apache::mod::proxy_html']
  Class['apache::mod::proxy_http'] -> Class['apache::mod::proxy_html']
  apache::mod { 'proxy_html': }
  case $::osfamily {
    'RedHat': {
      apache::mod { 'xml2enc': }
    }
    'Debian': {
      $proxy_html_loadfiles = $apache::params::distrelease ? {
        '6'     => '/usr/lib/libxml2.so.2',
        default => "/usr/lib/${::hardwaremodel}-linux-gnu/libxml2.so.2",
      }
    }
  }
  # Template uses $icons_path
  file { 'proxy_html.conf':
    ensure  => file,
    path    => "${apache::mod_dir}/proxy_html.conf",
    content => template('apache/mod/proxy_html.conf.erb'),
    require => Exec["mkdir ${apache::mod_dir}"],
    before  => File[$apache::mod_dir],
    notify  => Service['httpd'],
  }
}
