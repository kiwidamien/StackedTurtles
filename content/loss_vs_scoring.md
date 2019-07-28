Title: Custom Loss vs Custom Scoring 
Tags: machine learning, technical, metrics
Date: 2019-07-28 15:20
Category: Data Science
Status: draft
Summary: Scikit learn grid search functions include a scoring parameter. Scorers allow us to compare different trained models. Models try to minimize a _loss_ function. While custom scoring is straight-forward, custom losses are not.



## References

* The [`make_scorer`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.make_scorer.html) documentation.
* The [github issue](https://github.com/scikit-learn/scikit-learn/issues/1701) where the community decided against passing custom loss functions.
* Alex Miller's [customer estimator](https://alex.miller.im/posts/linear-model-custom-loss-function-regularization-python/) for implementing a custom loss (in this case MAPE: Mean Absolute Percentage Error)


