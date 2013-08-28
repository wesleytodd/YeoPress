require 'spec_helper'

describe 'apache', :type => :class do
  context "on a Debian OS" do
    let :facts do
      {
        :osfamily               => 'Debian',
        :operatingsystemrelease => '6',
        :concat_basedir         => '/dne',
      }
    end
    it { should include_class("apache::params") }
    it { should contain_package("httpd") }
    it { should contain_user("www-data") }
    it { should contain_group("www-data") }
    it { should contain_service("httpd").with(
      'ensure'    => 'true',
      'enable'    => 'true',
      'subscribe' => 'Package[httpd]'
      )
    }
    it { should contain_file("/etc/apache2/sites-enabled").with(
      'ensure'  => 'directory',
      'recurse' => 'true',
      'purge'   => 'true',
      'notify'  => 'Service[httpd]',
      'require' => 'Package[httpd]'
      )
    }
    it { should contain_file("/etc/apache2/mods-enabled").with(
      'ensure'  => 'directory',
      'recurse' => 'true',
      'purge'   => 'true',
      'notify'  => 'Service[httpd]',
      'require' => 'Package[httpd]'
      )
    }
    it { should contain_file("/etc/apache2/mods-available").with(
      'ensure'  => 'directory',
      'recurse' => 'true',
      'purge'   => 'true',
      'notify'  => 'Service[httpd]',
      'require' => 'Package[httpd]'
      )
    }
    it { should contain_concat("/etc/apache2/ports.conf").with(
      'owner'   => 'root',
      'group'   => 'root',
      'mode'    => '0644',
      'notify'  => 'Service[httpd]'
      )
    }
    # Assert that load files are placed and symlinked for these mods, but no conf file.
    [
      'auth_basic',
      'authn_file',
      'authz_default',
      'authz_groupfile',
      'authz_host',
      'authz_user',
      'dav',
      'env'
    ].each do |modname|
      it { should contain_file("#{modname}.load").with(
        'path'   => "/etc/apache2/mods-available/#{modname}.load",
        'ensure' => 'file'
      ) }
      it { should contain_file("#{modname}.load symlink").with(
        'path'   => "/etc/apache2/mods-enabled/#{modname}.load",
        'ensure' => 'link',
        'target' => "/etc/apache2/mods-available/#{modname}.load"
      ) }
      it { should_not contain_file("#{modname}.conf") }
      it { should_not contain_file("#{modname}.conf symlink") }
    end

    # Assert that both load files and conf files are placed and symlinked for these mods
    [
      'alias',
      'autoindex',
      'dav_fs',
      'deflate',
      'dir',
      'mime',
      'negotiation',
      'setenvif',
      'status',
    ].each do |modname|
      it { should contain_file("#{modname}.load").with(
        'path'   => "/etc/apache2/mods-available/#{modname}.load",
        'ensure' => 'file'
      ) }
      it { should contain_file("#{modname}.load symlink").with(
        'path'   => "/etc/apache2/mods-enabled/#{modname}.load",
        'ensure' => 'link',
        'target' => "/etc/apache2/mods-available/#{modname}.load"
      ) }
      it { should contain_file("#{modname}.conf").with(
        'path'   => "/etc/apache2/mods-available/#{modname}.conf",
        'ensure' => 'file'
      ) }
      it { should contain_file("#{modname}.conf symlink").with(
        'path'   => "/etc/apache2/mods-enabled/#{modname}.conf",
        'ensure' => 'link',
        'target' => "/etc/apache2/mods-available/#{modname}.conf"
      ) }
    end
  end
  context "on a RedHat 5 OS" do
    let :facts do
      {
        :osfamily               => 'RedHat',
        :operatingsystemrelease => '5',
        :concat_basedir         => '/dne',
      }
    end
    it { should include_class("apache::params") }
    it { should contain_package("httpd") }
    it { should contain_user("apache") }
    it { should contain_group("apache") }
    it { should contain_service("httpd").with(
      'ensure'    => 'true',
      'enable'    => 'true',
      'subscribe' => 'Package[httpd]'
      )
    }
    it { should contain_file("/etc/httpd/conf.d").with(
      'ensure'  => 'directory',
      'recurse' => 'true',
      'purge'   => 'true',
      'notify'  => 'Service[httpd]',
      'require' => 'Package[httpd]'
      )
    }
    it { should contain_concat("/etc/httpd/conf/ports.conf").with(
      'owner'   => 'root',
      'group'   => 'root',
      'mode'    => '0644',
      'notify'  => 'Service[httpd]'
      )
    }
    describe "Alternate confd/mod/vhosts directory" do
      let :params do
        {
          :vhost_dir => '/etc/httpd/site.d',
          :confd_dir => '/etc/httpd/conf.d',
          :mod_dir   => '/etc/httpd/mod.d',
        }
      end

      ['mod.d','site.d','conf.d'].each do |dir|
        it { should contain_file("/etc/httpd/#{dir}").with(
          'ensure'  => 'directory',
          'recurse' => 'true',
          'purge'   => 'true',
          'notify'  => 'Service[httpd]',
          'require' => 'Package[httpd]'
        ) }
      end

      # Assert that load files are placed for these mods, but no conf file.
      [
        'auth_basic',
        'authn_file',
        'authz_default',
        'authz_groupfile',
        'authz_host',
        'authz_user',
        'dav',
        'env',
      ].each do |modname|
        it { should contain_file("#{modname}.load").with_path(
          "/etc/httpd/mod.d/#{modname}.load"
        ) }
        it { should_not contain_file("#{modname}.conf").with_path(
          "/etc/httpd/mod.d/#{modname}.conf"
        ) }
      end

      # Assert that both load files and conf files are placed for these mods
      [
        'alias',
        'autoindex',
        'dav_fs',
        'deflate',
        'dir',
        'mime',
        'negotiation',
        'setenvif',
        'status',
      ].each do |modname|
        it { should contain_file("#{modname}.load").with_path(
          "/etc/httpd/mod.d/#{modname}.load"
        ) }
        it { should contain_file("#{modname}.conf").with_path(
          "/etc/httpd/mod.d/#{modname}.conf"
        ) }
      end

      it { should contain_file("/etc/httpd/conf/httpd.conf").with_content %r{^Include /etc/httpd/conf\.d/\*\.conf$} }
      it { should contain_file("/etc/httpd/conf/httpd.conf").with_content %r{^Include /etc/httpd/site\.d/\*\.conf$} }
      it { should contain_file("/etc/httpd/conf/httpd.conf").with_content %r{^Include /etc/httpd/mod\.d/\*\.conf$} }
      it { should contain_file("/etc/httpd/conf/httpd.conf").with_content %r{^Include /etc/httpd/mod\.d/\*\.load$} }
    end

    describe "Alternate conf.d directory" do
      let :params do
        { :confd_dir => '/etc/httpd/special_conf.d' }
      end

      it { should contain_file("/etc/httpd/special_conf.d").with(
        'ensure'  => 'directory',
        'recurse' => 'true',
        'purge'   => 'true',
        'notify'  => 'Service[httpd]',
        'require' => 'Package[httpd]'
      ) }
    end

    describe "Alternate mpm_modules" do
      context "when declaring mpm_module is false" do
        let :params do
          { :mpm_module => false }
        end
        it 'should not declare mpm modules' do
          should_not contain_class('apache::mod::prefork')
          should_not contain_class('apache::mod::worker')
        end
      end
      context "when declaring mpm_module => prefork" do
        let :params do
          { :mpm_module => 'prefork' }
        end
        it { should contain_class('apache::mod::prefork') }
        it { should_not contain_class('apache::mod::worker') }
      end
      context "when declaring mpm_module => worker" do
        let :params do
          { :mpm_module => 'worker' }
        end
        it { should contain_class('apache::mod::worker') }
        it { should_not contain_class('apache::mod::prefork') }
      end
      context "when declaring mpm_module => breakme" do
        let :params do
          { :mpm_module => 'breakme' }
        end
        it { expect { should contain_class('apache::params') }.to raise_error Puppet::Error, /does not match/ }
      end
    end

    describe "different templates for httpd.conf" do
      context "with default" do
        let :params do
          { :conf_template => 'apache/httpd.conf.erb' }
        end
        it { should contain_file("/etc/httpd/conf/httpd.conf").with_content %r{^# Security\n} }
      end
      context "with non-default" do
        let :params do
          { :conf_template => 'site_apache/fake.conf.erb' }
        end
        it { should contain_file("/etc/httpd/conf/httpd.conf").with_content %r{^Fake template for rspec.$} }
      end
    end
  end
end
