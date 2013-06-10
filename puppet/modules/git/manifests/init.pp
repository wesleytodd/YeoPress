class git
{
	package
	{
		"git":
			ensure => present,
			require => Exec['apt-get update']
	}
}
