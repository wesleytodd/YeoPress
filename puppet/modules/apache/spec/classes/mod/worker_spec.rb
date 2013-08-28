describe 'apache::mod::worker', :type => :class do
  let :pre_condition do
    'class { "apache": mpm_module => false, }'
  end
  context "on a Debian OS" do
    let :facts do
      {
        :osfamily               => 'Debian',
        :operatingsystemrelease => '6',
        :concat_basedir         => '/dne',
      }
    end
    it { should include_class("apache::params") }
    it { should_not contain_apache__mod('worker') }
    it { should contain_file("/etc/apache2/mods-available/worker.conf").with_ensure('file') }
    it { should contain_file("/etc/apache2/mods-enabled/worker.conf").with_ensure('link') }
    it { should contain_package("apache2-mpm-worker") }
  end
  context "on a RedHat OS" do
    let :facts do
      {
        :osfamily               => 'RedHat',
        :operatingsystemrelease => '6',
        :concat_basedir         => '/dne',
      }
    end
    it { should include_class("apache::params") }
    it { should_not contain_apache__mod('worker') }
    it { should contain_file("/etc/httpd/conf.d/worker.conf").with_ensure('file') }
    it { should contain_file_line("/etc/sysconfig/httpd worker enable") }
  end
end
