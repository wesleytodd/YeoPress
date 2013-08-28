class apache::mod::dav_svn {
  include apache::mod::dav
  apache::mod { 'dav_svn': }
}
