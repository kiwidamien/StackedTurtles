title: Keeping Notebooks Clean
Tags: Clean code, best practices, notebooks, interview
Date: 2019-06-13 22:00
Category: Tools
Summary: Jupyter notebooks allow for quick experimentation and exploration, but can encourage some bad habits. One subtle error is the usage of global variables in a Jupyter notebook. This is a quick post to show the error, and some steps you can take to avoid it


Jupyter notebooks are useful for a couple of things:

1. Experimentation and exploration,
2. Adding a narrative to your examples (for example, by including plots).

Experimentation and exploration is typically messy code; it is not expected to be long-lived, and it is generally not considered worth the effort of refactoring and maintaining the code if it is just going to be thrown away. The second class (adding a narrative) generally requires clean code, as the document is supposed to be long lived. My suggested best practise for such cases is to _write meaningful code in external files, and import it_. That is, your analysis should be something along the lines of

```python
import pandas as pd
# Your file is analysis.py
from analysis import get_daily_sales

sales = pd.read_csv('sales.csv')

daily_sales = get_daily_sales(sales, '2019-01-01', '2019-06-01')
daily_sales.plot()
```

i.e. the messy data wrangling is happening in `analysis.py`, allowing the person reading your notebook to focus on your analysis and the narrative. After all, we don't need to see the body of `get_daily_sales` to know what the _intention_ behind that function is. Written this way, your code should have almost no comments; instead you should be using Markdown cells to make comments about the _analysis_ (e.g. why daily sales is the relevant thing to look at) and not about your functions. In short:
> Someone reading your notebook is reading about the analysis and the business case, someone reading `analysis.py` is reading your code for correctness.

So the _short_ version of this article is
* Explore in the notebook
* Refactor into functions
* Import the functions back into the notebook
* Notebook markdown cells should describe the analysis; the code cells should be short with descriptively named functions.

### When is it more painful to follow this advice?

Sometimes, real world practicalities make this advice difficult to follow. Some specific examples:

* __Takehomes:__ People evaluating your takehome probably are not going to simply trust that you implemented your functions correctly. They will actually want to look at your code, and it is a hassle for them to jump between your external file and your notebook. 
* __Teaching:__ I have some experience teaching data analytics, which really involves teaching both the analytics skills (what questions should I be asking?) as well as the coding skills (how do I get Python/Pandas to answer this question?). Teaching them both together means having a notebook that contains both the analytics (the what) along with the python implementation (the how). I haven't seen a successful approach of teaching the two separately, and it would increase cognitative load to keep flipping between a Python file and a notebook. The painful irony of not adhearing to best practices while teaching is not lost on me!
* __Ad hoc analysis:__ Generally I would still advocate this approach for an _ad hoc_ analysis. If you are sharing the analysis with someone else, and the project is too trivial to warrant a github repo, the notebook approach has the advantage of keeping all the code in one file. I would generally advocate making two files.

## Keeping your notebook clean

So, for some reason or another, you have your code in a Jupyter notebook. Here are some steps you can take to clean it:




1. Install an autoformatter, such as `black` (optional)
2. Group your functions together into external files, such as `analysis.py`, `plotting.py`
3. Run a code linter on your external files
4. Write all your imports into their own cells (e.g. `from analysis import *`)
5. Run your notebook from beg
