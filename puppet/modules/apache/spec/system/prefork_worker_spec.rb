require 'spec_helper_system'

case node.facts['osfamily']
when 'RedHat'
  servicename = 'httpd'
when 'Debian'
  servicename = 'apache2'
else
  raise Error, "Unconfigured OS for apache service on #{node.facts['osfamily']}"
end

describe 'apache::mod::worker class' do
  describe 'running puppet code' do
    # Using puppet_apply as a helper
    it 'should work with no errors' do
      pp = <<-EOS
        class { 'apache':
          mpm_module => 'worker',
        }
      EOS

      # Run it twice and test for idempotency
      puppet_apply(pp) do |r|
        r.exit_code.should_not == 1
        r.refresh
        r.exit_code.should be_zero
      end
    end
  end

  describe service(servicename) do
    it { should be_running }
    it { should be_enabled }
  end
end

describe 'apache::mod::prefork class' do
  describe 'running puppet code' do
    # Using puppet_apply as a helper
    it 'should work with no errors' do
      pp = <<-EOS
        class { 'apache':
          mpm_module => 'prefork',
        }
      EOS

      # Run it twice and test for idempotency
      puppet_apply(pp) do |r|
        r.exit_code.should_not == 1
        r.refresh
        r.exit_code.should be_zero
      end
    end
  end

  describe service(servicename) do
    it { should be_running }
    it { should be_enabled }
  end
end
