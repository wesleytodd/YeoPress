#apache

####Table of Contents

1. [Overview - What is the Apache module?](#overview)
2. [Module Description - What does the module do?](#module-description)
3. [Setup - The basics of getting started with Apache](#setup)
    * [Beginning with Apache - Installation](#beginning-with-apache)
    * [Configure a Virtual Host - Basic options for getting started](#configure-a-virtual-host)
4. [Usage - The classes, defined types, and their parameters available for configuration](#usage)
    * [Classes and Defined Types](#classes-and-defined-types)
        * [Class: apache](#class-apache)
        * [Classes: apache::mod::*](#classes-apachemodname)
        * [Defined Type: apache::vhost](#defined-type-apachevhost)
    * [Virtual Host Examples - Demonstrations of some configuration options](#virtual-host-examples)
5. [Implementation - An under-the-hood peek at what the module is doing](#implementation)
    * [Classes and Defined Types](#classes-and-defined-types)
    * [Templates](#templates)
6. [Limitations - OS compatibility, etc.](#limitations)
7. [Development - Guide for contributing to the module](#development)
8. [Release Notes - Notes on the most recent updates to the module](#release-notes)

##Overview

The Apache module allows you to set up virtual hosts and manage web services with minimal effort.

##Module Description

Apache is a widely-used web server, and this module provides a simplified way of creating configurations to manage your infrastructure. This includes the ability to configure and manage a range of different virtual host setups, as well as a streamlined way to install and configure Apache modules.

##Setup

**What Apache affects:**

* configuration files and directories (created and written to)
    * **NOTE**: Configurations that are *not* managed by Puppet will be purged.
* package/service/configuration files for Apache
* Apache modules
* virtual hosts
* listened-to ports

###Beginning with Apache

To install Apache with the default parameters

    class { 'apache':  }

The defaults are determined by your operating system (e.g. Debian systems have one set of defaults, RedHat systems have another). These defaults will work well in a testing environment, but are not suggested for production. To establish customized parameters

    class { 'apache':
      default_mods => false,
      …
    }

###Configure a virtual host

Declaring the `apache` class will create a default virtual host by setting up a vhost on port 80, listening on all interfaces and serving `$apache::docroot`.

    class { 'apache': }

To configure a very basic, name-based virtual host

    apache::vhost { 'first.example.com':
      port    => '80',
      docroot => '/var/www/first',
    }

*Note:* The default priority is 15. If nothing matches this priority, the alphabetically first name-based vhost will be used. This is also true if you pass a higher priority and no names match anything else.

A slightly more complicated example, which moves the docroot owner/group

    apache::vhost { 'second.example.com':
      port          => '80',
      docroot       => '/var/www/second',
      docroot_owner => 'third',
      docroot_group => 'third',
    }

To set up a virtual host with SSL and default SSL certificates

    apache::vhost { 'ssl.example.com':
      port    => '443',
      docroot => '/var/www/ssl',
      ssl     => true,
    }

To set up a virtual host with SSL and specific SSL certificates

    apache::vhost { 'fourth.example.com':
      port     => '443',
      docroot  => '/var/www/fourth',
      ssl      => true,
      ssl_cert => '/etc/ssl/fourth.example.com.cert',
      ssl_key  => '/etc/ssl/fourth.example.com.key',
    }

To set up a virtual host with wildcard alias for subdomain mapped to same named directory 
`http://examle.com.loc => /var/www/example.com`

    apache::vhost { 'subdomain.loc':
      vhost_name => '*',
      port       => '80',
      virtual_docroot' => '/var/www/%-2+',
      docroot          => '/var/www',
      serveraliases    => ['*.loc',],
    }

To see a list of all virtual host parameters, [please go here](#defined-type-apachevhost). To see an extensive list of virtual host examples [please look here](#virtual-host-examples).

##Usage

###Classes and Defined Types

This module modifies Apache configuration files and directories and will purge any configuration not managed by Puppet. Configuration of Apache should be managed by Puppet, as non-puppet configuration files can cause unexpected failures.

It is possible to temporarily disable full Puppet management by setting the `purge_configs` parameter within the base `apache` class to 'false'. This option should only be used as a temporary means of saving and relocating customized configurations.

####Class: `apache`

The Apache module's primary class, `apache`, guides the basic setup of Apache on your system.

You may establish a default vhost in this class, the `vhost` class, or both. You may add additional vhost configurations for specific virtual hosts using a declaration of the `vhost` type.

**Parameters within `apache`:**

#####`default_mods`

Sets up Apache with default settings based on your OS. Defaults to 'true', set to 'false' for customized configuration.

#####`default_vhost`

Sets up a default virtual host. Defaults to 'true', set to 'false' to set up [customized virtual hosts](#configure-a-virtual-host).

#####`default_ssl_vhost`

Sets up a default SSL virtual host. Defaults to 'false'.

    apache::vhost { 'default-ssl':
      port            => 443,
      ssl             => true,
      docroot         => $docroot,
      scriptalias     => $scriptalias,
      serveradmin     => $serveradmin,
      access_log_file => "ssl_${access_log_file}",
      }

SSL vhosts only respond to HTTPS queries.

#####`default_ssl_cert`

The default SSL certification, which is automatically set based on your operating system  (`/etc/pki/tls/certs/localhost.crt` for RedHat, `/etc/ssl/certs/ssl-cert-snakeoil.pem` for Debian). This default will work out of the box but must be updated with your specific certificate information before being used in production.

#####`default_ssl_key`

The default SSL key, which is automatically set based on your operating system (`/etc/pki/tls/private/localhost.key` for RedHat, `/etc/ssl/private/ssl-cert-snakeoil.key` for Debian). This default will work out of the box but must be updated with your specific certificate information before being used in production.

#####`default_ssl_chain`

The default SSL chain, which is automatically set to 'undef'. This default will work out of the box but must be updated with your specific certificate information before being used in production.

#####`default_ssl_ca`

The default certificate authority, which is automatically set to 'undef'. This default will work out of the box but must be updated with your specific certificate information before being used in production.

#####`default_ssl_crl_path`

The default certificate revocation list path, which is automatically set to 'undef'. This default will work out of the box but must be updated with your specific certificate information before being used in production.

#####`default_ssl_crl`

The default certificate revocation list to use, which is automatically set to 'undef'. This default will work out of the box but must be updated with your specific certificate information before being used in production.

#####`service_enable`

Determines whether the 'httpd' service is enabled when the machine is booted, meaning Puppet will check the service status to start/stop it. Defaults to 'true', meaning the service is enabled/running.

#####`serveradmin`

Sets the server administrator. Defaults to 'root@localhost'.

#####`servername`

Sets the servername. Defaults to fqdn provided by facter.

#####`sendfile`

Makes Apache use the Linux kernel 'sendfile' to serve static files. Defaults to 'false'.

#####`error_documents`

Enables custom error documents. Defaults to 'false'.

#####`confd_dir`

Changes the location of the configuration directory your custom configuration files are placed in. Default is based on your OS.

#####`vhost_dir`

Changes the location of the configuration directory your virtual host configuration files are placed in. Default is based on your OS.

#####`mod_dir`

Changes the location of the configuration directory your Apache modules configuration files are placed in. Default is based on your OS.

#####`mpm_module`

Configures which mpm module is loaded and configured for the httpd process by the `apache::mod::prefork` and `apache::mod::worker` classes. Must be set to `false` to explicitly declare `apache::mod::worker` or `apache::mod::prefork` classes with parameters. Valid values are `worker`, `prefork`, or the boolean `false`. Defaults to `prefork` on RedHat and `worker` on Debian.

#####`conf_template`

Setting this allows you to override the template used for the main apache configuration file.  This is a potentially risky thing to do as this module has been built around the concept of a minimal configuration file with most of the configuration coming in the form of conf.d/ entries.  Defaults to 'apache/httpd.conf.erb'.

####Class: `apache::default_mods`

Installs default Apache modules based on what OS you are running

    class { 'apache::default_mods': }

####Defined Type: `apache::mod`

Used to enable arbitrary Apache httpd modules for which there is no specific `apache::mod::[name]` class. The `apache::mod` defined type will also install the required packages to enable the module, if any.

    apache::mod { 'rewrite': }
    apache::mod { 'ldap': }

####Classes: `apache::mod::[name]`

There are many `apache::mod::[name]` classes within this module that can be declared using `include`:

* `alias`
* `auth_basic`
* `auth_kerb`
* `autoindex`
* `cache`
* `cgi`
* `cgid`
* `dav`
* `dav_fs`
* `deflate`
* `dir`*
* `disk_cache`
* `fcgid`
* `info`
* `ldap`
* `mime`
* `mime_magic`
* `mpm_event`
* `negotiation`
* `passenger`*
* `perl`
* `php` (requires [`mpm_module`](#mpm_module) set to `prefork`)
* `prefork`*
* `proxy`*
* `proxy_html`
* `proxy_http`
* `python`
* `reqtimeout`
* `setenvif`
* `ssl`* (see [apache::mod::ssl](#class-apachemodssl) below)
* `status`
* `userdir`*
* `worker`*
* `wsgi`
* `xsendfile`

Modules noted with a * indicate that the module has settings and, thus, a template that includes parameters. These parameters control the module's configuration. Most of the time, these parameters will not require any configuration or attention.

The modules mentioned above, and other Apache modules that have templates, will cause template files to be dropped along with the mod install, and the module will not work without the template. Any mod without a template will install package but drop no files.

####Class: `apache::mod::ssl`

Installs Apache SSL capabilities and utilizes `ssl.conf.erb` template

	class { 'apache::mod::ssl': }

To *use* SSL with a virtual host, you must either set the`default_ssl_vhost` parameter in `apache` to 'true' or set the `ssl` parameter in `apache::vhost` to 'true'.

####Defined Type: `apache::vhost`

The Apache module allows a lot of flexibility in the set up and configuration of virtual hosts. This flexibility is due, in part, to `vhost`'s setup as a defined resource type, which allows it to be evaluated multiple times with different parameters.

The `vhost` defined type allows you to have specialized configurations for virtual hosts that have requirements outside of the defaults. You can set up a default vhost within the base `apache` class as well as set a customized vhost setup as default. Your customized vhost (priority 10) will be privileged over the base class vhost (15).

If you have a series of specific configurations and do not want a base `apache` class default vhost, make sure to set the base class default host to 'false'.

    class { 'apache':
      default_vhost => false,
    }

**Parameters within `apache::vhost`:**

The default values for each parameter will vary based on operating system and type of virtual host.

#####`access_log`

Specifies whether `*_access.log` directives should be configured. Valid values are 'true' and 'false'. Defaults to 'true'.

#####`access_log_file`

Points to the `*_access.log` file. Defaults to 'undef'.

#####`access_log_pipe`

Specifies a pipe to send access log messages to. Defaults to 'undef'.

#####`access_log_format`

Specifies either a LogFormat nickname or custom format string for access log. Defaults to 'undef'.

#####`add_listen`

Determines whether the vhost creates a listen statement. The default value is 'true'.

Setting `add_listen` to 'false' stops the vhost from creating a listen statement, and this is important when you combine vhosts that are not passed an `ip` parameter with vhosts that *are* passed the `ip` parameter.

#####`aliases`

Passes a list of hashes to the vhost to create `Alias` statements as per the [`mod_alias` documentation](http://httpd.apache.org/docs/current/mod/mod_alias.html). Each hash is expected to be of the form:

```ruby
aliases => [ { alias => '/alias', path => '/path/to/directory' } ],
```

For `Alias` to work, each will need a corresponding `<Directory /path/to/directory>` or `<Location /path/to/directory>` block.

**Note:** If `apache::mod::passenger` is loaded and `PassengerHighPerformance true` is set, then `Alias` may have issues honouring the `PassengerEnabled off` statement. See [this article](http://www.conandalton.net/2010/06/passengerenabled-off-not-working.html) for details.

#####`block`

Specifies the list of things Apache will block access to. The default is an empty set, '[]'. Currently, the only option is 'scm', which blocks web access to .svn, .git and .bzr directories. To add to this, please see the [Development](#development) section.

#####`custom_fragment`

Pass a string of custom configuration directives to be placed at the end of the vhost configuration.

#####`default_vhost`

Sets a given `apache::vhost` as the default to serve requests that do not match any other `apache::vhost` definitions. The default value is 'false'.

#####`directories`

Passes a list of hashes to the vhost to create `<Directory /path/to/directory>...</Directory>` directive blocks as per the [Apache core documentation](http://httpd.apache.org/docs/2.2/mod/core.html#directory).  The `path` key is required in these hashes.  Usage will typically look like:

    apache::vhost { 'sample.example.net':
      docroot     => '/path/to/directory',
      directories => [
        { path => '/path/to/directory', <directive> => <value> },
        { path => '/path/to/another/directory', <directive> => <value> },
      ],
    }

*Note:* At least one directory should match `docroot` parameter, once you start declaring directories `apache::vhost` assumes that all required `<Directory>` blocks will be declared.

*Note:* If not defined a single default `<Directory>` block will be created that matches the `docroot` parameter.

The directives will be embedded within the `Directory` directive block, missing directives should be undefined and not be added, resulting in their default vaules in Apache. Currently this is the list of supported directives:

######`addhandlers`

Sets `AddHandler` directives as per the [Apache Core documentation](http://httpd.apache.org/docs/2.2/mod/mod_mime.html#addhandler). Accepts a list of hashes of the form `{ handler => 'handler-name', extensions => ['extension']}`. Note that `extensions` is a list of extenstions being handled by the handler.
An example: 

    apache::vhost { 'sample.example.net':
      docroot     => '/path/to/directory',
      directories => [ { path => '/path/to/directory',
        addhandlers => [ { handler => 'cgi-script', extensions => ['.cgi']} ],
      } ],
    }

######`allow`

Sets an `Allow` directive as per the [Apache Core documentation](http://httpd.apache.org/docs/2.2/mod/mod_authz_host.html#allow). An example:

    apache::vhost { 'sample.example.net':
      docroot     => '/path/to/directory',
      directories => [ { path => '/path/to/directory', allow => 'from example.org' } ],
    }

######`allow_override`

Sets the usage of `.htaccess` files as per the [Apache core documentation](http://httpd.apache.org/docs/2.2/mod/core.html#allowoverride). Should accept in the form of a list or a string. An example:

    apache::vhost { 'sample.example.net':
      docroot     => '/path/to/directory',
      directories => [ { path => '/path/to/directory', allow_override => ['AuthConfig', 'Indexes'] } ],
    }

######`deny`

Sets an `Deny` directive as per the [Apache Core documentation](http://httpd.apache.org/docs/2.2/mod/mod_authz_host.html#deny). An example:

    apache::vhost { 'sample.example.net':
      docroot     => '/path/to/directory',
      directories => [ { path => '/path/to/directory', deny => 'from example.org' } ],
    }

######`options`

Lists the options for the given `<Directory>` block

    apache::vhost { 'sample.example.net':
      docroot     => '/path/to/directory',
      directories => [ { path => '/path/to/directory', options => ['Indexes','FollowSymLinks','MultiViews'] }],
    }

######`order`
Sets the order of processing `Allow` and `Deny` statements as per [Apache core documentation](http://httpd.apache.org/docs/2.2/mod/mod_authz_host.html#order). An example:

    apache::vhost { 'sample.example.net':
      docroot     => '/path/to/directory',
      directories => [ { path => '/path/to/directory', order => 'Allow, Deny' } ],
    }

######`passenger_enabled`

Sets the value for the `PassengerEnabled` directory to `on` or `off` as per the [Passenger documentation](http://www.modrails.com/documentation/Users%20guide%20Apache.html#PassengerEnabled).

    apache::vhost { 'sample.example.net':
      docroot     => '/path/to/directory',
      directories => [ { path => '/path/to/directory', passenger_enabled => 'off' } ],
    }

**Note:** This directive requires `apache::mod::passenger` to be active, Apache may not start with an unrecognised directive without it.

**Note:** Be aware that there is an [issue](http://www.conandalton.net/2010/06/passengerenabled-off-not-working.html) using the `PassengerEnabled` directive with the `PassengerHighPerformance` directive.

#####`docroot`

Provides the DocumentRoot directive, identifying the directory Apache serves files from.

#####`docroot_group`

Sets group access to the docroot directory. Defaults to 'root'.

#####`docroot_owner`

Sets individual user access to the docroot directory. Defaults to 'root'.

#####`error_log`

Specifies whether `*_error.log` directives should be configured. Defaults to 'true'.

#####`error_log_file`

Points to the `*_error.log` file. Defaults to 'undef'.

#####`error_log_pipe`

Specifies a pipe to send error log messages to. Defaults to 'undef'.

#####`ensure`

Specifies if the vhost file is present or absent.

#####`ip`

The IP address the vhost listens on. Defaults to 'undef'.

#####`ip_based`

Enables an IP-based vhost. This parameter inhibits the creation of a NameVirtualHost directive, since those are used to funnel requests to name-based vhosts. Defaults to 'false'.

#####`logroot`

Specifies the location of the virtual host's logfiles. Defaults to `/var/log/<apache log location>/`.

#####`no_proxy_uris`

Specifies URLs you do not want to proxy. This parameter is meant to be used in combination with `proxy_dest`.

#####`options`

Lists the options for the given virtual host

    apache::vhost { 'site.name.fdqn':
      …
      options => ['Indexes','FollowSymLinks','MultiViews'],
    }

#####`override`

Sets the overrides for the given virtual host. Accepts an array of AllowOverride arguments.

#####`port`

Sets the port the host is configured on.

#####`priority`

Sets the relative load-order for Apache httpd VirtualHost configuration files. Defaults to '25'.

If nothing matches the priority, the first name-based vhost will be used. Likewise, passing a higher priority will cause the alphabetically first name-based vhost to be used if no other names match.

*Note*: You should not need to use this parameter. However, if you do use it, be aware that the `default_vhost` parameter for `apache::vhost` passes a priority of '15'.

#####`proxy_dest`

Specifies the destination address of a proxypass configuration. Defaults to 'undef'.

#####`proxy_pass`

Specifies an array of path => uri for a proxypass configuration. Defaults to 'undef'.

Example:
$proxy_pass = [
  { 'path' => '/a', 'url' => 'http://backend-a/' },
  { 'path' => '/b', 'url' => 'http://backend-b/' },
  { 'path' => '/c', 'url' => 'http://backend-a/c' },
]

apache::vhost { 'site.name.fdqn':
  …
  proxy_pass       => $proxy_pass,
}

#####`rack_base_uris`

Specifies the resource identifiers for a rack configuration. The file paths specified will be listed as rack application roots for passenger/rack in the `_rack.erb` template. Defaults to 'undef'.

#####`redirect_dest`

Specifies the address to redirect to. Defaults to 'undef'.

#####`redirect_source`

Specifies the source items? that will redirect to the destination specified in `redirect_dest`. If more than one item for redirect is supplied, the source and destination must be the same length, and the items are order-dependent.

    apache::vhost { 'site.name.fdqn':
      …
      redirect_source => ['/images','/downloads'],
      redirect_dest => ['http://img.example.com/','http://downloads.example.com/'],
    }

#####`redirect_status`

Specifies the status to append to the redirect. Defaults to 'undef'.

    apache::vhost { 'site.name.fdqn':
      …
      redirect_status => ['temp','permanent'],
    }

#####`request_headers`

Specifies additional request headers.

    apache::vhost { 'site.name.fdqn':
      …
      request_headers => [
        'append MirrorID "mirror 12"',
        'unset MirrorID',
      ],
    }

#####`rewrite_base`

Limits the `rewrite_rule` to the specified base URL. Defaults to 'undef'.

    apache::vhost { 'site.name.fdqn':
      …
      rewrite_rule => '^index\.html$ welcome.html',
      rewrite_base => '/blog/',
    }

The above example would limit the index.html -> welcome.html rewrite to only something inside of http://example.com/blog/.

#####`rewrite_cond`

Rewrites a URL via `rewrite_rule` based on the truth of specified conditions. For example

    apache::vhost { 'site.name.fdqn':
      …
      rewrite_cond => '%{HTTP_USER_AGENT} ^MSIE',
    }

will rewrite URLs only if the visitor is using IE. Defaults to 'undef'.

*Note*: At the moment, each vhost is limited to a single list of rewrite conditions. In the future, you will be able to specify multiple `rewrite_cond` and `rewrite_rules` per vhost, so that different conditions get different rewrites.

#####`rewrite_rule`

Creates URL rewrite rules. Defaults to 'undef'. This parameter allows you to specify, for example, that anyone trying to access index.html will be served welcome.html.

    apache::vhost { 'site.name.fdqn':
      …
      rewrite_rule => '^index\.html$ welcome.html',
    }

#####`scriptalias`

Defines a directory of CGI scripts to be aliased to the path '/cgi-bin'

#####`serveradmin`

Specifies the email address Apache will display when it renders one of its error pages.

#####`serveraliases`

Sets the server aliases of the site.

#####`servername`

Sets the primary name of the virtual host.

#####`setenv`

Used by HTTPD to set environment variables for vhosts. Defaults to '[]'.

#####`setenvif`

Used by HTTPD to conditionally set environment variables for vhosts. Defaults to '[]'.

#####`ssl`

Enables SSL for the virtual host. SSL vhosts only respond to HTTPS queries. Valid values are 'true' or 'false'.

#####`ssl_ca`

Specifies the certificate authority.

#####`ssl_cert`

Specifies the SSL certification.

#####`ssl_certs_dir`

Specifies the location of the SSL certification directory. Defaults to `/etc/ssl/certs`.

#####`ssl_chain`

Specifies the SSL chain.

#####`ssl_crl`

Specifies the certificate revocation list to use.

#####`ssl_crl_path`

Specifies the location of the certificate revocation list.

#####`ssl_key`

Specifies the SSL key.

#####`vhost_name`

This parameter is for use with name-based virtual hosting. Defaults to '*'.

###Virtual Host Examples

The Apache module allows you to set up pretty much any configuration of virtual host you might desire. This section will address some common configurations. Please see the [Tests section](https://github.com/puppetlabs/puppetlabs-apache/tree/master/tests) for even more examples.

Configure a vhost with a server administrator

    apache::vhost { 'third.example.com':
      port        => '80',
      docroot     => '/var/www/third',
      serveradmin => 'admin@example.com',
    }

- - -

Set up a vhost with aliased servers

    apache::vhost { 'sixth.example.com':
      serveraliases => [
        'sixth.example.org',
        'sixth.example.net',
      ],
      port          => '80',
      docroot       => '/var/www/fifth',
    }

- - -

Configure a vhost with a cgi-bin

    apache::vhost { 'eleventh.example.com':
      port        => '80',
      docroot     => '/var/www/eleventh',
      scriptalias => '/usr/lib/cgi-bin',
    }

- - -

Set up a vhost with a rack configuration

    apache::vhost { 'fifteenth.example.com':
      port           => '80',
      docroot        => '/var/www/fifteenth',
      rack_base_uris => ['/rackapp1', '/rackapp2'],
    }
- - -

Set up a mix of SSL and non-SSL vhosts at the same domain

    #The non-ssl vhost
    apache::vhost { 'first.example.com non-ssl':
      servername => 'first.example.com',
      port       => '80',
      docroot    => '/var/www/first',
    }

    #The SSL vhost at the same domain
    apache::vhost { 'first.example.com ssl':
      servername => 'first.example.com',
      port       => '443',
      docroot    => '/var/www/first',
      ssl        => true,
    }

- - -

Configure a vhost to redirect non-SSL connections to SSL

    apache::vhost { 'sixteenth.example.com non-ssl':
      servername      => 'sixteenth.example.com',
      port            => '80',
      docroot         => '/var/www/sixteenth',
      redirect_status => 'permanent'
      redirect_dest   => 'https://sixteenth.example.com/' 
    }
    apache::vhost { 'sixteenth.example.com ssl':
      servername => 'sixteenth.example.com',
      port       => '443',
      docroot    => '/var/www/sixteenth',
      ssl        => true,
    }

- - -

Set up IP-based vhosts on any listen port and have them respond to requests on specific IP addresses. In this example, we will set listening on ports 80 and 81. This is required because the example vhosts are not declared with a port parameter.

    apache::listen { '80': }
    apache::listen { '81': }

Then we will set up the IP-based vhosts

    apache::vhost { 'first.example.com':
      ip       => '10.0.0.10',
      docroot  => '/var/www/first',
      ip_based => true,
    }
    apache::vhost { 'second.example.com':
      ip       => '10.0.0.11',
      docroot  => '/var/www/second',
      ip_based => true,
    }

- - -

Configure a mix of name-based and IP-based vhosts. First, we will add two IP-based vhosts on 10.0.0.10, one SSL and one non-SSL

    apache::vhost { 'The first IP-based vhost, non-ssl':
      servername => 'first.example.com',
      ip         => '10.0.0.10',
      port       => '80',
      ip_based   => true,
      docroot    => '/var/www/first',
    }
    apache::vhost { 'The first IP-based vhost, ssl':
      servername => 'first.example.com',
      ip         => '10.0.0.10',
      port       => '443',
      ip_based   => true,
      docroot    => '/var/www/first-ssl',
      ssl        => true,
    }

Then, we will add two name-based vhosts listening on 10.0.0.20

    apache::vhost { 'second.example.com':
      ip      => '10.0.0.20',
      port    => '80',
      docroot => '/var/www/second',
    }
    apache::vhost { 'third.example.com':
      ip      => '10.0.0.20',
      port    => '80',
      docroot => '/var/www/third',
    }

If you want to add two name-based vhosts so that they will answer on either 10.0.0.10 or 10.0.0.20, you **MUST** declare `add_listen => 'false'` to disable the otherwise automatic 'Listen 80', as it will conflict with the preceding IP-based vhosts.

    apache::vhost { 'fourth.example.com':
      port       => '80',
      docroot    => '/var/www/fourth',
      add_listen => false,
    }
    apache::vhost { 'fifth.example.com':
      port       => '80',
      docroot    => '/var/www/fifth',
      add_listen => false,
    }

##Implementation

###Classes and Defined Types

####Class: `apache::dev`

Installs Apache development libraries

    class { 'apache::dev': }

####Defined Type: `apache::listen`

Controls which ports Apache binds to for listening based on the title:

    apache::listen { '80': }
    apache::listen { '443': }

Declaring this defined type will add all `Listen` directives to the `ports.conf` file in the Apache httpd configuration directory.  `apache::listen` titles should always take the form of: `<port>`, `<ipv4>:<port>`, or `[<ipv6>]:<port>`

Apache httpd requires that `Listen` directives must be added for every port. The `apache::vhost` defined type will automatically add `Listen` directives unless the `apache::vhost` is passed `add_listen => false`.

####Defined Type: `apache::namevirtualhost`

Enables named-based hosting of a virtual host

    class { 'apache::namevirtualhost`: }

Declaring this defined type will add all `NameVirtualHost` directives to the `ports.conf` file in the Apache https configuration directory. `apache::namevirtualhost` titles should always take the form of: `*`, `*:<port>`, `_default_:<port>`, `<ip>`, or `<ip>:<port>`.

####Defined Type: `apache::balancermember`

Define members of a proxy_balancer set (mod_proxy_balancer). Very useful when using exported resources.

On every app server you can export a balancermember like this:

      @@apache::balancermember { "${::fqdn}-puppet00":
        balancer_cluster => 'puppet00',
        url              => "ajp://${::fqdn}:8009"
        options          => ['ping=5', 'disablereuse=on', 'retry=5', 'ttl=120'],
      }

And on the proxy itself you create the balancer cluster using the defined type apache::balancer:

      apache::balancer { 'puppet00': }

If you need to use ProxySet in the balncer config you can do as so:

      apache::balancer { 'puppet01':
        proxy_set => {'stickysession' => 'JSESSIONID'},
      }

###Templates

The Apache module relies heavily on templates to enable the `vhost` and `apache::mod` defined types. These templates are built based on Facter facts around your operating system. Unless explicitly called out, most templates are not meant for configuration.

##Limitations

This has been tested on Ubuntu Precise, Debian Wheezy, and CentOS 5.8.

##Development

### Overview

Puppet Labs modules on the Puppet Forge are open projects, and community contributions are essential for keeping them great. We can’t access the huge number of platforms and myriad of hardware, software, and deployment configurations that Puppet is intended to serve.

We want to keep it as easy as possible to contribute changes so that our modules work in your environment. There are a few guidelines that we need contributors to follow so that we can have a chance of keeping on top of things.

You can read the complete module contribution guide [on the Puppet Labs wiki.](http://projects.puppetlabs.com/projects/module-site/wiki/Module_contributing)

### Running tests

This project contains tests for both [rspec-puppet](http://rspec-puppet.com/) and [rspec-system](https://github.com/puppetlabs/rspec-system) to verify functionality. For in-depth information please see their respective documentation.

Quickstart:

    gem install bundler
    bundle install
    bundle exec rake spec
    bundle exec rake spec:system

##Copyright and License

Copyright (C) 2012 [Puppet Labs](https://www.puppetlabs.com/) Inc

Puppet Labs can be contacted at: info@puppetlabs.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
