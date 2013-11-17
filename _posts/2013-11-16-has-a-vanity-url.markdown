---
layout: post
title: "Vanity URLs"
---

<p data-height="300" data-theme-id="790" data-slug-hash="rGdme" data-user="jshawl" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/jshawl/pen/rGdme'>rGdme</a> by Jesse Shawl (<a href='http://codepen.io/jshawl'>@jshawl</a>) on <a href='http://codepen.io'>CodePen</a></p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

This is a post about how I fine tuned my URL. My main domain name is jshawl.com. It's easy to pronounce and it's rememberable. It's ideal for telling people how they can find out more about me. 

Every request that goes to http://jshawl.com/  or http://(\*).jshawl.com/, where the (*) indicates any subdomain of jshawl.com, will be automatically redirected to http://jesse.sh/awl/

My webserver of choice is Nginx, and I handle all the redirects in my Nginx configuration file 

	server {
	  listen 80;
	  server_name jshawl.com *.jshawl.com;
	  location / {
	    rewrite ^/?$ http://jesse.sh/awl/ permanent;
	  }
	  root   /var/www/jshawl.com;
	}

The `server_name` on the third line tells the webserver to respond to requests that come in for jshawl.com and any subdomain for jshawl.com. Under the `location /` block,
the requests will be redirected to jshawl.com if no file or folder is requested, like this [pig latin translator](http://jshawl.com/pig-latin-translator/) I made a while back.

The `permanent` on the fifth line responds with a 301 moved permanently header, instead of the default 302.

Now, any request to jshawl.com that isn't requesting a file or folder will be routed to http://jesse.sh/awl/. Sweet!

The last thing I wanted to do was prevent people from removing the /awl/ part of my domain. It's important. It completes my name, and it's that extra level of customization that gets me excited on a Saturday night. 

I maintain a separate Nginx configuration file for all of my sites at the jesse.sh domain. I don't keep many subdomains because I like to tell a story in my URL:

1. http://jesse.sh/awl/is-a-web-designer/
2. http://jesse.sh/awl/makes-3d-buttons-with-sass/
3. http://jesse.sh/awl/is-all-about/

Here are the relevant parts of my jesse.sh Nginx config:

	server {
	  listen 80;
	  server_name jesse.sh *.jesse.sh;
	  root   /var/www/jesse.sh;
	  location / {
	    rewrite ^/?$ http://jesse.sh/awl/ last;
	  }
	}

Any request to jesse.sh will be automatically redirected to the same domain with the /awl/ extra. 

Would you like a vanity URL too? It's easy!

First, I'd find a domain name. I often start my search with [domai.nr](https://domai.nr/). I think it's the easiest way just to browse what's available. Once I've found a cool domain, I would register it with a domain name registrar like [I Want My Name](https://iwantmyname.com/). This is another easy way to find the domain you're looking for. 

In order to get this fine-grained control over your domain, you might need more access than what the typical shared hosting provides. I recommend setting up a Virtual Private Server from [Digital Ocean](https://www.digitalocean.com/?refcode=01b24a40b88f). Even their most basic plan (512MBs of RAM, 20GBs harddisk space) is only $5 a month. 


It only takes a little bit of command-line-fu to get Nginx set up. If you've only worked with Apache in the past, I highly recommend giving it a try. Things that take several lines of directives in an Apache configuration file seemingly only take a word or two in a similar Nginx config file.

The command line can be a little scary at first, I get it. Fortunately, there are plenty of resources (read: carefully crafted instructions) for setting up a Virtual Private Server via the command line:

* [Installing Nginx](https://www.digitalocean.com/community/articles/how-to-install-nginx-on-ubuntu-12-04-lts-precise-pangolin)
* [Setting up a domain](https://www.digitalocean.com/community/articles/how-to-set-up-nginx-virtual-hosts-server-blocks-on-ubuntu-12-04-lts--3)

Are you in need of a cool domain but are completely lost? I'd love to help out. You can find me on [twitter](https://twitter.com/jshawl) or [via email](mailto:jesse@jshawl.com).

