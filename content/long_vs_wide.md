Title: Long vs Wide Data
Tags: Data munging, Pandas
Date: 2018-09-19 11:00
Category: Posts
Summary: What does it mean for data to be in long form vs wide form, and when would you use each? In Pandas, how do you convert from one form to another?

The way we store data is often different from the way it is used to create visualizations, or how it is fed into models. Often the data stored in a database is in [tidy format](http://vita.had.co.nz/papers/tidy-data.pdf) (as described in this paper by Hadley Wickham), and we have to transform it into a form appropriate for our analysis.

The two forms of data we will talk about are _long_ and _wide_.

* **Long form**
  This is very close to the tidy format. It typically makes the data easy to store, and allows easy transformations to other types.
* **Wide form**
  Useful when looking at multiple lines / series on a graph, or when making tables for quick comparison.

Which format is more useful for a machine learning model depends on the details of the model. These descriptions can seem a little abstract without some explicit examples.

## Stock price: long to wide via `pivot`

Let's look at the stock prices for Apple ([AAPL](https://www.nasdaq.com/symbol/aapl/historical)), Amazon ([AMZN](https://www.nasdaq.com/symbol/amzn/historical)), and Google ([GOOGL](https://www.nasdaq.com/symbol/googl/historical)). We can use quandl, or simply scrape the Nasdaq pages, to get some information on how these stocks are doing. Here is a snapshot of the dataframe `stock_price_long` in "long form"/"tidy form":

| Symbol | Date | Open |
| --- | --- | --- |
| AAPL | 2018-09-18 | 217.79 |
| AAPL | 2018-09-17 | 222.15 |
| AAPL | 2018-09-14 | 225.75 |
| AAPL | 2018-09-13 | 223.52 |
| AMZN | 2018-09-18 | 1918.65 |
| AMZN | 2018-09-17 | 1954.73 |
| AMZN | 2018-09-14 | 1992.93 |
| AMZN | 2018-09-13 | 2000.00 |
| GOOGL | 2018-09-18 |  1162.66|
| GOOGL | 2018-09-17 |  1177.77|
| GOOGL | 2018-09-14 |  1188.00|
| GOOGL | 2018-09-13 |  1179.70|

Here every row tells us about a specific stock on a specific day. If we wanted to plot the performance of the stock over time, we could use seaborn (which works well with long data sets):
```python
sns.lineplot(x='Date', y='Open', hue='Symbol', data='stock_price_long')
```

INSERT GRAPH HERE

If using `matplotlib`, long form isn't ideal for making this plot. We can use `groupby` (or filter) to make the plots:
```python
for group_index, group_frame in stock_frame_long.groupby('Symbol'):
    plt.plot(group_frame['Date'], group_frame['Open'], label=group_index)

plt.ylabel('Open price')
plt.legend()
```

INSERT GRAPH HERE

An alternative is to use a _wide_ dataframe. We can make one using the `pivot` method:
```python
stock_frame_wide = stock_frame_long.pivot(index='Date', columns='Symbol', values='Open')
```
which produces the following dataframe:
  
| Symbol| AAPL	| AMZN	|  GOOGL |
| --- | --- | --- | --- |
|**Date**	|		|   |   |
|2018-09-13|	223.52 | 2000.00 | 1179.70 |
|2018-09-12|	225.75 | 1992.93 | 1188.00 |
|2018-09-17|	222.15 | 1954.73 | 1177.77 |
|2018-09-18|	217.79 | 1918.65 | 1162.66 |

Note that the dates have been moved into the index, which makes plotting relatively simple
```python
for col in stock_frame_wide.columns:
    stock_frame_wide[col].plot()

plt.ylabel('Open price')
plt.legend()
```

The advantages of the wide format in this case is that it is a lot easier to present the information to people, and is slightly more natural to use with plotting. The disadvantages of the wide form is that it becomes cumbersome to add or remove columns. For example, if a company goes bankrupt, you have to decide whether to add blank rows, or drop the column. Likewise, if a new company starts, we have missing values for the dates before that company opens.

## Olympic Medals: long vs wide with `pivot_table`

Kaggle has an easy to read [data set of Olympic medal winners](https://www.kaggle.com/the-guardian/olympic-games). Loading the data from the summer olympics we see

|    |   Year | City   | Sport    | Discipline   | Athlete               | Country   | Gender   | Event                      | Medal   |
|---:|-------:|:-------|:---------|:-------------|:----------------------|:----------|:---------|:---------------------------|:--------|
|  0 |   1896 | Athens | Aquatics | Swimming     | HAJOS, Alfred         | HUN       | Men      | 100M Freestyle             | Gold    |
|  1 |   1896 | Athens | Aquatics | Swimming     | HERSCHMANN, Otto      | AUT       | Men      | 100M Freestyle             | Silver  |
|  2 |   1896 | Athens | Aquatics | Swimming     | DRIVAS, Dimitrios     | GRE       | Men      | 100M Freestyle For Sailors | Bronze  |
|  3 |   1896 | Athens | Aquatics | Swimming     | MALOKINIS, Ioannis    | GRE       | Men      | 100M Freestyle For Sailors | Gold    |
|  4 |   1896 | Athens | Aquatics | Swimming     | CHASAPIS, Spiridon    | GRE       | Men      | 100M Freestyle For Sailors | Silver  |
|  5 |   1896 | Athens | Aquatics | Swimming     | CHOROPHAS, Efstathios | GRE       | Men      | 1200M Freestyle            | Bronze  |
|  6 |   1896 | Athens | Aquatics | Swimming     | HAJOS, Alfred         | HUN       | Men      | 1200M Freestyle            | Gold    |

This information is already in long form, which is convenient for storage. The wide form is better for:
* Visualization: The data is too detailed and not well organized to allow quick visual comparisons.
* Point summarization: If we wanted to calculate a weighted medal scores - for example 5 points for gold, 3 for silver, and 1 for gold - then this format isn't great for analysis.
* Some machine learning models: we might use this data to see if performance in previous Olympic games can help predict the spending of that country in the next Olympic games. In this case, we want to feed the model all the information about a countries performance in a given set of games on a single row to allow it to make predictions.


Let's convert this to a "wide form" with the count of medals, broken down by year, country, gender, and medal type.

Last time we converted from long form to wide form, we used `DataFrame.pivot`. In that case, each element in the wide table came from a single row. For this problem, we want to aggregate many rows by counting how many occurred, which `pivot` cannot do. Instead, we are going to use [`DataFrame.pivot_table`](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.pivot_table.html) in the following way:

```python
summer = pd.read_csv('summer.csv')

summer_wide = (summer.pivot_table(index='Year',
                        columns=['Country', 'Gender', 'Medal'],
                        aggfunc='count')
                     .fillna(0).astype(int)
                     .loc[:,('Athlete')]
               )
```

All the columns in `summer` that are not used in the `index` or `columns` call to `pivot_table` (such as "Athlete", "Discipline", and "City") are copied at the top level. The call `.loc[:, ('Athlete')]` selects just the copy for Athletes.

This dataframe has up to 6 columns per country (3 medal types for each gender), with a total of 558 columns, which is still hard to visualize. We can focus down to just American medals which has only 6 columns, and can keep the number of rows reasonable by looking Olympics ceremonies starting in 1984, using `summer_wide.loc[1984:, ('USA')]`

|      |   ('Men', 'Bronze') |   ('Men', 'Gold') |   ('Men', 'Silver') |   ('Women', 'Bronze') |   ('Women', 'Gold') |   ('Women', 'Silver') |
|-----:|--------------------:|------------------:|--------------------:|----------------------:|--------------------:|----------------------:|
| 1984 |                  26 |               106 |                  70 |                    24 |                  62 |                    45 |
| 1988 |                  37 |                49 |                  45 |                    15 |                  28 |                    19 |
| 1992 |                  35 |                57 |                  31 |                    50 |                  32 |                    19 |
| 1996 |                  40 |                59 |                  32 |                    12 |                 101 |                    16 |
| 2000 |                  22 |                68 |                  29 |                    30 |                  62 |                    37 |
| 2004 |                  33 |                51 |                  33 |                    40 |                  65 |                    42 |
| 2008 |                  57 |                67 |                  29 |                    24 |                  58 |                    80 |
| 2012 |                  19 |                42 |                  27 |                    27 |                 105 |                    30 |

To show selection using the multi-index, we could also look at women's medals from the US and Canada, starting in 1984:
```python
summer_women = summer_wide.loc[1984:, (['USA', 'CAN'], 'Women',['Gold', 'Silver', 'Bronze'])]
```
|      |   ('CAN', 'Women', 'Bronze') |   ('CAN', 'Women', 'Gold') |   ('CAN', 'Women', 'Silver') |   ('USA', 'Women', 'Bronze') |   ('USA', 'Women', 'Gold') |   ('USA', 'Women', 'Silver') |
|-----:|-----------------------------:|---------------------------:|-----------------------------:|-----------------------------:|---------------------------:|-----------------------------:|
| 1984 |                           11 |                          4 |                           21 |                           24 |                         62 |                           45 |
| 1988 |                            7 |                          3 |                            0 |                           15 |                         28 |                           19 |
| 1992 |                            2 |                         16 |                            2 |                           50 |                         32 |                           19 |
| 1996 |                            7 |                          2 |                           23 |                           12 |                        101 |                           16 |
| 2000 |                           20 |                          0 |                            3 |                           30 |                         62 |                           37 |
| 2004 |                            3 |                          1 |                            3 |                           40 |                         65 |                           42 |
| 2008 |                            4 |                          1 |                            4 |                           24 |                         58 |                           80 |
| 2012 |                           29 |                          1 |                           10 |                           27 |                        105 |                           30 |


Even so, we are left with a lot of different countries, and a very wide table. Still focusing on games from 1984 onward, lets select the countries that have won the most medals:
```python
summer_countries = (summer.pivot_table(index='Year',
                            columns=['Country'], aggfunc='count')
                          .fillna(0).astype(int)
                          .loc[:,('Athlete')]
                   )

medal_totals = summer_countries.sum(axis=0)
country_mask = (medal_totals.rank(ascending=False) <= 10)
summer_countries.loc[1984:, country_mask]
```

|      |   AUS |   FRA |   GBR |   GER |   HUN |   ITA |   NED |   SWE |   URS |   USA |
|-----:|------:|------:|------:|------:|------:|------:|------:|------:|------:|------:|
| 1984 |    50 |    68 |    72 |     0 |     0 |    63 |    40 |    32 |     0 |   333 |
| 1988 |    34 |    29 |    53 |     0 |    44 |    29 |    44 |    16 |   294 |   193 |
| 1992 |    57 |    57 |    50 |   198 |    45 |    46 |    33 |    35 |     0 |   224 |
| 1996 |   132 |    51 |    26 |   124 |    43 |    71 |    73 |    31 |     0 |   260 |
| 2000 |   183 |    66 |    55 |   119 |    53 |    65 |    79 |    32 |     0 |   248 |
| 2004 |   157 |    53 |    57 |   149 |    40 |   102 |    76 |    12 |     0 |   264 |
| 2008 |   149 |    76 |    77 |   101 |    27 |    42 |    62 |     7 |     0 |   315 |
| 2012 |   114 |    82 |   126 |    94 |    26 |    68 |    69 |    23 |     0 |   250 |

We have reduced the dataset down enough that someone would be able to look at it and discern patterns in the data.

## Demographic data: wide to long with `melt`

The [wikipedia page for Seattle](https://en.wikipedia.org/wiki/Seattle) has the following demographic information presented

|    | Race                             | 2010   | 1990   | 1970       | 1940   |
|---:|:---------------------------------|:-------|:-------|:-----------|:-------|
|  1 | White                            | 69.5%  | 75.3%  | 87.4%      | 96.1%  |
|  2 | —Non-Hispanic                    | 66.3%  | 73.7%  | 85.3%[112] | NaN    |
|  3 | Black or African American        | 7.9%   | 10.1%  | 7.1%       | 1.0%   |
|  4 | Hispanic or Latino (of any race) | 6.6%   | 3.6%   | 2.0%[112]  | NaN    |
|  5 | Asian                            | 13.8%  | 11.8%  | 4.2%       | 2.8%   |
|  6 | Other race                       | 2.4%   | NaN    | NaN        | NaN    |
|  7 | Two or more races                | 5.1%   | NaN    | NaN        | NaN   |

The numbers in brackets are the classic wikipedia citations. Here we see some of the problems with wide format: early on the questionnaires didn't ask about "other", "two or more races" or "non-hispanic" as categories, so we are forced to use `NaN`s instead. In long format, we simple wouldn't store this data.

The long format should include the `race`, the `year`, and the `percentage` of population. We will also have to clear the data a little (for example, eliminating the percentage signs and the citation brackets).

We can grab the table with a little experimentation:
```python
# Grab all the tables on the wikipedia page
seattle_tables = pd.read_html('https://en.wikipedia.org/wiki/Seattle')
demographic_wide = seattle_tables[4]

# Convert to long form:
demographic_long = demographic_wide.melt(id_vars='Race',
    value_vars = [2010, 1990, 1970, 1940],
    var_name='Year', value_name='fraction')
```

This command changes the dataframe to have two new columns: the "variable" column called `Year` and the "value" called `fraction`. Each entry in the columns `1940`, ..., `2010` gets copied onto its own row, where the column name is entered for the year, and the entry value is used for the `fraction`:

|    | Race                             |   Year | fraction   |
|---:|:---------------------------------|-------:|:-----------|
|  0 | White                            |   2010 | 69.5%      |
|  1 | —Non-Hispanic                    |   2010 | 66.3%      |
|  2 | Black or African American        |   2010 | 7.9%       |
|  3 | Hispanic or Latino (of any race) |   2010 | 6.6%       |
|  4 | Asian                            |   2010 | 13.8%      |
|  5 | Other race                       |   2010 | 2.4%       |
|  6 | Two or more races                |   2010 | 5.1%       |
|  7 | White                            |   1990 | 75.3%      |
|  8 | —Non-Hispanic                    |   1990 | 73.7%      |
|  9 | Black or African American        |   1990 | 10.1%      |
| 10 | Hispanic or Latino (of any race) |   1990 | 3.6%       |
| 11 | Asian                            |   1990 | 11.8%      |
| 12 | Other race                       |   1990 | nan        |
| 13 | Two or more races                |   1990 | nan        |
| 14 | White                            |   1970 | 87.4%      |
| 15 | —Non-Hispanic                    |   1970 | 85.3%[112] |
| 16 | Black or African American        |   1970 | 7.1%       |
| 17 | Hispanic or Latino (of any race) |   1970 | 2.0%[112]  |
| 18 | Asian                            |   1970 | 4.2%       |
| 19 | Other race                       |   1970 | nan        |
| 20 | Two or more races                |   1970 | nan        |
| 21 | White                            |   1940 | 96.1%      |
| 22 | —Non-Hispanic                    |   1940 | nan        |
| 23 | Black or African American        |   1940 | 1.0%       |
| 24 | Hispanic or Latino (of any race) |   1940 | nan        |
| 25 | Asian                            |   1940 | 2.8%       |
| 26 | Other race                       |   1940 | nan        |
| 27 | Two or more races                |   1940 | nan        |

We still have a little cleaning to do in the `fraction` column:
```python
def clean_fractions(series):
    return series.replace(r'%(\s*\[\d*\])?', '', regex=True).astype(float)/100

demographic_long['fraction'] = clean_fractions(demographic_long['fraction'])
demographic_long.dropna(inplace=True)
```
Now we have our long form "tidy" dataset:

|    | Race                             |   Year |   fraction |
|---:|:---------------------------------|-------:|-----------:|
|  0 | White                            |   2010 |      0.695 |
|  1 | —Non-Hispanic                    |   2010 |      0.663 |
|  2 | Black or African American        |   2010 |      0.079 |
|  3 | Hispanic or Latino (of any race) |   2010 |      0.066 |
|  4 | Asian                            |   2010 |      0.138 |
|  5 | Other race                       |   2010 |      0.024 |
|  6 | Two or more races                |   2010 |      0.051 |
|  7 | White                            |   1990 |      0.753 |
|  8 | —Non-Hispanic                    |   1990 |      0.737 |
|  9 | Black or African American        |   1990 |      0.101 |
| 10 | Hispanic or Latino (of any race) |   1990 |      0.036 |
| 11 | Asian                            |   1990 |      0.118 |
| 14 | White                            |   1970 |      0.874 |
| 15 | —Non-Hispanic                    |   1970 |      0.853 |
| 16 | Black or African American        |   1970 |      0.071 |
| 17 | Hispanic or Latino (of any race) |   1970 |      0.02  |
| 18 | Asian                            |   1970 |      0.042 |
| 21 | White                            |   1940 |      0.961 |
| 23 | Black or African American        |   1940 |      0.01  |
| 25 | Asian                            |   1940 |      0.028 |

## Summary and next up

* Going long to wide, where each element in the wide table comes from a single row.
  * Use `DataFrame.pivot`
  * Reasonably straight-forward
* Going long to wide, where each element in the wide table is an aggregation of multiple rows.
  * Use `DataFrame.pivot_table`
  * Will generate a copy of the aggregation for each unused varaible. This could strain memory if the number of columns is large. Possible work arounds are to `group_by` first (as described [here]()), or select only the columns you are interested in.
* Going from wide to long:
  * Usually done to store the data in tidy format.
  * Can be done partially (i.e. convert some variables from wide format to long)
  * Uses the `DataFrame.melt` command

Other articles on reshaping data you might be interested in:

1. [What is tidy data anyway?](tidy.md) (upcoming)
2. [Tidying the results of presidential elections](/munging-with-multiindices-election-data.html)
3. [Clusters for Supervised Learning: Olympic Spending](upcoming)
