Title: Fixing a broken Postgres on Ubuntu (and AWS EC2) 
Tags: Postgres, bug-fix
Date: 2019-03-13 13:00
Category: Tools 
Summary: If your Ubuntu server is shutdown (for example, by your AWS instance rebooting), you may leave Postgres in an inconsistent state. This post walks through the steps of locating the lockfiles and getting Postgres up and running again. 

Note: this post references installations of PostgreSQL on linux machines using APT-GET (CHECK THIS). Other installation methods, such as using homebrew on OS X, place files in a different location.

## Quick-fix guide

The commands differ slightly depending on the version of postgres you have installed. These are the commands for version 9.5, for other versions simplely replace the "9.5" with your version number. 

```bash
# Remove the lock file

```


## Quick-fix guide

```bash
# find the errors in the logs
$ tail -n 20 /var/log/postgresql/postgresql-9.5-main.log

# remove the lock file
$ sudo rm /var/lib/postgresql/9.5/main/postmaster.pid

$ sudo su postgres
$ chmod a+w /var/lib/postgresql/9.5/main

The solution:
$ sudo chmod u+w /var/lib/postgresql/9.5/main/
$ sudo service postgresql restart
$ psql
```

