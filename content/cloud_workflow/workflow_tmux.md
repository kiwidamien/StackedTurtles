Title: Setting up Jupyter on the Cloud 
Tags: AWS, cloud, tmux
Date: 2020-04-23 11:00
Category: Tools
Summary: This article shows how you can run Jupyter on a remote server, connect to it, and have Jupyter continue to run - even if you get disconnected.

One of the advantages of working on a remote machine is that you can run extremely long computations without having to worry about your computer running slowly or running out of battery. If you have tried logging onto an AWS instance, however, you might have run into an issue where if you get disconnected, your process is terminated. This means that if you need to close your laptop for a meeting, need to travel, or even get momentarily disconnected, you could lose all that work.

Here is what we would ideally like to happen:

1. We start a job on AWS (e.g. run a Python script in Jupyter)
2. We can close our computer / switch it off / put it into airplane mode, and AWS continues to work on our problem
3. We can log back in later and see where we are with our long running job.

We walk you through using `tmux` in order to get a Jupyter session running that won't quit if your computer gets disconnected. We assume that you already have an EC2 instance (or other remote machine) setup already, with a key `~/.ssh/aws_key.pem` and public IP address `11.22.33.44` already. If you don't, you can follow the instructions in [this post]() on how to set one up using the dashboard, or [this post]() on how to set one up using Python. We also assume that you have Python installed on your EC2 instance.

You can skip the simple way, and just jump to getting a disconnection-tolerant jupyter server running by jumping to [this section](#the-safe-way-of-starting-jupyter-servers).


## Connecting to Jupyter the simple way

Before showing how to connect in a way that is tolerant to shutting down your computer, let's outline the main steps to connect to Jupyter (on AWS) from your browser on your computer.

#### Step 1: SSH onto the remote machine
Let's show how you can connect to Jupyter on your EC2 instance. First, we need to log in:
```bash
localhost$ ssh -i ~/.ssh/aws_key.pem ubuntu@11.22.33.44
# some login text from your server ....
ubuntu@ip-xxx-xxx-xxx-xxx$ 
```
For the prompts, we will show any command you need to run on your computer with `localhost$` (such as the `ssh` command), and any prompts for the remote computer we will show with `ubuntu@ip-xxx-xxx-xxx-xxx$`.

#### Step 2: Start Jupyter
On your remote machine, start Jupyter. Your output will look similar to the following:
```bash
ubuntu@ip-xxx-xxx-xxx-xxx$ jupyter notebook
[I 03:30:31.254 NotebookApp] The Jupyter Notebook is running at:
[I 03:30:31.254 NotebookApp] http://localhost:8890/?token=1627c05cd6feff33811e680f076719bc06bb74b40ac544bd
[I 03:30:31.254 NotebookApp]  or http://127.0.0.1:8890/?token=1627c05cd6feff33811e680f076719bc06bb74b40ac544bd
[I 03:30:31.254 NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[W 03:30:31.259 NotebookApp] No web browser found: could not locate runnable browser.
[C 03:30:31.259 NotebookApp] 
    
    To access the notebook, open this file in a browser:
        file:///home/ubuntu/.local/share/jupyter/runtime/nbserver-3278-open.html
    Or copy and paste one of these URLs:
        http://localhost:8888/?token=1627c05cd6feff33811e680f076719bc06bb74b40ac544bd
     or http://127.0.0.1:8888/?token=1627c05cd6feff33811e680f076719bc06bb74b40ac544bd
```

Copy and paste the `?token=.....` part of this string. Leave this terminal open.

### Step 3: Start an SSH tunnel in a separate terminal window

In a separate terminal window on _your_ machine, we are going to SSH to our EC2 instance again, but with one small difference:
```bash
localhost$ ssh -i ~/.ssh/aws_key.pem -NL 8888:localhost:12345 ubuntu@11.22.33.44
```

The `-NL 8888:localhost:12345` piece builds a "tunnel" from port 12345 on your machine (localhost) to port 8888 on the remote machine (ip address 11.22.33.44).  The port 12345 was chosen arbitrarily, you just need to give a high number that isn't already been used. What this enables us to do is 

- send messages to `localhost:12345`...
- .... which then get pushed to 11.22.33.44:8888 (where jupyter lives)
- Jupyter then gets the message and computes things, displaying a result back to 11.22.33.44:8888....
- .... which then gets pushed back to `localhost:12345` where we can see it.

The idea of a tunnel is that anything we push into our end `localhost:12345` comes out at the other end of the tunnel (`11.22.33.44:8888`) where Jupyter is waiting.

The tunnel will just sit there, and it will look like nothing is happening. This is okay!

### Step 4: Go to your browser

If we go to `https://localhost:12345` in our browser, we will be connected with Jupyter. Unfortunately, we will also be asked for a token, to prove we are who we say we are. You can copy in the token you found in step 2 into the dialog box, or just go to `https://localhost:12345/?token=.......` using the token found in step 2.

### Summary of simple connections

<ol>
<li> SSH to the remote machine: <code>ssh -i ~/.ssh/aws_key.pem ubuntu@11.22.33.44</code></li>
<li> On the remote machine, start Jupyter with <code>jupyter notebook</code>. Copy the token.</li>
<li> In a new terminal, SSH to the remote machine again, but this time with a tunnel: <br/>

   <code>ssh -i ~/.ssh/aws_key.pem -NL 8888:localhost:12345  ubuntu@11.22.33.44</code><br/>

Here 12345 is the arbitrary port you are opening on your machine.
</li>
<li> In a browser, go to <code>https://localhost:12345/?token=.....</code>, using the token found in step 2</li>
</ol>

## Why do you get disconnected?

If you follow the steps in the previous section, you have two connections to your remote machine running: the one you set up in step 2 to run Jupyter, and the tunnel you set up in step 3. If the tunnel goes down, you just need to run the command from step 3 again, and then just refresh your browser. If the connection in step 2 goes down, then the Jupyter notebook goes down, losing the results of any unsaved calculations.

The reason is that everytime you run a program, it is owned by a __session__, and if the session dies any programs it is running die as well. When you SSH into your remote computer, you start a new session, but that session only exists for as long as you remain logged in. If you get disconnected, the remote machine tidies up anything running in that session, including the Jupyter notebook server.

To get around this, we need to make a new session that _doesn't_ close when the login terminal closes. That is what `tmux` does: it allows us to create new sessions that don't depend on a login. These are called _detatched_ sessions.

### Starting the Jupyter server with tmux

Before, we started our Jupyter server with the command
```bash
ubuntu@ip-xxx-xxx-xxx-xxx$ jupyter notebook
```

This time, we will start with
```bash
ubuntu@ip-xxx-xxx-xxx-xxx$ tmux
# A new screen will come up
ubuntu@ip-xxx-xxx-xxx-xxx$ jupyter notebook
    ...
    ...
    # Now lots of lines
    To access the notebook, open this file in a browser:
         file:///home/ubuntu/.local/share/jupyter/runtime/nbserver-3278-open.html
     Or copy and paste one of these URLs:
         http://localhost:8888/?token=1627c05cd6feff33811e680f076719bc06bb74b40ac544bd
      or http://127.0.0.1:8888/?token=1627c05cd6feff33811e680f076719bc06bb74b40ac544bd
```

Any `tmux` commands start with <kbd>Ctrl</kbd>+<kbd>b</kbd> (you can think of this as putting you in "control mode", as in VIM). To detatch a sessoin, first use  <kbd>Ctrl</kbd>+<kbd>b</kbd> to go into control mode, then hit <kbd>d</kbd> to detatch the session. This will take you back to the login session you started with. If your login session closes (e.g. you exit, switch off your wifi, or shutdown your computer), your _detatched_ session remains open.

In the appendix, we will show some other `tmux` commands you can use to jump between sessions, but we don't need them for running Jupyter notebooks.

If you forgot the token, you can always run 
```bash
ubuntu@ip-xxx-xxx-xxx-xxx$ jupyter notebook list
```
from any session to get a list of all running servers.

<a name="the-safe-way-of-starting-jupyter-servers">
### The safe way of starting Jupyter servers
</a>

This list is almost the same as before, assuming that your cloud public IP is 11.22.33.44:

<ol>
<li> SSH to the remote machine: <code>ssh -i ~/.ssh/aws_key.pem ubuntu@11.22.33.44</code></li>
<li> On the remote machine:
  <ul>
  <li> Run <code>tmux</code></li>
  <li> Then run <code>jupyter notebook</code> in the new session. Copy the token.</li>
  <li> Press <kbd>Ctrl</kbd> + <kbd>b</kbd>, followed by <kbd>d</kbd> to detach the session.</li>
  <li> Use the command <code>exit</code> to end the (login) session. The detatched session still runes.</li>
  </ul>
<li> SSH in again from your local machine, but this time with a tunnel:<br/>
   
   <code>ssh -i ~/.ssh/aws_key.pem -NL 8888:localhost:12345  ubuntu@11.22.33.44</code>
</li>
<li> In a browser, go to <code>https://localhost:12345/?token=.....</code>, using the token found in step 2</li>
</ol>

If you ever get disconnected, or restart your local machine, you just need to run steps 3 and 4 again.

If you forget the token, you can ssh back onto AWS and run the command `jupyter notebook list` to get a list of all running servers.

## Summary

<ul>
<li> To allow our browser to "see" Jupyter on AWS we can use an SSH tunnel, where the command is <br/>
  <code>
  ssh -i <identity file> -NL <remote port>:localhost:<local port> ubuntu@<ip address>
  </code>
  
  This builds a tunnel from <code><ip address>:<remote port></code> to <code>localhost:<local port></code>
</li>
<li> If Jupyter runs on <code><ip address>:<remote port></code> and we have built a tunnel, we can access it at <code>https://localhost:<local port></code></li>
<li> Every process is owned by the session it starts in.</li> 
<li> When we SSH into a machine, we start a login session which closes when we either log out, or lose the connection.</li>
<li> <code>tmux<//code> is a tool that allows us to run <i>non-login</i> sessions, that will persist even once we log out.</li>
  <ul>
  <li> We showed some advanced techniques (listing sessions, naming sessions, and attaching to former sessions) that might be useful in other contexts.</li>
  <li> We don't need the more advanced techniques if all we want to do is run a Jupyter notebook.</li>
  </ul>
<li> <a href="#the-safe-way-of-starting-jupyter-servers">Step-by-step instructions</a> are included.</li>
</ul>


## References

* [Xiaoru Li](https://www.xiaoru.li/post/playing-with-tmux/) has a really nice overview of tmux, and some of the different commands you can use with it.
* [Tactical tmux](https://danielmiessler.com/study/tmux/) is a good, clean overview of tmux commands, including windows and panes.
* [A guide to customizing your tmux conf](https://www.hamvocke.com/blog/a-guide-to-customizing-your-tmux-conf/) is a nice post walking through some simple tmux configurations.

## Appendix: `tmux` tricks

The `tmux` command can be used for detatching sessions, or splitting a terminal into multiple panes (similar to using separate panes in an editor). The name `tmux` stands for _Terminal Multiplexer_. 

TMUX has a command mode, which you can enter with <kbd>Ctrl</kbd> + <kbd>b</kbd>, which you can follow by some commands:

| command | what it does          |
| ------- | ----------------------|
| `d`            | Detatches the session        |
| `$ <name>`     | Renames session to `<name>`  |
| `%`            | Splits terminal horizontally |
| `"`            | Splits terminal vertically   |
| <arrow>        | Moves between panes in that direction |


The tmux command also takes additional arguments on the command line, such as `tmux <command> <args>`. Here are some common ones:

1. `tmux ls`: list all the tmux sessions
2. `tmux attach`: attach to the most recent sessoin
3. `tmux attach -t <name>`: attach to the session with name `<name>` 

In our article, we launched `tmux`, then launched a jupyter notebook inside the new session, and then detatched from the session. What we could do instead is

```bash
ubuntu@xxx-xxx-xxx-xxx$ tmux
---- <new session starts> -------
# <Ctrl> + b to enter command mode, then write "$ notebook_session"
# Gives this session the name "notebook_session

ubuntu@xxx-xxx-xxx-xxx$ jupyter notebook

# Detatch the session, use <Ctrl> + b to enter command mode, then hit d
---- <back at regular terminal ----

# note the name
ubuntu@xxx-xxx-xxx-xxx$ tmux ls
notebook_session: 1 windows (created Sat May  2 14:38:33 2020)

# if we want to go back to the session:
ubuntu@xxx-xxx-xxx-xxx$ tmux attach -t notebook_sessoin

---- <back in the session> --------
```

If you are using mutiple sessions, giving them separate names can help you keep track (the default naming is 0, 1, 2, etc). You can also skip the renaming step by creating sessions with the slightly more verbose command
```bash
# equivalent to "tmux" followed by <Ctrl> + b, then "$ session_name"
ubuntu@xxx-xxx-xxx-xxx$ tmux new -s session_name  
```
