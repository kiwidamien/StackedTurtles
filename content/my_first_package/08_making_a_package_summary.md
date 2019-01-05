Title: Making a Python Package VIII - summary 
Tags: python, engineering, package, best-practices
Date: 2019-01-05 12:30
Category: Tools
Summary: This is the eighth in a series of blog posts where we go through the process of taking a collection of functions and turn them into a deployable Python package. In this post, we summarize the steps needed to make and deploy a Python package. 
Series: Making a Python Package
series_index: 8

Note: To get the material for this blog post, visit the [master branch of Romans!](https://github.com/kiwidamien/Roman) Github project. To get it locally, and assuming you cloned the previous version, run
```bash
# clear last set of changes
$ git reset --hard HEAD
# checkout this version
$ git checkout master
```

# Making a Python Package VIII: Summary

We are going to assume that you want to install `roman`, but you could change the package to whatever you would like
## Packages to install

```bash
$ pip install pycodestyle pydocstyle setuptools pytest tox twine
```

## Directory layout

You should have the following directory layout:
```bash
.
+-- roman/
    +-- __init__.py
    +-- (any *.py files needed)
    +-- data/
        +-- (any data files you want included)
+-- tests/
    +-- __init__.py (can be blank)
    +-- (any test_*.py files needed)
+-- README.md
+-- DESCRIPTION.rst
+-- MANIFEST.in
+-- setup.py
+-- tox.ini
```

**Notes:**

1. The `test/__init__.py` can be blank (and probably should be)
2. The `roman/__init__.py` should probably import other modules in the directory.
3. The `roman/data/` directory is optional -- not all projects will need external data

## Writing unit tests

1. Place tests in the `test/` subdirectory.
2. Make sure all files containing tests follow the pattern `test_*.py`
3. Make sure all functions that incorporate tests start with `def test_.....`
4. Write tests based on what you think the functions _should_ do, don't write tests tham mimic the existing implementation.

More detail on [unit tests here](/making-a-python-package-iv-writing-unit-tests.html). 

## Lint everything with tox

The file `tox.ini` should have the following format
```bash
[tox]
envlist=py36

[testenv]
deps =
  pandas
  pydocstyle
  pycodestyle
  pytest
commands =
  - pydocstyle --ignore=D100,D104,D213 roman/
  - pycodestyle roman/
  pytest
```
 
Include other depedencies as needed. You should periodically run `tox` while developing, and fix linting errors and address unit test failures as they occur. Note that we deliberately don't lint the unit test files.

More detail on [tox](/making-a-python-package-v-testing-with-tox.html) and [docstrings](/making-a-python-package-ii-writing-docstrings.html).

## Create setup.py

The `setup.py` file tells Python how to install via the `pip setup.py install` command. Even if you intend to distribute your file via the Python Package Index, PyPI, you still need `setup.py` to generate the build directory. There are lots of options for `setup.py`, but this is reasonably well-featured example that you can modify for your package:
```python
import setuptools

setuptools.setup(
    name="roman",
    version="0.1.0",
    url="https://github.com/kiwidamien/roman",
    author="Damien Martin",
    author_email="damien.j.martin@gmail.com",
    description="Allows conversion of Roman numerals to ints (and vice versa)",
    long_description=open('DESCRIPTION.rst').read(),
    packages=setuptools.find_packages(),
    install_requires=[],
    classifiers=[
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
    ],
    include_package_data=True,
    package_data={'': ['data/*.csv']},
)

```

**Note:**

1. The last two fields, `include_package_data` and `package_data`, are only useful if you are including extra data to go with your package. Most packages won't need this.

## Including other files (e.g. DESCRIPTION.rst, images, LICENCE files)

Use `MANIFEST.in` to ensure that files outside of `roman/` that you want distributed with your code are installed by `twine`. The format for `MANIFEST.in` is simple; in this project we used
```bash
include DESCRIPTION.ini
```

## Deploying

Thre are two methods of deploying: using a Github repo, or using a Python Package Index (TestPyPI / PyPI).

### Deploy via Github

If you have a github repo `roman`, users can use pip to install you package directory with the command 
```bash
$ pip install git+https://github.com/<github username>/roman
```

### Deploy via pip to TestPyPI

You will need to set up an account on TestPyPI before completing this step. Your project name also has to be unique across all of TestPyPI (unlike Github, where your repo names just have to be unique to your account). You can set up an account on TestPyPI via [this link](https://test.pypi.org/account/register/).

Before deploying, ensure that you have run `tox` and dealt with any linter errors or failing unit tests.

To do the deploy, run the following commands in the shell
```bash
# create the distribution
$ python setup.py install

# now install the newly created dist directory using twine
$ twine upload --repository-url https://test.pypi.org/legacy/ dist/*
```

You are done! To install this package, run the command 
```bash
pip install --extra-index-url https://testpypi.python.org/simple roman
```

### Deploy via pip to PyPI

This is very similar to deploying on TestPyPI. You will need to create an account on PyPI to deploy your package (you cannot just use the TestPyPI account). You should also make sure that you have run `tox` and ensured you have no linter errors or failing unit tests.

The commands to deploy are
```bash
# create the distribution
$ python setup.py install

# now install on the real PyPI
$ twine upload roman
```

To install, simply run
```bash
$ pip install roman
```

Congratulations! You have now installed a package on the Python Package Index, and made it available to the world.
