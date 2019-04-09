Title: Fixing a broken Postgres on Ubuntu (and AWS EC2) 
Tags: Postgres, bug-fix
Date: 2019-03-13 13:00
Category: Tools 
Summary: If your Ubuntu server is shutdown (for example, by your AWS instance rebooting), you may leave Postgres in an inconsistent state. This post walks through the steps of locating the lockfiles and getting Postgres up and running again. 

Note: this post references installations of PostgreSQL on linux machines using `apt-get`. Other installation methods, such as using homebrew on OS X, places files in a different location.

## Quick-fix guide

The commands differ slightly depending on the version of postgres you have installed. These are the commands for version 9.5, for other versions simplely replace the "9.5" with your version number. 

```bash
# Remove the lock file (change 9.5 to your version number)
$ sudo rm /var/log/postgresql/9.5/main/postmaster.pid

# log in as user postgres and reset the permissions on the postgres directory
$ sudo su postgres
$ chmod a+w /var/lib/postgresql/9.5/main
$ exit  # logs out postgres

# Now make the postgres file "user" accessible, and restart service
$ sudo chmod u+w /var/lib/postgresql/9.5/main/
$ sudo service postgresql restart

# Now restart postgres in terminal
$ psql
```

## What happens?

When we shut down an AWS instance, if the database is not terminated explicitly (e.g. with `sudo service postgresql stop`) then it fails to release certain locks it has on the system. The locks are in place to ensure if postgres is already running, subsequent requests connect to the _same_ database server, so we don't have two servers trying to write to the database at the same time. 

The locks are simply a file that is created (called a _lock file_). Before postgres starts a new service, it checks to see if the lock file exists. If it does, then postgres refuses to create a new service as one should already exist. When we shut down the service normally, the lock files are deleted, so when we restart the service postgres doesn't complain. If an EC2 instance is shut down abruptly, for example by stopping the instance, then postgres doesn't have time to delete the lock files before it is terminated.

Note that lock files don't actually do anything themselves. Instead, they are there as a convention. The postgres service is checking to see if they exist or not, and then will act accordingly. The files don't actively protect the data, they simply inform postgres about what it should do. For a simple system with one user, such as a typical project with public data, this isn't a huge concern. When dealing with sensitive private data, it is very important that an unauthorized user cannot simply stop the database from working (or create multiple access points) by deleting lock files. This is why we have to mess around with `sudo` and permissions -- the lock files are restricted access so that only trusted users can delete them (such as a the `postgres` user), so that we can continue using this "trust" system.

## A better way?

I provide the above as some reasons why we have to go through these steps. I don't mean for it to be an excuse. The solution provided here is definately a hack. After many hours on StackOverflow, I don't think at the time of writing this article there is a tider solution. That doesn't mean this process couldn't be automated, with permission restricted to a trusted user. My ideal solution would be to extend the service command:

```bash
# My ideal solution to the "shutdown in messy state problem"
# NOT implemneted (yet)
$ sudo service postgres cleanup
```

This is much more elegant (and robust) than trying to find the miscellaneous lock files and delete them manually. Hopefully this will get implemented, and this article will become out of date.
 
## Further problems?

One place to investigate is in the logs. If nothing else, the exact error message recorded in the logs can be a more useful place to start looking in StackOverflow for an answer. To access the end of the logs, use

```bash
# find the errors in the logs
$ tail -n 20 /var/log/postgresql/postgresql-9.5-main.log
```

Note that you may have to change the version number of postgres from 9.5 to your version.
