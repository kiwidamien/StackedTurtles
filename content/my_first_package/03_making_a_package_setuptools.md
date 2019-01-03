Title: Making a Python Package 3
Subtitle: An example using Roman Numerals III - making an installable package 
Tags: python, engineering, package, best-practices
Date: 2019-01-02 21:30
Category: Tools
Summary: This is the third in a series of blog posts where we go through the process of taking a collection of functions and turn them into a deployable Python package. In this post, we use `setuptools` to allow people to install our package on their system. 
Series: Making a Python Package
series_index: 3 

Note: To get the material for this blog post, visit the [v0.3 tag of Romans!](https://github.com/kiwidamien/Roman/tree/v0.3) Github project. To get it locally, and assuming you cloned the previous version, run
```bash
# clear last set of changes
$ git reset --hard HEAD
# checkout this version
$ git checkout tags/v0.3
```

### To install

To follow the steps in this tutorial, you will need to install `setuptools`
```bash
pip install setuptools 
```


# Making a Python Package III: installing packages

So far, we have our Python package (with nice docstrings) and our directory structure looks like this:
```bash
roman_project
+-- roman
    +-- __init__.py
    +-- roman.py
    +-- temperature.py
+-- README.md
```

We are going to include the file `setup.py` that will give Python details on how to install the new file.

## Writing `setup.py`

At the top level directory, create `setup.py` with the following contents:
```python
import setuptools

setuptools.setup(
    name="roman",
    version="0.1.0",
    url="https://github.com/kiwidamien/roman",
    author="Damien Martin",
    author_email="damien.j.martin@gmail.com",
    description="Allows conversion of Roman numerals to ints (and vice versa)",
    long_description=open('README.md').read(),
    packages=setuptools.find_packages(),
    install_requires=[],
    classifiers=[
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
    ],
)
```

Most of the fields are self-explanatory, but some highlights are

| Field | Description |
| --- | --- |
| **name** | The name the package will be imported as once installed (i.e. `install <name>`). You should make it match the directory name you stored the package. |
| **url** | The Github URL for your package. You did put your project on Github, right? (This is an optional field, you can leave it off -- but really, put it on Github!) |
| **description** | Used as a short description in the PyPI index for your package (if you post it there) when browsing the list of packages. |
| `long_description` | Text that appears on the PyPI home page for your project. |
| `install_requires` | A list of packages your package needs installed. If you need requests and numpy, have `install_requires=['numpy', 'requests']`. When using `pip` to install the package, `pip` will also install anything in this list |

## Do the installation

At this point, our directory structure is
```bash
roman_project
+-- roman
    +-- __init__.py
    +-- roman.py
    +-- temperature.py
+-- README.md
+-- setup.py
```

Run
```bash
$ python setup.py install
```

This will install `roman` on your system, so you can now use it anywhere. For example, you could open Python in your home directory, and `import roman` would work. You now have a working Python package!

If you have your Project on Github, you can now have other people install your package as well. Assuming your repo is called `roman`, the installation instructions would be:
```bash
$ pip install git+https://github.com/<github username>/roman
```
Now your and your coworkers can all share the same python package. If you update your package, you can let them know to pull a new version down from the repo and reinstall.

**IMPORTANT:** If you make corrections, you must increase the version number in `setup.py`. Pip will only upgrade, so if it sees the same version number, you cannot guarantee that it will actually install the new version, as it already thinks it is up-to-date.

## Uninstall

You _could_ stop here -- your package can be distributed out in the wild, and you have a (sort-of) updating mechanism for it.

If you are releasing software into the wild, you should start to implement best practices, which includes writing unit tests for your code. Even though this looks like a simple example (after all, Roman numerals aren't really going to change!) and we might expect that testing is superflous, the tests will actually end up changing `roman/roman.py` quite a bit! 

It would also be nice if people could just do `pip install roman` to get the package, instead of messing around with Github. 

So let's uninstall it again, so that we know we are testing the most up-to-date version (not the system version):
```bash
$ pip uninstall roman
```

## Summary and next steps

On our third article, we have achieved the main goal of having our package accessible from anywhere, and being able to distribute it. 

In this article, we covered
1. Writing `setup.py` to allow installation on your own system.
2. Installing locally using `pip setup.py install`
3. If you push the package up to github, anyone can install with `pip install git+https://github.com/<github username>/<repo name>`
4. How to uninstall with `pip uninstall roman`

In our next article, we will write some unit tests and improve the functionality of our roman numeral package.
