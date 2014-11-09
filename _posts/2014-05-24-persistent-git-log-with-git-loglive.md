---
layout: post
title: Persistent git log with git loglive
---

I recently watched a talk by [Tim Berglund](http://timberglund.com/) on advanced git - <http://vimeo.com/49444883>
wherein he demos some git plumbing commands with a `git log` that keeps refreshing.

It looks like this:

![](/img/git-loglive.gif)

This is incredibly useful for visualizing what's happening
to your repository as you switch between and modify branches.

The code below has been reproduced from his [original gist](https://gist.github.com/tlberglund/3714970)

{% highlight bash %}
#!/bin/bash

while :
do
    clear
    git --no-pager log --graph --pretty=oneline --abbrev-commit --decorate --all $*
    sleep 1
done 
{% endhighlight %}

I had to create a new file with the above contents somewhere in my `PATH`. I created a file called
`git-loglive` in `/usr/local/bin/`

If your commit history is longer than your terminal window is tall,
you might need to specify that you only want the top 10 commits or so.

    $ git loglive -10



