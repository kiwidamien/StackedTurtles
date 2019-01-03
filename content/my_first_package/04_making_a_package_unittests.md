Title: Making a Python Package
Subtitle: An example using Roman Numerals IV - writing unit tests
Tags: python, engineering, package, best-practices, unittest, pytest
Date: 2019-01-02 22:30
Category: Tools
Summary: This is the fourth in a series of blog posts where we go through the process of taking a collection of functions and turn them into a deployable Python package. In this post, we use `pytest` to write unit tests for the roman numeral package. 
Series: Making a Python Package
series_index: 1

Note: To get the material for this blog post, visit the [v0.4 tag of Romans!](https://github.com/kiwidamien/Roman/tree/v0.4) Github project. To get it locally, and assuming you cloned the previous version, run
```bash
# clear last set of changes
$ git reset --hard HEAD
# checkout this version
$ git checkout tags/v0.4
```

### To install

To follow the steps in this tutorial, you will need to install `tox` and `pytest`
```bash
pip install tox pytest
```

# Making a Python Package IV: writing unit tests 

There are many developers that would complain about us writing tests as step 4. They would claim the _first_ thing we should do is write tests that tell us what the functions _should_ do, and only then write code to satisfy the tests. This is called _Test Driven Development_ (TDD). If you are writing your first Python package, or are coming from a field like Data Science which is heavy on the EDA, you probably wrote some code and realized you could reuse it, rather than starting with the idea of creating reusable code. For that reason, I have put tests after the initial code has been written.

One important thing that we will come back to, however, is that we have to resist the temptation to write tests that duplicate the output of the code. Instead, we should start by asking ourselves "what _should_ our code do in case X?" and write a test to match that.

## Creating the directory structure

There are a few different places to put our tests, but I like having them outside my package directory. Our testing module, `pytest`, expects that
* files containing tests start with the word `test`
* functions containing tests start with the word `test`

Go ahead and create the following files:
* `tests/test_roman.py`: to test the implementation of `roman/roman.py`
* `tests/test_temperature.py`: to test the implementation of `roman/temperature.py`
* `tests/__init__.py`: we leave this blank, but it is required to turn `tests` into a package (otherwise `pytest` doesn't process the files in the test directory).

Our directory structure should now look like this:
```bash
roman_project
+-- roman
    +-- __init__.py
    +-- roman.py
    +-- temperature.py
+-- README.mdi
+-- setup.py
+-- tests
    +-- __init__.py
    +-- test_roman.py
    +-- test_temperature.py
```

## Creating our first tests

We will use the [pytest](https://semaphoreci.com/community/tutorials/testing-python-applications-with-pytest) module to write our unit tests. The simplest tests are equality assertions, where we check that a function returns the value we expect. For example, we would want `roman.roman_string_to_int('V')` to return `5`. Put the following in `test/test_roman.py`

```python
import pytest
from roman.roman import roman_string_to_int, int_to_roman_string

def test_V_gets_converted_to_5():
    assert roman_string_to_int('V') == 5
```


