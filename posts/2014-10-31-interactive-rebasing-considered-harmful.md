---
layout: layouts/post.njk

title: "Interactive Rebasing Considered Harmful"
category: advanced
---

Submitting pull requests with few files changed and a clean history means cleaning up your commits. One common solution is to do an interactive rebase and squash commits to rewrite history. 

While on a feature branch, I would `git rebase -i master`, which  requires me to remember a few things:

1. Have I pushed this branch to a shared remote?
2. What changed in each commit?

I often forget the answer to both of these questions, and undoing an interactive rebase can be a total pain.

Instead of the interactive rebase, try `git merge --squash`

While on your `master` branch:

`$ git merge --squash branch-name`

This will merge your feature branch into master, but stop before committing. Typing `git status` shows us that every addition and deletion
from the feature branch has been staged and is ready for commit.

You could unstage files one by one with `git reset HEAD <file>`, though I prefer to unstage everything with `git reset HEAD`, and add the changes I need
back to the staging area.

Finally, make the commit. It might be helpful to reference where these changes came from, so I usually reference the feature branch name.

`$ git commit -m "implement feature 2; merge branch feature-branch"`

In effect, we're leaving our feature branch and all of its history intact should we need to reference past commits (yes even fix-typo commits).

Since we did not rewrite the history of the feature branch, there's no need to worry if you pushed that branch or not.

