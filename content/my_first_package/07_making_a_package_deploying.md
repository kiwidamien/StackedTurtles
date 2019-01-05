Title: Making a Python Package VII - deploying 
Tags: python, engineering, package, best-practices, deploying
Date: 2019-01-04 12:30
Category: Tools
Summary: This is the seventh in a series of blog posts where we go through the process of taking a collection of functions and turn them into a deployable Python package. In this post, we show how to deploy to TestPyPI. 
Series: Making a Python Package
series_index: 7

Note: To get the material for this blog post, visit the [v0.6 tag of Romans!](https://github.com/kiwidamien/Roman/tree/v0.6) Github project. To get it locally, and assuming you cloned the previous version, run
```bash
# clear last set of changes
$ git reset --hard HEAD
# checkout this version
$ git checkout tags/v0.6
```

### To install

To follow the steps in this tutorial, you will need to install `twine``
```bash
pip install twine
```

# Making a Python Package VI: deploying 

In this article, we will be deploying to TestPyPI. This is a version of PyPI that you can publish to without affecting the actual PyPI index, so that you can test if you deployment scripts are written collections. Note that user accounts and packages are periodically purged, as TestPyPI isn't meant to be a stable platform for distributing packages. The good news is that our tools will upload to PyPI by default, so if you can get a package on TestPyPI it is very easy to put it on PyPI.

## Adding a descripton

At the moment, we have been using `README.md` for the long description of the package. Especially for this project, where the goal is to act as a tutorial rather than designing a package to do something useful, it makes sense to keep the `README` for Github, and have a different file to describe the package. Descriptions by default are assumed to be in reStructured Text format, so we will write a file `DESCRIPTION.rst` that will describe the project on TestPyPI.

In addition to writing `DESCRIPTION.md`, we need to make two other changes:

* In `setup.py`, change `long_description` from 
  ```
  long_description=open('README.md').read()
  ``` 
  to 
  ```
  long_description=open('DESCRIPTION.rst').read()
  ```
* Create a file `MANIFEST.in` to tell us what additional files should be uploaded to PyPI. In this case, the only extra file we want to include is `DESCRIPTION.rst`, and the format is simple:
  ```bash
  include DESCRIPTION.rst
  ```

## Making an account on TestPyPI

Before being able to upload a package, you will need to register an account.

1. Go to https://test.pypi.org/account/register/ to make an account.
2. You will need to verify your email as part of the registration process.

## Checkpoint -- almost ready to upload

Before uploading to TestPyPI, check that you have the following directory structure
```bash
roman_package
+-- roman
    +-- __init__.py
    +-- data
        +-- emperors.csv
    +-- emperors.py
    +-- roman.py
    +-- temperature.py
+-- tests
    +-- __init__.py
    +-- test_roman.py
    +-- test_emperors.py
+-- setup.py
+-- tox.ini
+-- DESCRIPTION.rst
+-- MANIFEST.md
+-- README.md
```

If you have all these files, you are ready to install.

## Deploying (finally!)

Here are the commands we need to run to deploy the roman package:
```bash
# create the distribution
$ python setup.py install

# upload to TestPyPI. You will be prompted for your TestPyPI username
# and password
$ twine upload --repository-url https://test.pypi.org/legacy/ dist/*

# Now install from pip (uninstall first if you installed locally)
# This is more complicated because we are using testpypi =)
$ pip install --extra-index-url https://testpypi.python.org/simple roman
```

Note that if we were deploying to PyPI, we would not include the `--repository-url` flag to `twine` (it defaults to PyPI), and the install command would simply be `pip install roman`.

## Summary

Congratulations! If you got this far, you should have installed your first package to TestPyPI. The steps we took in this article were

* Including a description that wasn't just the README
* Using `MANIFEST.in` to tell `twine` which non-standard files should be uploaded to our Python Index.
* Using `twine` to upload to TestPyPI.

These articles were written in a tutorial style. The next article summarizes the steps, so you can "check off" the different steps.
