Title: Webscraping beyond BeautifulSoup and Selenium
Subtitle: Article 1 -- an overview
Tags: Webscraping
Date: 2018-10-15 17:00
Category: Web
Summary: Introduction to a series of articles on alternatives to Selenium for AJAX/Javascript enabled webpages.
Series: Advanced Webscraping
series_index: 1

# Static vs Dynamic

The Python documentation, wikipedia, and most blogs (including this one) only include _static content_. That is, when a browser or the `requests` library asks for the URL, the information is already processed and ready to go. If that's the case, then a parser like BeautifulSoup is probably all you need. A short example of scraping a static page is demonstrated below. I have a more through overview of BeautifulSoup [here](#todo), and an example

A site with _dynamic content_ is one where requesting the URL brings up Javascript, which the browser is supposed to execute. This is common for sites that are supposed to update. For example, a weather webpage such as [weather.com](http://weather.com) would use Javascript to look up the latest weather. An Amazon webpage would use Javascript to load the latest reviews from its database. If you use a parser on a dynamically generated page, you will just get a skeleton of the page with the unexecuted javascript on it. Most of this post will be devoted to outlining different strategies for scraping dynamic pages.

## An example of scraping a static page

Here is a small piece of code demonstrating how to get the Introduction section of the Python style guide, [PEP8](https://www.python.org/dev/peps/pep-0008/):

```python
import requests
from bs4 import BeautifulSoup   # install with 'pip install BeautifulSoup4'


url = 'https://www.python.org/dev/peps/pep-0008/'

r = requests.get(url)

soup = BeautifulSoup(r.text, 'html.parser')

# By inspecting the HTML in our browser, we find the introduction
# is contained in <div id='introduction'> ..... </div>
intro_div = soup.find(id='introduction')

print(intro_div.text)
```

This prints

>Introduction
This document gives coding conventions for the Python code comprising
the standard library in the main Python distribution.  Please see the
companion informational PEP describing style guidelines for the C code
in the C implementation of Python [1].
....

Volia! If all you have is a static page, you are done!

## The straightforward way to scrape a dynamic page

The easiest way of scraping a dynamic page is to actually execute the javascript, and allow it to alter the HTML to finish the page. We can pass the rendered (i.e. finalized) HTML to python, and use the same parsing techniques we used on static sites. The Python module [Selenium](https://www.seleniumhq.org/) allows us to control a browser directly from Python. The steps to Parse a dynamic page using Selenium are:

1. Initialize a _driver_ (basically a browser window that Python controls)
2. Direct the driver to the URL we are interested in.
3. Wait for the driver to finish executing the javascript, and changing the HTML. The driver is typically a Chrome driver, so the page is treated the same way as if you were visiting it in Chrome.
4. Use `driver.page_source` to get the HTML as it appears after javascript has rendered it.
5. Use a parser on the returned HTML

The website https://webscraper.io has some fake pages to test scraping on. Let's use it on the page https://www.webscraper.io/test-sites/e-commerce/allinone to get the product name and the price for the three items listed there. At the time this article was written, the products were a Dell Inspiron 14 ($1140.20), an Acer Aspire ES1 ($379.95), and a Galaxy Tab 3 ($107.99).

![Example e-commerce page for webscraping practice](images/webscraping/e-commerce-example.png)

Once the HTML has been by Selenium, each item has a div with class `caption` that contains the information we want. The product name is in a subdiv with class `title`, and the price is in a subdiv with the classes `pull-right` and `price`. Here is code for scraping the product names and prices:
```python
from bs4 import BeautifulSoup
from selenium import webdriver
import time

url = 'https://www.webscraper.io/test-sites/e-commerce/allinone'

# Change argument to the location you installed the chrome driver
# (see selenium installation instructions, or get the driver for your
# system from https://sites.google.com/a/chromium.org/chromedriver/downloads)
driver = webdriver.Chrome('/Users/damien/Applications/chromedriver')
driver.get(url)

# Give the javascript time to render
time.sleep(1)

# Now we have the page, let BeautifulSoup do the rest!
soup = BeautifulSoup(driver.page_source)

# The text containing title and price are in a
# div with class caption.
for caption in soup.find_all(class_='caption'):
    product_name = caption.find(class_='title').text
    price = caption.find(class_='pull-right price').text
    print(product_name, price)
```

# Alternatives to Selenium

Using Selenium is an (almost) sure-fire way of being able to generate any of the dynamic content that you need, because the pages are actually been visited by a browser (albeit one controlled by Python rather than you).  If you can see it while browsing, Selenium will be able to see it as well.

There are some drawbacks to using Selenium over pure requests:
* **It's slow.**
  We have to wait for pages to render, rather than just grabbing the data we want.
* 
