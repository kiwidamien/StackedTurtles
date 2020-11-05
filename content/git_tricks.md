Title: Git Branch Tricks
Slug: git_branch_tricks 
Tags: git, workflow
Date: 2020-11-05 15:20
Category: Tools 
Summary: This is a post that I will update as I find little short snippets that work well with Github.

# Find the most recent commit on each branch

Usually used when cleaning up branches, and I cannot tell what is recent.

```bash
# Available since version 2.7.0
git branch --sort=-committerdate  # DESC, most recent at top
git branch --sort=committerdate  # ASC, most recent at bottom
```

To find the 5 most branches:
```bash
git branch --sort=-committerdate | head 5
```

Even more useful is the `-v` option:
```basg
git branch -v --sort=-committerdate | head 5
```
This gives the branch name, shortened commit hash, and the most recent commit message.

Credit to [this stackoverflow post](https://stackoverflow.com/questions/5188320/how-can-i-get-a-list-of-git-branches-ordered-by-most-recent-commit)

# Finding differences between master and feature branch (like a PR)

When wondering "do I want to keep this branch and resolve conflicts, or should I start fresh?"
it is useful to know what has been added to the branch. Doing a `git diff` with master will show
all the differences. What we really want to know is "what has **feature** added to master?". 
We don't really care about all the differences made to master that feature didn't touch.

This is similar to how a PR merging works. If master has 100 files, and people are working on all of them,
and branch `feature` works on 3, then your PR only shows the differences in those 3 files, not the other
97 files (where `master` and `feature` do differ, but feature is just a copy of old master).

The command is easier to type than describe!
```bash
git diff master...feature
```


