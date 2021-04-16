---
layout: layouts/post.njk

title: "Warning! push.default is not set"
---

Have you seen this before when running `git push` with no remote or branch name specified?

    $ git push

    warning: push.default is unset; its implicit value is changing in
    Git 2.0 from 'matching' to 'simple'. To squelch this message
    and maintain the current behavior after the default changes, use:

    git config --global push.default matching

    To squelch this message and adopt the new behavior now, use:

    git config --global push.default simple

    See 'git help config' and search for 'push.default' for further information.
    (the 'simple' mode was introduced in Git 1.7.11. Use the similar mode
    'current' instead of 'simple' if you sometimes use older versions of Git)

I confess, I've been seeing this message for weeks (months)? and have done nothing to squelch 
the warning message. 

Let's break it down and see what it means and what we can do to prevent it from cluttering
our terminal.

The first step is to run `git help config` and search for `push.default`.

    $ git help config

When the help page pops up, it looks like this:

![](https://dl.dropboxusercontent.com/u/2241201/Screenshot%202014-05-21%2021.32.33.png)

You can search for a word, namely 'push.default' by typing `/push.default`.

I had to look for the next search result by typing `n` a few times, but found what I was looking
for.

---

**push.default**

 Defines the action git push should take if no refspec is explicitly given. 
 Different values are well-suited for specific workflows; for instance, in 
a purely central workflow (i.e. the fetch source is equal to the push 
 destination), upstream is probably what you want. Possible values are:

-    **nothing** - do not push anything (error out) unless a refspec is explicitly 
      given. This is primarily meant for people who want to avoid mistakes by 
      always being explicit.

-    **current** - push the current branch to update a branch with the same name on the receiving end. Works in
     both central and non-central workflows.

-    **upstream** - push the current branch back to the branch whose changes are usually integrated into the
     current branch (which is called @{upstream}). This mode only makes sense if you are pushing to the same
     repository you would normally pull from (i.e. central workflow).

-    **simple** - in centralized workflow, work like upstream with an added safety to refuse to push if the
     upstream branch's name is different from the local one.

     When pushing to a remote that is different from the remote you normally pull from, work as current. This
     is the safest option and is suited for beginners.

     This mode will become the default in Git 2.0.

-    **matching** - push all branches having the same name on both ends. This makes the repository you are
     pushing to remember the set of branches that will be pushed out (e.g. if you always push maint and
     master there and no other branches, the repository you push to will have these two branches, and your
     local maint and master will be pushed there).

     To use this mode effectively, you have to make sure all the branches you would push out are ready to be
     pushed out before running git push, as the whole point of this mode is to allow you to push all of the
     branches in one go. If you usually finish work on only one branch and push out the result, while other
     branches are unfinished, this mode is not for you. Also this mode is not suitable for pushing into a
     shared central repository, as other people may add new branches there, or update the tip of existing
     branches outside your control.

     This is currently the default, but Git 2.0 will change the default to simple. 

---


Basically, the old git would push all branches that have the same name locally and on the remote. New branches will
not be created on the remote.

Git 2.0 will switch to "simple", which will refuse a push when you run `git push` unless an upstream branch is set:

    fatal: The current branch master has no upstream branch.
    To push the current branch and set the remote as upstream, use

	git push --set-upstream origin master


I personally prefer `matching` as my default. I like to think of it as keeping all of my branches in sync between 
the local and the remote.

Since I'm a rebaser, people often warn me to not push branches that might be rebased in the future. The fix? - 
prefix your work-in-progress branches with "wip": `wip/new-awesome-design` or `wip/fixing-bootstrap`.

Any other co-committers who are basing work off of a branch prefixed with 'wip' probably deserve the 
complications that might arise should you rebase and do a force push.





