Title: Making a Python Package VI - including data files 
Tags: python, engineering, package, best-practices, deploying
Date: 2019-01-03 12:30
Category: Tools
Summary: This is the sixth in a series of blog posts where we go through the process of taking a collection of functions and turn them into a deployable Python package. In this post, we show how to include a CSV file into your package. This should be considered optional - not every package will need this!
Series: Making a Python Package
series_index: 6

Note: To get the material for this blog post, visit the [v0.5 tag of Romans!](https://github.com/kiwidamien/Roman/tree/v0.4) Github project. To get it locally, and assuming you cloned the previous version, run
```bash
# clear last set of changes
$ git reset --hard HEAD
# checkout this version
$ git checkout tags/v0.5
```
### To install

To follow the steps in this tutorial, you will need to install `pkg_resources``
```bash
pip install pkg_resources
```

# Making a Python Package VI: deploying 

This article is optional, and won't apply to many packages. If we were making a sensible version of our Roman numeral converter, there wouldn't be additional data to include. In this article we are _artificially_ including data to show the overall process. If you don't have data to include, you can skip this step and go straight to [deployment]().

## Adding data file

We will be adding a CSV that contains information on the different roman emperors. We will need to create a directory inside the `roman/` package to store our data. Run the following commands in the top-level directory:
```bash
# make the directory to store the data
$ mkdir roman/data/
# download the data
$ curl https://raw.githubusercontent.com/kiwidamien/roman/master/roman/data/emperors.csv > roman/data/emperors.csv
```

Once you have done this, your directory structure should be
```bash
roman_package
+-- roman
    +-- __init__.py
    +-- roman.py
    +-- temperature.py
    +-- data
        +-- emperors.csv
+-- tests
    +-- __init__.py
    +-- test_roman.py
    +-- test_temperature.py
+-- setup.py
+-- tox.ini
+-- README.md
```

## Adding a file to access `roman/data/emperors.csv`

Let's write a couple of functions that use the CSV we downloaded. Copy the following into `roman/emperors.py`
```python
import pkg_resources
import pandas as pd


def load_emperors():
    """Return a dataframe about the 68 different Roman Emperors.

    Contains the following fields:
        index          68 non-null int64
        name           68 non-null object
        name.full      68 non-null object
	... (docstring truncated) ...

    """
    # This is a stream-like object. If you want the actual info, call
    # stream.read()
    stream = pkg_resources.resource_stream(__name__, 'data/emperors.csv')
    return pd.read_csv(stream, encoding='latin-1')


def causes_of_death():
    """Return a count of the ways Roman Emperors died."""
    return load_emperors()['killer'].value_counts()
```

If we were not using a package, the `load_emperors()` function would be simplified:
```bash
def load_emperors():
    return pd.read_csv('data/emperors.csv', encoding='latin-1')
```
When we load a package, our files get moved in a system dependent ways. The purpose of the `pkg_resources` module is to give one way of determining where the files have been installed. Here the `__name__` variable stores the module name (`roman`), and then asks where it installed the `data/emperors.csv` file.

We can check that our function works by loading the python interpreter in our top-level directory.
```python
# note that we need to import roman.emperors, because we didn't change __init__.py
>>> import roman.emperor
>>> roman.emperor.causes_of_death()
Other Emperor       18
Disease             16
Praetorian Guard     7
Opposing Army        6
Own Army             5
Unknown              5
Senate               3
Wife                 2
Heart Failure        1
Usurper              1
Lightning            1
Court Officials      1
Fire                 1
Aneurism             1
Name: killer, dtype: int64
```

While this works from the top-level directory, we need to make some changes to `setup.py` so that the CSV file will be included when we install the roman package.

## Modifying `setup.py` to include CSV in installation

We need to make two changes to `setup.py` to make it distribute the CSV as well. The two fields we need to add are `include_package_data` (set to `True`) and `package_data`. The format of `package_data` is a dictionary, where the keys are the package names, and the values are lists of locations of files we would want to include. A black string `''` for the key will match all packages we are typing to install.

Our updated `setup.py` now takes the following form: 
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

## Summary and next steps

It isn't hard to include extra files as part of your package, but it can be difficult to find information on how to change `setup.py` **and** find out how to access the files from the package. The basic steps are

* Place the files that you want to include in the package directory (in our case, the data has to reside in the `roman/` directory).
* Add the field `include_package_data=True` in `setup.py`.
* Add the field `package_data={'': [...patterns for files you want to include, relative to package dir...]}` in `setup.py`.
* Use the `pkg_resources` module inside your package to access the packaged files, to make sure that your techniques are portable across different platforms.

In the next article, we will see how to deploy our package so that it can be installed via `pip`.
