# Manage user gitconfig.
#
# See git-config (1) for more details.
#
# Parameters
#
#  [*ensure*]  - Set or destroy the .gitconfig file. (present|absent)
#  [*root*]    - The root directory in which to place .gitconfig. Default /home/USER.
#   *user*     - The user in question.
#  [*group*]   - The user's primary group. Default USER.
#  [*email*]   - The user's email address. Default USER@FQDN
#   *realname* - The user's 'real' name. Default USER
#
define git::resource::config($ensure=file, $root="/home/$user", $user, $group=$user, $email="$user@$fqdn", $realname=$user) {
  file { "$root/.gitconfig":
    ensure => $ensure,
    owner => $user,
    group => $group,
    content => template('git/gitconfig.erb'),
    require => [File[$root], User[$user]],
  }
}
