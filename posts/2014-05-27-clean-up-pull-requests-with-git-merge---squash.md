---
layout: layouts/post.njk

title: Clean up pull requests with git merge --squash
---

Sometimes, I will receive a pull request to one of my repositories that has commits
that affect several files. 

I want to merge the changes to one or two of those files across several commits,
but ignore the changes to the other files.

## Getting the latest changes.

First, create a new branch and pull in the commits submitted in the pull request:

    $ git checkout -b pull-request-23
    $ git pull git@github.com:otheruser/somerepo.git master

If I were to `git checkout master` and `git merge pull-request-23`, this
would manually merge the pull request, as GitHub describes it:

![](/img/merge-pull-request-from-command-line.png)

## git merge --squash prevents the merge commit

Instead of merging right into master with all of those changes,
I can `git merge --squash`, which will add all of the changes to the index
on `master`.

    $ git checkout master
    $ git merge --squash pull-request-23

At this point, the changes from pull-request-23 will be staged
while on master, and I can unstage the files that I don't want by using `git reset HEAD <path>`

    $ git reset HEAD files-i-dont-want/ ignore-me.rb

To get rid of the unstaged changes:

    $ git checkout -- .

And to remove untracked files and directories:

    $ git clean -fd

Now, your index should only contain changes to the files that you want
to merge in via the pull request. Finally, make the commit.

    $ git commit -m "Merge the cleaned up pull-request-23; fixes #23"

Notice the "fixes #23" at the end of the commit message? GitHub allows you to close
issues from a commit! - <https://help.github.com/articles/closing-issues-via-commit-messages>.

And push!

    $ git push origin master

GitHub will add a comment to the pull request thread showing that you've closed
the pull request:

![](/img/close-pr-merge-squash.png)

Now you don't need to ask your pull-request-submitters to clean up
their changes, and you can merge in the important stuff right away!




