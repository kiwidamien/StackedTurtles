Title: Making a Python Package
Subtitle: An example using Roman Numerals I - making a module 
Tags: python, engineering, package, best-practices
Date: 2019-01-01 17:00
Category: Tools
Summary: This is the first in a series of blog posts where we go through the process of taking a collection of functions and turning them into a deployable Python package. In this post, we create a Roman Numerals function, and make it into a Python module.
Series: Making a Python Package
series_index: 1

Note: To get the material for this blog post, visit the [v0.1 tag of Romans!](https://github.com/kiwidamien/Roman/tree/v0.1) Github project. To get it locally, run
```bash
# get the repo and put it in roman_package
$ git clone https://github.com/kiwidamien/roman.git roman_package
$ cd roman_package
# now get the version of the repo corresponding to the steps in this article
$ git checkout tags/v0.1
```

# Making a Python Package I: Making a Roman numerals module

You have written some Python code that you want to be used in other projects. Maybe it is a way of recursively grabbing information off SoundCloud, or scraping people's date of birth from their Wikipedia page, or calculating the change in scores when permuting a single feature to estimate its importance. Maybe you have written an ETL (extract-tranform-load) pipeline, and we want to be sure that everyone is using the same definition and process.

To keep the example simple, we will try and convert some code that we have written that converts Roman numerals to integers (and vice-versa) into a package that we can

* use anywhere on our system by typing `import roman`
* allow our colleagues to install
* allow anyone to install

by turning our function into a _package_.

If this is your first Python package, it may be the first time you are sharing code with the world at large. We will also go through some of the "best practices" you should follow, _particularly_ when sharing your code with a wider audience.

By the end of this article, you will have

* Seen the functions we want to package
* Made a Python module (i.e. something you can import from the current directory only)

## The original code for `roman.py`

During one of our projects, we wrote the following code in `roman.py` to work with Roman Numerals:
```python
# roman.py
ROMAN_SYMBOLS = [
    ('M', 1000), ('CM', 900),
    ('D', 500), ('CD', 400),
    ('C', 100), ('XC', 90),
    ('L', 50), ('XL', 40),
    ('X', 10), ('IX', 9),
    ('V', 5), ('IV', 4),
    ('I', 1)
]

def roman_string_to_int(numeral_string):
    """
    Converts a Roman numeral string to integer form
    """
    total = 0
    for symbol, value in ROMAN_SYMBOLS:
        while numeral_string.startswith(symbol):
            total += value
            numeral_string = numeral_string[len(symbol):]
    return total

def int_to_roman_string(number):
    """
    Converts a positive integer into a Roman numeral
    """
    result = ''
    for symbol, value in ROMAN_SYMBOLS:
        result += (number//value) * symbol
        number = number % value
    return result
```

If we open Python or a jupyter notebook in this directory, we can import it without a problem:
```python
>>> import roman
>>> roman.int_to_roman_string(22)
'XXII'
```

If we had a different project somewhere else, Python would not be able to find `roman.py`! You don't want to copy and paste this file to each directory it is going to be used, as over time you are likely to have several different versions of the file. After all, there could be bugs in the function that we have written!

We want to be able to install our "roman" functions so they can be accessed from anywhere. With this in mind, we create the following directory structure on our computer (it doesn't matter where):
```bash
roman_project
+-- roman
    +-- roman.py
+-- README.md
```
Here `README.md` contains any information you want to describe the `roman.py` package. Ultimately you should be putting your project on Github, so it is accessible to the rest of the world (or at least your colleagues if you use private repos).

## Packages and `__init__.py`

A _module_ is a single `*.py` file that contains some code we would like to import.

A _package_ is a collection of modules in a directory. The way that Python tells that we have a package is if the directory contains a `__init__.py` file. Even if that file is empty, it tells Python "this directory contains a collection of modules that are meant to be imported". To create the empty file, run 
```bash
touch roman/__init__.py
```
from the `roman_project` directory. Your directory structure should look like this:
```bash
roman_project
+-- roman
    +-- __init__.py
    +-- roman.py
+-- README.md
```

## Importing our module

In the `roman_project` directory, we can try importing our file:
```python
# Must lauch python from "roman_project"!
>>> import roman
# Success! Now try running one of the commands.....
>>> roman.roman_string_to_int('V')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: module 'roman' has no attribute 'roman_string_to_int'
```

It turns out we need to tell Python which file to look in. The following does work:
```python
# Need to import from roman/roman.py? Use roman.roman
>>> import roman.roman
>>> roman.roman.roman_string_to_int('V')
5
```

## Putting something useful in `roman/__init__.py`
 
Just typing `import roman` at the prompt goes to the `roman` directory, and opens `__init__.py` (which is blank). Typing `import roman.roman` imports `roman/roman.py`. We don't really want to call `roman.roman` when we do imports. The way around this is to import our files in `__init__.py` itself. Change `__init__.py` to contain the following:
```python
from .roman import roman_string_to_int, int_to_roman_string  # Note .XXXXXX means "import XXXXXX.py from current directory"

__version__ = '0.1.0'
__author__ = 'Damien Martin'
```

This imports our functions into `__init__.py` (which is read when we call `import roman`). The `__author__` and `__version__` are used in the help docstring of the module, and when checking the version of the package.

## Trying again

Go back to the `roman_package` directory, and start the Python interpreter. Now run the following:
```python
>>> import roman
# now this works!
>>> roman.roman_string_to_int('V')
5
>>> help(roman) 
```
You should see a help screen, with the author and version number set the way they were set in `roman/__init__.py`

## A package with multiple files

In order to demonstrate how multiple files work, the version of this project on Github also has `roman/temperature.py`. The temperature module contains functions that convert the temperature between Kelvin, Fahrenheit, and Celsius. While it doesn't really have anything to do with Roman numerals, it is a relatively easy example, and helps us understand how to deal with multiple modules in a package.

This article ends with the directory structure
```bash
roman_project
+-- roman
    +-- __init__.py
    +-- roman.py
    +-- temperature.py
+-- README.md
```
and the file `roman/__init__.py` as 
```python
from .roman import int_to_roman_string, roman_string_to_int
from .temperature import convert, convert_all

__version__ = '0.1.0'
__author__ = 'Damien Martin'
```

The downside to all of this work is that we can still only import our python module from `roman_project`! We will correct that in article 3 of this series, but first we need to tidy up our docstrings!

## Summary and next steps

So far we have made a local package, which is only importable from the current directory. To do this:

* We placed all the Python modules (`*.py` files) into the subdirectory `roman`
* Added `__init__.py` to the subdirectory `roman` (to make it a package)
* In `__init__.py`, imported the files we want access to
* In `__init__.py`, added some metadata (namely the `__author__` and `__version__`)

In the next article in this series, we look at writing good docstrings on our functions. 
