define apache::mod (
  $package = undef,
  $lib = undef
) {
  if ! defined(Class['apache']) {
    fail('You must include the apache base class before using any apache defined resources')
  }

  $mod = $name
  #include apache #This creates duplicate resources in rspec-puppet
  $lib_path = $apache::params::lib_path
  $mod_dir = $apache::mod_dir

  # Determine if we have special lib
  $mod_libs = $apache::params::mod_libs
  $mod_lib = $mod_libs[$mod] # 2.6 compatibility hack
  if $lib {
    $lib_REAL = $lib
  } elsif $mod_lib {
    $lib_REAL = $mod_lib
  } else {
    $lib_REAL = "mod_${mod}.so"
  }

  # Determine if we have a package
  $mod_packages = $apache::params::mod_packages
  $mod_package = $mod_packages[$mod] # 2.6 compatibility hack
  if $package {
    $package_REAL = $package
  } elsif "${mod_package}" {
    $package_REAL = $mod_package
  }
  if $package_REAL {
    # $package_REAL may be an array
    package { $package_REAL:
      ensure  => present,
      require => Package['httpd'],
      before  => File["${mod_dir}/${mod}.load"],
    }
  }

  file { "${mod}.load":
    ensure  => file,
    path    => "${mod_dir}/${mod}.load",
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => "LoadModule ${mod}_module ${lib_path}/${lib_REAL}\n",
    require => [
      Package['httpd'],
      Exec["mkdir ${mod_dir}"],
    ],
    before  => File[$mod_dir],
    notify  => Service['httpd'],
  }

  if $::osfamily == 'Debian' {
    $enable_dir = $apache::mod_enable_dir
    file{ "${mod}.load symlink":
      ensure  => link,
      path    => "${enable_dir}/${mod}.load",
      target  => "${mod_dir}/${mod}.load",
      owner   => 'root',
      group   => 'root',
      mode    => '0644',
      require => [
        File["${mod}.load"],
        Exec["mkdir ${enable_dir}"],
      ],
      before  => File[$enable_dir],
      notify  => Service['httpd'],
    }
    # Each module may have a .conf file as well, which should be
    # defined in the class apache::mod::module
    # Some modules do not require this file.
    if defined(File["${mod}.conf"]) {
      file{ "${mod}.conf symlink":
        ensure  => link,
        path    => "${enable_dir}/${mod}.conf",
        target  => "${mod_dir}/${mod}.conf",
        owner   => 'root',
        group   => 'root',
        mode    => '0644',
        require => [
          File["${mod}.conf"],
          Exec["mkdir ${enable_dir}"],
        ],
        before  => File[$enable_dir],
        notify  => Service['httpd'],
      }
    }
  }
}
