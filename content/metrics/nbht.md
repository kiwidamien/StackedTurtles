Title: Hypothesis tests and sample size (p values and Cohen's h)
Slug: nbht 
Tags: p_values, cohen, effect size, sample size, power
Date: 2020-01-19 18:00
Category: Data Science
Summary: p-values are commonly used to determine if an effect is statistically significant. Cohen's D gives a measure of how important an effect is. It is possible to see a statistically significant difference (p value small) even if the effect isn't important (D small).

One of the common questions we might have as data scientists is deciding which version of a webpage, email, or web advertisment to use. For each of these, we have a "call to action" (such as signing up, making an order, following a link, etc). If someone does the action we are asking them for, we call it a __conversion__. The question we are generally tasked with is

> Given different versions of <page/email/ad>, which one lead to the largest conversion rate?
 
If we just wanted to determine the raw fraction of people that converted, this would be a simple SQL query. The challenges are:
- We want to estimate which page/email/ad has the largest **underlying** conversion rate, not just the highest sample rate.<br/>
  If we show an ad to 1000 people and 510 convert, if we did the same experiment again, maybe only 505 people convert. Our samples are trying to access the "true" conversion rate, which we only know if we take an infinitely large number of people from our experiment.
- Often there is a **control** or **status quo** variation to beat.<br/>
  Many times there is a pre-existing page our customers are already familiar with, so we want to be convinced that the new variation is better (not just the new version "might be" better).
- If there is a cost to switching, we want to know that switching is worth it.<br/>
  If we are sending out attachments in our email that are causing costs to increase, we might decide that we need a 1 percentage point increase in people's responses before the additional costs are worth it.

A common framework for looking at these types of questions is null-based hypothesis testing (NBHT). In NBHT, a control is selected, which we will say is $A$. The idea is that $A$ will be the winner _unless_ we find compelling evidence that $B$ is the winner. In the case of a tie, or only weak evidence that $B$ is better, we will still use the control $A$. A decision made at the beginning of the experiment is "how strong does the evidence need to be to dethrone the control", which we give as a $p$-value.

## The null hypthoesis and the p-value

Our null hypothesis (called $H_0$) is the statement that both pages have the same conversion rate, so there is no advantage of switching from $A$ to $B$. We write this mathematically as

$$ H_0: \pi_A = \pi_B$$

where $\pi_A$ is the "true" conversion rate of page $A$, and $\pi_B$ is the "true" conversion rate of page $B$. 

Now, the null hypothesis is almost certaintly wrong (i.e. we are very unlikely to live in a world where $A$ and $B$ have the **exact** same conversion rate, or even the same to "only" the 100th decimal place). We don't pick the null hypothesis because we believe that it is true, instead we pick it because we have a specific model that we can simulate the probability we get a result this extreme (or more) if the null hypothesis was true.

To see why probabilities get involved, imagine we showed page A to 1000 people and got 310 sign ups (i.e. conversion rate of 31%). If we showed the exact same page to another 1000 people, we may only get 308 sign ups (i.e. conversion rate of 30.8%). Even looking at the same page, we expect there to be some variation between our measured sample rates. We expect as we make our sample size larger, the amount of fluctuation in our measured conversion rate should decrease. The central limit theorem makes this more formal: we expect our _measured_ conversion rate to follow a normal distribution with standard deviation of $\sqrt{\pi_A(1-\pi_A)/N_A}$, where $N_A$ is the number in our sample.

Suppose we got the following data from an experiment

| Page Version | Views | Conversions | Conversion rate |
| ---- | ---- | ---- | ---- |
|   A  | 1000 | 310 | 31.0% |
|   B  | 1000 | 312 | 31.2% |

We know _in these samples_ B performed better. A null hypothesis test asks "if A and B were EXACTLY the same (something we don't actually believe), what is the probability that we see a conversion rate difference of 0.2% or more, just by chance?". This number is the $p$-value. We generally pick a threshold, and claim that if the $p$-value is less than this threshold, we should consider it strong enough evidence that the challenger is better, and use that instead.

### A p-value calculation

By the central limit theorem, the _differences_ between the population proportions are also normally distributed. The mean of the differences is zero (according to the null hypothesis), but the standard error takes into account we are taking the difference between distribution, which _adds_ to the variance. The variance for the difference in conversion rates is

$$\text{Var(difference)} = \text{Var(conversion rate A)} + \text{Var(conversion rate B)} = \frac{\pi_A(1-\pi_A)}{N_A} + \frac{pi_B(1-\pi_B)}{N_B}$$

We know $N_A = N_B = 1000$ (the number of views for each). We don't know $\pi_A$ (the true rate for $A$) or $\pi_B$ (the true rate for B). We only know the rates in our sample of 1000. The null hypothesis tells us to assume $\pi_A$ and $\pi_B$ are the same, so our best estimate is 
$$\pi_A = \pi_B = \text{total conversions}{total views} = 622/2000 = 0.311$$
Plugging this in, we get an expected variance (under the null hypothesis) of 0.000429. Taking the square root, we get a standard deviation of differences in conversion rate (also called the _standard error_) of 0.0207.

So we have an actual difference in conversion rate of 0.002 (i.e. 0.312 - 0.310), and a typical variation in samples of size 1000 of 0.0207. The z-score of the fraction of teh difference we actually found, divided by the typical variation we expect to find:
$$z = \frac{0.002}{0.0207} = 0.0966$$
The probability of getting a z-score higher than this on a standard normal distribution is shown as the shaded region (note that I am looking at a two-tailed test, which is the same as asking for the size of |z| being higher than 0.0966) in the diagram below:
![Shaded region shows the p-value](images/null_hypothesis_two_tailed.png)
Using normal distribution tables, this gives us a p-value of 0.923

**Interpretation**: _If_ the null hypothesis is true, there is a 92.3% chance of seeing a difference in conversion rate of 0.2% or higher in samples of 1000, even though there is no difference.

## Confusion about $p$-values: significance vs statistical significance

This is **not** the same as saying that there is a 92.3% chance the null hypothesis is right. There is almost 100% chance that the null hypothesis is wrong (i.e. it is almost impossible that A and B have the EXACT same conversion rate). What a p-value of 0.923 says is if we pretend there is no effect, there is a 92.3% chance we see a difference at least this large by chance alone. 

If we make the sample size larger, we will be able to detect smaller and smaller effects. That is because the difference in effects should be the same regardless of sample size, but the standard error decreases as we increase the sample size.

Suppose that the actual conversion rates are page A converts at 31.0%, and B converts at 31.5% (i.e. our experiment happened to hit exactly the right values). We could ask how the $p$ value changes as we make the experiment bigger and bigger. Let's pretend we have 6 different data science teams working on the same question, so for each experiment, we have 6 different $p$ values (one from each team) just to see how they compare. The code is in [this notebook]() with a seed set for reproducability, with the results tabulated below:

|   N        |   p-value trial 1 |   p-value trial 2 |   p-value trial 3 |   p-value trial 4 |   p-value trial 5 |   p-value trial 6 |   average |
|-----------:|------------------:|------------------:|------------------:|------------------:|------------------:|------------------:|----------:|
|      1,000 |        **0.029**  |            0.3503 |            1      |            0.5586 |            0.923  |            0.3029 |    0.5273 |
|      5,000 |            0.2923 |            0.8633 |            0.0656 |            0.9139 |            0.7301 |            0.1733 |    0.5064 |
|     10,000 |            0.5702 |            0.7602 |            0.2722 |            0.3663 |            0.4814 |            0.4249 |    0.4792 |
|     50,000 |            0.4941 |            0.3019 |            0.2507 |            0.8856 |            0.7427 |            0.4863 |    0.5269 |
|    100,000 |            0.3645 |            0.3609 |            0.9575 |            0.3664 |            0.3316 |            0.0773 |    0.4097 |
|    500,000 |            0.3415 |            0.9414 |            0.1279 |            0.9552 |        **0.0487** |            0.4429 |    0.4763 |
|  1,000,000 |            0.102  |            0.4925 |            0.0791 |            0.5874 |        **0.0058** |            0.1107 |    0.2296 |
| 10,000,000 |        **0.0001** |        **0.0022** |        **0.0198** |            0.1127 |        **0.0258** |            0.3449 |    0.0843 |

I have emphasized experiments that had a $p$-value less than 0.05. Remember this means that even if there was no effect, we would still expect to see a p-value of 0.05 or smaller in 1 out of 20 experiments! That is because if there is no effect, the $p$-value is uniformly distributed over the interval [0,1]! This is precisely because the p-value is the probability of discovering a difference by chance _if there is no difference_. 

The $p$-value **doesn't** tell us if there is a difference what the probability is of seeing it. As argued above, the chance that there is _some_ difference, if we go to enough decimal places is approximately 100%. In our generated dataset, once we got to sample sizes of 10 million, four out of 6 of our data science groups could detect a difference. In reality, we would not duplicate an experiment 6 times -- we would only have one group look at it. So, as a rough estimate, 1/3 of the time with a sample size of 10 million we would detect the difference between a conversion rate of 31.0% and 31.5%.

If we go to N=50 million, all 6 teams saw a p-value of 0.0000 (i.e. zero to at least 4 decimal places). With a sample size of 50 million, we are pretty confident we will see a statistically significant result. But do we care about increasing conversion by 0.5 percentage points? Another way of asking this is if we had 100 million clients to run an A/B test with (50 million to see variation A, 50 million to see variation B), is this the most valuable A/B test we could run? Or are there bigger gains we could make elsewhere? Assuming the answer is that there are more valuable things we could be doing than running this experiment with 100 million clients, an experiment with 50 million people per variation would find a statistically significant result (p-value << 0.05), but not one that was practically significant.

Suppose we thought that this experiment _would_ be worth running for a 0.5 percentage point expected gain with 10,000 clients (i.e. 5000 see variation A and 5000 see variation B). Looking at our table, we see _none_ of our six teams in the simulation saw anything. That is, 5000 clients isn't enough to detect a difference this small. Even though this difference of 0.5 percentage points is "worth" an experiment of 10k clients, such an experiment would be a waste because it won't detect anything. So we may as well spend those clients doing something else.

### Summary of p-values

We can take this idea of pretending we have 6 teams doing parallel experiments, and instead think we have a very large number of teams running independent experiments (e.g. 100k+ teams). In the real world, we would only have 1 team analyzing results, but pretending we have many teams helps us think about how p-values work.

- If there is actually no difference between page A and page B, then the 5% of teams will see a p-value smaller than 0.05 (and 10% will see a p-value smaller than 0.1, etc). The p-value tells you the fraction of teams that make the wrong conclusion. This is independent of the number of clients in your sample!
- If the difference between rates is small (roughly if the difference is smaller than $1/\sqrt{N}$), the difference between page A and page B will be approximately the same as the p-value (i.e. 5% of teams will see a p-value smaller than 0.05). If $N$ gets big enough, you will eventually be able to detect a difference.
- If the difference between rates is large (roughly if the difference is much bigger than $1/\sqrt{N}$), then the p-values will cluster around 0, so you will start to reliably pick the better performing result.

A different, more mathematical way of phrasing this, is
* if $\pi_A = \pi_B$, the limit of the distribution of $p$-value as $N\rightarrow \infty$ is the uniform distribution.
* if $\pi_A \neq \pi_B$, the limit of the dsitribution of $p$-values as $N\rightarrow \infty$ is 0 (with probability 1).

Since we know there is _always_ some difference between the two versions, we know that given enough resources we should be able to pick the "best" version. Given limited resources, it may not be worth figuring out which version is best.

## Cohen's h

Let's ask instead whether we expect a shift of 0.310 -> 0.315 to be a big difference of not. Cohen's $h$ is an attempt to standardize the size of shifts in proportions (similar to Cohen's $d$ in a previous article). The formula is
$$\phi_A = 2\arcsin \pi_A, \quad\quad \phi_B = 2\arcsin \pi_B, \quad\quad h = |\phi_A - \phi_B|$$
We generally don't have access to $\pi_A$ and $\pi_B$, but can use the values we found from our experiment as an approximation. The idea is that we can look at the effects of different experiments as "small", "medium", or "large" by comparing the values of $h$:

| Cohen's h | Size of effect | 
| ---- | ---- |
| 0 - 0.2 | "small" |
| 0.2 - 0.5 | "medium" |
| 0.5 - 0.8 | "large" |

In our example, we have $\phi_A = 0.315$, $\phi_B = 0.320$, so $h \approx 0.011$ (i.e. a (very) small effect).  


### The large sample behavior of Cohen's $h$

Let's repeat the same thought experiment we had above, where we get a lot of teams to calculate the value of $h$ from an experiment. If each team calculates $h$ using their sample data, the distribution of $h$ will be an (approximately) normal distribution around the true value. The bigger the number $N$ of clients that see each variation, the "tighter" the distribution of our different teams will be around the true value. If the effect size is there but small, we will have many teams that _see_ and effect, but all those teams agree the effect is small.

This differs from the $p$ value in one critical way. A very small $p$ value tells you the experiment has, with high probability, detected a difference. If there is no effect, your $p$-value will be distributed randomly, so different teams will have wildly different values. It _doesn't_ tell you anything about the size of that difference. Cohen's $h$, on the other hand, tells you about the size of the effect and different teams will get similar values for $h$. There is no contradiction here - like many things in statistics, any single team's calculation of $h$ based off the single sample will have a confidence interval you can calculate, so whether or not there is an effect depends on whether that confidence interval contains $0$.

### The inconsistency of Cohen's $h$

There is one troubling aspect of Cohen's $h$, which is it is inconsistent about which outcome you term a success. In our example, we have looked at two pages with conversion rates of 0.310 amd 0.315. The value of Cohen's $h$ was approximately 0.011, which qualified as a "small" effect. 

But suppose we reversed the definition of "conversion" to **not** take the action described. Then the "conversion" rate of page A is 0.69, and the "conversion" rate of page B is 0.689. The value of Cohen's $h$ is now 0.003, which is significantly smaller.

You might object that this is a silly distinction, as it should be clear what event should count as a conversion. To see why this is an issue, imagine that instead of picking a version of webpages, we were picking between two coins that might be weighted differently, so they may have a different distribution of heads vs tails. If we were trying to quantify how "off" these two coins were from each other, it shouldn't matter if we are measure the probability of getting heads vs the probability of getting tails -- if one of these measures says "the coins are significantly different" the other one should too. What the calculation above shows is that our choice of whether to think of $\pi_A$ as the probability coin $A$ gives heads can give a different result than if we think of $\pi_A$ as the probabiltiy coin $A$ gives tails, even when the question is "do coins A and B have the same proportion of heads vs tails as each other?"

## Summary

The "textbook" hypothesis testing method is null hypothesis testing, which is centered around the $p$-value. A $p$-value really has one job: it makes a guarantee that if the null hypothesis was exactly true, how unlikely it would be to get a result at least as extreme as the one you actually saw. That is, it limits the probability of you rejecting the null hypothesis _if the null hypothesis is true_. The problem is, no one believes the null hypothesis actually is true, and in most cases we are almost certain it is not (because it states something like "these two rates are **exactly** equal"). From a business or problem-solving perspective, we are generally more interested in whether or not the difference in two webpages (or ads, or medicines) is large enough for us to switch our treatment, and the $p$-value _doesn't_ answer that question.

More specifically, if there is _any_ difference at all, at a large enough sample size we will start to see a small $p$-value. If the effect size is small, maybe we can get a better payoff by running a different experiment instead. When we run an actual experiment, we should consider what the smallest effect we consider to be important is, and [design our experiment](/power_analysis.html) around that.

In bullets:

- The $p$-value tells you what the probability is of getting a result as extreme as the one you saw if the null hypothesis is true (typically that your variations are **exactly** the same)
- The traditional null hypothesis test states that if your $p$ value is less than some threshold $\alpha$, you reject the null hypothesis and claim there is a difference.
- By construction, if there really is no difference (i.e. the null hypothesis is correct) you will reject the null hypothesis with probability $\alpha$.
- There is always some difference between two variations, even if it is small! So the real probability that you reject the null hypothesis is always actually less than $\alpha$ =)
- Even though rejecting the null is "always" the right thing to do, what we are generally interested in is which variation is better. Often when we have a large $p$-value, we know there is some difference between the variations (i.e. the null is wrong) but we cannot tell which one is better, but we are okay with it because the difference is likely small.

Focusing on the outcomes:
- If there is no difference, taking really large samples doesn't force your $p$-values to zero. They stay a uniform distribution!
- If there **is** a difference, you can make the $p$-value really small provided you get a large enough sample.
- A low $p$-value just means that it is unlikely this result happened by chance, it doesn't mean the effect is important.
  - Our example was changing conversion rates from 31.0% to 31.5%, which was very significant if we have 50 million people look at each variation, but a 0.5 percentage point change wasn't actually that important. 
- Textbooks focusing on just the $p$-value _once the data has been collected_ have done hypothesis testing a disservice. In our next article on [designing experiments](/power_analysis.html) we show how to think about the smallest effect you would like to detect, and then determine the sample size you would need to detect it reliablely. As a spoiler, it is easier to detect big effects than small ones (i.e. you need smaller samples to detect bigger changes).

Finally, there is Cohen's $h$:

- Cohen's $h$ is a standardized measure of the difference in proportions between two treatments (e.g. webpages)
- While there is always a difference between treatments, so a $p$-value would go to zero as the samples get larger, $h$ tends toward a stable value as the sample size gets larger.
- The values different teams measure for $h$ is (approximately) normally distributed around the "true" value. The distribution gets narrower around the true value as the sample size gets larger.




## References

- [Lyft's blog post on experimental interference](https://eng.lyft.com/experimentation-in-a-ridesharing-marketplace-b39db027a66e)
- [Nina Zumel's talk on "Myth's of Data Science](https://github.com/WinVector/ODSCWest2017/blob/master/MythsOfDataScience/MythsOfDataScience.pdf) has some excellent slides on Cohen's $d$ and Cohen's $h$.
- Wikipedia's article on [Cohen's h](https://en.wikipedia.org/wiki/Cohen%27s_h)

