---
layout: layouts/post.njk
title: "[book] The Art of Unix Programming"
---

I just finished [The Art of Unix Programming](http://www.catb.org/esr/writings/taoup/html/) and I highly recommend it. I ended up reading the book cover to cover but it's written in such a way that you can skip around if you like. Despite being last updated over 12 years ago, the book is surprisingly relevant today and I wanted to document some of my favorite parts: 

## Configuration

Over the years I've noticed patterns in both configuration files and command line options but couldn't quite put my finger on how they were related. 

There are generally three ways to configure an application. 

1. In the /etc/ directory
2. Hidden file in $HOME
3. Command line options. 

### /etc/ configuration files

Configuration files in the /etc/ directory are meant to be edited by the system administrator, not the user. 

Examples include:

- /etc/nginx/nginx.conf
  - System wide configuration for the nginx web server
- /etc/profile
  - Similar to a system-wide bash profile
- /etc/mysql/my.cnf
  - System wide configuration for the MySQL database server

### .rc configuration files

Configuration files in the users directory are often hidden and end with "rc", which stands for run control. User configuration files are meant to be edited infrequently and contain configuration options specific to the user running the application. 

Examples include:

- ~/.vimrc
  - User specific editor configuration
- ~/.gitconfig
  - User specific aliases and output configuration
- ~/.netrc
  - User login and initialization information

### Command line arguments

Command line arguments are another way to configure an application at runtime with the understanding that the user will frequently change these options. 

#### `-` vs `--`

`-` options are usually followed by a single case letter

The single hyphen is an artifact from using teletypes - where holding down the shift key required serious effort! Instead of the more logical `+` choice for adding options, `-` is used to facilitate typing.

`--` options are usually followed by a lowercase word, separated by hyphens

>The GNU style uses option keywords (rather than keyword letters) preceded by two hyphens. It evolved years later when some of the rather elaborate GNU utilities began to run out of single-letter option keys (this constituted a patch for the symptom, not a cure for the underlying disease). It remains popular because GNU options are easier to read than the alphabet soup of older styles.

