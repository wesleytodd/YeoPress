class apache::mod::worker (
  $startservers        = '2',
  $maxclients          = '150',
  $minsparethreads     = '25',
  $maxsparethreads     = '75',
  $threadsperchild     = '25',
  $maxrequestsperchild = '0',
  $serverlimit         = '25',
) {
  if defined(Class['apache::mod::prefork']) {
    fail('May not include both apache::mod::worker and apache::mod::prefork on the same node')
  }
  File {
    owner => 'root',
    group => 'root',
    mode  => '0644',
  }

  # Template uses:
  # - $startservers
  # - $maxclients
  # - $minsparethreads
  # - $maxsparethreads
  # - $threadsperchild
  # - $maxrequestsperchild
  # - $serverlimit
  file { "${apache::mod_dir}/worker.conf":
    ensure  => file,
    content => template('apache/mod/worker.conf.erb'),
    require => Exec["mkdir ${apache::mod_dir}"],
    before  => File[$apache::mod_dir],
    notify  => Service['httpd'],
  }

  case $::osfamily {
    'redhat': {
      file_line { '/etc/sysconfig/httpd worker enable':
        ensure => present,
        path   => '/etc/sysconfig/httpd',
        line   => 'HTTPD=/usr/sbin/httpd.worker',
        match  => '#?HTTPD=/usr/sbin/httpd.worker',
        notify => Service['httpd'],
      }
    }
    'debian': {
      file { "${apache::mod_enable_dir}/worker.conf":
        ensure  => link,
        target  => "${apache::mod_dir}/worker.conf",
        require => Exec["mkdir ${apache::mod_enable_dir}"],
        before  => File[$apache::mod_enable_dir],
        notify  => Service['httpd'],
      }
      package { 'apache2-mpm-worker':
        ensure => present,
      }
    }
    default: {
      fail("Unsupported osfamily ${::osfamily}")
    }
  }
}
