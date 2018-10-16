Title: Using API calls via the Network Panel
Tags: Scraping, API, Network Panel
Date: 2018-10-16 16:00
Category: Web
Summary: Second article in the advanced web-scraping series. Clarifies the difference between static and dynamic pages. Shows how to use Chrome's Network Panel to intercept Javascript and AJAX calls.
Series: Advanced Scraping
series_index: 2

In the first article in this series, we looked at the two standard ways of scraping sites:

1. Using a parser such as BeautifulSoup for static sites
2. Using Selenium to execute Javascript on a dynamic site. Once Javascript has rendered the site, use a parser to extract the information.

On many websites, the Javascript executed by the browser makes requests from another server to get the information and process into HTML. In this installment, we investigate how to discover these network calls using Chrome's Network Panel in the Developer Tools.

We will look at two examples:

* Getting customer reviews of lipsticks from Sephora
* Getting a list of job openings at Apple

## Sephora lipstick reviews

One of my students at Metis did a project where she clustered [Sephora lipsticks by similarity](https://mayamadhavan.github.io/2018/09/30/project-fletcher/), using not only the features claimed by Sephora, but also the reviews of the different lipsticks. To do this, she had to scrape the reviews from the individual lipsticks sold.

Here is an example of a [typical lipstick page](https://www.sephora.com/product/stunna-lip-paint-P39787544?icid2=products%20grid:p39787544:product). If you visit that page, you may note that there is a link "Show 6 more reviews" at the bottom of the page that allows us to (slowly) make our way through the review. Here is a screen shot including a review:

![Some Sephora review with link to more review](images/scraping/sephora/sephora_review.png)

Investigating the "link", we see that it is actually a button (operated by Javascript). We want to find a way of getting the reviews without having to start Selenium.

### Open the Network tab

Open the [page](https://www.sephora.com/product/stunna-lip-paint-P39787544?icid2=products%20grid:p39787544:product) for this lipstick in Chrome. You can access this from the menu bar: **View -> Developer -> Developer Tools**. This will open the Developer tools on the right. Now click "Network" on the top.

![The network tools](images/scraping/sephora/network.png)

You should see a list of files that have been downloaded by this page (shown in the box under "Name"). If there is nothing there, refresh the page.

### Using the Network tab

The network panel shows the different files downloaded by the browser when opening the page. For example, if you include an image tag `<img src="some_image.png"/>` in your HTML, the browser has to download `some_image.png`. Then `some_image.png` will be recorded in the Network panel.

We are interested in whether we can find the reviews as something the page downloaded. Let's take some text from a review, and search for objects that have been downloaded with this string in it. Click on the magnifying glass (boxed in red), and copy the text `"This is a gorgeous universal red, as it dries and turns matte"` from one of the reviews into the search box:

![Finding the file that contains the review](images/scraping/sephora/search_review.png)

We see that the review is in `reviews.json?........`. We can search for the `review.json` request using the _other_ search box in the Network tab

![Finding reviews.json](images/scraping/sephora/find_reviews.png)

Looking at the header (at the top, not shown) we see the URL used to get `review.json` was

```bash
https://api.bazaarvoice.com/data/reviews.json?Filter=ProductId%3AP39787544&Sort=Helpfulness%3Adesc&Limit=30&Offset=0&Include=Products%2CComments&Stats=Reviews&passkey=rwbw526r2e7spptqd2qzbkp7&apiversion=5.4
```

This URL is a long and ugly, and has encoded parts (e.g. `Sort=Helpfulness%3Adesc`, where `%3A` is the HTML encoding for the standard colon). If we scroll to the bottom, we can find the query string parameters formatted nicely. We can put these in a standard Python dictionary:

```python
# These are the parameters used to get the first 30 reviews
params = {
  'Filter': 'ProductId:P39787544',
  'Sort': 'Helpfulness:desc',
  'Limit': 30,
  'Offset': 0,
  'Include': 'Products,Comments',
  'Stats': 'Reviews',
  'passkey': 'rwbw526r2e7spptqd2qzbkp7',
  'apiversion': 5.4
}
```

We can also see the object returned from this request by looking at the `Preview` menu (located next to `Header`). We see that a JSON object is returned (in Python, this will be a dictionary). The reviews are held as a list of dictionaries in the field `Results`. Only the first 30 reviews are included (as determined by `offset` and `limit`). Notice that the total number of reviews is also stored in the field `TotalResults`.

### The python code to get all the reviews

Here is the code for getting all the data about the reviews for this lipstick:
```python
import requests
import time


url = 'https://api.bazaarvoice.com/data/reviews.json'

params = {
  'Filter': 'ProductId:P39787544',
  'Sort': 'Helpfulness:desc',
  'Limit': 30,
  'Offset': 0,
  'Include': 'Products,Comments',
  'Stats': 'Reviews',
  'passkey': 'rwbw526r2e7spptqd2qzbkp7',
  'apiversion': 5.4
}

reviews = []
loop = 0

while True:
  params['Offset'] = len(reviews)

  # Make the same request that Javascript makes
  r = requests.get(url, params=params)

  # break if we have an error or have all the reviews
  if (r.status_code != 200) or (len(reviews) >= r.json()['TotalResults']):
    break

  # add the list of results to current results
  reviews.extend(r.json()['Results'])

  # Give a pause, so we don't get blocked
  time.sleep(0.5)

# Show how many reviews we scraped
print(len(reviews))
```
