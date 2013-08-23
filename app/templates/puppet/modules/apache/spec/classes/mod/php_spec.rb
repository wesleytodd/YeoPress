describe 'apache::mod::php', :type => :class do
  describe "on a Debian OS" do
    let :facts do
      {
        :osfamily               => 'Debian',
        :operatingsystemrelease => '6',
        :concat_basedir         => '/dne',
      }
    end
    context "with mpm_module => prefork" do
      let :pre_condition do
        'class { "apache": mpm_module => prefork, }'
      end
      it { should include_class("apache::params") }
      it { should contain_apache__mod('php5') }
      it { should contain_package("libapache2-mod-php5") }
      it { should contain_file("php5.load").with(
        :content => "LoadModule php5_module /usr/lib/apache2/modules/libphp5.so\n"
      ) }
    end
    context 'with mpm_module => worker' do
      let :pre_condition do
        'class { "apache": mpm_module => worker, }'
      end
      it 'should raise an error' do
        expect { subject.should contain_apache__mod('php5') }.to raise_error Puppet::Error, /mpm_module => 'prefork'/
      end
    end
  end
  describe "on a RedHat OS" do
    let :facts do
      {
        :osfamily               => 'RedHat',
        :operatingsystemrelease => '6',
        :concat_basedir         => '/dne',
      }
    end
    context "with default params" do
      let :pre_condition do
        'class { "apache": }'
      end
      it { should include_class("apache::params") }
      it { should contain_apache__mod('php5') }
      it { should contain_package("php") }
      it { should contain_file("php5.load").with(
        :content => "LoadModule php5_module modules/libphp5.so\n"
      ) }
    end
    context "with mpm_module => prefork" do
      let :pre_condition do
        'class { "apache": mpm_module => prefork, }'
      end
      it { should include_class("apache::params") }
      it { should contain_apache__mod('php5') }
      it { should contain_package("php") }
      it { should contain_file("php5.load").with(
        :content => "LoadModule php5_module modules/libphp5.so\n"
      ) }
    end
  end
end
