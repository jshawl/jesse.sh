---
layout: post
title: "One Commit Too Many"
---

I've finally shifted my git workflow to use feature branches. Master is always in a deployable state, and any
given feature gets its own branch. 

When I'm completed a fix or a feature on its own branch, I rebase and squash my commits to maintain the cleanest
possible history. None of those nasty merge commits.

I was working on a feature branch recently, and got carried away with my commits. I completed the feature, but forgot to squash and merge into master before making another commit
on a similar (but separate) feature.

`$ git log`

...will give us the following graph:

    * a3b69bd  (HEAD, feature-1) Began working on feature-2
    * 447f7f6  feature-1 is complete and ready for merge
    * 62eb878  Began working on feature-1
    * e019e08  (master) Deployable Code

The goal here is to:

1. Move the `feature-2` commit to a new branch
2. Prepare the `feature-1` branch for merge into `master`
3. Update `feature-2` with progress on `master`

### Moving feature-2 to its own topic branch

Easy!

    $ git branch feature-2

This creates a new branch with the work of feature two as its latest commit.

Here is a `git log`:











