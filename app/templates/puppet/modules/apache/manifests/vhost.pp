# Definition: apache::vhost
#
# This class installs Apache Virtual Hosts
#
# Parameters:
# - The $port to configure the host on
# - The $docroot provides the DocumentRoot variable
# - The $virtual_docroot provides VirtualDocumentationRoot variable
# - The $serveradmin will specify an email address for Apache that it will
#   display when it renders one of it's error pages
# - The $ssl option is set true or false to enable SSL for this Virtual Host
# - The $priority of the site
# - The $servername is the primary name of the virtual host
# - The $serveraliases of the site
# - The $options for the given vhost
# - The $override for the given vhost (list of AllowOverride arguments)
# - The $vhost_name for name based virtualhosting, defaulting to *
# - The $logroot specifies the location of the virtual hosts logfiles, default
#   to /var/log/<apache log location>/
# - The $access_log specifies if *_access.log directives should be configured.
# - The $ensure specifies if vhost file is present or absent.
# - The $request_headers is a list of RequestHeader statement strings as per http://httpd.apache.org/docs/2.2/mod/mod_headers.html#requestheader
# - $aliases is a list of Alias hashes for mod_alias as per http://httpd.apache.org/docs/current/mod/mod_alias.html
#   each statement is a hash in the form of { alias => '/alias', path => '/real/path/to/directory' }
# - $directories is a lost of hashes for creating <Directory> statements as per http://httpd.apache.org/docs/2.2/mod/core.html#directory
#   each statement is a hash in the form of { path => '/path/to/directory', <directive> => <value>}
#   see README.md for list of supported directives.
#
# Actions:
# - Install Apache Virtual Hosts
#
# Requires:
# - The apache class
#
# Sample Usage:
#
#  # Simple vhost definition:
#  apache::vhost { 'site.name.fqdn':
#    port => '80',
#    docroot => '/path/to/docroot',
#  }
#
#  # SSL vhost with non-SSL rewrite:
#  apache::vhost { 'site.name.fqdn':
#    port    => '443',
#    ssl     => true,
#    docroot => '/path/to/docroot',
#  }
#  apache::vhost { 'site.name.fqdn':
#    port          => '80',
#    rewrite_cond => '%{HTTPS} off',
#    rewrite_rule => '(.*) https://%{HTTPS_HOST}%{REQUEST_URI}',
#  }
#  apache::vhost { 'site.name.fqdn':
#    port            => '80',
#    docroot         => '/path/to/other_docroot',
#    custom_fragment => template("${module_name}/my_fragment.erb"),
#  }
#
define apache::vhost(
    $docroot,
    $virtual_docroot    = false,
    $port               = undef,
    $ip                 = undef,
    $ip_based           = false,
    $add_listen         = true,
    $docroot_owner      = 'root',
    $docroot_group      = 'root',
    $serveradmin        = false,
    $ssl                = false,
    $ssl_cert           = $apache::default_ssl_cert,
    $ssl_key            = $apache::default_ssl_key,
    $ssl_chain          = $apache::default_ssl_chain,
    $ssl_ca             = $apache::default_ssl_ca,
    $ssl_crl_path       = $apache::default_ssl_crl_path,
    $ssl_crl            = $apache::default_ssl_crl,
    $ssl_certs_dir      = $apache::params::ssl_certs_dir,
    $priority           = undef,
    $default_vhost      = false,
    $servername         = undef,
    $serveraliases      = [],
    $options            = ['Indexes','FollowSymLinks','MultiViews'],
    $override           = ['None'],
    $vhost_name         = '*',
    $logroot            = "/var/log/${apache::params::apache_name}",
    $access_log         = true,
    $access_log_file    = undef,
    $access_log_pipe    = undef,
    $access_log_format  = undef,
    $aliases            = undef,
    $directories        = undef,
    $error_log          = true,
    $error_log_file     = undef,
    $error_log_pipe     = undef,
    $scriptalias        = undef,
    $proxy_dest         = undef,
    $proxy_pass         = undef,
    $no_proxy_uris      = [],
    $redirect_source    = '/',
    $redirect_dest      = undef,
    $redirect_status    = undef,
    $rack_base_uris     = undef,
    $request_headers    = undef,
    $rewrite_rule       = undef,
    $rewrite_base       = undef,
    $rewrite_cond       = undef,
    $setenv             = [],
    $setenvif           = [],
    $block              = [],
    $ensure             = 'present',
    $custom_fragment    = undef
  ) {
  # The base class must be included first because it is used by parameter defaults
  if ! defined(Class['apache']) {
    fail('You must include the apache base class before using any apache defined resources')
  }
  $apache_name = $apache::params::apache_name

  validate_re($ensure, '^(present|absent)$',
  "${ensure} is not supported for ensure.
  Allowed values are 'present' and 'absent'.")
  validate_bool($ip_based)
  validate_bool($access_log)
  validate_bool($error_log)
  validate_bool($ssl)
  validate_bool($default_vhost)

  if $access_log_file and $access_log_pipe {
    fail("Apache::Vhost[${name}]: 'access_log_file' and 'access_log_pipe' cannot be defined at the same time")
  }

  if $error_log_file and $error_log_pipe {
    fail("Apache::Vhost[${name}]: 'error_log_file' and 'error_log_pipe' cannot be defined at the same time")
  }

  if $ssl {
    include apache::mod::ssl
  }

  if $virtual_docroot {
    include apache::mod::vhost_alias
  }

  # This ensures that the docroot exists
  # But enables it to be specified across multiple vhost resources
  if ! defined(File[$docroot]) {
    file { $docroot:
      ensure  => directory,
      owner   => $docroot_owner,
      group   => $docroot_group,
      require => Package['httpd'],
    }
  }

  # Same as above, but for logroot
  if ! defined(File[$logroot]) {
    file { $logroot:
      ensure  => directory,
      require => Package['httpd'],
    }
  }

  # Open listening ports if they are not already
  if $servername {
    $servername_real = $servername
  } else {
    $servername_real = $name
  }

  # Define log file names
  if $access_log_file {
    $access_log_destination = "${logroot}/${access_log_file}"
  } elsif $access_log_pipe {
    $access_log_destination = "\"${access_log_pipe}\""
  } else {
    if $ssl {
      $access_log_destination = "${logroot}/${servername_real}_access_ssl.log"
    } else {
      $access_log_destination = "${logroot}/${servername_real}_access.log"
    }
  }

  if $error_log_file {
    $error_log_destination = "${logroot}/${error_log_file}"
  } elsif $error_log_pipe {
    $error_log_destination = "\"${error_log_pipe}\""
  } else {
    if $ssl {
      $error_log_destination = "${logroot}/${servername_real}_error_ssl.log"
    } else {
      $error_log_destination = "${logroot}/${servername_real}_error.log"
    }
  }

  # Set access log format
  if $access_log_format {
    $_access_log_format = "\"${access_log_format}\""
  } else {
    $_access_log_format = 'combined'
  }


  if $ip {
    if $port {
      $listen_addr_port = "${ip}:${port}"
      $nvh_addr_port = "${ip}:${port}"
    } else {
      $nvh_addr_port = $ip
      if ! $servername and ! $ip_based {
        fail("Apache::Vhost[${name}]: must pass 'ip' and/or 'port' parameters for name-based vhosts")
      }
    }
  } else {
    if $port {
      $listen_addr_port = $port
      $nvh_addr_port = "${vhost_name}:${port}"
    } else {
      $nvh_addr_port = $name
      if ! $servername {
        fail("Apache::Vhost[${name}]: must pass 'ip' and/or 'port' parameters, and/or 'servername' parameter")
      }
    }
  }
  if $add_listen {
    if $ip and defined(Apache::Listen[$port]) {
      fail("Apache::Vhost[${name}]: Mixing IP and non-IP Listen directives is not possible; check the add_listen parameter of the apache::vhost define to disable this")
    }
    if ! defined(Apache::Listen[$listen_addr_port]) and $listen_addr_port {
      apache::listen { $listen_addr_port: }
    }
  }
  if ! $ip_based {
    if ! defined(Apache::Namevirtualhost[$nvh_addr_port]) {
      apache::namevirtualhost { $nvh_addr_port: }
    }
  }

  # Load mod_rewrite if needed and not yet loaded
  if $rewrite_rule {
    if ! defined(Apache::Mod['rewrite']) {
      apache::mod { 'rewrite': }
    }
  }

  # Load mod_alias if needed and not yet loaded
  if $scriptalias or ($redirect_source and $redirect_dest) {
    if ! defined(Class['apache::mod::alias']) {
      include apache::mod::alias
    }
  }

  # Load mod_proxy if needed and not yet loaded
  if ($proxy_dest or $proxy_pass) {
    if ! defined(Class['apache::mod::proxy']) {
      include apache::mod::proxy
    }
  }

  # Load mod_passenger if needed and not yet loaded
  if $rack_base_uris {
    if ! defined(Class['apache::mod::passenger']) {
      include apache::mod::passenger
    }
  }

  # Configure the defaultness of a vhost
  if $priority {
    $priority_real = $priority
  } elsif $default_vhost {
    $priority_real = '10'
  } else {
    $priority_real = '25'
  }

  # Check if mod_headers is required to process $request_headers
  if $request_headers {
    if ! defined(Class['apache::mod::headers']) {
      include apache::mod::headers
    }
  }

  ## Apache include does not always work with spaces in the filename
  $filename = regsubst($name, ' ', '_', 'G')

  ## Create a default directory list if none defined
  if $directories {
    $_directories = $directories
  } else {
    $_directories = [ {
      path           => $docroot,
      options        => $options,
      allow_override => $override,
      order          => 'allow,deny',
      allow          => 'from all',
    } ]
  }

  # Template uses:
  # - $nvh_addr_port
  # - $servername_real
  # - $serveradmin
  # - $docroot
  # - $virtual_docroot
  # - $options
  # - $override
  # - $logroot
  # - $name
  # - $aliases
  # - $_directories
  # - $access_log
  # - $access_log_destination
  # - $_access_log_format
  # - $error_log
  # - $error_log_destination
  # - $custom_fragment
  # block fragment:
  #   - $block
  # proxy fragment:
  #   - $proxy_dest
  #   - $no_proxy_uris
  # rack fragment:
  #   - $rack_base_uris
  # redirect fragment:
  #   - $redirect_source
  #   - $redirect_dest
  #   - $redirect_status
  # requestheader fragment:
  #   - $request_headers
  # rewrite fragment:
  #   - $rewrite_rule
  #   - $rewrite_base
  #   - $rewrite_cond
  # scriptalias fragment:
  #   - $scriptalias
  #   - $ssl
  # serveralias fragment:
  #   - $serveraliases
  # setenv fragment:
  #   - $setenv
  #   - $setenvif
  # ssl fragment:
  #   - $ssl
  #   - $ssl_cert
  #   - $ssl_key
  #   - $ssl_chain
  #   - $ssl_certs_dir
  #   - $ssl_ca
  #   - $ssl_crl
  #   - $ssl_crl_path
  file { "${priority_real}-${filename}.conf":
    ensure  => $ensure,
    path    => "${apache::vhost_dir}/${priority_real}-${filename}.conf",
    content => template('apache/vhost.conf.erb'),
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    require => [
      Package['httpd'],
      File[$docroot],
      File[$logroot],
    ],
    notify  => Service['httpd'],
  }
  if $::osfamily == 'Debian' {
    $vhost_enable_dir = $apache::vhost_enable_dir
    file{ "${priority_real}-${filename}.conf symlink":
      ensure  => link,
      path    => "${vhost_enable_dir}/${priority_real}-${filename}.conf",
      target  => "${apache::vhost_dir}/${priority_real}-${filename}.conf",
      owner   => 'root',
      group   => 'root',
      mode    => '0644',
      require => File["${priority_real}-${filename}.conf"],
      notify  => Service['httpd'],
    }
  }
}

