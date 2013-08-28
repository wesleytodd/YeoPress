# Class: php::params
#
# This class defines default parameters used by the main module class php
# Operating Systems differences in names and paths are addressed here
#
# == Variables
#
# Refer to php class for the variables defined here.
#
# == Usage
#
# This class is not intended to be used directly.
# It may be imported or inherited by other classes
#
class php::params {

  ### Application related parameters
  $module_prefix = $::operatingsystem ? {
    /(?i:Ubuntu|Debian|Mint)/ => 'php5-',
    default                   => 'php-',
  }

  $package = $::operatingsystem ? {
    /(?i:Ubuntu|Debian|Mint)/ => 'php5',
    default                   => 'php',
  }

  # Here it's not the php service script name but 
  # web service name like apache2, nginx, etc.
  $service = $::operatingsystem ? {
    /(?i:Ubuntu|Debian|Mint)/ => 'apache2',
    default                   => 'httpd',
  }

  $config_dir = $::operatingsystem ? {
    /(?i:Ubuntu|Debian|Mint)/ => '/etc/php5',
    default                   => '/etc/php.d',
  }

  $config_file = $::operatingsystem ? {
    /(?i:Ubuntu|Debian|Mint)/ => '/etc/php5/php.ini',
    default => '/etc/php.ini',
  }

  $config_file_mode = $::operatingsystem ? {
    default => '0644',
  }

  $config_file_owner = $::operatingsystem ? {
    default => 'root',
  }

  $config_file_group = $::operatingsystem ? {
    default => 'root',
  }

  $data_dir = $::operatingsystem ? {
    default => '',
  }

  $log_dir = $::operatingsystem ? {
    default => '',
  }

  $log_file = $::operatingsystem ? {
    default => '',
  }

  # General Settings
  $my_class = ''
  $source = ''
  $source_dir = ''
  $source_dir_purge = false
  $template = ''
  $options = ''
  $version = 'present'
  $service_autorestart = true
  $absent = false

  ### General module variables that can have a site or per module default
  $puppi = false
  $puppi_helper = 'standard'
  $debug = false
  $audit_only = false

}
