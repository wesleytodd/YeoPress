require 'spec_helper_system'

describe 'basic tests:' do
  # Using puppet_apply as a subject
  context puppet_apply 'notice("foo")' do
    its(:stdout) { should =~ /foo/ }
    its(:stderr) { should be_empty }
    its(:exit_code) { should be_zero }
  end
end

describe 'disable selinux:' do
  context puppet_apply '
  exec { "setenforce 0":
    path   => "/bin:/sbin:/usr/bin:/usr/sbin",
    onlyif => "which setenforce && getenforce | grep Enforcing",
  }
  ' do
    its(:stderr) { should be_empty }
    its(:exit_code) { should_not == 1 }
  end
end
