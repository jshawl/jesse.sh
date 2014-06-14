---
layout: post
title: "sudo npm install -g is an antipattern"
---

![](http://imgs.xkcd.com/comics/sandwich.png)

Earlier this week, I begun working on my first npm package. I've published it,
but only to understand how packages are distributed via npmjs.org.

I built a simple little command line tool to upload files to my server and print out the url to the
resource in the console.

Since I wanted to use this command without specifying a path to the executable,
I knew I had to install it globally.

Normally I would just
   
    $ sudo npm install -g package-name

But I noticed while reading the docs that this is quite dangerous to let *anyone* (yes, that includes me)
install code on your system with super user privileges. <https://www.npmjs.org/doc/files/npm-folders.html>

## The Solution

    $ sudo chown -R `whoami` /usr/local/lib/node_modules

This will allow you to globally edit npm packages without `sudo`. i.e. `npm install -g package-name`.