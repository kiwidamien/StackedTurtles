Title: Prevent big commits 
Tags: Github
Date: 2019-02-01 10:20
Category: Github 
Summary: Instead of learning how to undo accidentally commiting a large file, what if we could prevent the commit in the first place? This article shows how to use git hooks to check commits automatically for validity _before_ actually doing the commit. 

Have you ever accidentally made a large commit to github (i.e. a file that is larger than 100 MB)? If so, you might have experienced the problem discussed in an [earlier aricle](/big-commits-in-github.html). Github doesn't accept large files, which is reasonable, and rejects pushes that contain commits with larg files. When you delete the file, re-commit, and push again it will still fail, complaining about the large file you deleted.

The problem is that git is a version control system, so it "remembers" the commit with the large file, even though you deleted it. By keeping this large file, you are able to go back to your previous commit where you deleted it. 

The previous article showed how to fix the problem. In this article, we will show how to use git hooks to prevent the problem in the first place.

## Introducing git hooks

In programming, a **hook** is a program or function we can use to extend or change the behavior of other program without touching that programs code. The more modern name is a plugin. When you run `git commit -m "commit message"` here are the steps git takes

1. See if `.git/hooks/pre-commit` exists. If it does, run it. If it returns with an error (i.e. a non-zero value), stop the commit.
2. Create a default message.
3. See if `.git/hooks/prepare-commit-msg` exists. If it does, run it. If it returns with an error (i.e. a non-zero value), stop the commit.
4. Do the commit (including launching an editor if there is no `-m` flag)
5. See if `.git/hooks/post-commit` exists. If it does, run it

**Note:** When git checks `.git/hooks/*`, it checks at the top level of your repo, even if you are in another folder when you run your `git` commands.

If you never create the `pre-commit`, `prepare-commit-msg` or `post-commit` files, git will operate normally. However, by adding these files, you can change the behavior of git without ever looking at its course code! We want to stop a commit from happening if a file is too large, so we will write a `pre-commit` hook.

### Setup

Let's make a new repo. We won't connect it to github, because we don't need to push the file. We are just going to look at making commits. 

In the terminal, run the following
```bash
$ mkdir git_hook_example
$ cd git_gook_example
git_hook_example$ git init
Initialized empty Git repository in /Users/damien/git_hook_example/.git/
git_hook_example$ ls -la
.    ..   .git
```
Note the hidden `.git/` directory. This is where we are going to place our hook.

Let's also create a couple of files, just to simulate a real repo:
```bash
git_hook_example$ echo '# hook example' > readme.me # creates a readme file
git_hook_example$ echo 'some text' > junk.txt
git_hook_example$ dd if=/dev/zero of=big_file.bin count=200 bs=1048576  # make 200 MB file
```

We now have a repo directory with two small files (`readme.md` and `junk.txt`) as well as a 200 MB file.

### Our first precommit hook

We will use the gitpython package to write our first hook. Install it with
```bash
$ pip install gitpython
```

In your favorite text editor, write the following file and save it to `.git/hooks/pre-commit`
```python
#!/usr/bin/env python3

# This is a pre-commit hook that ensures attempts to commit files that
# are larger than 100 MB to your _local_ repo fail, with a helpful error
# message. This is the python version.

from git import Repo
from gitdb.exc import BadName
import os
import sys


repo = Repo('.')
limit = 10**8

try:
    filenames = (diff_obj.a_path for diff_obj in repo.index.diff('HEAD'))
except BadName:
    # new repo, no 'HEAD' or master until first commit completed
    filenames = (filename for filename, _ in repo.index.entries.keys())

for filename in filenames:
    filesize = os.stat(filename).st_size
    if filesize > limit:
        print(f"""
              {filename} ({filesize // 10**6} MB) is larger than the {limit // 10**6} MB limit
              Commit aborted""")
        sys.exit(1)
```

This file is also available as a [gist](https://gist.github.com/kiwidamien/597ebbaeaf2388932ac9a3aaff7d1287). 

Briefly, this file uses the `git` package to initialize the repo that you are currently in. It looks at the repos index and compares what you are trying to commit to what is already saved. Only going through the files you are trying to update (i.e. iterating through `repo.index.diff('HEAD')`), if any of there are larger than 100 MB (technically 10<sup>6</sup> bytes, which isn't _quite_ the same thing) then stop the commit with a non-zero exit. The script prints out an error message telling you which file is problematic, and stops the commit before it happens!

Note that if the script exits normally, the default return value is `0`, which is interpreted as a success.

### Other uses

Notice that git didn't pass any information to this hook, it just ran the script with the right name sitting in the right place. We got the information about which files had changed by calling git within our script (i.e. we let the `gitpython` package do that for us). You can use a hook like to check other things as well, such as 

* __Automatic linting:__ Run pylint on your code pre-commit, and only allow the commit if there are no linting errors.
* __Automatic testing:__ Run your unittests on your code pre-commit. Only allow the commit if there are no failing test cases.
* __Spell checking:__ If running a blog off github (such as this one), run a spell-checker and only allow the commit if there are no spelling errors (I should really implement this one!)

The other hooks are useful too. This blog is associated with two github repos: the one that publishes the processed files, and the one that stores the original content. I work in the original content repo, and a post-commit hook ensures everytime I commit, the files are processed and published to my actual blog.

You can also write your hooks in any language you like. The same hook written as a bash script is available in [this gist](https://gist.github.com/kiwidamien/a6a909ee196be8795b30431079074d64). This is harder to read, but is more portable to systems that don't use Python 3 (or don't have gitpython installed).

### Testing

Let's test the hook! In your terminal, try adding your files and commiting them:
```bash
# make our hook "executable"
git_hook_example $ chmod a+x .git/hooks/pre-commit

# now do the add/commit workflow
git_hook_example $ git add .
git_hook_example $ git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

	new file:   big_file.bin
	new file:   junk.txt
	new file:   readme.me

git_hook_example $ git commit -m 'will this allow a big commit?'

              big_file.bin (209 MB) is larger than the 100 MB limit
              Commit aborted
```

Fantastic! Let's remove the `big_file.bin` and check the commit goes through:
```bash
git_hook_example $ git rm big_file.bin
git_hook_example $ git commit -m 'It should work now'
[master (root-commit) 841a985] It should work now
 3 files changed, 62 insertions(+)
```

Success!! You have made a git pre-commit hooks.

## Other hooks

## Summary, and doing this in other repos
