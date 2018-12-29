Title: Derivations and Conjugate Priors (average ratings)
Tags: data, statistics, Bayes, shrinkage
Date: 2018-12-28 15:00
Category: Data Science
Summary: This article contains derivations when applying the shrinkage methods of empirical Bayes to average rating problems.
Series: Empirical Bayes
series_index: 3

# Derivations and Conjugate Priors (average ratings)

## The problem statement

We have a lot  of items (such as boardgames) $i$, and each item has multiple reviews. We are interested in making the best estimate of the average rating $\theta_i$ of each item. Item $i$ has received $n_i$ ratings, with an observed average rating of $\bar{x}_i$ and observed variance $\sigma_i$.  In particular, we want to use information about the _global_ distribution of ratings for items to improve the estimates of $\theta_i$ for each individual item.

Under some reasonable assumption, we will show the "most likely value" for $\theta_i$ (technically the MAP estimate) is
$$\theta_i = B_i \bar{x}_i + (1-B_i)\mu, \quad\quad\quad B_i = \frac{\tau^2}{\tau^2 + \epsilon_i^2}$$
where

* $\mu$ is the average rating of all the items,
* $\tau^2$ is the variance of the average rating of all the items,
* $\bar{x}_i$ is the observed average rating of item $i$,
* $\sigma_i^2$ is the observed variance of the ratings for item $i$,
* $n_i$ is the number of reviews of item $i$,
* $\epsilon_i^2 = \sigma_i^2/n_i$ is the standard error in $\bar{x}_i$.

### Bayes's theorem and conjugate prior

We want to find the most likely value of $\theta_i$ given the data we have collected. i.e. we are looking to maximize $P(\theta_i | \text{data})$. This is called the _a posteriori_ distribution, as we are making our decision _after_ looking at the data. Bayes's theorem allows us to calculate this provided we have two other pieces of information:
$$P(\theta_i | \bar{x}_i) = \frac{P(\bar{x}_i|\theta_i)P(\theta_i)}{P(\bar{x}_i)}$$
Since the denominator is independent of our choices of parameter $\theta_i$ (i.e. it can be thought of as a normalizing factor), and we are interested in maximizing, it is more convenient to write Bayes's theorem as
$$P(\theta_i | \bar{x}_i) \propto P(\bar{x}_i|\theta_i)P(\theta_i)$$

The central limit theorem takes care of the first factor for us. It tells us explicitly that $P(\bar{x_i} | \theta_i)$ follows a normal distribution:
$$P(\bar{x}_i|\theta_i) \propto \exp\left(-\frac{(\bar{x}_i - \theta_i)^2}{2\epsilon_i^2}\right)$$
where $\epsilon_i = \sigma_i/\sqrt{n_i}$ is the standard error.

The _prior_, $P(\theta_i)$, is up for grabs. One of the criticisms of approaching things like a Bayesian is the arbitrariness in picking a prior, as different choices will lead to different results, and there is no one "right way" to select one. The prior used here will be the _conjugate prior_ to the normal distribution. This choice is one of convenience, although we can use the philosophy of empirical Bayes to see if it is a reasonable prior.

#### What is a conjugate prior?

A useful way of motivating the idea of a conjugate prior is to think of data collection as a continuous process. When we first collect our data, we make up some prior $P_0(\theta_i)$, and use Bayes's theorem to get
$$P(\theta_i | \text{data set 1}) = \frac{P(\text{data set 1}|\theta_i)P_0(\theta_i)}{P(\text{data set 1})}$$

The a posteriori distribution, $P(\theta_i | \text{data set 1})$,  represents our confidence in the values of $\theta_i$ _after_ looking at the data. If we have a new data set, it makes sense for $P(\theta_i | \text{data set 1})$ to act as the _new_ prior, since we have more information than we did when looking at the first data set:
$$P(\theta_i | \text{data set 2}) = \frac{P(\text{data set 2}|\theta_i)P_1(\theta_i)}{P(\text{data set 1})}, \quad\quad\quad P_1(\theta_i) = P(\theta_i|\text{data set 1})$$
i.e. we can view collecting data as the process of updating our prior to whatever the a posterior distribution was from the last round of data collection.

The type of distribution we get for the a posterior distribution depends on two things:

* The likelihood function, $P(\text{data} | \theta_i)$
* The prior $P(\theta_i)$

The likelihood functions are often well studied distributions, such as the normal, poisson, or binomial distributions. The _conjugate prior_ to a particularly likelihood function is a choice of parameterized prior such that the a posterior distribution is in the same family of distributions, but with a different set of parameters. This makes updating incredibly simple: instead of having to do a messy numerical integration every time we collect new data, we just need to know how to update the parameters. Since the "new prior" belongs to the same family, we can use the same technique for the next update.

For the rating problem, the central limit theorem tells us our likelihood $P(\theta_i | \bar{x}_i)$ is a Gaussian. We will show that the Gaussian distribution is conjugate to itself, and use this to motivate the choice of a Gaussian prior.

## Using a Gaussian Prior

We will start by using the Gaussian prior with mean $\mu$ and variance $\tau^2$:
$$P(\theta_i) \propto \exp\left(-\frac{(\theta_i-\mu)^2}{2\tau^2}\right)$$

This means that our a priori likelihood is
$$P(\theta_i | \bar{x}_i) \propto \exp\left(-\frac{(\bar{x}_i - \theta_i)^2}{2\epsilon_i^2}\right)\exp\left(-\frac{(\theta_i-\mu)^2}{2\tau^2}\right)$$
We can use the fact that products of exponentials simply sum their arguments:
$$P(\theta_i | \bar{x}_i) \propto \exp\left(-\frac{1}{2}\left[\frac{(\bar{x}_i - \theta_i)^2}{\epsilon_i^2} + \frac{(\theta_i-\mu)^2}{\tau^2}\right]\right)$$
Finally we can complete the square (and absorb the constant term into the proportionality) to get
$$P(\theta_i | \bar{x}_i) \propto \exp\left(-\frac{1}{2}\left(\frac{1}{\tau^2} + \frac{1}{\epsilon_i^2}\right)\left(\theta_i - \left[\frac{\tau^2 \bar{x}_i + \epsilon_i^2\mu}{\tau^2 + \epsilon_i^2}\right]\right)\right)$$
We can create new variables, $\hat{\theta}_i$ and $S_i^2$, to tidy up this formula to
$$P(\theta_i | \bar{x}_i) \propto \exp\left(-\frac{(\theta_i - \hat{\theta_i})^2}{2S_i^2}\right)$$
where
$$\hat{\theta_i} = \frac{\tau^2 \bar{x}_i + \epsilon_i^2\mu}{\tau^2 + \epsilon_i^2} = \left(\frac{\tau^2}{\tau^2 + \epsilon_i^2}\right)\bar{x}_i + \left(\frac{\epsilon_i^2}{\tau^2 + \epsilon_i^2}\right)\mu$$
and
$$\frac{1}{S_i^2} = \frac{1}{\tau^2} + \frac{1}{\epsilon_i^2}$$


To recap: our prior distribution for $\theta_i$ was a normal distribution with mean $\mu$ and variance $\tau^2$. This a posterior distribution is also normal, but with a mean of $\hat{\theta}_i$ and a variance of $S_i^2$. Since this is the same distribution as the prior with updated parameters, this demonstrates that the Gaussian distribution is conjugate to itself.

We can simplify the expression for $\hat{\theta}_i$, the most likely value for $\theta_i$:
$$\hat{\theta}_i = \frac{\tau^2}{\tau^2 + \epsilon_i^2}\,\bar{x}_i + \left(\frac{\epsilon_i^2}{\tau^2 + \epsilon_i^2}\right)\mu = \left(\frac{\tau^2}{\tau^2 + \epsilon_i^2}\right)\bar{x}_i + \left(1 - \frac{\tau^2}{\tau^2 + \epsilon_i^2}\right)\mu$$
After introducing $B_i = \tau^2/(\tau^2 + \epsilon_i^2)$ this expression becomes
$$\hat{\theta}_i = B_i \bar{x}_i + (1-B_i)\mu$$
as advertised.

### Other uses

We have done more than just find the "best" estimate for $\theta_i$. We have a distribution for $\theta_i$ as well! It is a Gaussian distribution with mean $\hat{\theta}_i$, and variance $S_i^2$.
With this, we could construct a 95% "credible interval", using the same techniques we would use to construct a confidence interval (the name change is to emphasize the difference in interpretation between the Bayesian and Frequentist approaches, the technique is the same). This gives us more than just the simple "point estimate".

## Can we use the prior just because of convenience?

You might object that choosing a Gaussian prior just because it has a nice mathematical property (in this case, making the updated prior belong to the same distribution as the original prior) as being less than data-driven. The idea of choosing models with mathematically convenient  but unrealistic assumptions is a critique that Leo Breiman, professor of statistics at Berkeley, made about the culture of statisticians back in 2001 in his paper ["Statistical Modeling: The Two Cultures"](https://projecteuclid.org/download/pdf_1/euclid.ss/1009213726).

If we are doing empirical Bayes, we use the distribution of $\bar{x}_i$ (in our case, the ratings of boardgames) to infer the parameters of the prior distribution, $\mu$ and $\tau^2$. When we are doing this, we should also check that the distribution looks somewhat normal! The motivation behind the empirical Bayes philosophy is that since priors are somewhat arbitrary, we should use the pooled data to determine them.

What would happen if the global distribution deviated significantly from normal? For example, the distribution of ratings could be bimodal, or skewed. In that case, we could move to either a mixture model, or just resort to numerical integration when calculating the a posteriori distribution. The conjugate prior trick is just a convenience to make updating the priors easier, but if another prior works better we can still use empirical Bayes -- we will just require a lot more computation instead of the simple lines of code that can perform the regression to the mean for us.

## Summary

* Empirical Bayes uses the global distribution of parameters to adjust raw averages.
* It is convenient to assume the prior distribution for ratings is a Gaussian with mean $\mu$ and variance $\tau^2$. You should get $\mu$ and $\tau^2$ by matching the mean and variance of the average ratings. This assumption can be checked by plotting the average ratings and checking they follow a normal distribution.
* Under the conditions of the central limit theorem, we can "shrink" or "regress" the raw average $\bar{x}_i$ for item $i$ to
$$\hat{\theta}_i = B_i \bar{x}_i + (1-B_i)\mu, \quad\quad\quad B_i = \frac{\tau^2}{\tau^2 + \epsilon_i^2}, \quad\quad \epsilon_i^2 = \frac{\sigma_i^2}{n_i}$$
* The standard error $S_i$ in this estimate $\hat{\theta}_i$ can be found from
$$\frac{1}{S_i^2} = \frac{1}{\tau^2} + \frac{1}{\epsilon_i^2} = \frac{1}{\tau^2} + \frac{n_i}{\sigma_i^2}$$
