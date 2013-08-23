require 'spec_helper_system'

describe 'apache class' do
  let(:distro_commands) {
    YAML.load(File.read(File.dirname(__FILE__) + '/../fixtures/system/distro_commands.yaml'))
  }
  let(:os) {
    node.facts['osfamily']
  }

  context 'default parameters' do
    # Using puppet_apply as a helper
    it 'should work with no errors' do
      pp = <<-EOS
      class { 'apache': }
      EOS

      # Run it twice and test for idempotency
      puppet_apply(pp) do |r|
        r.exit_code.should_not == 1
        r.refresh
        r.exit_code.should be_zero
      end
    end

    it 'should install apache' do
      if distro_commands.has_key?(os)
        shell(distro_commands[os]["package_check"]["command"]) do |r|
          r.stdout.should =~ distro_commands[os]['package_check']['stdout']
          r.exit_code.should == 0
        end
      end
    end

    it 'should start the apache service' do
      if distro_commands.has_key?(os)
        shell(distro_commands[os]["service_check"]["command"]) do |r|
          r.exit_code.should == 0
        end
      end
    end
  end

  context 'custom site/mod dir parameters' do
    # Using puppet_apply as a helper
    it 'should work with no errors' do
      pp = <<-EOS
      file { '/apache': ensure => directory, }
      class { 'apache':
        mod_dir   => '/apache/mods',
        vhost_dir => '/apache/vhosts',
      }
      EOS

      # Run it twice and test for idempotency
      puppet_apply(pp) do |r|
        r.exit_code.should_not == 1
        r.refresh
        r.exit_code.should be_zero
      end
    end

    it 'should start the apache service' do
      if distro_commands.has_key?(os)
        shell(distro_commands[os]["service_check"]["command"]) do |r|
          r.exit_code.should == 0
        end
      end
    end
  end
end
