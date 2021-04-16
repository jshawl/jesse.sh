---
layout: layouts/post.njk

title: Repo Stats from the command line
---

Did you know?! You can see [github-style commit stats](https://github.com/jekyll/jekyll/graphs/contributors) from the command line.

    $ git shortlog -sn | head -5

This will summarize the output of git log, sorted by number of commits per author, with only the author's name
and total commits.

    ~/jekyll-source git:(master) git shortlog -ns | head -10
    1654	Parker Moore
     409	Tom Preston-Werner
     395	Matt Rogers
     145	maul.esel
      96	Anatol Broder
      85	Nick Quaranto
      56	Coby Chapple
      51	zachgersh
      47	Kris Brown
      39	Ben Balter

It's interesting that these numbers do not correspond to the contributors tab on github - <https://github.com/jekyll/jekyll/graphs/contributors>
Maybe `shortlog` includes merge commits?

I mostly run this command to boost my ego when I know I've been hard at work committing to a repository, and now you can too!