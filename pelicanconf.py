#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Damien Martin'
SITENAME = u'Stacked Turtles'
SITEURL = '/'

PATH = 'content'

TIMEZONE = 'America/Los_Angeles'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = False

LOAD_CONTENT_CACHE = False

PLUGIN_PATHS = ['/Users/damien/pelican-plugins']
PLUGINS = ['assets', 'gravatar', 'neighbors', 'subcategory', 'series', 'readtime']

#THEME = '/Users/damien/pelican-themes/stye'
THEME = '/Users/damien/pelican-themes/attila'  # Nice jumbotron, no left sidebar
#THEME = '/Users/damien/pelican-themes/pure'    # Missing nicely formatted tables
#THEME = '/Users/damien/pelican-themes/flex'

# Look in attila/static/css/code_blocks/ for  predefined color schemes
# for code blocks
COLOR_SCHEME_CSS = 'monokai.css'

## Allow my custom css / custom images to be found
STATIC_PATHS = ['assets', 'extra/favicon.ico']

EXTRA_PATH_METADATA = {
    'extra/favicon.ico': {'path': 'favicon.ico'},
}

CSS_OVERRIDE = ['assets/css/mystyle.css']

HEADER_COVER = 'assets/images/tools.png'

HEADER_COVERS_BY_CATEGORY = {
    'tools': 'assets/images/tools.png',
    'portfolio': 'assets/images/github.png',
    'posts': 'assets/images/pandas.png',
    'web': 'assets/images/web.png',
}

# These appear on the left pull out bar
MENUITEMS = [('slashdot', 'http://slashdot.org'),
             ('metis', 'https://thisismetis.com'),
             ('stackoverflow', 'https://stackoverflow.com')]

AUTHORS_BIO = {
  "Damien Martin": {
    "name": "Damien Martin",
    "cover": "https://casper.ghost.org/v1.0.0/images/team.jpg",
    "image": "assets/images/avatar.png",
    "website": "http://kiwidamien.github.io",
    "linkedin": "kiwidamien",
    "github": "kiwidamien",
    "location": "USA",
    "bio": "This is the place for a small biography with max 200 characters. Well, now 100 are left. Cool, hugh?"
  }
}

# Get rid of the theme SITENAME

SHOW_CREDITS = False
# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
