require 'spec_helper_system'

describe 'apache::vhost define' do
  let(:distro_commands) {
    YAML.load(File.read(File.dirname(__FILE__) + '/../fixtures/system/distro_commands.yaml'))
  }
  let(:os) {
    node.facts['osfamily']
  }
  let(:vhost_dir) {
    case node.facts['osfamily']
    when 'Debian'
      '/etc/apache2/sites-enabled'
    when 'RedHat'
      '/etc/httpd/conf.d'
    end
  }

  context "default vhost without ssl" do
    it 'should create a default vhost config' do
      puppet_apply(%{
        class { 'apache': }
      }) { |r| [0,2].should include r.exit_code}
    end

    it 'should have a default config file' do
      shell("/bin/cat #{vhost_dir}/15-default.conf") do |r|
        r.stdout.should =~ /^<VirtualHost \*:80>$/
        r.exit_code.should == 0
      end
    end

    it 'should not have a default ssl config file' do
      shell("/bin/cat #{vhost_dir}/15-default-ssl.conf") do |r|
        r.exit_code.should == 1
      end
    end
  end

  context 'default vhost with ssl' do
    it 'should create default vhost configs' do
      puppet_apply(%{
        class { 'apache':
          default_ssl_vhost => true,
        }
      }) { |r| [0,2].should include r.exit_code}
    end

    it 'should have a default config file' do
      shell("/bin/cat #{vhost_dir}/15-default.conf") do |r|
        r.stdout.should =~ /^<VirtualHost \*:80>$/
        r.exit_code.should == 0
      end
    end

    it 'should have a default ssl config file' do
      shell("/bin/cat #{vhost_dir}/15-default-ssl.conf") do |r|
        r.stdout.should =~ /^<VirtualHost \*:443>$/
        r.stdout.should =~ /SSLEngine on/
        r.exit_code.should == 0
      end
    end
  end

  context 'new vhost on port 80' do
    it 'should configure an apache vhost' do
      puppet_apply(%{
        class { 'apache': }
        apache::vhost { 'first.example.com':
          port    => '80',
          docroot => '/var/www/first',
        }
      }) { |r| [0,2].should include r.exit_code}

      shell("/bin/cat #{vhost_dir}/25-first.example.com.conf") do |r|
        r.stdout.should =~ /^<VirtualHost \*:80>$/
        r.stdout.should =~ /ServerName first\.example\.com$/
        r.exit_code.should == 0
      end
    end
  end

  context 'new vhost on port 80' do
    it 'should configure two apache vhosts' do
      puppet_apply(%{
        class { 'apache': }
        apache::vhost { 'first.example.com':
          port    => '80',
          docroot => '/var/www/first',
        }
        host { 'first.example.com': ip => '127.0.0.1', }
        file { '/var/www/first/index.html':
          ensure  => file,
          content => "Hello from first\\n",
        }
        apache::vhost { 'second.example.com':
          port    => '80',
          docroot => '/var/www/second',
        }
        host { 'second.example.com': ip => '127.0.0.1', }
        file { '/var/www/second/index.html':
          ensure  => file,
          content => "Hello from second\\n",
        }
      }) { |r| [0,2].should include r.exit_code}

      if distro_commands.has_key?(os)
        shell(distro_commands[os]["service_check"]["command"]) do |r|
          r.exit_code.should == 0
        end
      end
    end

    it 'should answer to first.example.com' do
      shell("/usr/bin/curl first.example.com:80") do |r|
        r.stdout.should == "Hello from first\n"
        r.exit_code.should == 0
      end
    end

    it 'should answer to second.example.com' do
      shell("/usr/bin/curl second.example.com:80") do |r|
        r.stdout.should == "Hello from second\n"
        r.exit_code.should == 0
      end
    end
  end
  context 'virtual_docroot hosting separate sites' do
    it 'should configure a vhost with VirtualDocumentRoot' do
      puppet_apply(%{
        class { 'apache': }
        apache::vhost { 'virt.example.com':
          vhost_name      => '*',
          serveraliases   => '*virt.example.com',
          port            => '80',
          docroot         => '/var/www/virt',
          virtual_docroot => '/var/www/virt/%1',
        }
        host { 'virt.example.com': ip => '127.0.0.1', }
        host { 'a.virt.example.com': ip => '127.0.0.1', }
        host { 'b.virt.example.com': ip => '127.0.0.1', }
        file { [ '/var/www/virt/a', '/var/www/virt/b', ]: ensure => directory, }
        file { '/var/www/virt/a/index.html': ensure  => file, content => "Hello from a.virt\\n", }
        file { '/var/www/virt/b/index.html': ensure  => file, content => "Hello from b.virt\\n", }
      }) { |r| [0,2].should include r.exit_code}

      if distro_commands.has_key?(os)
        shell(distro_commands[os]["service_check"]["command"]) do |r|
          r.exit_code.should == 0
        end
      end
    end

    it 'should answer to a.virt.example.com' do
      shell("/usr/bin/curl a.virt.example.com:80") do |r|
        r.stdout.should == "Hello from a.virt\n"
        r.exit_code.should == 0
      end
    end

    it 'should answer to b.virt.example.com' do
      shell("/usr/bin/curl b.virt.example.com:80") do |r|
        r.stdout.should == "Hello from b.virt\n"
        r.exit_code.should == 0
      end
    end
  end
end
