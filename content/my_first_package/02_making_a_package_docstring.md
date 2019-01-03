Title: Making a Python Package II - writing docstrings
Tags: python, engineering, package, best-practices, docstrings
Date: 2019-01-01 20:00
Category: Tools
Summary: This is the second in a series of blog posts where we go through the process of taking a collection of functions and turn them into a deployable Python package. In this post, we add docstrings for our users to be able to understand what our package does.
Series: Making a Python Package
series_index: 2

Note: To get the material for this blog post, visit the [v0.2 tag of Romans!](https://github.com/kiwidamien/Roman/tree/v0.2) Github project. To get it locally, and assuming you cloned the previous version, run
```bash
# clear last set of changes
$ git reset --hard HEAD
# checkout this version
$ git checkout tags/v0.2
```

### To install

If you want to write really good docstrings, you should install `pydocstyle` with 
```bash
pip install pydocstyle
```
This is a code linter for docstrings.


# Making a Python Package II: writing docstrings

Before we write a package that other people can install and download, it is worth taking time to write some proper documentation. Right now, if we load up the Python interpreter, the docstrings for our code are not that helpful:
```python
>>> import roman.roman
>>> help(roman.roman)
```
gives the help screen
```bash
Help on module roman.roman in roman:

NAME
    roman.roman

FUNCTIONS
    int_to_roman_string(number)
        Converts a positive integer into a Roman numeral
    
    roman_string_to_int(numeral_string)
        Converts a Roman numeral string to integer form

DATA
    ROMAN_SYMBOLS = [('M', 1000), ('CM', 900), ('D', 500), ('CD', 400), ('...

FILE
    <Location of file on your system>
```

A few things to note here:

* The end user probably doesn't care about _how_ we solved this problem. The variable `ROMAN_SYMBOLS` isn't that interesting to them!
* The functions here are probably simple enough that the one line description is enough. For user facing functions, it is nice to tell us what the *inputs* are, the *returned* values, and possible *exceptions* that might get raised.

## Hiding from the user

Let's start by hiding `ROMAN_SYMBOLS` from the help function. The Python help function automatically grabs all global variables - including functions - that don't start with a leading underscore. If we don't want a variable or function to show up, we just need to start it with a leading underscore. This allows us to guide the user to only the things they care about. Simply renaming `ROMAN_SYMBOLS` to `_ROMAN_SYMBOLS` is enough to make sure it doesn't show up in the help screen.

## Google / numpy format for docstrings

A good docstring for a user-facing fucntion should contain the following parts:

1. A one-line summary of what the function does. This should end with a period.
2. A list of arguments, and their types, with a description.
3. A list of returned values and their types.
4. An example (optional).
5. A list of raised exceptions (if any).

Here is the docstring for `roman.int_to_roman_string(numeral)` to illustrate these guidelines:
```python
     """Converts a positive integer into a Roman numeral.
        
        Args:
            number: a positive integer to be converted into a roman numeral
        
        Returns:
            The string representation of numeral.
        
        Examples:
            >>> int_to_roman_string(5)
            'V'
            >>> int_to_roman_string(2019)
            'MMXIX'
     """
```

If you want to get really fancy, you can run `pydocstyle roman/roman.py` and `pydocstyle roman/temperature.py` to check for ways in which your docstring doesn't conform to convention. It is actually pretty detailed, for example, if you run it on branch v0.2 in my Github repo, it will complain that I use "Converts" rather than "Convert" in the summary, and that I don't have a blank line after my examples! We will fix these things before finally deploying the package, but it is interesting that `pydocstyle` does limited grammar checking!

### What about `temperature.py`

If we look at the `v0.1` of the code, the help for `temperature.py` is not useful
```python
>>> import roman.temperature
>>> help(roman.temperature)
NAME
    roman.temperature

FUNCTIONS
    convert(temp, from_unit, to_unit)
        Converts temp in unit from_unit to to_unit
    
    convert_C_to_F(tempC)
    
    convert_C_to_K(tempC)
    
    convert_F_to_C(tempF)
    
    convert_F_to_K(tempF)
    
    convert_K_to_C(tempK)
    
    convert_K_to_F(tempK)
    
    convert_all(temp, unit)
        Returns a dictionary, converting temp in 'unit' to all different
        units

DATA
    ABSOLUTE_ZERO_IN_C = -273.15
    CONVERSIONS = {('C', 'C'): <function <lambda>>, ('C', 'F'): <function ...
    UNITS = 'KFC'
    UNIT_NAMES = {'Celsius': 'C', 'Centigrade': 'C', 'Fahrenheit': 'F', 'K..
.
```

We aren't going to pay a lot of attention to the details of `temperature.py`, but it is worth looking at how we tidied up the docstrings:

1. We changed the 6 `convert_X_to_Y(temp)` functions to `_convert_X_to_Y(temp)` to hide them from the user. We want the user to use `convert` or `convert_all`
2. We also changed `CONVERSIONS` to `_CONVERSIONS`, as we don't want the user to access the dictionary of conversion functions directly.
3. The functions raise errors if we give a unit that it doesn't know. So we included exceptions in the docstring.
4. We chose to add an exception if the user tried to generate a temperature below absolute zero, unless he or she indicated this was okay.

Here is what the docstrings end up being for temperature:
```python
>>> import roman.temperature
>>> help(roman.temperture)
NAME
    roman.temperature

FUNCTIONS
    convert(temp, from_unit, to_unit)
        Converts temp expressed in from_unit to the numeric value expressed in
        to_unit.
        Args:
            temp (numeric): the numeric value of the temperature in from_unit.
            from_unit (string): one of 'K', 'F', or 'C' to express if temp is given
                                in Kelvin, Farenheit, or Celsius respectively.
            to_unit (string): one of 'K', 'F', or 'C' to express the unit to
                              convert the temperature in to.
        Returns:
            The numeric value of the temperature in to_unit
        Examples:
            # convert 0C into F
            >>> convert(0, 'C', 'F')
            32
            # convert 0F into C
            >>> convert(0, 'F', 'C')
            -17.777777778
            # there is one temp where C and F have same numeric value
            >>> convert(-40, 'F', 'C')
            -40
        Raises:
            KeyError: If either from_unit or to_unit are not 'K', 'F', or 'C'

    convert_all(temp, unit, allow_neg_abs=False)
        Converts temp expressed in unit to Kelvin, Fahrenheit, and Celsius
        Args:
            temp (numeric): the numeric value of the temperature.
            unit (string): one of 'K', 'F', or 'C' to express if temp is given in
                           Kelvin, Farenheit, or Celsius respectively.
            allow_neg_abs: set to True to allow temperatures below absolute zero.
        Returns:
            A dictionary with keys representing the unit, and values representing
            the temperature in that unit.
        Examples:
            >>> convert_all(0, 'C')
            {'K': 273.15, 'F': 32.0, 'C': 0}
            >>> convert_all(212, 'F')
            {'K': 373.15, 'F': 212, 'C': 100}
        Raises:
            KeyError: If unit is not one of 'K', 'F', or 'C'
            ValueError: If the temperature is below absolute zero, and
                        allow_neg_abs is False

DATA
    ABSOLUTE_ZERO_IN_C = -273.15
    UNITS = 'KFC'
    UNIT_NAMES = {'Celsius': 'C', 'Centigrade': 'C', 'Fahrenheit': 'F', 'K...

FILE
    <location of temperature.py on your machine>
```

These docstrings are also available to you if you use Shift+Tab in your Jupyter notebook. Some people would advocate docstrings this detailed all the time. For many functions, this is overkill when you are just using them locally. If you are writing a package, then you are expecting other people to be able to use your code. Be a responsbile developer and write a good docstring for your users. 

## Summary and next steps

This article showed how to write a docstrings. Technically, this has nothing to do with writing packages. You can (and should!) write thoughtful docstrings even when not writing pacakges. Similarly, your package will compile without any docstring. But you should remember all the times you typed `help(matplotlib.plot)` only to get `plot(x,y,*kw,**args)` and how sad it made you; don't do this to someone else. And if you _do_ decide to publish a package without a good docstring, make sure you remove your address from every corner of the internet first!

We saw

1. What the parts of a "good" docstring are.
2. That we can hide irrelevant detail by starting functions and variables with a leading underscore.
3. We can use `pydocstyle <filename>` to check for deviations of our docstring from the standard.

Next up, we will learn how to use `setuptools` to install the package for use anywhere on your machine (and so you can get others to install it from github)
 
