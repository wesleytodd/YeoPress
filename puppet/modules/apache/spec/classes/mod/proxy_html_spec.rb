describe 'apache::mod::proxy_html', :type => :class do
  let :pre_condition do
    [
      'include apache',
      'include apache::mod::proxy',
      'include apache::mod::proxy_http',
    ]
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
    it { should contain_apache__mod('proxy_html') }
    it { should contain_package("libapache2-mod-proxy-html") }
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
    it { should contain_apache__mod('proxy_html') }
    it { should contain_package("mod_proxy_html") }
  end
end
