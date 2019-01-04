Title: Making a Python Package V - Testing with Tox
Tags: python, engineering, package, best-practices, deployment
Date: 2019-01-03 08:30
Category: Tools
Summary: This is the fifth in a series of blog posts where we go through the process of taking a collection of functions and turn them into a deployable Python package. In this post, we use the `tox` package to automate some of the deployment steps 
Series: Making a Python Package
series_index: 5

Note: To get the material for this blog post, visit the [v0.4.5 tag of Romans!](https://github.com/kiwidamien/Roman/tree/v0.4.5) Github project. To get it locally, and assuming you cloned the previous version, run
```bash
# clear last set of changes
$ git reset --hard HEAD
# checkout this version
$ git checkout tags/v0.4.5
```

### To install

To follow the steps in this tutorial, you will need to install `tox`
```bash
pip install tox
```

# Making a Python Package V: Testing with `tox`

We have written some unit tests and seen that they work with our Python environment. The `tox` package is a way of automating testing, so that we can build a clean environment to test our pacakge in. It also allows us to automatically run our unit tests against multiple versions of Python (e.g. py27, py36, py37). Because my code uses f-strings, I cannot provide support for versions of Python lower than Python 3.6.

The goal is to run `tox` and let it tell us of problems our code has. We will run the following:

* `pytest`: to run our unit tests and report functional errors,
* `pycodestyle`: to check if our code is PEP8 compliant, 
* `pydocstyle`: to check if our docstrings are PEP257 compliant

## Making tox.ini

The `tox` package has a command `tox-quickstart` that you can type in the shell to generate your `tox.ini` file. You can also make the file manually. In the top-level directory, save the following code into `tox.ini`:
```bash
[tox]
envlist=py36

[testenv]
deps = 
  pydocstyle
  pycodestyle
  pytest
commands =
  - pydocstyle --ignore=D100,104 roman/ 
  - pycodestyle roman/ 
  pytest
```

This tells `tox`:

* I only want to build against Python 3.6 (`envlist=py36`),
* The commands I want to run depend on `pydocstyle`, `pycodestyle` and `pytest` being installed,
* I want to run the three commands under the "[commands]" section.

The dashes in front of a command mean "ignore the exit code of this function". Both `pydocstyle` and `pycodestyle` give non-zero exit codes if they find any violations, and `tox` stops on any command that has a non-zero exit code. We want to run all three of these commands, even if one of them finds an issue, so we use the leading dash to ignore the exit code.

When this is all done, your directory should look like
```bash
roman_package
+-- roman/
    +-- __init__.py
    +-- roman.py
    +-- temperature.py
+-- setup.py
+-- tests/
    +-- __init__.py
    +-- test_roman.py
+-- tox.ini
+-- README.md
```

## Using tox

Simply type `tox` at the command prompt, and the tests will run!

We see that while all our unit tests pass, there are quite a few errors picked up by `pydocstyle` (these errors all start with a `D`). We will fix those in the next branch, when we move on to deploying our solution.

## Summary and next steps

In this article, we showed how to setup `tox.ini` so that we could do all our linting and testing in one step. Although we didn't take advantage of it, `tox` is also a tool for testing against multiple Python releases at once.

The next step in our series is one that most projects won't need: how to package datafiles (such as CSVs) in your package. This is a confusing step, so feel free to skip ahead to deployment if you don't need it.  
