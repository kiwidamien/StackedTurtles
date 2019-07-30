Title: Custom Loss vs Custom Scoring 
Tags: machine learning, technical, metrics
Date: 2019-07-28 11:20
Category: Data Science
Summary: Scikit learn grid search functions include a scoring parameter. Scorers allow us to compare different trained models. Models try to minimize a _loss_ function. While custom scoring is straight-forward, custom losses are not.

When fitting data, we might decide we want to find the smallest mean squared error (MSE) or (equivalently) maximize the coefficient of determination $R^2$. We can use `LinearRegression`, `Ridge`, or `Lasso` that optimize on finding the smallest MSE, and this matches the thing we want to optimize.

While common, MSE isn't necessarily the best error metric for your problem. Other examples are

* _Mean absolute error (MAE)_: doesn't penalize outliers as much as MSE, generally more robust prediction.
* _Huber loss_: gives MSE for points "close" to a certain distance away, and MAE after that. MSE is not sensitive to small errors (for small $x$, $x^2$ is smaller than $x$) but transforms to linear loss far away.
* _Hinge loss_: gives no penalty for points "close enough" to the prediction. Outside of the no penalty region (typically called the margin) the penalty increases linearly. This is what SVMs use when doing regression.
* _Quantile Loss_: Maybe underestimating is worse than overestimating (e.g. when predicting how much to buy). You would like an error metric that gives a higher penalty for getting an answer that is too low.

When looking at the documentation for Ridge and Lasso, you won't find a scoring parameter. You might think that you could optimize for mean absolute error in the following way:
```python
# Doesn't this minimize mean absolute error?
alphas = (0.1, 0.3, 1.0, 3.0, 10.0)
rcv = RidgeCV(alphas, scoring='neg_mean_absolute_error', cv=5).fit(X_train, y_train)
```
Not really. There are two different things happening:

* For _each_ value in `alphas` we are solving a Ridge regression, which attempts to minimize the MSE (not MAE). This gives us a model that gets the best coefficients for minimizing the MSE with this value for the regularization parameter.
* Then we compare the mean _absolute_ error in the predictions for the five different models we made, and pick the one with the lowest MAE.

So we only apply the `scoring` parameter when choosing between models, _not_ when fitting the individual models themselves.

This can be subtle, so it is worth distinguishing the two concepts:

* __Loss:__ The metric that your fitting method optimizes for a given model with all hyperparameters set.
* __Scoring:__ The metric used to choose between your optimized model (i.e. how you pick the best hyperparameters).

If you are trying to minimize the MAE, you would ideally want to have MAE as your loss (so each model has the smallest possible MAE, given the hyperparameters) _and_ have MAE as your scoring function (so you pick the best hyperparameters). If you use MSE as your loss, and MAE as your scoring, you are unlikely to find the best answer.

Scikit-learn makes it very easy to provide your own custom score function, but not to provide your own loss functions. In this [Github issue](), Andreas Muller has stated that this is not something that Scikit-learn will support. While it is clearly useful, function calls in Python are slow. A loss function can be called thousands of times on a single model to find its parameters (the number of tiems called depends on `max_tol` and `max_iterations` parameters to the estimators). A scoring function, on the other hand, is only called once per model to do a final comparison between models.

We will never be able to have Ridge or Lasso support even a simple error such as Mean Absolute Error. For this particular loss, you _can_ use [`SGDRegressor`](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDRegressor.html) to minimize MAE. For quantile loss, or Mean Absolute Percent Error (MAPE) you either have to use a different package such as `statsmodels` or roll-your-own.

## An example where having different loss and scoring is reasonable.

It might seem shocking that loss and scoring are different. After all, if we are going to optimize for something, wouldn't it make sense to optimize for it throughout? While this is generally true, we are far more comfortable with the idea that loss and scoring being different in classification problems. Consider a classifier for determining if someone had a disease, and we are aiming for high recall (i.e. we would rather flag a healthy person eroneously than miss a sick person).
```python
# Here are some parameters to search over
params = {
  ....
}

rf_grid = GridSearchCV(RandomForestClassifier(), param_grid=params, 
                       cv=5, scoring='recall')
rf_grid.fit(X_train, y_train)
```

It is possible to get 100% recall by simply predicting everyone has the disease. That is _not_ what the code above does. Instead, for each combination of hyperparameters we train a random forest in the usual way (minimizing the entropy or Gini score). Once we have all of those different trained models, _then_ we compare their recall and select the best one.

This isn't fundamentally any different from what is happening when we find coefficients using MSE and then select the model with the lowest MAE, instead of using MAE as both the loss and the scoring. The difference is that recall is a bad loss function because it is trivial to optimize. In classification, we are a lot happier using a loss function and a score functoin that are different.


(I would put forward an opinion that because recall is a bad _loss_, it is also a bad _scorer_. If I would not optimize against recall directly -- and I shouldn't -- it is because it is pathelogical, and so I shouldn't use it to select between my models either. Instead, in a given problem, I should more carefully consider the trade-offs between false positives and false negatives, and use that to pick an appropriate scoring method. I also believe I am in the minority in this view that recall is a pathelogical score, so it is probably best you don't repeat this point of view while on an interview.)


## Making a custom score

Now that we understand the difference between a loss and a scorer, how do we implement a custom score? The first step is to see if we need to, or if it is already implemented for us. We can find a list of build-in scores with the following code:
```python
import sklearn
print(sorted(sklearn.metrics.SCORERS.keys()))
```
This lists the 35 (at the time of writing) different scores that sklearn already recognizes.

If the score you want isn't on that list, then you can build a custom scorer. The easiest way to do this is to make an ordinary python function `my_score_function(y_true, y_predict, **kwargs)`, then use sklearn's `make_scorer` to create an object with all the properties that sklearn's grid search expects. This sounds complicated, but let's build mean absolute error as a scorer to see how it would work. Note this scorer is already built-in, so in practice we would use that, but this is an easy to understand scorer:
```python
from sklearn.metrics import make_scorer
import numpy as np

def mean_abs_error(y_true, y_predict):
  return np.abs(np.array(y_true)-np.array(y_predict)).mean()

mean_abs_scorer = make_scorer(mean_abs_error, greater_is_better=False)
```

The `make_scorer` function takes two arguments: the function you want to transform, and a statment about whether you want to maximize the score (like accuracy and $R^2$) or minimize it (like MSE or MAE). In the standard implementation, it is assumed that the a higher score is better, which is why we see the functions we want to minimize appear in the negative form, such as `neg_mean_absolute_error`: minimizing the mean absolute error is the same as maximizing the _negative_ of the mean absolute error. The `make_scorer` function allows us to specify directly whether we should maximize or minimize.

We can now use the scorer in cross-validation like so:
```python
# This was our original way of using cross-validation using MAE:
# Note we would use the scoring parameter in GridSearchCV or others
rcv = RidgeCV(alphas, scoring='neg_mean_absolute_error', cv=5).fit(X_train, y_train)

# This is equivalent, using our custom scorer
rcv = RidgeCV(alphas, scoring=mean_abs_scorer, cv=5).fit(X_train, y_train)
```

### Unfortunate choice of terminology

In the scikit-learn documentation, they make an unfortunate distinction is made between scores you attempt to maximize, and scores you attempt to minimize. They call a score you try to maximize a "score", and a score you try to minimize a "loss" in [this part of the documentation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.make_scorer.html) when describing `greater_is_better`.

I am not using those terms the same way here! It isn't you that is confused! I don't use the same terminology as sklearn for a few reasons:

* The function described, `make_scorer` should make ... scorers. It seems perverse to say some scorers return scores, and some return losses, which sklearn tries to do. This scorer is a score, and this scorer is a loss is just far too confusing.
* The term loss is commonly used in fitting algorithms in literate. This gives a nice distinction between a loss (used when fitting) and a score (used when choosing between fit models). Sklearn's usage "uses up" a perfectly good term "loss" instead of just talking about a score we are trying to minimize.

### Implementing MAPE

The scorer we implemented about wasn't that useful, as we could already use the predefined `'neg_mean_absolute_error'` string to accomplish the same goal. Let's implement a new score, mean absolute percentage error (MAPE), that isn't predefined in sklearn. The definition of MAPE is 

$$ \text{MAPE} = \frac{1}{n}\sum_{i=1}^n |\text{% error in }y_{\text{predict, i}}| = \frac{1}{n}\sum_i \frac{|y_{\text{true, i}} - y_{\text{predict, i}}|}{|y_{\text{true, i}}|} $$

In code, this is
```python
def mape(y_true, y_predict):
  # Note this blows up if y_true = 0
  # Ignore for demo -- in some sense an unsolvable
  # problem with MAPE as an error metric
  y_true = np.array(y_true)
  y_predict = np.array(y_predict)
  return np.abs((y_true - y_predict)/y_true).mean()

mape_scorer = make_scorer(mape, greater_is_better=False)
```

## Making a custom loss

Making a custom loss is a lot harder, and I have devoted a separate (upcoming) [post](/custom_loss.html) to it. The simple approaches are

* Write your own estimator in sklearn. [Alex Miller](https://alex.miller.im/posts/linear-model-custom-loss-function-regularization-python/) has done this in one of his posts, which my article borrows from.
* Write a custom loss in Keras. Neural nets can be used for large networks with interpretability problems, but we can also use just a single neuron to get linear models with completely custom loss functions.

## Summary

* The loss that is used during the `fit` parameter should be thought of as part of the model in scikit-learn. Because of the expense of making function calls, scikit-learn won't be supporting custom losses.
* In particular, `Ridge` and `Lasso` will always minimize MSE (or equivalently maximize $R^2$).
* You can minimize MAE using `SGDRegressor`.
* Custom losses require looking outside sklearn (e.g. at Keras) or writing your own estimator.
* Model _scoring_ allows you to select between different trained models. Scikit-learn makes custom scoring very easy.
* The difference is a custom score is called once per model, while a custom loss would be called thousands of times per model.
* The `make_scorer` documentation unfortunately uses "score" to mean a metric where bigger is better (e.g. $R^2$, accuracy, recall, $F_1$) and "loss" to mean a metric where smaller is better (e.g. MSE, MAE, log-loss). This usage of loss _isn't_ the same as the way it is used in this article.


## References

* The [`make_scorer`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.make_scorer.html) documentation.
* The [github issue](https://github.com/scikit-learn/scikit-learn/issues/1701) where the community decided against passing custom loss functions.
* Article on implementing a [custom loss](/custom_loss.html) (to come)
* Alex Miller's [customer estimator](https://alex.miller.im/posts/linear-model-custom-loss-function-regularization-python/) for implementing a custom loss (in this case MAPE: Mean Absolute Percentage Error)


