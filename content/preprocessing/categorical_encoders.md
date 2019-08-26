Title: Encoding categorical variables
Tags: pandas, categorical
Slug: encoding-categorical-variables
Date: 2019-08-25 17:10
Category: Data Science
Summary: Non-numeric features generally have to be _encoded_ into one or more numeric features before applying machine learning models. This article covers some of the different encoding techniques, the `category_encoders` package, and some of the pros and cons of each method.

Many machine learning algorithms are not able to use non-numeric data. While many features we might use, such as a person's age, or height, are numeric there are many that are not. Usually these features are represented by strings, and we need some way of transforming them to numbers before using scikit-learn's algorithms. The different ways of doing this are called _encodings_.

Examples of the features we might need to encode:

* Which college someone when to
  _e.g. "Harvard", "Rutgers", "UCLA", "Berkeley", "Stanford", ..._
* The state someone lives in
  _e.g. California, New York, Washington, Nevada, New Hampshire, ..._
* The highest degree someone has
  _e.g. High school, Bachelors, Masters, PhD_
* Someone's profession
  _e.g. Doctor, Lawyer, Plumber, Gardener, ...._
* The cuisine type of a restaurant
  _e.g. Chinese, Indian, Italian, American, Greek, ...._
* For medical problems, patient race might be relevant to track (either because it is associated with risk factors for various diseases, or to help identify if there are populations that are not receiving appropriate attention)

The way you encode categorical variables changes how effective your machine learning algorithm is. This article will go over some common encoding techniques, as well as their advantages and disadvantages.

## Some terminology

**Levels**: A levels of a non-numeric feature are the number of distinct values. The examples listed above are all examples of levels. The number of levels can vary wildly: the number of races for a patient is typically four (asian, black, hispanic, and white), the number of states for the US is 51 (if we include DC separately), while the number of professions is in the thousands.

**Ordinal**: If the levels are *ordered*, then we call the feature *ordinal*. For example, if a class grade such as "B+" or "A" is a non-numeric feature, but the letters are not just different, they are ordered (an "A" is better than a "B+", which is better than a "C-" etc). The standard way of dealing with ordered features is just to map every level onto a number, in a way that preserves the encoding. This is called _Label_ or _Ordinal Encoding_.

**Categorical**: If the levels are just different without an ordering, we call the feature *categorical*. For example, professions or car brands are categorical. If we use an encoding that maps levels to numbers, we introduce an ordering on the categories, which _may_ not be desirable. Most of this article will be about encoding categorical variables.

**One hot encoding**: The standard technique in books for creating categorical features is to use *one-hot encoding*, which creates a new feature _per level_ of the original feature. For example, the `race` category would become 4 new features: `race_asian`, `race_black`, `race_hispanic`, and `race_white`. The profession feature would turn into thousands of new features (e.g. `profession_doctor`, `profession_plumber`, etc). This is also common because Pandas implements it using the `get_dummies` function, so it is easy to implement within Pandas. This technique becomes problematic if you have a _lot_ of levels, especially for tree-based models such as Random Forests.


## Some considerations

* __Do you have many levels?__
  If so, using an encoding that has a level-per-feature is difficult for tree-based models. Trees separate on features that "split" the data into different classes effectively. If there are many levels, it is likely only a tiny fraction of the data belong to one level, so it will be hard for trees to "find" that feature to split on. Typically this isn't a problem for linear models.

* __Are there many examples of each level?__
  If there are only 5 doctors in your dataset, you probably are not going to know the doctor category very well (nor will it generalize). Some encoders deal with this gracefully, while others won't. You might consider making an explicit "other" category for levels, or grouping categories together. This is a problem for all models.

* __Could you have new categories at test time?__
  Some categorical variables can be completely specified at training time (e.g. the levels for race or blood type would be known even with zero training examples). Other categories, such as profession, are so broad that we probably learn the levels from the training data. Some encoders deal with levels that are _only_ in the test set better than others.

* __Are the categories related?__
  Many encoding schemes treat two different levels as "equally different" from one another. If looking at color of a car, a typical encoding has no idea that "brick red" and "red" are more related than "red" and "yellow". One way of solving this problem is to cluster the categories into higher levels, and then encode that category as well.

* __Is it reversible? Does it store a lookup table?__
  Given the encoding of a feature, can you recover the original value? If so, we call the encoding _reversible_. Generally, reversible features also require a lot of storage if there are a lot of levels (to figure out how to go backward). I would generally see reversible as a negative _if_ it requries storing a lookup table as well.

We will be looking at the following encoding schemes. We will be encoding a feature with N levels.

| Encoder | Num Features | Encoding Ordered | Reversible (for levels in train set) | Tree-model friendly | Useful for clustering problems? | Test-only friendly |
| --- | --- | --- | --- | --- | --- |---|
| Label  | 1 | T | T | T | T |F |
| One-hot  | N or N-1 | F | T | T | Problematic | Depends |
| Hash  | User set | F | F | T | T | T |
| Target  | 1 | T (on target) | F | T | F(*) | T |
| DRACuLa | 4 | F | F | T | T | T |

None of the encoders discussed in this article support hierarchical categories (i.e. they don't allow specifying that some levels are "closer" or "more similar" than others). This is something you typically need to feature engineer.

While most of the focus of this article is on supervised learning problems, categorical variables need to be encoded before using unsupervised learning methods like clustering. If your encoding method creates a large number of categories (such as one hot encoding) you risk making clusters hard to find due to the [curse of dimensionality](https://en.wikipedia.org/wiki/Curse_of_dimensionality). Some encoding techniques, such as Target Encoding, require the use of a `target` variable which may not be available in an unsupervised learning problem.

## Category Encoders Package

For some of these encoders, there are versions in scikit-learn (e.g. Label Encoding and One-hot encoding). I am recommending use of the category encoders package instead, as it is generally more robust to features only seen in the test set, and can return a dataframe with named columns.

To install this package, run this on your terminal:
```bash
pip install category_encoders
```

There is a `conda-forge` version as well, but currently gets version 1.3.0, which has some usability issues. Pip installs the most up-to-date version (which is 2.0 at the time of writing).

Like scikit-learn, category encoders uses a standard format for all its encoders. If we have a training set `df_train` (with targets `y_train`), and a test set `df_test` (with targets `y_test`), we can use the following pattern with category encoders:
```python
import category_encoders as ce

encoder = ce.DesiredEncoder(cols=[cols_I_want_to_encode], return_df=True)

# Some encoding techniques use information about the
# target values during training
df_train_transformed = encoder.fit_transform(df_train, y_train)

# Note that there is not information leakage, we don't
# know about the target values on the test set.
df_test_transformer = encoder.transform(df_test)
```

## The encoders

This section is a _brief_ introduction to the different encoders. We will use the example of predicting whether someone will pay back a loan. Our data takes the form:

| annual_income | debt_to_income | loan_amount | purpose | grade | repaid |
| --- | --- | --- | --- | --- | --- |
| 120,000 | 0.100 | 3,500 | medical | A | True |
| 130,000 | 0.500 | 13,800 | medical | C | False |
| 220,000 | 0.400 | 33,500 | medical | B | False |
| 65,000 | 0.250 | 2,000 | refinance | B | False |
| 60,000 | 0.200 | 2,200 | refinance | B | True |
| 45,000 | 0.312 | 5,500 | auto | D | True |
| 75,000 | 0.111 | 2,000 | auto | B | True |
| 24,000 | 0.400 | 500 | other | C | False |

Here **repaid** is the target. The `grade` is an ordinal feature from a ratings agency, and `purpose` is a categorical feature with 4 levels: medical, refinance, auto, and other.

This [gist](https://gist.github.com/kiwidamien/1ee8d6217610be9ed1dcda81dbc9eba4) shows how to use the different encoders on each of these columns.

### LabelEncoder / OrdinalEncoder

Also called an OrdinalEncoder, this maps each level to an individual number. By default, the strings will be assigned numbers in increasing alphabetical order. If the grades in our training set are `A`, `B`, `C`, and `D` then OrdinalEncoder will map them to 1, 2, 3, 4 respectively. If a 'C' was missing from the training set then we would have `A`&rightarrow; 1, `B` &rightarrow; 2, and `D` &rightarrow; 3.

Here is the default usage:
```
import category_encoders as ce

encoder = ce.OrdinalEncoder(cols=['grade'], return_df=True)

# Assume our loan data has been imported as df already
# and split into df_train and df_test
df_train_transformed = encoder.fit_transform(df_train)
df_test_transformed = encoder.transform(df_test)
```

If we have a value that isn't seen in the data set, the `OrdinalEncoder` will return `-1` by default. You can change this with the `handle_error` argument to `OrdinalEncoder` to make it use `nan` or raise an error instead.

If we want to specify the mapping as well, it is a little tricker. The documentation is outdated on how to do this. Let's say we want to ensure that `A`, `B`, `C`, `D` map to 1, 3, 5, and 10 respectively. We need to write function that takes the category value (`A` -- `D`) and returns the category, then pass that in as a mapping:
```python
import category_encoders as ce

def map_for_grades(grade):
  "Returns 1 for 'A', 3 for 'B', 5 for 'C' and  10 for others"
  return {'A': 1, 'B': 3, 'C':5}.get(grade, 10)

encoder = ce.OrdinalEncoder(mapping={'col': 'grade', 'mapping': map_for_grades},
                            return_df=True)

# Assume our loan data has been imported as df already
# and split into df_train and df_test
df_train_transformed = encoder.fit_transform(df_train)
df_test_transformed = encoder.transform(df_test)
```

After encoding, our loan dataframe would take the form

| annual_income | debt_to_income | loan_amount | purpose | grade | repaid |
| --- | --- | --- | --- | --- | --- |
| 120,000 | 0.100 | 3,500 | medical | 1 | True |
| 130,000 | 0.500 | 13,800 | medical | 5 | False |
| 220,000 | 0.400 | 33,500 | medical | 3 | False |
| 65,000 | 0.250 | 2,000 | refinance | 3 | False |
| 60,000 | 0.200 | 2,200 | refinance | 3 | True |
| 45,000 | 0.312 | 5,500 | auto | 10 | True |
| 75,000 | 0.111 | 2,000 | auto | 3 | True |
| 24,000 | 0.400 | 500 | other | 5 | False |

#### When to use it?
When the categories have an obvious order (i.e. ordinal categories)

#### Does the mapping from categories to levels matter?
If the model is using tree-based methods, only the ordering matters.

If you are using linear models, or models based off linear models (e.g. SVMs), then the actual values matter. If you encode `A` as 1, `B` as 2, `C` as 3, the model has baked-in moving from `A` to `B` is as different as moving from `B` to `C`.

#### When to avoid?
Don't use this encoding method if you don't have ordered categories.

### One hot encoder

One-hot encoding is one of the first encoding schemes taught when we see categorical variables. It maps each _level_ of a category to its own column, and each row has a `1` for the category it belongs to, and a zero otherwise.

If we wanted to encode the `purpose` column of our dataframe:
```
import category_encoders as ce

encoder = ce.OneHotEncoder(cols=['purpose'], use_cat_names=True,
                        return_df=True)

df_train_transformed = encoder.fit_transform(df_train)
df_test_transformed = encoder.transform(df_test)
```

The output of the encoder is

| annual_income | debt_to_income | loan_amount | purpose_auto | purpose_medical | purpose_refinance | purpose_other  | grade | repaid |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 120,000 | 0.100 | 3,500 | 0 | 1 | 0 | 0 | A | True |
| 130,000 | 0.500 | 13,800 | 0 | 1 | 0 | 0 | C | False |
| 220,000 | 0.400 | 33,500 | 0 | 1 | 0 | 0 | B | False |
| 65,000 | 0.250 | 2,000 | 0 | 0 | 1 | 0 | B | False |
| 60,000 | 0.200 | 2,200 | 0 | 0 | 1 | 0 | B | True |
| 45,000 | 0.312 | 5,500 | 1 | 0 | 0 | 0 | D | True |
| 75,000 | 0.111 | 2,000 | 1 | 0 | 0 | 0 | B | True |
| 24,000 | 0.400 | 500 | 0 | 0 | 0 | 1 | C | False |

There are lots of issues and opinions around One-hot encoding, such as whether you should drop a column or not (the so-called "dummy variable trap"). Category encoders _doesn't_ drop a column, so a row of all zeros would occur if you see a column that you haven't seen in training. A more detailed article about one-hot encoding is [here](/are-you-getting-burned-by-one-hot-encoding.html).

#### When to use?
This is a good choice if there are only a few levels.

#### When to avoid?
When you have a large number of levels for the category, particularly if you are using tree-based models.

### Target and James-Stein encoders

These encoders use knowledge of the target variable to do the encoding. Target encoding replaces each category with the average value of the target for rows with that category, similar to Naive Bayes. For example, if we were looking at salaries as a target, each row with "teacher" in the profession column would be replaced with the average salary for teachers (or, more precisely, the average salary of teachers _in the training set_). This can be a very nice way of dealing with a lot of categories.

Because these encoders use the target value, you have to be careful when doing cross-validation to encode during each step of cross-validation, rather than just encode.

Let's see this in action with our dataset.  We will encode the purpose column, using the repaid column as a target:
```python
import category_encoders as ce

encoder = ce.TargetEncoder(cols=['purpose'], smoothing=0, return_df=True)

df_train_transformed = encoder.fit_transform(df_train, df_train['repaid'])
df_test_transformed = encoder.transform(df_test)
```
This gives us

| annual_income | debt_to_income | loan_amount | purpose | grade | repaid |
| --- | --- | --- | --- | --- | --- |
| 120,000 | 0.100 | 3,500 | 0.33333 | A | True |
| 130,000 | 0.500 | 13,800 | 0.33333 | C | False |
| 220,000 | 0.400 | 33,500 | 0.33333 | B | False |
| 65,000 | 0.250 | 2,000 | 0.50000 | B | False |
| 60,000 | 0.200 | 2,200 | 0.50000 | B | True |
| 45,000 | 0.312 | 5,500 | 1.0000 | D | True |
| 75,000 | 0.111 | 2,000 | 1.0000 | B | True |
| 24,000 | 0.400 | 500 | 0.50000 | C | False |

We see that only 1/3 of medical bills are repaid, and that "medical" is replaced with 1/3. We can do this check for each category (e.g. `df_train.groupby(['purpose'])['repaid'].mean()` will do it, or we can do it by hand) and check that _almost_ every category works. We have

| purpose | # of rows | Fraction repaid |
| --- | --- | --- |
| medical | 3 | 1/3 |
| refinance | 2 | 1/2 |
| auto | 2 | 1 |
| other | 1 | 0 |

The sole exception is `other`, where 0% of examples in the training set were repaid, but it was encoded as `0.5000`. For only _one_ example, TargetEncoder will use the average of the dataset. (This is actually [hard-coded into the TargetEncoder](https://github.com/scikit-learn-contrib/categorical-encoding/blob/f2e408efe58362f20573a903090d70629a327faf/category_encoders/target_encoder.py#L172) class!)

The `smoothing` parameter in `TargetEncoder` allows us to interpolate between the overall average (e.g. the average number of repaid loans) and the average number in our category. Roughly speaking, as the number of examples in a particular level increase, the more the average will increase. This is similar to Laplace Smoothing in Naive Bayes, but that adds "fake counts" rather than doing a direct re-weighting. As `smoothing` increases, the overall average becomes more dominant for the same number of rows.

The James-Stein encoder is similar to `TargetEncoder`. The way that it differs is how it treats smoothing. For target encoder, the only thing that matters for smoothing is the number of rows in a given category. The James-Stein encoder uses the amount of variation within examples of that category, and compares to variation over the entire dataset. This is described in more detail in the article on [shrinkage for regression problems](https://kiwidamien.github.io/derivations-and-conjugate-priors-average-ratings.html).

#### When to use?
Useful in a wide variety of cases. I typically prefer using the `JamesSteinEncoder` over the `TargetEncoder`, but the `TargetEncoder` is slightly easier to describe.

#### When not to use?
If there are only a few examples per category, this technique is not going to be particularly useful. We also have to be aware that we need to "save" the group average for each category, which can be problematic if we have a _lot_ of categories. An example of a bad feature to use TargetEncoders on might be the "referrer page" for the ad someone came from.

### Hash Encoder

Hash encoders is an encoder that is suitable for a large number of levels. It has a lot of different compromises, but scales extremely well. The user specifies the number of binary output columns that they want as output.

The central part of the hashing encoder is the _hash function_, which maps the value of a category into a number. For example, a (bad) hash function might treat "a=1", "b=2", and sum all the values together of the label together. For example:
```python
hash("critic") = 3 + 18 + 9 + 20 + 9 + 3 = 62
```
Because we are not memorizing the different levels, it deals with new levels gracefully. If we said that we wanted 4 binary features, we can take the value written in binary, and select the lowest 4 bits. For example, `hash("critic") = 62`, and in binary `62=0b111110`; taking the lower 4 bits would give the values `1`, `1`, `1`, `0`.

It can be hard to see why this series of steps would lead to a useful encoding. Here is the basic intuition:

* One-hot encoding gives problems because tree-based methods don't deal well with a lot of features. Hash encoding limits the number of output features, so we (hope) a good fraction of them have "feature_1" as 0 and 1, so trees can still select them and split on them.
* Instead, we can think of each level as having a roughly 50% chance of getting a 0 or a 1 in each of the output features. If there are interesting properties shared by different levels, we hope that some of the features that share values will be selected by the tree models (and the others are ignored). As we get more output columns, the chances of "correlated" levels having the same value in at least one column goes up.

Earlier, I claimed that "sum the values of letters in the level" wasn't a good hash function. That is because it is too easy for two words to have the same hash, so it is impossible for us to tell them apart after the encoding. For example, `hash("general")=62`, so the naive hash suggested would never be able to distinguish between the professions of "critic" and "general". The supplied hash functions make it unlikely to get collisions, but it is something to be aware of.

We will show how to use the hash encoder on our dataset, but we would only actually use it in practice on a feature that had _many_ levels.
```python
import category_encoders as ce

encoder_purpose = ce.HashingEncoder(n_components=3, cols=['purpose'])
encoder_purpose.fit_transform(df_train)
```
This returns

| col_0 | col_1 | col_2 | annual_income | debt_to_income | loan_amount  | grade | repaid |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 120,000 | 0.100 | 3,500  | A | True |
| 0 | 0 | 1 | 130,000 | 0.500 | 13,800  | C | False |
| 0 | 0 | 1 | 220,000 | 0.400 | 33,500  | B | False |
| 0 | 0 | 1 | 65,000 | 0.250 | 2,000  | B | False |
| 0 | 0 | 1 | 60,000 | 0.200 | 2,200  | B | True |
| 1 | 0 | 0 | 45,000 | 0.312 | 5,500  | D | True |
| 1 | 0 | 0 | 75,000 | 0.111 | 2,000  | B | True |
| 0 | 1 | 0 | 24,000 | 0.400 | 500  | C | False |


Note that we have a collision between `medical` and `refinance`, as they both get mapped to `(0, 0, 1)`. They don't actually get mapped to the same value, but the values of the three bits that we take happen to coincide.

#### When to use?
When using tree models with _lots_ of different levels.

#### When to avoid?
You want interpretability for the contribution of each of your levels. You won't be able to give a good answer to "how does being a medical loan differ from an auto loan" easily with this encoder, even though they don't collide.

### Dracula

The DRACuLa encoder isn't supported yet by category encoders. It is an interesting exercise to "roll your own". It is generally for classification problems. We are going to introduce the concept of "buckets": the most frequently occurring B levels get their own buckets. All other levels share the leftover bucket.

For binary classification, DRACuLa produces 4 columns:

* `N+`: the number of times the positive class has been seen in this bucket,
* `N-`: the number of times the negative class has been seen in this bucket,
* `log(N+/N-)`: the log likelihood,
* `is_leftover`: boolean, indicating if this was one of the `B` levels that got its own bucket (`False`), or if we were in the "leftover" bucket (`True`)

This categorical encoder is used when you have a _lot_ of levels. It is commonly used by advertisers to encode the IP addresses (typically `xxx.xxx.*.*` are all placed into a single bucket, and only a few of the top domains are explicitly tracked).

A good video description of this encoding is given [here](https://www.youtube.com/watch?v=7sZeTxIrnxs).

#### When to use?
When you have a lot of different levels, especially if you think you will see new levels at test time.

One of the big advantages over `TargetEncoder` is that only the most frequent `B` categories need to be remembered explicitly; all other categories are lumped together. It also contains the actual counts, rather than just the target value/log likelihood, which can help us be down-weight samples with low counts.

Compared to `HashEncoder`, the output is still reasonably interpretable and understandable.

#### When to avoid
This is a pretty flexible encoding scheme, but isn't build directly into `scikit-learn`. It offers some advantages over `TargetEncoder`, but `TargetEncoder` works nicely out-of-the-box.

This technique doesn't extend naturally to regression problems.

## Summary

* Machine learning algorithms in scikit-learn need to work with numeric features; non-numeric features need to be _encoded_ as numbers before training.
* Some numeric features (e.g. zip code) are technically numbers, but are really acting as categories.
* How you choose to encode the categories can have a big effect on how effectively your model can learn from the data.
* There are many more methods than just "map each level to its own number" (Label Encoding) and "map each level to its own column" (one-hot encoding).
* Things to consider about your encoding scheme:

  * Do you have many levels in this category?
  * Do you have many examples of each level?
  * Are you using a linear-type model (which deals gracefully with many features), or a tree-type model or distance metric (which do not)?
  * Do you need to store a lookup table for categories?

  The answers to these questions will help determine which encoders are suitable for your problem.
* You can choose different encodings for each column in your dataframe.
* The category encoders package does a better job of dealing with categories robustly than the scikit-learn encoders.

This article has focused on the ideas behind the different encoding schemes; this [gist](https://gist.github.com/kiwidamien/1ee8d6217610be9ed1dcda81dbc9eba4) goes through the code on a similar example.


## References

* [Are you getting burned by one-hot encoding?](/are-you-gettting-burned-by-one-hot-encoding.html) A deeper look at one hot encoding.
* [Why `pd.get_dummies` is Evil, Use Category Encoders Instead](/get-dummies-is-evil.html)
* [Derivations and Conjugate Priors](https://kiwidamien.github.io/derivations-and-conjugate-priors-average-ratings.html) shows how the James-Stein encoder interpolates between the group mean and the population mean.
* [Category Encoders](https://contrib.scikit-learn.org/categorical-encoding/) reference page (and links within)
* [Distributed Robust Algorithm for CoUnt-based LeArning](https://www.youtube.com/watch?v=7sZeTxIrnxs) (DRACuLa)
This video is a great reference.
