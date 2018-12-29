Title: Derivations and Conjugate Priors (proportions)
Tags: data, statistics, Bayes, shrinkage
Date: 2018-12-28 20:00
Category: Data Science
Summary: This article contains derivations when applying the shrinkage methods of empirical Bayes to proportion problems.
Series: Empirical Bayes
series_index: 4

# Derivations and Conjugate Priors (proportions)

## The problem statement

We have some collection of binomial distributions, where each one has a probability of success $p_i$. For example, individual baseball hitters have a probability $p_i$ of hitting the ball that depends on the particular batter $i$. In the example investigated in this series, we looked at the kidney cancer rate on a per county basis. We are interested in using information about the population distribution of $p_i$ to help us get better estimates of $p_i$ than just the number of successes over number of failures for the experiment $i$.

Introducing some notation, let $s_i$ be the number of successes that experiment $i$ has had, and $f_i$ be the number of failures. In the baseball example, $s_i$ would be the number of "hits" player $i$ has had over his or her career, and $f_i$ would be the number of misses. In the kidney cancer example, $s_i$ would be the number of cases of kidney cancer found in county $i$, and $f_i$ would be the number of healthy people. The maximum likelihood estimate for $p_i$ is
$$\hat{p}_{i} = \frac{s_i}{s_i + f_i} \,\quad\quad\quad(\text{MLE})$$
We will show, under some reasonable assumptions, that a better estimate can be found with
$$\hat{p}_i = \frac{s_i + s_0}{s_i + f_i + (s_0 + f_0)}$$
for appropriate choices of $s_0$ and $f_0$.

### Bayes' theorem and conjugate priors

### What is a conjugate prior?

### Using the Beta distribution
