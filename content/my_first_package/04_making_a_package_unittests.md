Title: Making a Python Package IV - writing unit tests 
Tags: python, engineering, package, best-practices, unittest, pytest
Date: 2019-01-02 22:30
Category: Tools
Summary: This is the fourth in a series of blog posts where we go through the process of taking a collection of functions and turn them into a deployable Python package. In this post, we use `pytest` to write unit tests for the roman numeral package. 
Series: Making a Python Package
series_index: 4

Note: To get the material for this blog post, visit the [v0.4 tag of Romans!](https://github.com/kiwidamien/Roman/tree/v0.4) Github project. To get it locally, and assuming you cloned the previous version, run
```bash
# clear last set of changes
$ git reset --hard HEAD
# checkout this version
$ git checkout tags/v0.4
```

### To install

To follow the steps in this tutorial, you will need to install `pytest`
```bash
pip install pytest
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

## Creating our first test

We will use the [pytest](https://semaphoreci.com/community/tutorials/testing-python-applications-with-pytest) module to write our unit tests. The simplest tests are equality assertions, where we check that a function returns the value we expect. For example, we would want `roman.roman_string_to_int('V')` to return `5`. Put the following in `test/test_roman.py`

```python
import pytest
from roman.roman import roman_string_to_int, int_to_roman_string

def test_V_gets_converted_to_5():
    assert roman_string_to_int('V') == 5
```

At the top level directory, run 
```bash
$ pytest
```
and you should see output similar to the following
```bash
============================================== test session starts ===============================================
platform darwin -- Python 3.6.5, pytest-3.3.2, py-1.5.2, pluggy-0.6.0
rootdir: <file location of package>/roman_package, inifile:
collected 1 item


tests/test_roman.py .                                                                                      [100%]

============================================ 1 passed in 0.02 seconds ============================================
```
This tells us that our test passed!

Let's change the test so that it fails. We will change the function to
```python
def test_V_gets_converted_to_6():   # this is wrong and should fail
    assert roman_string_to_int('V') == 6
```

Now the output is
```bash
============================================== test session starts ===============================================
platform darwin -- Python 3.6.5, pytest-3.3.2, py-1.5.2, pluggy-0.6.0
rootdir: <location of file on drive>/roman_package, inifile:
collected 1 item
                                                                                                                                                                       

tests/test_roman.py F                                                                                      [100%]

==================================================== FAILURES ====================================================
___________________________________________ test_V_gets_converted_to_6 ___________________________________________

    def test_V_gets_converted_to_6():   # this is wrong and should fail
>       assert roman_string_to_int('V') == 6
E       AssertionError: assert 5 == 6
E        +  where 5 = roman_string_to_int('V')

tests/test_roman.py:5: AssertionError
============================================ 1 failed in 0.04 seconds ============================================
```
Note what the failure is telling us in some detail:

* The name of the function that failed (`test_V_gets_converted_to_6`)
* The code of the failing function
* That `roman_string_to_int('V')` actually evaluated to 5
* That `5 == 6` is not a true statment.

In this case, it is easy to see that our test is incorrect, because we deliberately made the test wrong to see what information we get. One of the key pieces of information is the name of the failing test. When naming test functions, it should be very clear exactly what is being tested. We should write names as questions: `test_if_V_is_converted_to_6` is a bad name, `test_V_gets_converted_to_6` is a good name. By reading the name of the test, you should know _exactly_ what _should_ happen as a result of the test. 

For testing, you are encouraged to write long, verbose names. The usual "PEP 8" standards that claim you should have 79 characters per line are not applied to unit tests.

## Our second test: an assertion test

What _should_ `roman_string_to_int('Q')` return? Since 'Q' isn't a Roman numeral, our function should throw an error. Right now, it actually returns 0 -- we made the assumption when writing the function that we had a valid Roman numeral. Here is how we check for errors in `pytest`:
```python
def test_char_not_in_MDCLXVI_raises_ValueError():
    with pytest.raises(ValueError, message="Q should raise value error, not in MDCLXVI"):
        roman_string_to_int('Q')
```

Let's check it when running pytest (note that we have changed our other test back to `test_V_gets_converted_to_5`):
```bash
$ pytest
============================================== test session starts ===============================================
platform darwin -- Python 3.6.5, pytest-3.3.2, py-1.5.2, pluggy-0.6.0
rootdir: /Users/damien/metis/roman_package, inifile:
collected 2 items
                                                                                                                                                                      

tests/test_roman.py .F                                                                                      [100%]

==================================================== FAILURES ====================================================
___________________________________ test_char_not_in_MDCLXVI_raises_ValueError ___________________________________

    def test_char_not_in_MDCLXVI_raises_ValueError():
        with pytest.raises(ValueError, message="Q should raise value error, not in MDCLXVI"):
>           roman_string_to_int('Q')
E           Failed: Q should raise value error, not in MDCLXVI

tests/test_roman.py:9: Failed
======================================= 1 failed, 1 passed in 0.05 seconds =======================================
```
We see the first test passed and the second one failed (hence `.F` after `tests/test_roman.py`).

These are the two most common tests that we will use.

## Writing tests

Notice when we wrote the test for `roman_string_to_int('Q')`, we **didn't** look at what the code currently did (return 0) and declare that correct. We decided what the code should do (raise an error) and then wrote a test to see if our implementation did what we expected. In this case, it does not! This tells us we should probably go back and change `roman/roman.py` to raise an error when an illegal string is passed in.

It won't always be clear what the "right" behavior should be. For example, what should `roman_string_to_int('')` be? Here are two possibilities:

* The empty string contains nothing, so it should represent 0, or
* The Roman's had no concept or representation of 0, so `''` should raise a ValueError.

I could defend either of these positions, and when writing the function I didn't take a particular stand one way or the other. If this package is mostly used to label copyright dates, the case of zero coming up doesn't seem particularly likely, so we just have to make a decision. I won't tell you what decision I made, but I will tell you the name of the test I wrote: `test_empty_string_gives_zero`. Even though there isn't a "right" answer, someone reading my test code should be able to determine what I decided.

Let's look at another example. What should `roman_string_to_int('iii')` be? There are at least two reasonable answers here:

* Roman numerals should be considered case insensitive, so 'iii' should resolve to 3 (like it does in the Preface of books)
* Roman numerals were always used by the Romans in upper case, so 'i' (and other lower case letters) should be considered illegal.

Which would you decide to use?

Then there is the question of whether 'LLL' is legal. On the one hand, it is unambiguous: 'L' represents 50, so 'LLL' should be 150. On the other hand, we "should" take 'LLL' and reduce it to 'CL' as the "correct" or "usual" representation of 150. So if a user passes in a string like "LLL" or "IIIIIIIIII" do we evaluate it, or raise an error? What about "MMMMM"? The usual pattern is when we have 5 repeating powers of 10, we replace it with the next highest symbol (e.g. `IIIII->V, XXXXX->L, CCCCC->D`). Since there is nothing higher than `M`, do we declare Roman numerals incapable of representing numbers greater than 4999? Or do we accept that we can have as many `M`s as we want?

Let me list all of my tests in `tests/test_roman.py`. I claim you should be able to answer these questions after reading the name of the tests.

|Test function name | Result (Pass/Fail) |
| --- | --- | 
| `test_empty_string_gives_zero()` | Pass |
| `test_char_not_in_MDCLXVI_raises_ValueError()` | Fail |
| `test_error_on_lower_case()` | Fail |
| `test_III_is_converted_to_3()` |  Pass |
| `test_IV_is_romaned_to_four()` | Pass |
| `test_LLL_throws_ValueError()` | Fail |
| `test_CCC_gives_300()` | Pass |
| `test_CI_allows_and_gives_101()` | Pass |
| `test_IC_throws_ValueError()` | Fail |
| `test_5_gives_V()` | Pass |
| `test_10_gives_X()` | Pass |
| `test_50_gives_L()` | Pass |
| `test_100_gives_C()` | Pass |
| `test_500_gives_D()` | Pass |
| `test_1000_gives_M()` | Pass |
| `test_6000_is_MMMMMM()` | Pass |
| `test_2018_is_MMXVIII()` | Pass |

You can probably think of other tests (e.g. trying to convert a fraction, or a negative number). The important thing here is that I didn't pick tests that would pass, I picked cases and determined what I wanted the behavior to be (or at least, made a choice about what it should be). It is now my job to rewrite the functions to make the tests pass.

**Note:** If you are using the `v0.4` branch off github, you can see that I have also written unit tests for the temperature functions. I won't be covering them in these articles, but they are worth looking over.

## How testing helps

Our original version of `roman/roman.py` was this:
```python
# We don't want these exposed to the end user,
# so lead with an underscore instead
_ROMAN_SYMBOLS = [
    ('M', 1000), ('CM', 900),
    ('D', 500), ('CD', 400),
    ('C', 100), ('XC', 90),
    ('L', 50), ('XL', 40),
    ('X', 10), ('IX', 9),
    ('V', 5), ('IV', 4),
    ('I', 1)
]

def roman_string_to_int(numeral_string):
    """Converts a numeral string representing a roman numeral to an integer.

    Args:
        numeral_string: represents a valid roman numeral. Must consist only of
                        M, D, C, L, X, V, and I.

    Returns:
        An integer.

    Examples:
        >>> roman_string_to_int('V')
        5
        >>> roman_string_to_int('MMXIX')
        2019
    """
    total = 0
    for symbol, value in _ROMAN_SYMBOLS:
        while numeral_string.startswith(symbol):
            total += value
            numeral_string = numeral_string[len(symbol):]
    return total

def int_to_roman_string(number):
    """Converts a positive integer into a Roman numeral.

    Args:
        number: a positive integer to be converted into a roman numeral

    Returns:
        The string representation of number.

    Examples:
        >>> int_to_roman_string(5)
        'V'
        >>> int_to_roman_string(2019)
        'MMXIX'
    """
    result = ''
    for symbol, value in _ROMAN_SYMBOLS:
        result += (number//value) * symbol
        number = number % value
    return result
```

After rewriting it to make the tests work, I have the following:
```python
# We don't want these exposed to the end user,
# so lead with an underscore instead
_ROMAN_SYMBOLS = [
    ('M', 1000), ('CM', 900),
    ('D', 500), ('CD', 400),
    ('C', 100), ('XC', 90),
    ('L', 50), ('XL', 40),
    ('X', 10), ('IX', 9),
    ('V', 5), ('IV', 4),
    ('I', 1)
]

_ROMAN_POWERS_TEN = 'MCXI'
_ROMAN_MID_POWERS = 'DLV'
_ROMAN_ALL_SYMBOLS = ''.join([p + m for p, m in zip(_ROMAN_POWERS_TEN,
                                                    _ROMAN_MID_POWERS)]) + 'I'


def _contains_replacable(numeral_string):
    """
    Here are some simplifible rules. We will use I for powers of 10, and V for
    non-powers of 10:
      IIIII->V (5 powers of 10, except M, can be replaced with next non-power)
      IIII->IV (4 powers of 10, except M, can be replaced)
      VV->X (2 non-powers of 10 can be replaced with next highest power of 10)
      VIV->IX (nonpower, power, nonpower is replacable)
    Note all "replaceable" strings are in the same power (e.g. I,V/X,L/C,D)

    Raises a ValueError on finding a reducible substring.
    """
    levels = zip(_ROMAN_MID_POWERS, _ROMAN_POWERS_TEN[1:])
    for non_power, power_10 in levels:
        reducibles = [power_10*5, power_10*4, non_power*2,
                      non_power+power_10+non_power]
        for reducible in reducibles:
            if reducible in numeral_string:
                raise ValueError(f"""{numeral_string} is not a correctly
                                 formated roman numeral (it contains
                                 {reducible} as a substring, which is
                                 reducible)""")


def _check_all_characters_legal(numeral_string):
    """
    Raises a ValueError if numeral_string contains a character not in MDCLXVI
    """
    illegal_chars = set(numeral_string) - set(_ROMAN_POWERS_TEN +
                                              _ROMAN_MID_POWERS)
    if len(illegal_chars):
        raise ValueError(f"""{numeral_string} contains {illegal_chars}, which
                         are not allowed in Roman numerals""")


def _check_for_illegal_combos(numeral_string):
    """
    Raises a ValueError if numeral_string contains an illegal combination.
    An illegal combination is any string where:
        - A digit with a smaller value appears before a larger value, with the
        exceptions of CM, CD, XC, XL, IX, IV (e.g. IC is illegal)
        - Two or more smaller values appear immediately before a larger value
        (e.g. CM is legal, but CCM is not)
    """
    illegal_substrings = ['CCM', 'CCD', 'XXC', 'XXL', 'IIX', 'IIV']
    exception_substrings = ['CM', 'CD', 'XC', 'XL', 'IX', 'IV']

    for illegal_substring in illegal_substrings:
        if illegal_substring in numeral_string:
            raise ValueError(f"""{numeral_string} is not a valid Roman numeral,
                             it contains the illegal substring
                             {illegal_substring}""")
    for exception_substring in exception_substrings:
        numeral_string = numeral_string.replace(exception_substring,
                                                exception_substring[-1])
    for current_char, next_char in zip(numeral_string, numeral_string[1:]):
        curr_index = _ROMAN_ALL_SYMBOLS.index(current_char)
        next_index = _ROMAN_ALL_SYMBOLS.index(next_char)
        if (curr_index > next_index):
            raise ValueError(f"""String contains an illegal combination of
                             characters""")


def _validate_string(numeral_string):
    """Raises an error if string is not valid. Interal use only."""
    _check_all_characters_legal(numeral_string)
    _contains_replacable(numeral_string)
    _check_for_illegal_combos(numeral_string)


def is_valid_roman_numeral(numeral_string):
    """Determines if numeral_string is a valid Roman numeral or not"""
    try:
        _validate_string(numeral_string)
        return True
    except ValueError:
        return False


def roman_string_to_int(numeral_string):
    """Converts a numeral string representing a roman numeral to an integer.

    Args:
        numeral_string: represents a valid roman numeral. Must consist only of
                        M, D, C, L, X, V, and I.

    Returns:
        An integer.

    Examples:
        >>> roman_string_to_int('V')
        5
        >>> roman_string_to_int('MMXIX')
        2019

    Raises:
        ValueError: if passed symbols other than MDCLXVI, or passed illegal
                    combinations (e.g. IC), or passed reducible combinations
                    (e.g. LLL)
    """
    _validate_string(numeral_string)
    total = 0
    for symbol, value in _ROMAN_SYMBOLS:
        while numeral_string.startswith(symbol):
            total += value
            numeral_string = numeral_string[len(symbol):]
    return total


def int_to_roman_string(number):
    """Converts a positive integer into a Roman numeral.

    Args:
        number: a positive integer to be converted into a roman numeral.
                Will use integer part if passed a float.

    Returns:
        The string representation of number.

    Examples:
        >>> int_to_roman_string(5)
        'V'
        >>> int_to_roman_string(2019)
        'MMXIX'

    Raises:
        ValueError: if passed a negative number
    """
    number = int(number)
    if number < 0:
        raise ValueError(f"""{number} is negative, cannot convert to Roman
                         numeral""")
    result = ''
    for symbol, value in _ROMAN_SYMBOLS:
        result += (number//value) * symbol
        number = number % value
    return result
```

It is a lot longer, but notice that

* the docstrings have been updated
* there are meaningful error messages
* we have a new user level function `is_valid_roman_numeral`

Looking at this code, it is clear that we could use `_ROMAN_MID_POWERS` and `ROMAN_POWERS_TEN` to generate `_ROMAN_SYMBOLS`, or even do away with the table altogether. With the tests in place, we are free to try and rearrange this code. When we are done, we just rerun the tests and check our changes didn't break anything.

## Summary and next steps

* We made a module `tests/` at the top level by creating `tests/__init__.py`
* We made several `tests/test_*.py` files, each of which contain different tests
* We saw how to write equality tests with `assert thing_to_test() == expected_answer`
* We saw how to write assertion tests with
```python
    with pytest.raises(ErrorType, message='this is the message'):
        function_that_should_raise_error()
```
* We emphasized you should write tests with _expected_ behavior in mind, not current behavior
* Writing tests allows us to rearrange/refactor our code with confidence, because we can check on particular examples that it did the same thing before and after the changes.

Next, we will introduce the `tox` package as a way of simplifying the testing process.
* We introduced `pytest`, which ran all files `test_` that it could find


