---
layout: post
---

Unfortunately, undoing a `git clean` is impossible, as C’s `unlink()` is [called](https://github.com/git/git/blob/9874fca7122563e28d699a911404fc49d2a24f1c/builtin/clean.c#L987)
on each of the untracked files (and directories if `-d` is supplied).

I was working on a rails application earlier this week and wanted to implement
a third party login authentication system. So I created a feature branch and
began working on implementing the OAuth flow.

I created a new file to store all of my API keys and secrets, and quickly thereafter
added this file to my `~/.gitignore` so as not to track sensitive information.

Before I could complete the feature, I had to switch back to master to push a quick
bug-fix. In the heat of the moment, I wanted to clean my working directory and
ran  `git clean -fd` to remove all untracked files and directories.

Unfortunately, this removed the file containing all the API keys and secrets, and 
I had to visit each of the API provider’s sites to recover them.

To prevent this sort of thing from happening in the future, I created a git alias
named `git clear`.

If you add this to your `~/.gitconfig`, you won’t permanently lose your untracked files.

    [alias]
      clear = stash --keep-index --include-untracked

This will stash all and only your untracked files, and the `--keep-index` option will retain
the state of the staging area.

If you accidentally "remove" untracked files with the new alias:

    $ git clear

You can retrieve them with `git stash pop`. If you’ve stashed a few things since
running `git clear`, you’ll have to specify the stash number, which you can find
with `git stash list`.