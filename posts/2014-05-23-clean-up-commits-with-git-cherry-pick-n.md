---
layout: layouts/post.njk

title: Clean up Commits with git cherry-pick -n
---

Sometimes I binge code for like 3+ hours and work on several unrelated things.
Since I'm so in the zone, I often forget to commit regularly, and am left
with a bunch of changes not yet staged for commit when I take a break:

![](https://dl.dropboxusercontent.com/u/2241201/Screenshot%202014-05-23%2015.50.33.png)

ffffffaaaacccckkkkkk!!!!!!!

First, I stage the changes:

    $ git add .

And then create a new branch and prefix the branch name with `wip`

    $ git checkout -b wip/clean-me

This produces a git log that looks like:
    
    * 5a639f3  (HEAD, wip/clean-me) 48 seconds ago Jesse shawl
    |  Please clean this branch|
    |  five  | 0
    |  four  | 0
    |  one   | 0
    |  seven | 0
    |  six   | 0
    |  three | 0
    |  two   | 0
    |  7 files changed, 0 insertions(+), 0 deletions(-)
    |
    * 24784a5  (master) 6 hours ago Jesse shawl
       initial commit
       readme.md | 0
       1 file changed, 0 insertions(+), 0 deletions(-)

I can always come back to this point as long as I commit, but in this post, I'll walk
through the process of making sense of this otherwise meaningless commit.

## Getting only the changes you want/need

Let's say that `5a639f3` contains a few hot fixes that should be added to master. I want to pull
in the file changes to one, two, and three, but not four, five, six, and seven.

To move a commit to a new branch, you normally `git cherry-pick 5a639f3` while on the master branch. *But*, this
will just add a new commit on master that's identical to the `wip/clean-me` branch. This doesn't do much for us.

Instead, we can `git cherry-pick -n 5a639f3` to cherry-pick the changes without making a commit. This will
allow us to edit the index (or staging area) before making the next commit. 

    $ git cherry-pick -n 5a639f3

After running this command, `git status` will tell me that I have changes that need to be committed:

    On branch master
     Changes to be committed:
      (use "git reset HEAD <file>..." to unstage)

	new file:   five
	new file:   four
	new file:   one
	new file:   seven
	new file:   six
	new file:   three
	new file:   two

At this point, I reset my `HEAD` to move these changes out of the staging area. This means that I can add back in the changes
I want with `git add <path>` and/or view the diffs without having to use the `--staged` option.

    $ git reset HEAD

You can now add the files you want to the staging area individually:

    $ git add one two three

And finally, make the commit.

This leaves us with a git log that looks like:


    * 07ac794  (HEAD, master) 6 seconds ago Jesse shawl
    |  Add hotfixes that should be deployed asap|
    |  one   | 0
    |  three | 0
    |  two   | 0
    |  3 files changed, 0 insertions(+), 0 deletions(-)

    | * 5a639f3  (wip/please-clean-me) 17 minutes ago Jesse shawl
    |/   Please clean this branch|
    |    five  | 0
    |    four  | 0
    |    one   | 0
    |    seven | 0
    |    six   | 0
    |    three | 0
    |    two   | 0
    |    7 files changed, 0 insertions(+), 0 deletions(-)

    * 24784a5  7 hours ago Jesse shawl
       initial commit
       readme.md | 0
       1 file changed, 0 insertions(+), 0 deletions(-)

At this point, we've added the important changes from the `please-clean-me` branch to `master`. The changes still exist
on your existing branch if you need to go back later and make changes.
