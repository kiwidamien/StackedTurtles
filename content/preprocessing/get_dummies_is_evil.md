Title: Why `pd.get_dummies` is Evil, Use Category Encoders Instead
Tags: pandas, categorical
Slug: get-dummies-is-evil
Date: 2018-09-02 21:00
Category: Data Science
Status: Draft
Summary: A common technique for transforming categorical variables into a form suitable for machine learning is called "one hot encoding". Pandas provides a convenient function, `get_dummies` to do this, which you should never use.

 While many features we might use, such as a person's age, or height, are numeric there are many that are not. Usually these features are represented by strings, and we need some way of transforming them to numbers before using scikit-learn's algorithms. The different ways of doing this are called _encodings_.

Other articles on this blog have looked at [different methods for encoding categorical variables](/encoding-categorical-variables.html), and some of the [issues with one-hot encoding](/are-you-getting-burned-by-one-hot-encoding.html) in particular. This article is about the dangers of using `pd.get_dummies` to do one-hot encoding, and some of the better alternatives.

## Example dataset

To look at some of the issues with `pd.get_dummies`, we will use the example of predicting the traffic volume on I-94, outside of St Paul, Minnesota. This is a slightly processed version of the original dataset (available [here](https://archive.ics.uci.edu/ml/machine-learning-databases/00492/Metro_Interstate_Traffic_Volume.csv.gz)).

The first few five rows of the dataset are

| date_time | is_holiday | temp_F | rain_1h | snow_1h | clouds_all | weather_main | traffic_volume | 
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-10-02 09:00 | False | 59.234 | 0.0 | 0.0 | 40 | Clouds | 5545 | 
| 2012-10-02 10:00 | False | 61.178 | 0.0 | 0.0 | 75 | Clouds | 4516 | 
| 2012-10-02 11:00 | False | 61.574 | 0.0 | 0.0 | 90 | Clouds | 4767 | 
| 2012-10-02 12:00 | False | 62.564 | 0.0 | 0.0 | 90 | Clouds | 5026 | 
| 2012-10-02 13:00 | False | 64.382 | 0.0 | 0.0 | 75 | Clouds | 4918 | 

We will need to encode the `weather_main` variable before we can apply our machine learning techniques to this dataset. Let's split this dataset into a training and testing set. Becacuse this is time-series data, we will use the last 10% of it as "hold-out" data.

```python
import pandas as pd
url = "...."
traffic = pd.read_csv(url, parse_dates=[0])

split_loc = int(0.9*len(traffic))
raw_features = traffic.drop('traffic_volume', axis=1)
target = traffic['traffic_volume']

X_train, X_test = raw_features[:split_loc], raw_features[split_loc:]
y_train, y_test = target[:split_loc], target[split_loc:]
```

### What are the categories?

Let's start by looking at the training set. We can get a list of each of the eleven distinct values and how frequently they appear using `X_train['weather_main'].value_counts()`

| Weather main value | Frequency in training set |
| --- | --- | 
| Clouds | 13903 |
| Clear  | 12042 |
| Mist   |  5355 |
| Rain   |  4756 |
| Snow   |  2872 |
| Drizzle|  1584 |
| Haze   |  1251 |
| Fog    |   821 |
| Thunderstorm |  777 |
| Smoke  |    18 |
| Squall |     4 |

When we one-hot encode the training set, we will get the `weather_main` column replaced with 11 columns instead (`weather_main_Clouds` to `weather_main_Squall`), for a total of 17 features.

We can (easily!) use `pd.get_dummies(X_train)` to one-hot encode the training data:

| date_time | is_holiday | temp_F | rain_1h | snow_1h | clouds_all | weather_main_Clear |   weather_main_Clouds | weather_main_Drizzle | ... | weather_main_Squall  | 
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-10-02 09:00 | False | 59.234 | 0.0 | 0.0 | 40 | 0 | 1 | 0 | ... | 0 | 5545 | 
| 2012-10-02 10:00 | False | 61.178 | 0.0 | 0.0 | 75 | 0 | 1 | 0 | ... | 0 | 4516 | 
| 2012-10-02 11:00 | False | 61.574 | 0.0 | 0.0 | 90 | 0 | 1 | 0 | ... | 0 | 4767 | 
| 2012-10-02 12:00 | False | 62.564 | 0.0 | 0.0 | 90 | 0 | 1 | 0 | ... | 0 | 5026 | 
| 2012-10-02 13:00 | False | 64.382 | 0.0 | 0.0 | 75 | 0 | 1 | 0 | ... | 0 | 4918 | 

Pandas reports to us that we have 17 columns of data. Any model we train is going to expect 17 features.

Now let's encode the test set. While we should not peak and look at the _distribution_ of a feature in the test set, we should ensure that we can encode it properly. By doing `X_test['weather_main'].unique()` we get the list of 10 types of weather that appear in the test set, which are a subset of the original 11. Not surprisingly, the rare "Squall" is missing. Summarizing we have

| Weather main value | Frequency in training set | In test set |
| --- | --- |  --- | 
| Clouds | 13903 | Y |
| Clear  | 12042 | Y |
| Mist   |  5355 | Y |
| Rain   |  4756 | Y |
| Snow   |  2872 | Y |
| Drizzle|  1584 | Y |
| Haze   |  1251 | Y |
| Fog    |   821 | Y |
| Thunderstorm |  777 | Y |
| Smoke  |    18 | Y |
| Squall |     4 | N |

The test set doesn't have any "new" or "unseen" values that were not present in the training set. When we use `pd.get_dummies(X_test)` to encode this dataframe, we run into an issue -- our one-hot encoded dataframe only has _16_ columns. Any model trained will break, as it is expecting 17 different columns.

### Can't we get around this by encoding before splitting?

We could get around this problem by using `pd.get_dummies(traffic)` _before_ doing the split into training and testing data. There are a couple of reasons this doesn't really solve your problem:

1. **Don't process before the split**

  The test set is supposed to give us an indication of what our model will do on new, unseen data. In particular, if we encode the columns based on _all_ data, we lose the ability to infer what will happen if our model sees a new value "in the wild".

  Maybe this is a possiblity that you can live with. If we didn't see the value in our data (training or test set) maybe we _should_ raise an error instead of trying to make a prediction. Or maybe we are in a well-known domain, where we know we have exhausted all the possible categories. Blood group would be one such example: we know we will only encounter 8 different types.

  Even if you are happy processing before the split, there is a much more pragmatic problem.....

2. **We cannot encode new data reliably**

  Let's say that you decided to use `pd.get_dummies` on all your data, so both the training set and the test set have access to the 17 different features. Now we want to make a prediction for tomorrow's traffic, and the prediction is there will be Fog. We cannot use `pd.get_dummies` to make one prediction at a time, because it will only replace `weather_main` with a single column (`weather_main_Fog` in our example).

  To say it slightly differently, doing the encoding before the split allowed us to work with both `X_train` and `X_test` to build our model, and assess its performance. However, when making new predictions after putting our app into deployment, we cannot make one-at-a-time predictions using `pd.get_dummies` on production data. We would be stick with a cumbersome solution of _manually_ creating the required columns.

There is an even more subtle error that can occur. In this example, we didn't see any new values in `weather_main` in the test set that were not in the training set. If we used `pd.get_dummies(X_train)` and trained a model, we would have errors using `pd.get_dummies(X_test)` when we tried using the same model. If the test set had more distinct values ("levels") than the training set, we would also encounter errors. At least then we would know something was wrong, and could (in the worst case) manually add missing columns or drop extra columns. If the test set had a new value, such as `Balmy`, and was missing `Squall`, then the dataframes would be the same size, but the columns would be shifted!
Our model would see a dataframe the right size, but would process it with the wrong interpretation of the columns. Our model would confidently predict **non-sense**.

What we need is an encoder that we can train (i.e. let it know which columns to expect) and then fit. This will ensure that our output data has a consistent, and that the columns always appear in the same order.  The `OneHotEncoder`s found in `sklearn.preprocessing` and `category_encoders` offer exactly that. 

### When would you use `pd.get_dummies`? Why does it exist?

If get dummies is so bad, why is it a function in Pandas? When would someone use it?

It isn't particularly useful for machine learning, where you will eventually want to make predictions on new data. There are many fields where statistical analyses are done to determine what the important variables are, and how we should change them, without trying to make predictions on new data.

This is common in econometrics, for example. 

## Summary
