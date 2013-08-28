define apache::namevirtualhost {
  $addr_port = $name
  include apache::params

  # Template uses: $addr_port
  concat::fragment { "NameVirtualHost ${addr_port}":
    target  => $apache::params::ports_file,
    content => template('apache/namevirtualhost.erb'),
  }
}
