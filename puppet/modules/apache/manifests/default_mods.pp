class apache::default_mods (
  $all = true,
) {
  # These are modules required to run the default configuration.
  # They are not configurable at this time, so we just include
  # them to make sure it works.
  case $::osfamily {
    'redhat': {
      apache::mod { 'log_config': }
    }
    default: {}
  }
  apache::mod { 'authz_host': }

  # The rest of the modules only get loaded if we want all modules enabled
  if $all {
    case $::osfamily {
      'debian': {
        include apache::mod::reqtimeout
      }
      'redhat': {
        include apache::mod::cache
        include apache::mod::disk_cache
        include apache::mod::info
        include apache::mod::ldap
        include apache::mod::mime_magic
        include apache::mod::proxy
        include apache::mod::proxy_http
        include apache::mod::userdir
        include apache::mod::vhost_alias
        apache::mod { 'actions': }
        apache::mod { 'auth_digest': }
        apache::mod { 'authn_alias': }
        apache::mod { 'authn_anon': }
        apache::mod { 'authn_dbm': }
        apache::mod { 'authn_default': }
        apache::mod { 'authnz_ldap': }
        apache::mod { 'authz_dbm': }
        apache::mod { 'authz_owner': }
        apache::mod { 'expires': }
        apache::mod { 'ext_filter': }
        apache::mod { 'include': }
        apache::mod { 'logio': }
        apache::mod { 'proxy_ajp': }
        apache::mod { 'proxy_balancer': }
        apache::mod { 'proxy_connect': }
        apache::mod { 'proxy_ftp': }
        apache::mod { 'rewrite': }
        apache::mod { 'speling': }
        apache::mod { 'substitute': }
        apache::mod { 'suexec': }
        apache::mod { 'usertrack': }
        apache::mod { 'version': }
      }
      default: {}
    }
    case $apache::mpm_module {
      'prefork': {
        include apache::mod::cgi
      }
      'worker': {
        include apache::mod::cgid
      }
    }
    include apache::mod::alias
    include apache::mod::autoindex
    include apache::mod::dav
    include apache::mod::dav_fs
    include apache::mod::deflate
    include apache::mod::dir
    include apache::mod::mime
    include apache::mod::negotiation
    include apache::mod::setenvif
    include apache::mod::status
    apache::mod { 'auth_basic': }
    apache::mod { 'authn_file': }
    apache::mod { 'authz_default': }
    apache::mod { 'authz_groupfile': }
    apache::mod { 'authz_user': }
    apache::mod { 'env': }
  }
}
