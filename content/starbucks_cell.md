Title: Using Folium: What is the furthest you can get from Starbucks in Seattle?
Date: 2017-04-08 20:30
Category: Portfolio
Tags: geocoding, visualization, folium

It seems that Starbucks is ubiquitous in Seattle. Where in Seattle is furthest from a Starbucks store?

 In order to work this out, we need a list of all the stores in Seattle. The open data project [Socrata](https://opendata.socrata.com/) makes it easy to find out - you can pull the address, as well as longitude and latitude  all the Starbucks locations in the any given city.

This question was also a fun way for me to experiment with methods for presenting data and calculations on maps. My ultimate goal was to have something people could interact with on this blog, without having to install extra plugins.

## Methodolgy

First we had to decide what counted as "Seattle" for the purposes of this calculation. To make it easy to reproduce similar calculations for other cities, I decided that I would choose the bounding longitudes as the lower quartile and upper quartiles of longitudes for stores retrieved by Socrata. The same cut was made for the latitudes. This restriction hopefully makes an interesting answer, rather than telling us the middle of a residential district like *Magnolia*.

I broke Seattle into regions, called [Voronoi Cells](https://en.wikipedia.org/wiki/Voronoi_diagram). The idea is that each region has single Starbucks store in it, and is defined as the collection of points that are closest to that Starbucks. For example, taking a square city with two stores, the line halfway between the stores divides the city in two: on one side you are closer to store #1, on the other you are closer to store #2.

<div class="veronoi" style="width:20%;margin-left:auto;margin-right:auto">
<svg>
<rect x ="0" y="0" width="125" height="200"
      style="fill:yellow;fill-opacity:0.1;stroke-opacity:0.9"/>
<rect x ="125" y="0" width="125" height="200"
      style="fill:blue;fill-opacity:0.1;stroke-opacity:0.9"/>
<circle cx="50" cy="40" r="15" stroke="yellow" stroke-width="2"
        fill="yellow" />
<circle cx = "200" cy = "40" r="15"
        stroke="green" stroke-width ="2" fill="cyan" />
<line x1="125" y1="0" x2="125" y2="200"
      style="stroke:rgb(0,0,0);stroke-width:2" />
<text x="46" y="45">1</text>
<text x="195" y="45">2</text>
<text x="10" y="140">Region closer to 1</text>
<text x="130" y="140">Region closer to 2</text>
</svg>
</div>

Adding a third store changes the picture. Placing it toward the bottom of the city, but centered horizontally gives the following cells:


<div class="veronoi" style="width:20%;margin-left:auto;margin-right:auto">
  <svg width="250" height="200">
  <rect x ="0" y="0" width="125" height="80" style="fill:yellow;fill-opacity:0.1;stroke-opacity:0.9"/>
  <rect x ="125" y="0" width="125" height="80" style="fill:blue;fill-opacity:0.1;stroke-opacity:0.9"/>
  <rect x="0" y="80" width="250" height ="120" style="fill:green;fill-opacity:0.1;stroke-opacity:0.9"/>
  <circle cx="50" cy="40" r="15" stroke="yellow" stroke-width="2" fill="yellow" />
  <circle cx = "200" cy = "40" r="15" stroke="green" stroke-width ="2" fill="cyan"></circle>
  <circle cx = "125" cy = "120" r="15" stroke="green" stroke-width ="2" fill="green" />
   <line x1="125" y1="0" x2="125" y2="80" style="stroke:rgb(0,0,0);stroke-width:2" />
   <line x1="0" y1="80" x2="250" y2="80" style="stroke:rgb(0,0,0);stroke-width:2" />
   <text x="46" y="45">1</text>
   <text x="195" y="45">2</text>
   <text x="121" y="125">3</text>
</svg>
</div>

If the third store is directly below store 1, we get

<div class="veronoi" style="width:20%;margin-left:auto;margin-right:auto">
  <svg width="250" height="200">
  <rect x ="0" y="0" width="125" height="80" style="fill:yellow;fill-opacity:0.1;stroke-opacity:0.9"/>
   <polygon points="250,0 125,0 125,80 189,200 250,200" style="fill:blue;fill-opacity:0.1;" />
   <polygon points="0,80 125,80 189,200 0,200"
   style="fill:green;fill-opacity:0.1;stroke-opacity:0.9"/>
  <circle cx="50" cy="40" r="15" stroke="yellow" stroke-width="2" fill="yellow" />
  <circle cx = "200" cy = "40" r="15" stroke="green" stroke-width ="2" fill="cyan" />
  <circle cx = "50" cy = "120" r="15" stroke="green" stroke-width ="2" fill="green" />
   <line x1="125" y1="0" x2="125" y2="80" style="stroke:rgb(0,0,0);stroke-width:2" />
   <line x1="0" y1="80" x2="125" y2="80" style="stroke:rgb(0,0,0);stroke-width:2" />
   <!--
   midpoint between 1 and 2:
   [ (200,40) + (50,120)]/2 = (125,80)
   Gradient of line joining them:
   Dy/Dx = (120-40)/(50-200) = -80/150
   Gradient of normal
   150/80 = 15/8 = 1.875

   Eqn of line:
   y - 80 = (150/80)(x - 125)
   -->
   <line x1="125" y1="80" x2="189" y2="200" style="stroke:rgb(0,0,0);stroke-width:2" />
   <text x="46" y="45">1</text>
   <text x="195" y="45">2</text>
   <text x="45" y="125">3</text>
</svg>
</div>

The location furthest from a Starbucks has to either by an intersection point between the regions (the examples with three stores have one intersection point, the example with two stores has none), or a point on the boundary of the city. I was able to use `scipy.spatial.Voronoi` to calculate the Voronoi cells and get a list of intersection points, rather than trying to do it by hand. It was useful practice to annotate the maps with the cells as well.

## The map

Here is the final map produced. You can highlight the Voronoi cells by mousing over them to get an idea of how large an area each store "controls". You can also bring up information about the stores by clicking on them.

<div style="width:10%;float:left;"></div>
<div style="width:80%;margin-left: auto; margin-right:auto;">
<iframe width="100%" height="600" src="furthest_starbucks.html" frameborder="0" align="center" allowfullscreen></iframe>
</div>

We find that the furthest we can get from Starbucks in Seattle is the corner of Meridian Avenue North with North 36th street (a few streets north of Gas Works Park), shown as an orange dot. The bounding box is also shown in orange.

## Folium compared to other packages

There are many ways to plot data on top of maps with Python. Here are a few I considered before using folium:

#### Basemap (part of matplotlib)

This is a great way to create attractive graphs in Python. There are lots of tutorials, and the package is well documented. The disadvantages are that basemap expects you to obtain and manage shapefiles, and the output are static images (like the plots in matplotlib). This is easy to work with in an interactive environment, but makes it difficult to just the results of your work to someone else.

Tutorials for basemap:

1. [Creating attractive informative maps visualizations in Python with Basemap](http://www.datadependence.com/2016/06/creating-map-visualisations-in-python/)
2. [So you'd like to make a map using (basemap) python](http://sensitivecities.com/so-youd-like-to-make-a-map-using-python-EN.html#.WOncl1KZOgQ)


#### Plot.ly

This was one of the slickest options I considered. To use it, you need to create an account (free trials are offered), and it seemed difficult to embed directly on a static site. These considerations led me to dismiss `Plot.ly` fairly early, although it looks like a good option if you don't mind paying for an account.

#### Bokeh

Bokeh is a collection of plots that uses the __grammar of graphics__ to build up plots. The plots are interactive on the development machine, and you can setup your server to run Bokeh plots to allow other people to interact with your plots online. When working with static pages on a server designed to serve static pages, I would have to either embed or link to an external Bokeh plot. If I was running this off my own server, using Bokeh would certainly be viable.

#### Folium

Folium seems to be the extension of the now defunct __Vincent__ package for python. Folium makes maps that use __Leaflet.js__ to remain interactive, so you can save the output to HTML. Anyone with a browser can open the HTML (or visit it on your blog) and still pan, zoom, and have the interactive mouse-overs and tool tips still function.

The downside to folium is that there are a [lot](http://www.digital-geography.com/python-and-webmaps-folium/#.WOnulFKZOgT) [of](https://greek0.net/blog/2016/01/27/plotting_maps_with_folium/) [great](https://blog.dominodatalab.com/creating-interactive-crime-maps-with-folium/) [tutorials](https://ocefpaf.github.io/python4oceanographers/blog/2015/12/14/geopandas_folium/) ..... for version 0.2.0. The current version, 0.3.0, introduced a lot of reorganization and the documentation is lagging. All of the tutorials have commands that break in version 0.3.0. For example, in 0.2.0 the command to create a dot on the map was `folium.Map.circle_marker`, while in 0.3.0 it is `folium.CircleMarker`. The documentation is improving, and GitHub has a collection of 0.3.0 [examples](https://github.com/python-visualization/folium/tree/master/examples).

Once written, the code is very readable, and there is great integration with Open Street Maps, so you don't have to keep your own shape files on hand. One of the goals of this project was to be able to refer back to it as an example of how to use folium 0.3.0!

#### Geoplotlib and Kartograph.py

I only found out about these package once I had completed the project.

It looks like geoplotlib only produces static maps, similar to Basemap, but seems like it is very expressive and able to do a lot without much code. It is also integrated with GeoPandas.

Kartograph is designed to produce maps in python that are then coverted into SVG elements with embedded javascript, to enable the maps to be shared with anyone with a browser.

I will experiment with both of these in a future blog post.


### Useful links

* [The github page](https://github.com/kiwidamien/StarbucksVeronoi) for this project, or use a direct link to the [Python notebook](https://github.com/kiwidamien/StarbucksVeronoi/blob/master/TidyStarbuckSeattle.ipynb). You can experiment with your own choice of city.

* [Socrata list of Starbucks Stores](https://opendata.socrata.com/Business/All-Starbucks-Locations-in-the-World/xy4y-c4mk)

*  [Folium 0.3.0 example repository](https://github.com/python-visualization/folium/tree/master/examples)

* [Geoplotlib](https://github.com/andrea-cuttone/geoplotlib) and [Kartograph](http://kartograph.org) projects.
