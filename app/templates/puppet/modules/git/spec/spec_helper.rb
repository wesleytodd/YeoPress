require 'puppetlabs_spec_helper/module_spec_helper'

Puppet::Util::Log.level = :warning
Puppet::Util::Log.newdestination(:console)
