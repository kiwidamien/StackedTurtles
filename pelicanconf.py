#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Damien Martin'
SITENAME = u'Stacked Turtles'
SITEURL = 'https://kiwidamien.github.io'

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
SOCIAL = (('github', 'https://github.com/kiwidamien'),
          ('envelope', 'mailto:damien.j.martin@gmail.com'),)

DEFAULT_PAGINATION = False

LOAD_CONTENT_CACHE = False

PLUGIN_PATHS = ['/Users/damien/pelican-plugins']
PLUGINS = ['assets', 'gravatar', 'neighbors', 'subcategory', 'series', 'readtime', 'ipynb.markup',
           'pelican_fontawesome', 'pelican_alias', 'render_math']

#THEME = '/Users/damien/pelican-themes/stye'
THEME = 'theme/attila'  # Nice jumbotron, no left sidebar
#THEME = '/Users/damien/pelican-themes/pure'    # Missing nicely formatted tables
#THEME = '/Users/damien/pelican-themes/flex'

# Look in attila/static/css/code_blocks/ for  predefined color schemes
# for code blocks
COLOR_SCHEME_CSS = 'monokai.css'


## Allow notebooks to generate markup
MARKUP = ('md', 'ipynb')

## Allow my custom css / custom images to be found
STATIC_PATHS = ['assets', 'extra/favicon.ico', 'images']

EXTRA_PATH_METADATA = {
    'extra/favicon.ico': {'path': 'favicon.ico'},
}

CSS_OVERRIDE = ['assets/css/mystyle.css']

HEADER_COVER = 'assets/images/tools.png'

HEADER_COVERS_BY_CATEGORY = {
    'tools': 'assets/images/cover_background/tool_background.svg',
    'portfolio': 'assets/images/cover_background/github_background.svg',
    'posts': 'assets/images/cover_background/panda_background.svg',
    'pandas': 'assets/images/cover_background/panda_background.svg',
    'web': 'assets/images/cover_background/web_background.svg',
    'github': 'assets/images/cover_background/github_background.svg',
}

CATEGORY_IMAGES = {
    'tools': 'assets/images/icon/tool_icon.png',
    'pandas': 'assets/images/icon/panda_icon.png',
    'posts':  'assets/images/icon/panda_icon.png',
    'github': 'assets/images/icon/github_icon.png',
    'web': 'assets/images/icon/web_icon.png',
    'default': 'assets/images/icon/tool_icon.png',
}

CATEGORY_DESCRIPTION = {
    'github': 'Posts on how to solve some of the trickier problems with git and Github.',
    'pandas': 'Posts on general data munging and processing, with an emphasis on techniques in Pandas.',
    'web': 'Posts about setting up webpages, scraping, using OAuth, or other issues in networking.',
    'tools': 'Tips and tricks on how to use different tools, such as PostgreSQL, MongoDB, and AWS. Note git has its own category.',
    'posts': 'Default category, when a post doesn\'t fit anywhere else',
}

# These appear on the left pull out bar
MENUITEMS = [('About this blog', SITEURL + '/about.html'),
             ('slashdot', 'http://slashdot.org'),
             ('metis', 'https://thisismetis.com'),
             ('stackoverflow', 'https://stackoverflow.com')]

AUTHORS_BIO = {
  "damien martin": {
    "name": "Damien Martin",
    "cover": "https://casper.ghost.org/v1.0.0/images/team.jpg",
    "image": "../assets/images/avatar.png",
    "website": "http://kiwidamien.github.io",
    "linkedin": "kiwidamien",
    "github": "kiwidamien",
    "location": "USA",
    "bio": "I am a data scientist with an interest in what drives the world. Background in Physics, Math, and Computer Science. Interested in Algorithms, Games, Books, Music, and Martial Arts. That is, when I am not off taking pictures somewhere! "
  }
}

LOGO = SITEURL + '/assets/images/icon/turtle.svg'

# Get rid of the theme SITENAME

SHOW_CREDITS = False
# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
