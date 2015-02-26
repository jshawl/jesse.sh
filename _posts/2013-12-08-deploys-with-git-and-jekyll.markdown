---
layout: post
title: "Deploying your Jekyll Site"
---

Jekyll generates static HTML. I prefer it to other content managing strategies because I can compose and deploy entirely within the command line (no GUI needed).

This is a git-based workflow for deploying sites built with Jekyll. In this article, I'll
describe the process of:

1. [Setting up a git based web workflow.](/awl/deploys-with-git-and-jekyll/#setting-up-a-git-based-web-workflow)
2. [Installing build tools on the server.](/awl/deploys-with-git-and-jekyll/#installing-build-tools-on-the-server)
3. [Changing the document root for a domain on your webserver.](/awl/deploys-with-git-and-jekyll/#changing-the-document-root)
4. [Configuring server-side git hooks.](/awl/deploys-with-git-and-jekyll/#configuring-server-side-git-hooks)

<!-- more -->

<h3 id='setting-up-a-git-based-web-workflow'>Setting up a git based web workflow</h3>

I run my own [git server](http://git.jshawl.com/) on the same web server that runs jshawl.com and jesse.sh/awl/. All of my repositories are stored in /git/. You can either keep your repositories there or in a sibling directory to the site's document root.
Importantly, the origin git repository must be on the same server as the site's host.

    $ cd /git/
    $ git init --bare jekyll-site.git

 We've setup a bare repository on our web server, and now just need to push our local projects to the remote. On your local machine, be sure to add `_site` to your `.gitignore`. Keeping compiled files out of version control helps keep our commit history clean and meaningful. Additionally, it incentivizes future developers not to edit compiled files. 

On your local machine:

    $ git remote add origin server:/git/jekyll-site.git
    $ git push origin master 

> protip! It's a good idea to configure an ssh alias in your ~/.ssh/config file so as not to expose usernames and hosts for
your SSH servers. If you haven't disabled password authentication, a username and host helps brute force attackers. 

<h3 id='changing-the-document-root'>Changing the document root</h3>

On the server, we need to configure a virtual host. Set the document root to `/path/to/www/jekyll-site/_site`. Notice that we're setting the compiled jekyll _site folder as the document root for this site. This will allow us to only keep the uncompiled source files in the git repository.

Here's an example nginx config file:

    server {
        listen 80;
        server_name jekyll-site.jshawl.com;
        index   index.html;
        root   /var/www/jekyll-site.jshawl.com/_site;
    }

Need help setting up a virtual host? [How to Set Up nginx Virtual Hosts](https://www.digitalocean.com/community/articles/how-to-set-up-nginx-virtual-hosts-server-blocks-on-ubuntu-12-04-lts--3)

Next, create the directory for your jekyll site on the web server:

    $ cd /var/www/
    $ git clone /git/jekyll-site.git

<h3 id='installing-build-tools-on-the-server'>Installing build tools on the server</h3>

Using build tools in our deploy strategy guarantees that 1) no compiled files are being edited, and 2) compiled files are absent from source control.

If you keep compiled files in version control, you'll encounter mergeconflicts like crazy during any merging or rebasing. It's an unnecessary source of frustration.

Just like installing locally, Install jekyll on the server. Here's a link to the install process: [Installing Jekyll](http://jekyllrb.com/docs/installation/)

After you install Jekyll on the server, do the intial jekyll build:

    $ cd /var/www/jekyll-site/
    $ jekyll build

If you visit your site in a web browser now, you should see the compiled jekyll site.

While you could manually `git pull` and `jekyll build` each time you want to update your website, we can do this automatically by configuring a post-update git hook in the website's bare repository.

 <h3 id='configuring-server-side-git-hooks'>Configuring the Git hook</h3>

Next, we have to create a post-update hook that executes every time the bare repo receives a push.

	$ vim /git/jekyll-site.git/hooks/post-update

Here is an example post-update script:
It has been adapted from [A web-focused Git workflow](http://joemaller.com/990/).

	#!/bin/sh

	cd /var/www/jekyll-site.jshawl.com/ || exit
	unset GIT_DIR
	git pull origin master && jekyll build 

When the remote repository receives a push, it will execute this script, which first changes directory to the project. Then it pulls down the latest changes from origin, and builds the site. 

Because we've already configured the document root for this domain to be in the _site directory, anything built by jekll will end up there

When the remote repository receives a push, it will execute this script, which first changes directory to the project. Then it pulls down the latest changes from origin, and builds the site. 

>I create feature branches to always keep my master branch in a deployable state. Experimental branches can be pushed and tested with a duplicate of the above shell script, but referencing a new document root and git branch, like:

	cd /var/www/dev-jekyll-site.jshawl.com/ || exit
	unset GIT_DIR
	git pull origin dev && jekyll build

Because we've already configured the document root for this domain to be in the _site directory, anything built by jekll will end up there.

Deploying your jekyll site from a local machine is now only a matter of running:

    $ git push origin master

Happy updating!

## Update 02-26-2015

I recently built a tool - <https://updog.co> that lets you host your jekyll site using dropbox. Anytime you build the
site locally with `jekyll build`, the changes will be synced to dropbox and available to view instantly.
