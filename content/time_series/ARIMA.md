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

| Day/Time | 1/12:00 | 2/13:00 | 3/10:00 | 4/09:00 | 5/16:00 |
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

Many time series techniques "anticipate" cyclic behavior, and give up flexibility in order to gain interpretability and making better fits with less data. You can find a discussion of this trade-off [here](the-interpretability-dilemma.html). This series will focus on two similar models for looking at time series:

* **Auto-Regressive Integrated Moving Average models** (ARIMA models)
* **Seasonal ARIMA models** (SARIMA models)

Naturally there are extensions to these models, such as SARIMAX (Seasonal ARIMA models that include eXogenous variables). Different flavors of models for time series not covered in this series are

* **General Additive Models** (GAMs). This is what Facebook Prophet uses. These models also make assumptions about cyclic behavior, and will be covered in the series on SimpleProphet.
* **LSTMs**. These are the general purpose technique for solving sequence learning problems.

For this series, we will be focusing on ARIMA and its close cousin SARIMA. These models are considered the classical techniques of

# Components of a time series

When looking at a time series, the classical methods (ARIMA and GAM) assume we can break it into three components:

* A long term trend
* A cyclic variation
* Noise

(INSERT IMAGE HERE)

## Trend subtraction

ARIMA is used to model _stationary_ series. This has a technical meaning that the distribution of values doesn't depend on when you choose to measure it, but for practical purposes it is generally enough that the mean and standard deviation of what you are trying to measure doesn't depend on when you are measuring it.

This seems counter-intuitive, as most quantities of interest have an overall trend. Often the trend is the most interesting part of the time series. Consider these examples of time series:

* When looking at the temperature, we know that it will get colder in winter than summer, but it seems like we would want to know if it is generally getting cooler or warmer over time.
* The owner of the downtown coffee shop knows there are busy periods around 8:00 - 10:00 and again at 2:00 - 4:00, but she would be interested in whether the shop is seeing an increase in sales week to week or not.

Let's focus on the second example. If our coffee shop owner is interested in the week-to-week performance of the store, she should ignore the minutia of the daily busy periods, and instead look at daily or weekly sales totals. Using those, she could make a long-term trend about what she expects the future of the business to look like. Unless these weekly sales also show a cyclic variation, she can ignore time series for the purposes of answering her question.

If she is interested in knowing when to schedule her staff, however, anticipating how many customers are going to be in the shop during the 8 - 10 rush is important. It is about choosing the right tool for the right job:

* When looking to predict just the trend, classical time series techniques are _useless_. Don't use time series to make long term predictions about the trend.
* When you care about how you are _deviating_ from the trend, classical techniques show their value.

The basic approach with the classical techniques is to remove the trend in order to model a stationary series. If a series is stationary, its statistical properties -- in particular, how the next value is correlated with the previous values -- doesn't change in time. This allows our model to simply be a static collection of correlations that don't change, so predicting them is easy! When we want to make a prediction, we use our knowledge of the (static) correlations, as well as our knowledge of the actual values to get the prediction of the new value, then add the trend back in.

## The ARIMA model

The ARIMA model assumes that after differencing enough times, we have a stationary series, and that this stationary series can be modeled using lags (the _autoregressive part_) and combinations of the residuals (the _moving average part_).

It helps to discuss the auto-regressive (AR) and moving average (MA) parts separately. Both the AR and MA parts take a number of terms they should "look back". We will discuss how to set these parameters, traditionally called $p$ and $q$, in the next article in this series.

### Auto-regressive model of order p: AR(p)

An AR(p) model assumes that the current value of the target, $Y(p)$, can be written as a linear combination of the $p$ previous values of $Y$ with some random white noise term added:

$$Y(t) = \beta_1 Y(t-1) + \beta_2 Y(t-2) + .... + \beta_p Y(t-p) + \varepsilon(t)$$

One approach to modeling this is to copy the "lags" $Y(t-1)$, ...., $Y(t-p)$ into the same row of your dataframe as your target, so we are treating them as features. Using $X_i(t) = Y(t-i)$, we have

$$Y(t) = \beta X_i(t) + \varepsilon(t)$$

which looks a lot like the equation for linear regression. You could use the standard linear regression techniques to find the coefficients $\beta$ to "solve" the model.

This still leaves the question of how we find $p$ -- that is, how many lags should we include? We will answer this question in our next article.

#### Example of AR(1)

Usually we have observations, and try to determine the coefficients of a series. It can be instructive to actually build a series to see what is happening.

$$Y(t) = 0.4Y(t-1) + \varepsilon(t)$$

where $\varepsilon$ was random noise with mean 0 and standard deviation 1.

If $Y(0) = 3$, we might get $Y(1) = 0.4*3 +\varepsilon(0) = 1.2 + \varepsilon(0)$. Let's say the random noise term was $-0.2$, so $Y(1) = 1.0$. Then the next term would be $Y(2) = 0.4Y(1) + \varepsilon(1) = 0.4*1.0 + \varepsilon(1) = 0.4 + \varepsilon(1)$. This time, maybe the random noise term is $0.2$, so $Y(2) = 0.6$. We can write Python code to simulate this process:

```python
import random

def get_next_value(previous):
    noise = random.gauss(0,1)
    return 0.4*previous + noise
```

Note that if we changed $Y(0)$, that would change $Y(1)$, and changing $Y(1)$ would in term change $Y(2)$, et cetera. Even though $Y(t)$ only _explicitly_ depends on $Y(t-1)$, changing any of the earlier values of the target $Y$ will end up altering $Y(t)$. Another way of saying this is that our system never truly "forgets" any of the previous values, even with only one lag ($p=1$).

### Moving average of order q: MA(q)

The moving average is a little more subtle. A moving average of order $q$ assumes the current value is given by looking at a linear combination of the last $q$ _noise_ terms.
