Title: Encoding categorical variables
Tags: pandas, categorical
Slug: encoding-categorical-variables
Date: 2019-08-05 13:00
Category: Data Science
Status: Draft
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

Each value of a non-numeric feature has a number of distinct values, called *levels*. The examples listed above are all examples of levels. The number of levels can vary wildly: the number of races for a patient is typically four (asian, black, hispanic, and white), the number of states for the US is 51 (if we include DC separately), while the number of professions is in the thousands.

If the levels are *ordered*, then we call the feature *ordinal*. For example, if a class grade such as "B+" or "A" is a non-numeric feature, but the letters are not just different, they are ordered (an "A" is better than a "B+", which is better than a "C-" etc). The standard way of dealing with ordered features is just to map every level onto a number, in a way that preserves the encoding. This is called _Label Encoding_.

If the levels are just different without an ordering, we call the feature *categorical*. For example, professions or car brands are categorical. If we use an encoding that maps levels to numbers, we introduce an ordering on the categories, which _may_ not be desirable. Most of this article will be about encoding categorical variables.

The standard technique in books for creating categorical features is to use *one-hot encoding*, which creates a new feature _per level_ of the original feature. For example, the `race` category would become 4 new features: `race_asian`, `race_black`, `race_hispanic`, and `race_white`. The profession feature would turn into thousands of new features (e.g. `profession_doctor`, `profession_plumber`, etc). This is also common because Pandas implements it using the `get_dummies` function, so it is easy to implement within Pandas. This technique becomes problematic if you have a _lot_ of levels, especially for tree-based models such as Random Forests.


## Some considerations

* Do you have many levels?
  If so, using an encoding that has a level-per-feature is difficult for tree-based models. Trees separate on features that "split" the data into different classes effectively. If there are many levels, it is likely only a tiny fraction of the data belong to one level, so it will be hard for trees to "find" that feature to split on.

* Are there many examples of each level?
  If there are only 5 doctors in your dataset, you probably are not going to know the doctor category very well (nor will it generalize). Some encoders deal with this gracefully, while others won't. You might consider making an explicit "other" category for levels  

There are multiple ways to encode categorical variables, which involve different tradeoffs. In this article, we will discuss the different types of encoding schemes, and their pros and cons.
 Even the exceptions, such as Naive Bayes or tree-based methods, require the features to be converted into numeric form for scikit-learn implementation.
