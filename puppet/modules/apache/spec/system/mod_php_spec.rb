require 'spec_helper_system'

describe 'apache::mod::php class' do
  let(:distro_commands) {
    YAML.load(File.read(File.dirname(__FILE__) + '/../fixtures/system/distro_commands.yaml'))
  }
  let(:os) {
    node.facts['osfamily']
  }
  let(:mod_dir) {
    case node.facts['osfamily']
    when 'Debian'
      '/etc/apache2/mods-available'
    when 'RedHat'
      '/etc/httpd/conf.d'
    end
  }
  let(:vhost_dir) {
    case node.facts['osfamily']
    when 'Debian'
      '/etc/apache2/sites-enabled'
    when 'RedHat'
      '/etc/httpd/conf.d'
    end
  }

  context "default php config" do
    it 'should install php' do
      puppet_apply(%{
        class { 'apache':
          mpm_module => 'prefork',
        }
        class { 'apache::mod::php': }
        apache::vhost { 'php.example.com':
          port    => '80',
          docroot => '/var/www/php',
        }
        host { 'php.example.com': ip => '127.0.0.1', }
        file { '/var/www/php/index.php':
          ensure  => file,
          content => "<?php phpinfo(); ?>\\n",
        }
      }) { |r| [0,2].should include r.exit_code}

      if distro_commands.has_key?(os)
        shell(distro_commands[os]["service_check"]["command"]) do |r|
          r.exit_code.should == 0
        end
      end
    end

    it 'should have a default config file' do
      shell("/bin/cat #{mod_dir}/php5.conf") do |r|
        r.stdout.should =~ /^DirectoryIndex index\.php$/
        r.exit_code.should == 0
      end
    end

    it 'should answer to php.example.com' do
      shell("/usr/bin/curl php.example.com:80") do |r|
        r.stdout.should =~ /PHP Version/
        r.exit_code.should == 0
      end
    end
  end
end
