Title: Stylish Pandas
Tags: tricks, formatting, notebook
Date: 2019-11-05 18:25
Category: Data Science
Summary: As the _Zen of Python_ states, "readability counts". With a few simple tips and tricks, we can make our Pandas dataframes a lot more readable.

# Stylish Pandas Dataframes

When used in an ETL, we generally don't format numbers on the screen, and styling our dataframes isn't that useful. If we are using a notebook, we are generally writing code to communicate our result, either as an exploratory data analysis (where we want to read and quickly act on results) or as part of a reproducible report for others.

By default, Jupyter outputs our dataframes in a Jupyter notebook in nice HTML tables. Sometimes the formatting of these tables can still make them difficult to read, specifically:

- Jupyter truncates the number of rows (and columns). There is a good argument for limiting the number of columns displayed. When doing EDA, however, it can be useful to scroll through multiple columns.

- When you have very large numbers, such as `10639524` it can be difficult to read them as 106 million (and change) without visual breaks. Especially since the number is actually only `10,638,524` (i.e. 10.6 million and change).

- An excessive number of decimal places can make comparing numbers between different rows difficult.

According to the _Zen of Python_, "readability counts". This article goes through some tricks to make your Jupyter notebook dataframes a little more readable.

## Number formatting

An example DataFrame with code is posted in [this gist](https://nbviewer.jupyter.org/gist/kiwidamien/f808d4b5e4efeb072d60c14def32253a), which uses campaign finance data. Let's look at a slightly simplified version, which contains fewer columns:

| Last Name | First Name | Party | Individual Contrib| Candidate Contrib | Transfers | Other | Total Funding | Individual % of total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Clinton | Hillary | Democrat | 2.311585e+08 | 997159.15 | 33940000.00 | 8446040.85 | 2.745417e+08 | 0.841980 |
| Sanders | Bernard | Democrat | 2.306704e+08 | 0 | 1500000.00 | 3252100.00 | 2.354225e+08 | 0.979814 |
| Cruz	| Rafael | Republican | 9.211106e+07 | 0 | 250012.93 | 263277.07 | 9.262435e+07 | 0.994458 |
| Trump | Donald | Republican | 3.695986e+07 | 49950643.36 |2201313.93 | 2186292.71  | 	9.129811e+07 | 0.404826 |
| Carson | Benjamin | Republican | 6.346140e+07 | 25000.00 | 0.00  | 757560.00 | 6.424396e+07 | 0.987819 |

This dataframe has some very large numbers that have defaulted to scientific notation, as well as percentages, and "normal" numbers such as 25000. It doesn't have too many columns, but does have multiple numbers.

### Global change of number formats

The simplest thing we can do is to set the format for all numbers, which we can do with the command `pd.options` structure:

```python
# Add a comma and keep to two d.p.
pd.options.display.float_format = '{:,.2f}'.format
```

We need to pass `float_format` a _function_ rather than a specific format string. Writing string with `format` (and no parethesis) is a function that we are passing. There is no specific "string" formatting for `float_format`, we are using the standard string formatting from Python. We could this code slightly less cryptically as
```python
def format_float(value):
    return f'{value:,.2f}'

pd.options.display.float_format = format_float
```

The head of our dataframe would now be displayed as 

| Last Name | First Name | Party | Individual Contrib| Candidate Contrib | Transfers | Other | Total Funding | Individual % of total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Clinton | Hillary | Democrat | 231,158,512.33 | 997,159.15 | 33,940,000.00 | 8,446,040.85 | 274,541,697.77 | 0.84 |
| Sanders | Bernard | Democrat | 230,670,405.61 | 0.00 | 1,500,000.00 | 3,252,100.00 | 235,422,542.44 | 0.98 |
| Cruz	| Rafael | Republican | 92,111,063.05 | 0.00 | 250,012.93 | 263,277.07 | 992,624,351.05 | 0.99 |
| Trump | Donald | Republican | 36,959,857.71 | 49,950,643.36 |2,201,313.93 | 2,186,292.71  | 	91,298,110.38	 | 0.40 |
| Carson | Benjamin | Republican | 63,461,402.63 | 25,000.00 | 0.00  | 757,560.00 | 64,243,961.26 | 0.99 |

Note that all numbers, including the percentages, have commas and two decimal places. This global change will also make _all_ dataframes have this format (which might be what you want).

### Styling individual columns

Let's make the percentages look nice. Here is an example of how to format percentages:
```python
>>> '{:.1%}'.format(0.1033)
'10.3%'
```

To style the dataframe `df`, we can use the `df.style.format(format_dict)`, where `format_dict` has column names for keys, and the format string as the value. We can called our dataframe `contribution` to contain the financial information for each candidate. In this case, we could use
```python
# Note the value is a format STRING, NOT a function!
format_dict = {
    'Individual % of total': '{:.1%}'
}

# our dataframe containing the data is called contribution
contribution.head().style.format(format_dict)
```
The output is

| Last Name | First Name | Party | Individual Contrib| Candidate Contrib | Transfers | Other | Total Funding | Individual % of total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Clinton | Hillary | Democrat | 2.311585e+08 | 997159.15 | 33940000.00 | 8446040.85 | 2.745417e+08 | 84.2% |
| Sanders | Bernard | Democrat | 2.306704e+08 | 0 | 1500000.00 | 3252100.00 | 2.354225e+08 | 98.0% |
| Cruz	| Rafael | Republican | 9.211106e+07 | 0 | 250012.93 | 263277.07 | 9.262435e+07 | 99.4% |
| Trump | Donald | Republican | 3.695986e+07 | 49950643.36 |2201313.93 | 2186292.71  | 	9.129811e+07 | 40.5% |
| Carson | Benjamin | Republican | 6.346140e+07 | 25000.00 | 0.00  | 757560.00 | 6.424396e+07 | 98.8% |

#### What happened to the default formatting? An aside on stylers vs dataframes

Our earlier `pd.options.display.float_format = '{:,.2f}'.format` command changed the default style for all _dataframes_ in our notebook. When we access the style attribute, a _styler_ is returned. Specifically:

| Variable | `type(Variable)` |
| --- | --- | 
| `contribution` | `pd.DataFrame` |
| `contribution.style` | `pd.io.formats.style.Styler` |

As a side effect, dataframe methods don't work on stylers. So while `contribution.head().style.format(format_dict)` is legal, `contribution.style.format(format_dict).head()` is not, as a styler doesn't have a `head()` method.


The default styling options _don't_ apply to styler objects (annoyingly). If you use the format specification for a column, you will get the original formatting for all the other columns. A trick I use to get around this is to use `select_dtypes` to select the numeric columns, and then use a dictionary comprehension to generate a dictionary with defaults, and then override the columns I want. In code:
```python
# set ALL float columns to '${:,.2f}' formatting (including the percentage)
format_dict = {col_name: '${:,.2f}' for col_name in contribution.select_dtypes(float).columns}
# override the percentage column
format_dict['Individual % of total'] = '{:.1%}'

contribution.head().style.format(format_dict)
```
This will display

| Last Name | First Name | Party | Individual Contrib| Candidate Contrib | Transfers | Other | Total Funding | Individual % of total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Clinton | Hillary | Democrat | $231,158,512.33 | $997,159.15 | $33,940,000.00 | $8,446,040.85 | $274,541,697.77 | 84.2% |
| Sanders | Bernard | Democrat | $230,670,405.61 | $0.00 | $1,500,000.00 | $3,252,100.00 | $235,422,542.44 | 98.0% |
| Cruz	| Rafael | Republican | $92,111,063.05 | $0.00 | $250,012.93 | $263,277.07 | $992,624,351.05 | 99.4% |
| Trump | Donald | Republican | $36,959,857.71 | $49,950,643.36 | $2,201,313.93 | $2,186,292.71  | 	$91,298,110.38	 | 40.5% |
| Carson | Benjamin | Republican | $63,461,402.63 | $25,000.00 | $0.00  | $757,560.00 | $64,243,961.26 | 98.8% |

### Summary on number formatting

* To set the number format for all dataframes, use `pd.options.display.float_format` to a _function_.
* To set the number format for a specific set of columns, use `df.style.format(format_dict)`, where `format_dict` has column names as keys, and format _strings_ as values.
* If you use `df.style.format(....)`, you get a styler object back, not a dataframe. The default options won't be set.
* You can use `df.select_dtypes(float).columns` to get the names of all the float columns, which can be used to generate a dictionary with default format strings, that you can then selectively override.

## Other formatting


### Making more columns visible

A common problem when exploring data is having 20 (or more) columns, and having Jupyter truncate the display. This isn't an issue with our contributions dataset, but it can be an issue when exploring larger datasets. The options here are largely self-explanatory:

```python
# Show up to 15 cols, 50 rows by default
pd.set_option('display.max_cols', 15)
pd.set_option('display.max_rows', 50)
```

The pandas [`set_option`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.set_option.html) documentation lists other settings you can change, but `max_cols` and `max_rows` are generally the only ones I set.

### Graph magics

With graphics, the things I generally want to change are 

- the default figure size (make larger)
- making the figures higher defintion
- changing the figures from PNG to SVG (see note below)

SVG (Scalable Vector Graphics) are rendered as web elements, and rescale as the size of the figure scales. This means that they are not prone to pixelation artifacts, and are generally much cleaner. However, each point and line is now a new HTML element in the page. If you have hundreds or thousands of points in a scatter plot, this will put hundreds or thousnads of points to your page. A PNG graphic only saves the output, so it scales much better to many points.

The code for achieving these changes are
```python
import matplotlib.pyplot as plt

plt.rcParams['figure.figsize'] = (12, 10)
%config InlineBackend.figure_formats = ['retina']        # retina only
%config InlineBackend.figure_formats = ['svg', 'retina'] # both SVG and retina 
```

The [matplotlib options docs](https://ipython.org/ipython-doc/2/config/options/notebook.html) give a range of options that might be useful for customizing your graphs.

### String formatting

These next two sections are probably a little gimmicky, but might come in handy. If we want to _display_ the last name in capital letters, without actually changing it, we can use the format dict for that as well:

```python
# .... using same format_dict as before, but add a key
format_dict['Last Name'] = lambda x: x.upper()

# Print out the resulting dataframe
contribution.head().style.format(format_dict)
```

| Last Name | First Name | Party | Individual Contrib| Candidate Contrib | Transfers | Other | Total Funding | Individual % of total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CLINTON | Hillary | Democrat | $231,158,512.33 | $997,159.15 | $33,940,000.00 | $8,446,040.85 | $274,541,697.77 | 84.2% |
| SANDERS | Bernard | Democrat | $230,670,405.61 | $0.00 | $1,500,000.00 | $3,252,100.00 | $235,422,542.44 | 98.0% |
| CRUZ	| Rafael | Republican | $92,111,063.05 | $0.00 | $250,012.93 | $263,277.07 | $992,624,351.05 | 99.4% |
| TRUMP | Donald | Republican | $36,959,857.71 | $49,950,643.36 | $2,201,313.93 | $2,186,292.71  | 	$91,298,110.38	 | 40.5% |
| CARSON | Benjamin | Republican | $63,461,402.63 | $25,000.00 | $0.00  | $757,560.00 | $64,243,961.26 | 98.8% |

### Cell formatting

Our second gimmicky trick shows you how to apply CSS to a cell in a dataframe. In CSS, `background-color: <value>` assigns the background color of a cell, while `color: <value>` assigns the color of the text in the cell. We need a function that, given the value of a cell, returns the CSS string we want applied to the cell. If we are trying to apply multiple attributes (such as a background color and a text color) we separate the different attributes by a semi-colon.

This example shows how to make changes based on the party affilication of the candidate. First we need a function that will return the appropriate CSS string for the given input value:

```python
def party_color(party_value):
    bgcolor = 'grey'
    if party_value == 'Democrat':
        bgcolor = 'blue'
    if party_value == 'Republican':
        bgcolor = 'red'
    if party_value == 'Green':
        bgcolor = 'green'
    return f'color: white; background-color: {bgcolor}'
```

We can now use `applymap` on the styler object to color the "Party" column, like so:
```python
(
contributions.head()
 .style
 .format(format_dict)
 .applymap(party_color, subset=['Party'])
)
```

<table>
<tr>
    <th>Last Name</th> 
    <th>First Name</th>
    <th>Party</th>
    <th>Individual Contrib</th> 
    <th>Candidate Contrib</th>
    <th>Transfers</th>
    <th>Other</th>
    <th>Total Funding</th>
    <th>Individual % of total</th>
</tr>
<tr>
    <td>CLINTON</td>
    <td>Hillary</td>
    <td style='background-color: blue; color: white'>Democrat</td>
    <td>$231,158,512.33</td>
    <td>$997,159.15</td>
    <td>$33,940,000.00</td>
    <td>$8,446,040.85</td>
    <td>$274,541,697.77</td>
    <td>84.2%</td>
</tr>
<tr>
    <td>SANDERS</td>
    <td>Bernard</td>
    <td style='background-color: blue; color: white'>Democrat</td>
    <td>$230,670,405.61</td>
    <td>$0.00</td> 
    <td>$1,500,000.00</td>
    <td>$3,252,100.00</td>
    <td>$235,422,542.44</td>
    <td>98.0%</td>
</tr>
<tr>
    <td>CRUZ</td>
    <td>Rafael</td>
    <td style='background-color: red; color: white'>Republican</td>
    <td>$92,111,063.05</td>
    <td>$0.00</td>
    <td>$250,012.93</td>
    <td>$263,277.0</td>
    <td>$992,624,351.05</td>
    <td>99.4%</td>
</tr>
<tr>
    <td>TRUMP</td>
    <td>Donald</td>
    <td style='background-color: red; color: white'>Republican</td>
    <td>$36,959,857.71</td>
    <td>$49,950,643.36</td>
    <td>$2,201,313.93</td>
    <td>$2,186,292.71</td>
    <td>$91,298,110.38</td>
    <td>40.5%</td>
</tr>
<tr>
    <td>CARSON</td>
    <td>Benjamin</td> 
    <td style='background-color: red; color: white'>Republican</td>
    <td>$63,461,402.63</td>
    <td>$25,000.00</td>
    <td>$0.00</td>
    <td>$757,560.00</td>
    <td>$64,243,961.26</td>
    <td>98.8%</td>
</table>

## Summary

We have seen quite a few tricks. Some of them, like coloring the background of a cell or uppercasing a cell, have very limited applicability. Especially capitalizing a string, it probably isn't a great idea to change the representation of a string from it's underlying form. But there are some options I like to put at the top of most of my Python files:

```python
import pandas as pd
import matplotlib.pyplot as plt

# Show up to 15 cols, 50 rows by default
pd.set_option('display.max_cols', 15)
pd.set_option('display.max_rows', 50)
# Suitable default display for floats
pd.options.display.float_format = '{:,.2f}'.format

%matplotlib inline
plt.rcParams['figure.figsize'] = (12, 10)

# This one is optional -- change graphs to SVG
# Only use if you don't have a lot of points/lines
# on your graph.
# Can also just use ['retina'] if you don't want SVG.
%config InlineBackend.figure_formats = ['retina', 'svg']
```

Often, one of the most frustrating things is formatting floats. The summary in formatting numbers is pretty useful:

* To set the number format for all dataframes, use `pd.options.display.float_format` to a _function_.
* To set the number format for a specific set of columns, use `df.style.format(format_dict)`, where `format_dict` has column names as keys, and format _strings_ as values. (Note: functions will also work as values, such as the upper case example)
* If you use `df.style.format(....)`, you get a styler object back, not a dataframe. The default options won't be set.
* You can use `df.select_dtypes(float).columns` to get the names of all the float columns, which can be used to generate a dictionary with default format strings, that you can then selectively override.

A nice function for applying the default style and overwrites is
```python
def style_columns(df, format_dict, default_float_format='{:,2f}'):
    full_format_dict = {col: default_float_format for col in df.select_dtypes(float).columns}
    # merge the two dictionaries, giving priority to format_dict
    full_format_dict = {full_format_dict, **format_dict}
    return df.style.format(full_format_dict)

# Usage:
style_columns(contributions, {'Individual % of total': '{:.1%}'})
```

Look at the [example gist](https://nbviewer.jupyter.org/gist/kiwidamien/f808d4b5e4efeb072d60c14def32253a) to get a view of a notebook that uses these tip and tricks.

### Other resources

* [`set_option` documentation](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.set_option.html)
* [Example gist](https://nbviewer.jupyter.org/gist/kiwidamien/f808d4b5e4efeb072d60c14def32253a) 
* [Documentation on styling](https://pandas.pydata.org/pandas-docs/stable/user_guide/style.html)
