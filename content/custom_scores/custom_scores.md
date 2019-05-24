Title: Custom scoring in cross-validation 
Tags: Data Analysis, sklearn
Date: 2018-05-03 17:00
Category: Data Science
Summary: The scoring functions used in our models are often baked in (such as using cross-entropy in Logistic Regression). We do get some choices when cross-validating, however. For example, we can pick the regularization parameter by using the ROC area under the curve. Here we show two examples of using custom scoring functions for picking hyper-parameters.

It is common to find the parameters of a machine learning algorithm by optimizing one metric, but then do cross-validation or threshold checking on a different metric. Sometimes this is because of computational convinience: in a decision tree we are choosing the splits by optimizing the "information gain", which can be either the entropy or the gini score, with the goal of maximizing accuracy (or precision, or recall, or ....). In fact, most of the classification models try minimize something that isn't our primary metric, such as the cross-entropy. For some models, there is a strong connection between a metric (such as accuracy) and the quantity being optimized (such as cross-entropy). But if we have a variety of models (including the selecting hyperparameters amongst the same class of model), we will often pick the best one using a criteria 
