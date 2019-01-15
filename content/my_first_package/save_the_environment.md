Title: Save the environment with conda (and how to let others run your programs)
Tags: python, engineering, package, best-practices, environment, conda
Date: 2019-01-15 10:30
Category: Tools
Summary: Environments allow you to distribute software to other users, where you don't know what packages they have installed. This is a better solution than using `reuirements.txt`, as the packages you install won't interfere with the users system. 

## Save the environment with conda (and how to let others run your programs)

If you have been developing in Python, you may have tried to distribute your program to friends and colleagues. It can be mildly annoying when they try to run your program and it fails because they don't have `obscurePackage42` installed. If you are nearby, then it is easy for you to call `pip install` a few times and get them started with your program. If you are trying to distribute a program to end users (or even some non-technical executives) then you really want something that is going to work "out of the box".


## The old way (and its drawbacks)

One way of doing this was to write a `requirements.txt` file. The format of this file was pretty simple:
```bash
# Installs 
# A version of numpy no older than 1.14.0
# Exactly the version 0.23.4 of Pandas
numpy>=1.14.0
pandas==0.23.4
```

A single command, `pip install -r requirements.txt` and everything would be written to the main Python repository. 

While simple to use, there are a couple of different problems with this approach:
* __Version conflicts:__ What if one application required version `0.23.4` of Pandas, but a different application required `0.19.0` (because it used a now deprecated feature)? We would have to reinstall from `requirements.txt` when switching between these applications.
* __Tracking dependencies:__ It can be difficult to keep track of which packages your application is actually using. You don't want to include all installed packages on your machine, as only a few are relevant to your application.

Environments were designed to address both of these issues.

## Environments

An _environment_ is a way of starting with a new Python installation, that doesn't look at your already installed packages. In this way, it simulates having a fresh install of Python. If two applications require different versions of Python, you can simply create different environments for them. If you start from a fresh environment and install as you go, you are able to generate a list of all packages installed in the environment so that others can easily duplicate it.

There are many different environments and dependency managers in the Python ecosystem. The most common ones in use are `virtualenv` and `conda` (but there are others such as `poetry`, `pyenv/pipenv`, `hatch` and probably many more I haven't heard of). This article is about using `conda` to manage environments, although all of these tools share the same broad goals. Some of the differences between these tools are touched on in the **Alternatives** section.

### Using conda environments

Need activate/deactivate/create/delete/export
#### Create a new (empty) conda environment

The following creates a new environment, `myenv`, with only python 3.6 installed.
```bash
conda create --name myenv python=3.6
```

#### Create a new conda environment with some packages

```bash
conda create --name myenv pandas numpy statsmodels
```

#### Get a list of all installed environments

```bash
conda env list
```

#### Create the environment file

```bash 
conda env export > environment.yaml
``` 
### Summary

### Alternatives

* The original virtualenv. As the Jake VanderPlas article ["Conda: Myths and Misconceptions"](https://jakevdp.github.io/blog/2016/08/25/conda-myths-and-misconceptions/) points out, these are mostly interchangle if you are only installing python packages into your environment. In slightly more detail
  * `virtualenv/pip` installs python packages into _any_ environment, while
  * `conda` installs _any_ packages into _conda_ environments.
  
  If you are solely installing Python packages, there is not much difference between the two.
* [`pyenv/pipenv`](https://pipenv.readthedocs.io/en/latest/) by Kenneth Reitz. The main goal of this project was to automate/simplify environment creation, but is not as mature as either `virtualenv` or `conda` solutions.
* [`poetry`](https://poetry.eustace.io/) by Sébastien Eustace, which aims to be a packaging and deployment tool.

With the exception of `virtualenv`, none of these solutions are as mature as `conda`. This is a piece of the Python that will hopefully improve and simplify, but for now, Randall Munroe's XKCD comic puts it well.
