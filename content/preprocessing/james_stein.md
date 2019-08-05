Title: The James-Stein Encoder
Tags: pandas, categorical, encoder, target, impact, estimator
Slug: james-stein-encoder
Date: 2018-09-10 13:00
Category: Data Science
Summary: One technique, sometimes called "target" or "impact" encoding, uses the average value of the target variable per value to encode. The James-Stein encoder is a twist the "shrinks" the target value back to the global average to stop statistical fluctuations.

How we convert _categorical features_ &mdash; non-numeric features without an order &mdash; into numbers can effect the performance of our machine learning models.

The article ["Encoding Categorical Features"](encoding-categorical-features) talks about different encoding techniques, and what would influence your choice of encoding. This article looks into one effective encoding scheme called _target_, _impact_, or _James-Stein_ encoding.

## The basic idea

The rough idea for this family of encoders is:

* For _regression_: replace category value $X_i$ with the average value of the target over that group.
* For _binary classification_: replace category value $X_i$ with the proportion of instances with that value that belong to the positive class.
* For _multi-class classification_: replace category value $X_i$ with one value per class; that value being the proportion of instances with that value that below to each of the classes.

Let's see this with an example. Suppose we had a dataset with 10k people, and the data took the form

| Gender | Race | Age | Height (cm)| Colorblind |
| --- | --- | --- | --- | --- |
| Male | White | 26 | 167 | False |
| Female | White | 22 | 158 | False |
| Female | Asian | 29 | 162 | False |
| Male | Black | 23 | 172 | True |
| Male | White | 24 | 169 | True |

We find the following percentage of the people are colorblind, when broken down by gender:

| Gender | % of training set that is colorblind |
| --- | --- |
| Male | 8.0% |
| Female | 0.5% |

and by race:

| Race | % of training set that is colorblind |
| --- | --- |
| Asian | 2.5%|
| Black | 2.0% |
| Hispanic | 4% |
| White | 4% |

Target encoding would replace each categorical variable with the percentage of colorblind people in that group. After transformation, we would get

| Gender | Race | Age | Height (cm)| Colorblind |
| --- | --- | --- | --- | --- |
| 0.080 | 0.040 | 26 | 167 | False |
| 0.005 | 0.040 | 22 | 158 | False |
| 0.005 | 0.025 | 29 | 162 | False |
| 0.080 | 0.020 | 23 | 172 | True |
| 0.080 | 0.040 | 24 | 169 | True |

Note that we are _not_ looking at the combined categories (i.e. we were not looking at the percentage of asian females that were colorblind, or of hispanic men). Each feature is encoded separately. This is similar to Naive Bayes.

## Being careful with the encoder

Unlike other encoding methods (such as _one-hot encoding_), this method uses knowledge of the target. It is important if you use this method to encode _after_ splitting into training and testing sets. We should also ensure that we do the encoding _within_ cross-validation. We will demonstrate how to perform target encoding in a cross-validation safe way below.

## Difference between James-Stein and target encoding

There is a big difference between knowing that 4% of a population of 4000 is color-blind versus a 4% of a population of 50 are color-blind. In the former case, we are reasonably confident the proportion is close to 4%. In the later case, we only have two people out of 50 that are colorblind, and are very susceptible to random noise.

The James-Stein encoder _shrinks_ the average toward the overall average. If $p_{\text{all}}$ is the overall proportion of people that are colorblind in our sample set, we have

$$\text{Encoded value for group $i$} = (1-B) p_i + B p_{\text{all}}$$

where $B$ is a weight of the population mean, and $1-B$ is the weight of the group mean (with the total weight being 1).

There are different methods for calculating $B$, as discussed in [the documentation](https://contrib.scikit-learn.org/categorical-encoding/jamesstein.html), but the default one in category encoders is called the "independent model". For each category we have

$$B = \frac{\text{(group variance)}}{\text{(group variance)} + \text{(population variance)}}$$

When we are uncertain about a group's value (i.e. the group variance is high compared to the population variance) then $B\approx 1$, and we are heavily biased toward the population value. When the group variance is much lower that the population variance, $B \approx 0$ and we use the value for the group instead.


For a proportion problem, the explicit formula for $B$ is obtained using the variance in the population proportion:

$$B = \frac{p_i(1-p_i)/N_i}{\frac{p_i(1-p_i)}{N_i} + \frac{p_{\text{all}}(1-p_{\text{all}})}{N_{\text{all}}}}$$

where $N_i$ is the number in the group, and $N_{\text{all}}$ is the number in the population.

Let's see how this plays out with our colorblind example.  Encoding the race variable, let's say we had

| Race | Number in sample | Number colorblind | Proportion |
| --- | --- | --- | --- |
| Asian | 4000 | 100 | 2.5%|
| Black | 1950 | 39 | 2.0% |
| Hispanic | 50 | 2 | 4.0% |
| White | 4000 | 160 | 4.0% |
| **Total**| **10000** | **301** | 301/10k = 3.0% |

These are the same percentages we saw earlier, but now we are including the sample sizes as well. The squared standard error for the entire population is

$$(\text{std err in pop})^2 = \frac{p_{\text{all}}(1-p_{\text{all}})}{N_{\text{all}}} = \frac{(0.03)(0.97)}{10,000} = 2.9\times 10^{-6}$$

 Each group has its own $B$ (the weight of the overall mean) which we calculate below. We put everything in terms of powers of $10^{-6}$ to allow easy comparison

| Race | std error squared | B |
| --- | --- | --- |
| Asian | (0.025)(1 - 0.025)/4000 = 6.1x10<sup>-6</sup> | 0.6778 |
| Black | 10.1x10<sup>-6</sup>| 0.7769 |
| Hispanic | 768.0x10<sup>-6</sup>| 0.9962 |
| White | 9.6x10<sup>-6</sup>| 0.7680 |

We see in this data set, the overall mean would have the greatest effect on the Hispanic encoding, and the least effect on the Asian encoding.

## Doing it in code

To implement this model , we first need to install the category encoders package:

```bash
conda install -c conda-forge category_encoders
```

### No train-test split

Let's make a dataframe and encode it:
```python
import category_encoders as ce
import pandas as pd

# Some fake data loaded from Github
colorblind = pd.DataFrame('https://........')

# Build the encoder
encoder = ce.JamesSteinEncoder(cols=['gender', 'race'])

# Encode the frame and view it
colorblind_tranformed = encoder.fit_transform(colorblind, colorblind['Colorblind'])

# Look at the first few rows
colorblind_tranformed.head()
```

### With train-test split

Let's train a simple RandomForest model, just to show how to use the encoder with cross-validation. We will put our encoder in a pipeline with our random forest:

```python
import category_encoders as ce
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.metrics import recall_score
from sklearn.pipeline import Pipeline

# Some fake data loaded from Github
colorblind = pd.DataFrame('https://........')

# Do the train test split
X_train, X_test, y_train, y_test = train_test_split(colorblind.drop('Colorblind', axis=1), colorblind['Colorblind'])

# Build the encoder
encoder = ce.JamesSteinEncoder(cols=['gender', 'race'])

# Build the model, including the encoder
model = Pipeline([
  ('encode_categorical', encoder),
  ('classifier', RandomForestClassifier())
])

# Here are the parameters we want to search over
# Review pipelines to see how to access the different
# stages
params = {
  'classifier__n_estimators': [50, 100, 200],
  'classifier__max_depth': [4, 6, 8]
}

# build a grid search
grid = GridSearchCV(model, param_grid=params, cv=5).fit(X_train, y_train)

# How well did we do on the test set?
# Note that we don't need to explicitly transform the test
# set!
predict_test = grid.predict(X_test)
print(f"Recall on the test set is {recall_score(y_train, predict_test)}")
```

By putting our encoder in a pipeline, cross validation was handled correctly (i.e. the encoder was trained on the 4 training folds, and evaluated on the one hold out fold). See the article on [pipelines](/an-introduction-to-pipelines.html) for more detail.

## Summary
