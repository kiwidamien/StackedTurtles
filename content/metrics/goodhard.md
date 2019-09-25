Title: Goodhard's Law
Tags: feedback, metrics, cross-validation, causal
Date: 2019-09-25 14:00
Category: Data Science
Summary: Goodhart's law claims _"When a measure becomes a target, it ceases to be a good measure"_. This article explores how bad metrics can create perverse incentives, and how cross-validation fails to catch our errors.

It is rarely useful to just have an accurate predictive model, usually we want to use a predictive model to not only know what will happen, but to have an idea of how we can change the outcome to something more desirable. 

A rare counter-example is a weather forecast: in this case there probably isn’t anything we can do to affect the weather tomorrow or the day after in a meaningful way. An accurate weather forecast will help us plan what we organize the things we want to do.

Contrast this with a climate forecast. If the climate forecast was like the weather forecast (i.e. this is what will happen, regardless of the things you try and do) then we would have temperature rise predictions, and our job would be how to absorb the impact of the change. We claim there are important driving inputs that we can change, and we model how our choices can mitigate the climate change effects.

Business models are (typically) more like the climate change model, where we want to know "if I want to make X as good as possible, so what actions should I take?" A supermarket trying to serve customers would _like_ a model that would tell it how many customers would be in a store in any given hour to help it staff its registers efficiently, but would _love_ a model that would tell it how to price things to create a consistent stream of customers (with an aim of profit maximization).


![When a measure becomes a target, it ceases to be a good measure](images/cartoon_sales_quota.jpg)
_When a measure becomes a target, it ceases to be a good measure_


The cartoon example at the top shows an example where a company notices that revenue increases with increasing sales. It issues its salespeople a sales quota -- if you don’t consistently meet quota, you are out of a job. Let’s look at the incentives for the salespeople:

* Prior to change:

    A salesperson tries to maximize commission. She is able to offer a discount, but that will reduce commission earned. If the customer doesn’t buy, she earns nothing. Her goal is to get as many customers to buy as possible, at as high a price as possible. It is understandable why # sales and amount of revenue are highly correlated.

* Introduction of sales quotas:
    If a salesperson cannot reach quota, he will be out of a job. While he would like to charge clients as much as possible to get a large commission, hitting # sales is now more important. If he has to lower prices to drive sales, then he will do it. If all salespeople are doing this, the linear relationship between # sales and amount of revenue won’t match what they were before the sales quota was imposed.

This could be summarized by an economist as "incentives matter".

## What does this have to do with ML?
How does ML play into this? We already know about the dangers of overfitting: if we have a flexible enough model, or enough variables, we can find “spurious correlations” -- ones that would vanish if we took a large set of new data. Cross-validation is a technique for simulating new data, and it allows us to see if a correlation that appeared in the data was spurious or not (at least to high probability).

So once we find a correlation using cross-validation, we are reasonably sure it isn’t spurious. If we took more data, using the same collection technique from a similar population in similar conditions, then we expect the correlations to survive. The "similar population" and "similar environment" are key: we don’t expect the sales for turkey in the US to be similar in November and March, as there is a huge environmental change (e.g. the presence of Thanksgiving).

If we have a machine learning model, and it tells us to act a certain way, we have to think carefully about whether our actions are significantly changing the environment in which we are making predictions. If they are, we may end up breaking the correlation we started with. Machine Learning models only learn how to make predictions about "typical data" in its training distribution; if the output of the model leads to actions that significantly change the distribution of future data, we may not be able to trust the model.

This isn’t to say all hope is lost. Sometimes a different set of features will be enough to mitigate these "feedback loops". This is why I think that **automated data science** (i.e. pour all the feaures in, and let a program automatically  feature select) will not replace data scientists anytime soon. Even if these models work, and make great predictions on past data, even when backtested and/or cross-validated, this isn’t that useful unless you have the rare problem where you are not trying to affect the outcome (e.g. like the weather forecast, where predicting the outcome and working around it is the goal). 

Most of the time we want "more of the good stuff" and "less of the bad stuff", and will try and take actions that our model suggests will make our results better. This is the ML version of Goodhart’s law -- we might not be able to trust the model any longer.

### Example 1: Traffic routing

Let’s look at a typical ML model from a Metis student, which tries to use historical NYC taxi data to predict trip times from point A to point B. You could make a fancy model, incorporate holidays, weather, population trends, special events, ... into the model. Let’s say this model works great, and has an RMSE of &pm; 2 minutes (on the test set).

This student deploys the app to 10 cars as a pilot program and it works amazingly well. The RMSE over a month is still &pm; 2 minutes, which is about the best we can hope for.

Bouyed by success, she deploys this app and it gets used by 20% of drivers in NYC ... for a week. Results are terrible! The predictions are way off, and it keeps suggesting people turn down odd streets that are also extremely busy.

What happened? Well, the streets that tend to be busy were slow, so the app would make predictions to use the less busy streets. When a few users used the app, it worked great. When a lot of people used the app, suddenly a LOT of people were trying to use the (historically) fast streets -- which were fast because there was no one on them! The prediction _use street X because it isn’t busy_ to a lot of different people **caused** street X to be busy. This app has the property that the more people that use it, the worse the predictions become!

The way Waze (and other apps) actually use the current location and speed of the cars as inputs. While they use historical data to suggest routes, it gets "pings" from other cars using the app to find out how fast different sections of road are. This real time information can be used to redirect cars to less busy streets. With the addition of these new features, the app now improves as more people use it.

### Wait … this isn’t Goodhart’s law

You might correctly point out this isn’t actually an example of Goodhart’s law. We tried to build a model of how long it would take for cars to get from point A to point B using data in a world where MetisCarApp didn’t exist, but that this didn’t generalize well to a world where MetisCarApp did exist, because the App changed the environment. The thing we tried to measure (time from A to B) didn’t change.

This objection is correct, it does show how the results of an ML model can end up changing the environment and destroying the correlations that it was built on (in this case, the correlations were “certain streets are quiet at certain times” and then predict to use those streets). Instead, this might technically fall under "self-defeating predictions".

Even though it isn’t a problem with the metric, and therefore not an example of Goodhart’s Law, it is a good example of how models can alter their environments.

Stock prediction is another example of a self-defeating metric: if we had a good long-term stock predictor that was in common use (i.e. it worked if no one acted on its results), it wouldn’t work if many people tried to use its predictions to their advantage.

### Example 2: Band revenue

Let’s look at a case where a band manager is trying to maximize revenue. Ultimately the manager cares about total revenue, but when the band releases new songs, it takes a while to go on tour and collect all the ticket sales. The label’s data scientist suggests that because album revenue have been about 15% of the band’s revenue for the last 5 years (a number that seems to be typical across the different artists in the label) that the manager uses album revenue as a target instead, because it is accessible so much faster.

The manager and the band work with the data scientist to optimize for album revenue. They find that raising the price increases the revenue gained from the albums, although to fewer people. 

Once the ticket receipts come in, the numbers bought in are significantly lower (i.e. the albums are making much more than 15% of the revenue now). They are making less money overall than before. The problem is they now have a lack of exposure to people that might want to go to the concerts, because they optimized for a metric (album sales) that was a responsive proxy for a slow to move metric (total annual revenue), but exploited a relationship that existed in the absence of their intervention.

A better approach would be to monitor multiple metrics, such as number of sales and album revenue, and force the model to look at how revenue compared to both sales and number.

### Example  3: Home ownership

The classic example in economics is using percentage of a population that owns a home as a measure of economic health. Looking at previous observations, we can see that home ownership is higher in periods where GDP is high, unemployment is low, and other positive indicators of a strong economy. It also makes sense that people are able to make large investments when the 

Instead of using home ownership % as a measure of economic health, let’s task HUD with finding ways of getting more people into homes (a target). 

If we allow more flexible loans, better terms, et cetera to allow a broader range of people to qualify for loans, then we can move the needle and make the % of home ownership increase. However, since after making the change to optimize for home ownership, we have broadened the range of people that qualify for homes, so the relationship between home ownership and general economic health will decay.

Now, it might be worth getting people into their own homes for other reasons than trying to improve overall economic health. The only claim being made here is the correlation observed between the % of people owning a home under the original constraints buying a home put on you (min income, deposit, etc) to GDP is going to be different from the correlation between % of people owning a home to GDP if you make it easier to qualify.

## Summary

It isn’t quite as subtle as mistaking a random correlation for causation, like the [Nicolas Cage vs swimming pool deaths](http://tylervigen.com/view_correlation?id=359), that can be limited by cross-validation. 

It isn’t quite the same as the "two things are created by the same thing" problem, such as number of drownings and ice-cream sales being correlated. (The typical explanation is that they are both positively correlated with temperature, based on things people do when it’s hot)

This is more about correlations that are plausible connected (maybe even in a causal way), such as quiet streets being quicker to travel along, but that optimizing for a proxy (such as album revenue or home ownership) can ruin the relationship between the proxy and the thing you were trying to measure’
e.g. 
Album sales were a good measure of how the band was doing overall, until we tried to optimize for it directly.

At least in the first example, keeping track of the RMSE in minutes of trip times would at least tell you something is breaking.

As an analyst, you should be thinking about whether the relationship between the metric you have and what you really want to know is reasonable, and pick multiple metrics to help you sanity check (e.g. look at both album sales and number sold, and think about how you would trade one against the other).
