require 'facter'
Facter.add("last_run") do
  setcode do
    Facter::Util::Resolution.exec('date')
  end
end
