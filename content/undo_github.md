Title: Undo in Github (aka the elephants in the room)
Tags: Github
Date: 2018-09-12 23:00
Category: Tools
Summary: How to rollback in Github

Git is a version control system, and is designed so you can "go back" to previous versions of your codebase. Initially the process can be a little intimidating; this guide is designed to help.

A few cautionary words are in order before we begin:
* Git cannot recover files that you it never started tracking. If you delete a file that you have never committed, it will be gone once you delete it.
* Git cannot recover changes in your file that you have never committed, _even if you have committed this file in the past_. You can only restore commits.
* It is _much_ easier to restore to a particular commit. It is possible to use git's _[cherry pick](https://git-scm.com/docs/git-cherry-pick)_ to take parts of some commits and mix them with others, but it should be avoided.

Hopefully the comments above convey that making lots of small commits are the way to work. This gives you a lot of stages to restore the code to. Because git commits only save the differences between files, making lots of small commits takes roughly the same amount of space as making a single large commit.

Committing should be like voting:
** Commit early, commit often **

The plan for this blog post will be to make a small text document, `room.txt`, make some changes to it, and then revert back to the original version of `room.txt`.

**NOTE**

If you are trying to remove a file that is too large from Github, you should look at [these instructions](big-commits-in-github.html) instead.

## Setup

You can do the setup in an existing git repo, or make a new one. First, on branch `git_experiment`, we make the original document `room.txt` as a shout out to Lin-Manuel Miranda:
```
room.txt (original):
No one else was in the room where it happened,
the room where it happened,
the room where it happened.
```
(Note that this would work equally well on the `master` branch as well, but you should not be developing on `master`!)


Let's add and commit this code:
```bash
$ git add room.txt && git commit -m "added room.txt"
[git_experiment eca0535] added room.txt
```
The code `eca0535` is the beginning of the _commit hash_ for the commit we just made. It helps us identify this commit at any point in the future.

Now let's add one line to `room.txt`, so it reads
```
room.txt (modified):
No one else was in the room where it happened,
the room where it happened,
the room where it happened.
(Well, except the elephant)
```
We can also add and commit this code:
```bash
$ git add room.txt && git commit -m "mentioned elephant in the room"
[git_experiment 997b13a] mentioned elephants in the room
```

What we have so far:
* A commit `eca0535` where we made `room.txt`
* A commit `997b13a` where we added a line to `room.txt`

Our goal is to restore the repo at the commit hash of `eca0535`, where we have created `room.txt` but haven't added the elephants in the room (because no-one talks about the elephant in the room).

In this specific case, it would be easiest to delete the line and commit again. We are going to do it the hard way to demonstrate how to rollback git commands.

**Note about commit hashes**

If you are following this in your own repo, you will have different hashes than `eca0535` and `997b13a`. That is OK! We also have two different ways of referring to this hashes with git:
* `HEAD` is the most recent commit (in this case, `997b13a`)
* `HEAD~1` is the previous commit (in this case `eca0535`)

### Method 1: We haven't pushed to Github

If we haven't pushed to Github, then we only have to deal with fixing our local version of `git`. This is a one line command:
```bash
$ git reset --hard HEAD~1
HEAD is now at eca0535 added room.txt
```
Here git is telling us our current position (HEAD) is at the old commit. Note that the commit message helps tell us which commit this is -- this is a reason to write good commit messages. We can use this same method to go back any number of commits (e.g. `HEAD~n` goes back `n` commits).

**hard vs soft git resets**

The `git reset [COMMIT_HASH]` resets our branch to the state it was in when we made the commit `COMMMIT_HASH`. Specifically, it does a _soft reset_, which is where git remembers the repo as it was at the point `COMMIT_HASH`, but doesn't change your local files. So if you look at your `room.txt` you would still have the elephants in the room. This is useful if you have committed files you didn't want to commit yet, as it gives you a chance to add different files to your commit.

If you want git to rewind to `COMMIT_HASH` _and_ you want your files to change to the state they were in at `COMMIT_HASH`, you should do a hard reset instead with `git reset --hard [COMMIT_HASH]`.

### Method 2: We have pushed to Github

This gets a little trickier if you have already pushed your repository to Github. Hopefully you are working on your own branch (e.g. `git_experiment`) so that you don't have to worry about your changes affecting other people's work.

Git provides two ways of doing this:
1. `git reset --hard` + `git push (force)`
2. `git revert`

which both do the same thing if you are just going back one commit. If you are trying to go back multiple commits, you should use the first approach only (the second approach will do something subtly different).

#### Method 2a: Using git reset and force push

Our remote repo is on commit `997b13a` (with the elephant), and we want to set it to `eca0535` (with no elephant). We can do this with
```bash
$ git reset --hard eca0535
HEAD is now at eca0535 added room.txt
$ git push origin +HEAD:git_experiment
+ 997b13a...eca0535 HEAD -> git_experiment (forced update)
```
The first line updated `HEAD` to `eca0535`, the commit we want, on the local machine. The second command pushes the current `HEAD` (i.e. `eca0535`) on the local machine to the remote branch `git_experiment`. Once this is done, we _force pushed_ to Github.

You can use this method to go back any specific commit, and rewind your entire repo to that commit.

#### Method 2b: Using git revert

We still want to go from commit `997b13a` (with the elephant), to `eca0535` (with no elephant). Git revert takes a commit hash, and makes a new commit where we have erased the changes made in that commit:
```bash
$ git revert 997b13a
[git_experiment 4ac130a] Revert "mentioned elephants in the room"
$ git push
```
Now we are at a new commit `4ac130a`, which has undone the changes made at commit `997b13`. This means that commit `4ac130a` has the files in the same state as the commit `997b13a`.

What `git revert [COMMIT_HASH]` does behind the scenes is to try and remove all the changes made in `COMMIT_HASH` while leaving future commits in place. So if `COMMIT_HASH` was several commits back, you are only undoing the changes made in that commit -- not restoring the entire repo to a particular stage.

If you are removing the very last commit, removing the changes from that commit is the same as resetting to one commit prior. Sometimes this is what you want, but it this approach doesn't do what we advertised in this blog post (resetting to a particular commit).

One important advantage of this approach is that all the commits are retained. If we do `git log --oneline` we get the following output:
```bash
4ac130a (HEAD -> git_experiment, origin/git_experiment) Revert "mentioned elephant in the room"
997b13a mentioned elephants in the room
eca0535 added room.txt
... (older commits)
```
If we decided we want the elephant back, it would be possible with `git revert`.

## Summary

Summing it up, we had our most recent commit (`HEAD`) that we wanted to get rid of. Our approaches were

* __If we haven't pushed to Github__

  `git reset --hard HEAD~1`

* __If we have pushed to Github, method 2a__

  `git reset --hard HEAD~1 && git push origin +HEAD:git_experiment`

  Note this method can be used with any commit hash, but will delete history.

* __If we have pushed to Github, method 2b__

  `git revert HEAD && git push`

  This only does what we want when deleting the most recent commit, so don't swap HEAD with another commit. Creates a new commit and preserves history.

Jefferson, Madison, and Hamilton can now rest at ease, as no one will mention the elephant in the room.
