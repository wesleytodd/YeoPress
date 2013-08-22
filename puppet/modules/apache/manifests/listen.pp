define apache::listen {
  $listen_addr_port = $name
  include apache::params

  # Template uses: $listen_addr_port
  concat::fragment { "Listen ${listen_addr_port}":
    target  => $apache::params::ports_file,
    content => template('apache/listen.erb'),
  }
}
