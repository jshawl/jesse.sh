---
layout: layouts/post.njk

title: A Better Git Log
---

The standard `git log` is pretty useless: 

![](https://dl.dropboxusercontent.com/u/2241201/Screenshot%202014-05-23%2014.42.30.png)

It tells me nothing about my current branch and/or how it differs from its upstream
counterpart.

I personally use:

    $ git log --all --decorate --graph --pretty=format:"%C(yellow)%h%Creset %C(auto)%d%Creset %Cblue%ar%Creset %Cred%an%Creset %n%w(72,1,2)%s"

![](https://dl.dropboxusercontent.com/u/2241201/Screenshot%202014-05-23%2014.47.04.png)

It shows all of my current local and remote branches, commit times in "time-ago" formats, author names,
and even displays all of this information in an attractive and readable graph.

You can either add the whole git log line as an alias in your `~/.bash_profile` or as a git alias in your `~/.gitconfig`.

Do you use something different? Let's see it!

Looking for the available options? Try running `git help log` in the terminal. Or you can check out the relevant pages 
from "Pro Git" - <http://git-scm.com/book/en/Git-Basics-Viewing-the-Commit-History>
