Title: Why `pd.get_dummies` is Evil, Use Category Encoders Instead
Tags: pandas, categorical
Slug: get_dummies_is_evil
Date: 2018-09-10 13:00
Category: Data Science
Status: Draft
Summary: A common technique for transforming categorical variables into a form suitable for machine learning is called "one hot encoding". Pandas provides a convenient function, `get_dummies` to do this, which you should never use.

Many machine learning algorithms are not able to use non-numeric data. While many features we might use, such as a person's age, or height, are numeric there are many that are not. Usually these features are represented by strings, and we need some way of transforming them to numbers before using scikit-learn's algorithms. The different ways of doing this are called _encodings_.

If the strings are ordered (e.g. "best" > "good" > "fair" > "bad") then maybe all you need to do is replace the strings with a number that respect the same ordering. For example, replace "best" with 2, "good" with 1, "fair" with 0, and "bad" with -1. These variables are called _ordinal variables_, and this encoding scheme is referred to as "label encoding".

Often there will be differences between the strings, but they won't be ordered. For example if a feature is species, we don't want to say "dog" > "snake", or "mouse" > "rabbit", so label encoding isn't appropriate. Similar problems occur with encoding race, gender, state, nationality, hair color, or any other category without an order. We call these _categorical variables_.

## A common solution: one-hot encoding

One simple way of dealing with categorical variables is create a new feature for each value. This is called "one-hot encoding", or "dummy encoding". As a simple example, let's look at a feature with different species:

| Species |
| --- |
| Cat |
| Cat |
| Dog |
| Snake|
| Rabbit |
| Cat |

One-hot encoding would turn this into 4 different columns, where in each row there is exactly one 1 (the "hot" element) with the remaining elements zero:

| Species_Cat | Species_Dog | Species_Rabbit | Species_Snake |
| --- | --- | --- | --- |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 0 | 0 | 1 |
| 0 | 0 | 1 | 0 |
| 1 | 0 | 0 | 0 |

Each species is now represented by a 1 in the appropriate column, with no implicit ordering. We could pass this to a machine learning algorithm, along with other features, to make predictions.

### The dummy trap: drop or not to drop?

We can drop a column from our one-hot encoding without losing any information. For example, we could encode the same series of animal names as


| Species_Dog | Species_Rabbit | Species_Snake |
| --- | --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 0 | 0 |
| 1 | 0 | 0 |
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 0 | 0 | 0 |

As long as we know "cat" was the dropped feature, we can tell that any row without a 1 in it represents a cat. (This is still called a one-hot encoding, although technically the cat rows are _zero_-hot encoded.)

The problem with keeping all the features is that the rows are not linearly independent. For example, using a linear model, the sum of all the columns without a dropped feature will be 1 in every row, so it will be indistinguishable from an intercept term.

This generally doesn't bother me too much if I have regularization in the model, as the intercept term is not regularized, and will be as large as possible. If you drop the "cat" column, all offsets are measured relative to the value of the feature from "cat", with the value of "cat" being absorbed into the (non-regularized) intercept. So for me, dropping the column is actually problematic because we are treating one of the values of the feature as exempt from regularization!

The other reason I dislike dropping one of the columns is the question of what happens if there is a new animal (such as "fish") that is in the test set, but not in the training set, it isn't clear what to do with it. If we don't drop a column, the natural thing to do is put all zeros. If we dropped a column (such as "cat") then there is no longer a way to encode the new variable. A good compromise is to include another column called "other", and drop that if you want to avoid the dummy trap.

## Why `pd.get_dummies` is a bad solution

Let's look at our
