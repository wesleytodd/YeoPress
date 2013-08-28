describe 'apache::mod::prefork', :type => :class do
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
    it { should_not contain_apache__mod('prefork') }
    it { should contain_file("/etc/apache2/mods-available/prefork.conf").with_ensure('file') }
    it { should contain_file("/etc/apache2/mods-enabled/prefork.conf").with_ensure('link') }
    it { should contain_package("apache2-mpm-prefork") }
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
    it { should_not contain_apache__mod('prefork') }
    it { should contain_file("/etc/httpd/conf.d/prefork.conf").with_ensure('file') }
    it { should contain_file_line("/etc/sysconfig/httpd prefork enable").with({
      'require' => 'Package[httpd]',
    })
    }
  end
end
