Title: Are You Getting Burned By One-Hot Encoding?
Tags: pipelines, preprocessing, categorical
Date: 2019-08-31 13:00
Category: Data Science
Slug: are-you-getting-burned-by-one-hot-encoding
Summary: A common technique for transforming categorical variables into a form suitable for machine learning is called "one-hot encoding" or "dummy encoding". This article discusses some of the limitations and folklore around this method (such as the so-called "dummy variable trap").

Many machine learning algorithms are not able to use non-numeric data. While many features we might use, such as a person's age, or height, are numeric there are many that are not. Usually these features are represented by strings, and we need some way of transforming them to numbers before using scikit-learn's algorithms. The different ways of doing this are called _encodings_.

If the strings are ordered (e.g. "best" > "good" > "fair" > "bad") then maybe all you need to do is replace the strings with a number that respect the same ordering. For example, replace "best" with 2, "good" with 1, "fair" with 0, and "bad" with -1. These variables are called _ordinal variables_, and this encoding scheme is referred to as "label encoding".

Often there will be differences between the strings, but they won't be ordered. For example if a feature is species, we don't want to say "dog" > "snake", or "mouse" > "rabbit", so label encoding isn't appropriate. Similar problems occur with encoding race, gender, state, nationality, hair color, or any other category without an order. We call these _categorical variables_.

This article focuses on one-hot encoding (also known as "dummy encoding"), which is one of the simplest encoding schemes. In particular, we focus on the question of the "dummy variable trap", as well as some of the drawbacks that led to the development of more sophisticated encodings. This article is good if you are trying to understand and apply one-hot encoding in a way that doesn't depend on the language you are using.

The article ["Encoding categorical variables"](/encoding-categorical-variables.html) gives a high level survey of many different encodings and their properties, as well as Python implementation details.

## A common solution: one-hot encoding (OHE)

One simple way of dealing with categorical variables is create a new feature for each value. This is called "one-hot encoding", or "dummy encoding". As a simple example, let's look at a feature with different species:

| Species |
| --- |
| Cat |
| Cat |
| Dog |
| Snake|
| Rabbit |
| Cat |

Each of the four different species (`Cat`, `Dog`, `Snake`, and `Rabbit`) are referred to as **levels** of the `Species` feature. One-hot encoding would turn the feature `Species` into 4 different columns (one for each level), where in each row there is exactly one 1 (the "hot" element) with the remaining elements zero:

| Species_Cat | Species_Dog | Species_Rabbit | Species_Snake |
| --- | --- | --- | --- |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 0 | 0 | 1 |
| 0 | 0 | 1 | 0 |
| 1 | 0 | 0 | 0 |

Each species is now represented by a 1 in the appropriate column, with no implicit ordering. We could pass this to a machine learning algorithm, along with other features, to make predictions.

## Problems with OHE

One-hot encoding is a particularly simple encoding scheme. When should we use it (or, perhaps more importantly, when should we avoid it)? One-hot encoding is a good choice for

* Problems with only a few "levels" (distinct values that a category can take, e.g. the number of species in our example)
* Linear models with any number of levels
* Problems where the different levels are known (or you are unlikely to encounter new levels on your testing set)

Tree-based models, such as Decision Trees, Random Forests, and Boosted Trees, typically don't perform well with one-hot encodings with lots of levels. This is because they pick the feature to split on based on how well that splitting the data on that feature will "purify" it. If we have a lot of levels, only a small fraction of the data (typically) will belong to any given level, so the one-hot encoded columns will be mostly zeros. Since splitting on this column will only produce a small gain, tree-based algorithms typically ignore the information in favor of other columns. This problem persists, regardless of the volume of data you actually have.

Linear models don't suffer from this problem. Each level gets its own coefficient, so in statistics terms you are "using up a degree of freedom" for each level of your feature. This is a problem with any encoding with many features, but with enough data, a linear model can support a large number of categories. A good solution to this problem if you have limited dataa is to see if you can cluster some of you levels together.

There is also a question of what to do if you encounter new levels on a new dataset. For some features, such as encoding `Blood Type`, we would know all the possible levels at the beginning of the problem: `AB+`, `AB-`, `A+`, `A-`, `B+`, `B-`, `O+`, `O-`. For features such as `Species`, it is highly likely we will see new values on the testing set. How to deal with new levels is something I will discuss with the "dummy variable" trap.

## The dummy trap: drop or not to drop?

So far I have claimed that one-hot encoding gives us a column for each level. However, we can drop a column from our one-hot encoding without losing any information. For example, we could encode the same series of animal names as

| Species_Dog | Species_Rabbit | Species_Snake |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 0 | 0 |
| 1 | 0 | 0 |
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 0 | 0 | 0 |

As long as we know "cat" was the dropped feature, we can tell that any row without a 1 in it represents a cat. (This is still called a one-hot encoding, although technically the cat rows are _zero_-hot encoded.)

While we might be able to recover the information about "cat" by looking at the all zero rows, you might ask what harm there is in keeping the "cat" column anyway (after all, ["explicit is better than implicit"](https://inventwithpython.com/blog/2018/08/17/the-zen-of-python-explained/)). The argument for dropping a column comes from statistics: without dropping a column, we know that the sum of all these columns will be 1 in every row. This leads to non-uniqueness and inability to interpret the coefficients uniquely, as we can change the coefficients by changing the intercept as well. This is called the [**dummy variable trap**](https://en.wikipedia.org/wiki/Dummy_variable_(statistics)). The standard advice in statistics is that you _must_ drop a column in order to avoid problems. I feel this overstates the case and leads to its own biases, but before discussing those lets look at a concrete exaample.

### The "trap" in action

Suppose we are making a "model" that predicts how much it costs to feed a particular pet a week. Our first version of this model only takes one feature, the pet's species. We know that it costs $10 to feed cats, $15 to feed dogs, $5 to feed snakes, and $8 to feed rabbits. One way we can write our model is

```python
cost = 10*Species_Cat + 15*Species_Dog + 8*Species_Rabbit + 5*Species_Snake
```

Another way we could write the same model is to start with a cost of $6, and reduce each coefficient by $6

```python
cost = 6 + 4*Species_Cat + 9*Species_Dog + 2*Species_Rabbit + (-1)*Species_Snake
```

This model produces the exact same answers for any time I make a prediction (remember than exactly one of the variables `Species_X` is equal to one, the rest are zero). There was nothing special about $6 as the starting choice; we could have picked any value we wanted, provided we adjusted the coefficients as well. The argument is that this makes the coefficients completely arbitrary and non-interpretable.

What does this model look like if we drop `Species_Cat`? To get the cost of feeding cats correct, we are forced to set the intercept to $10, and that fixes the other coefficients as well:

```python
cost = 10 + 5*Species_Dog + (-2)*Species_Rabbit + (-5)*Species_Snake
```

The coefficients are both unique and interpretable: the coefficient of `Species_X` tells you how much more expensive it is to buy food for Species `X` compared to a cat.

### Why I don't care about the dummy variable trap (in ML models)

There are two reasons I dislike the dropping a variable:

1. Introduces a bias toward the dropped variable when regularizing
2. Makes dealing with new levels difficult

Looking at the example where we dropped `Species_cat` from the model, the amount it costs to feed a cat got absorbed into the intercept term, and all other coefficients told us the difference in feeding that species relative to feeding a cat. However, the intercept is non-regularized, while the other coefficients are regularized. This means our model isn't paying a regularization penalty to get "cat" right, but it does pay a regularization cost to move other species food costs away from the value for cat. Dropping "cat" and absorbing it into the intercept actually exempts one of the features from regularization!

What would our model look like if we didn't drop `Species_cat`? We have a non-unique model, as desribed above, except that regularization will attempt to keep all the intercepts as small as possible. The intercept can be thought of as the "typical" cost to keep a pet, with the (regularized) coefficients of each species being the offset. Now no features are getting special or biased treatment.

The other reason I dislike dropping one of the columns is dealing with a new species (such as "fish") that is in the test set, but not in the training sett. If we don't drop a column, the natural thing to do is put all zeros (i.e. this animal is not any of the animals we have seen). If we dropped a column (such as "cat") then there is no longer a way to encode the new variable. A good compromise is to include another column called "other", and drop that if you want to avoid the dummy trap.

## Best practices

If you have decided that you want to one-hot encoding, here are some best practices:

1. Count the number of features you have as the number of levels + number of "numerical features" when estimating how much data you need. For example, linear models often have a guideline of having the number of rows being at least 5 times the number of features (e.g. example of the feature `Species` really counts as 4 features)
2. For tree-based models, try to keep the number of levels less than 5 (roughly each level has around 20% of the data)

Basically, this advice amounts to "keep the number of levels small". If the number of levels is large, you could be better off with a different encoding scheme. There are other ways of keeping the levels small:

* __Grouping levels together__
  * Instead of dealing with species, maybe you have classes `Cats`, `Dogs`, `Birds`, `Reptiles`, `Fish`
  * Instead of dealing with neighborhoods of New York like `Chinatown` and `DUMBO`, you use the boroughs (Manhatten, Queens, the Bronx, Brooklyn, and Staten Island).
* __Keep the first K levels with an "Other"__
  Many problems have some common levels that are most important to get right from a business perspective, and then other categories that you don't have a lot of data on. It might be worth lumping levels together _not_ because we thing they are similar, but we don't really have eonugh data to say anything about them. For example, a California company might with customers in all states, but 80% of its business is from California, 15% for Oregon, and the remaining 5% across the other 48 states. An encoding such as `(State_CA, State_OR, State_OTHER)` makes sense in this context.

Summarizing the "dummy variable trap" discussion:
1. If regularizing, or dealing with possible unknown values, don't drop a level.
2. If doing a statistical analysis (i.e. no test set and no regularization) and are looking to interpret the coefficient, drop a level.

## Summary

One-hot encoding replaces each _level_ (distinct value) in a categorical feature as its own feature. This encoding works well if there are only a few levels.

* Tree-models struggle if there are a large number of levels, regardless of how much data we have.
* Linear models can deal with a large number of levels, provided we have enough data to accurately estimate the coefficients.
* Feature engineering to reduce the number of features can dramatically improve the effectiveness of your model if you are one-hot encoding thte feature.
* If regularizing, don't drop a level - it biases your model in favor of the variable you dropped. Regularization also takes care of the non-uniqueness problem when solving your linear model.
* If you have a separate test set, make sure the way you encode will work with new unseen values. In particular, avoid using `pd.get_dummies`!

## References

* [Encoding categorical variables](/encoding-categorical-variables.html)
* [Why `pd.get_dummies` is Evil, Use Category Encoders Instead](/get-dummies-is-evil.html)
