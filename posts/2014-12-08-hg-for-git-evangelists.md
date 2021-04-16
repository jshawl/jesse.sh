---
layout: layouts/post.njk

title: "Mercurial for Git Evangelists"
---

I’ve been playing around with mercurial as of late as a way to enhance what I know about git
and version control in general. These are my in-progress notes.

## A lot of things are familiar

- `hg help` behaves like `git help`
- `hg init` behaves like `git init`.
- `hg status` behaves like `git status`.
  - but with more cryptic responses: `$ touch newfile && hg status #=> ? newfile`
  - no output indicates a clean working directory
  - `hg sum` tells you the state of the working directory
- `hg add` behaves like `git add <file>`
- `hg commit` behaves like `git commit`.

## Revisions, not SHA1s

`hg log` is similar to `git log`, with a few important differences.

    $ hg log --graph --style=compact
    @  2[tip]   3afb761704c7   2014-12-06 11:14 -0500   jesse
    |    third commit
    |
    o  1   2d9ef30807a4   2014-12-06 11:09 -0500   jesse
    |    second commit
    |
    o  0   ff70fcdc63f9   2014-12-06 11:07 -0500   jesse
	 initial commit

Instead of SHA1 hashes to label commits, mercurial uses revision numbers. This means reverting changes
is easy as `hg update 1` or `hg update 0`. The `@` symbol indicates which revision your working directory is in, ie
git’s `HEAD`.

## Multiple HEADs

`hg update` feels a bit like `git reset`, but is less dangerous in terms of its ability to rewrite history.
