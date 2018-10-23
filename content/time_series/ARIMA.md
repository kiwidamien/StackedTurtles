Title: An Introduction to ARIMA
Tags: Time series, ARIMA, Classical time series
Date: 2018-10-22 23:00
Category: Data Science/Time series
Summary: An article that outlines the standard approach to time series.
Series: ARIMA
series_index: 1

# What is a time series?

A time series is any variable that is recorded at _regularly spaced_ intervals. For example, if we recorded the temperature every day at the same time, we might get the following time series:

| Day/Time | 1/12:00 | 2/12:00 | 3/12:00 | 4/12:00 | 5/12:00 |
| --- | --- | --- | --- | --- | --- |
| Temp (F) | 65 | 68 | 70 | 71 | 70 |

The following set of observations are **not** a time series:

| Day/Time | 1/12:00 | 2/13:00 | 3/10:00 | 4/9:00 | 5/16:00 |
| --- | --- | --- | --- | --- | --- |
| Temp (F) | 65 | 70 | 71 | 68 | 66 |

Even though they measure how a variable (temperature) changes in time, the time intervals are not regularly spaced.

# Modeling with time series

When building predictive models, we are looking to take some _features_ to predict a _target_. For example, a machine learning model might predict house prices using square footage, neighborhood, number of bedrooms and number of bathrooms. In this case, the features are `(square footage, neighborhood, number of bedrooms, number of bathrooms)` and the target is `house price`.

For a time series model, we are considering two types of features:

* Features that don't include the target variable, called _exogenous variables_
* Previous values of the target variable, called _lags_

For example, we could try and predict the temperature (target) tomorrow using the amount of cloud cover today (an exogenous variable) and the temperature in each of the last three days (the lags).

The simplest time series don't use any exogenous variables; instead they try to predict future values of the target using only the past values. Formally, this is an example of the [sequence prediction problem](https://en.wikipedia.org/wiki/Sequence_learning). The state of the art techniques for learning a general sequence is to use **Long Short-term Memory** (LSTM) neural networks. While LSTMs can be used for neural networks, many time series problems show variation on a "natural cycle", so it can help to use techniques that manipulate this pattern. For example:

* Food sales see weekly cycles (Saturdays are similar to other Saturdays), monthly cycles related to people being paid.
* Drink driving incidents also see weekly cycles (as well as sharp peaks around holidays).
* Weather events typically don't see weekly cycles, but do see strong yearly cycles (related to the seasons).

Many time series techniques "anticipate" cyclic behavior, and give up flexibility in order to gain interpretability and 
