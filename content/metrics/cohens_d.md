Title: Normalization (z-score for features, Cohen's D for results) 
Tags: feedback, metrics, cross-validation, causal
Date: 2020-01-18 14:00
Category: Data Science
Summary: p-values are commonly used to determine if an effect is statistically significant. Cohen's D gives a measure of how important an effect is. It is possible to see a statistically significant difference (p value small) even if the effect isn't important (D small).


Let's say we had an experiment that was looking at the effect of diet on weight. Maybe some of the features we would include are
- height of the subject (continuous)
- gender (categorical)
- race (categorical)
- initial weight (continuous)
- diet plan (categorical)
Our target would be the **final weight** of our subject, after the diet regemine comes to an end.

One very simple model we could apply is a linear model, in which case we would be most interested in the coefficient of the different `diet_plan` variables. By choosing the plan with the smallest coefficient (i.e. most negative, or if there are no negative coefficients, least positive coefficient), we have a candidate for the most effective diet plan. (We would have to check the robustness of the linear assumption, and the process that people were selected into different groups, before being very certain). In a more complicated model, we might need to include interaction effects between initial weight and height, and the diet plan chosen.

Let's say we find the following model with _unscaled_ features:
```python
final_weight_in_lbs = (1.2 * (height_subject_feet) + 0.98 * (initial_weight_in_lbs) 
                       - 10*(is_female) + 0*(is_diet_A) - 2.3 * (is_diet_B) 
                       - 6.50)
```
How much more important is height than initial weight in this model? We don't want to claim that height is more important just because it has a bigger coefficient. Someone that is an extra foot taller is _much_ more noticable that somoene that is an extra pound heavier. We could claim that increasing the height of someone by 1 foot has the same effect as increasing the initial weight by 1.23 pounds to get some idea of the trade-off, but more often we standardize our features using $z$ scores.

## Feature normalization with $z$ scores

For continuous features, the idea is we center values around the mean, and measure them in units of standard deviations. This allows us to compare shifts in $z$-scores by how large a shift (i.e. how many standard deviations) we are moving from the typical value of the population. The formula is
$$z = (X - \mu)/\sigma$$

For example, the average height in the US is 5.4 ft with a standard deviation of 0.4 feet (if we don't separate by gender). So changing a height by 1 foot would be the same as changing by 2.5 standard deviations (i.e. quite a bit!). The average weight of people in the US pooled between genders is 180 lbs with a standard deviation of 30 lbs. An increase of 1 pound is only changing by 0.033 standard deviations.

If we fit our model using $z$-scores, we would get
$$\text{final weight in lbs} = 0.48*(z_{\text{height}}) + 29.4*(z_{\text{ini weight}}) - 10*(\text{is_female}) + 0*(\text{is_diet_A}) - 2.3*(\text{is_diet_B}) + 180$$
Our coefficients now capture the importance of the features, when we compare to the _natural_ scale of variation of the underlying feature.

## Effect normalization

Regardless of whether or not we normalize the features, we can also ask how big an effect this is:

- `diet_A` has no effect on underlying weight,
- `diet_B` causes a loss of 2.3 lbs.

Of course, this just means that `diet_A` was chosen as the baseline. The real measureable thing is that the average weight difference between diet A and diet B is 2.3 pounds. If we are interested in absolute numbers (i.e. 2.3 pounds), this is good enough. We can also ask how big is 2.3 pounds in terms of the standard deviation of final weights. This equivalent of z-scores for the results is known as Cohen's D.

In this case, suppose we have 500 people in diet A and 400 in diet B. The standard deviation in final weights in diet A was 25 lbs, while the standard deviation of final weights in diet B was 28 lbs. The pooled standard deviation from combining both distributions is
$$(\text{pooled std dev})^2 = (N_A \sigma_A^2 + N_B \sigma_B^2)/(N_A + N_B) = (500\times(25)^2 + (400)\times(28)^2)/900 = 695.66$$
or the pooled standard deviation is 26.4 lbs after taking the square root.

Cohen's D is given by
$$ D = \frac{\text{mean difference}}{\text{pool std dev}} = \frac{2.3\text{ lbs}}{26.4\text{ lbs}} = 0.087$$
The way we can interpret this is that moving from diet A to diet B is that we "move the needle" (i.e. final weight) by 0.087 standard deviations.

## Effect size

Cohen's D gives us a standard effect size, so we can compare different effects against one another. There is a "look-up" table to see how big an effect your experiment has compared to "typical" experimental results. The following size chart was taken from the [wikipedia article](https://en.wikipedia.org/wiki/Effect_size#Cohen's_d) on Cohen's $D$:

| Cohen's D | Size of effect | 
| --- | --- |
| < 0.01 | Very small |
| 0.01 - 0.20 | Small | 
| 0.20 - 0.50 | Medium |
| 0.50 - 0.80 | Large |
| 0.80 - 1.20 | Very Large |
| > 1.20 | Extremely large |

When reporting effects of a change in diet, it is probably more meaningful to describe diet B is associated with 2.3 pounds of weight loss instead of $D = 0.087$ or "a small effect". However, when planning an experiment, if we estimate $D = 0.087$ we might decide that since this is a small typical value of $D$, we might be better off looking for a diet that has a greater effect.

## Summary

Ultimately Cohen's D is a heuristic about effect size. Bigger Cohen's $D$ means a larger effect, and if you are trying to prioritize different efforts on different metrics, Cohen's D can be one way of estimating the "change" and resources you put behind a particular experiment or effort. Ultimately there isn't really a shortcut to considering your ultimate bottom line: a "large" effect on the signups might be less important to company metrics than a "small" effect to the number of abandoned checkouts. For proportions, there is the closely related [Cohen's H](https://en.wikipedia.org/wiki/Cohen%27s_h) to look at the effect of changes in effect size.

In a followup article on [hypothesis tests and sample size](nbht.md) we will look at how we can use Cohen's H instead of a $p$-value to more easily intepret the outcome of an experiment.

The main takeaways:
- When we standardize features using $z$-scores we can more directly compare coefficients to see the "importance" of features.
- When looking at the $z$-scores of features, higher $z$ scores mean "more atypical", as we are measuring the deviation from the mean of that feature in units of that features standard deviatoin.
- The formula for $z$-scores is $z = (x - \mu)/\sigma$, where $\mu$ is the mean of the feature and $\sigma$ is the standard deviation.
- When comparing two treatments, we can assess the size of the difference in outcome in a normalized way, which is Cohen's D. The formula is $D = (\text{(mean difference)}/\text{pooled std dev})$
- Cohen's D is useful for comparing between experiments, but usually people will want to compare the actual outcomes in "natural units" (e.g. how many pounds this diet is responsible for people losing, how many conversions this email drove, etc).
- Generally speaking, larger effects (i.e. higher $D$) are easier to detect, and will require fewer samples. We will dig into this more in the article on [hypothesis tests and sample size](nbht.md)

### References

- Wikipedia's article on [Effect size](https://en.wikipedia.org/wiki/Effect_size#Cohen's_d)
- Wikipedia's article on [Cohen's h](https://en.wikipedia.org/wiki/Cohen%27s_h)
- This blog's article on [hypothesis tests and sample size](nbht.md)


 
