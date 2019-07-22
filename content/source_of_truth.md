Title: Pet Peeve - Single Source of Truth
Tags: pet peeve, wisdom, quotes
Date: 2019-07-21 13:20
Category: Data Science
Summary: In software engineering, it is important to have a _single source of truth_. In data science, it is a little more complicated.

# Pet Peeve - Single Source of Truth

Take a moment to consider the meaning of the following adage:
> A man with a watch knows what time it is. A man with two watches is never sure.

This adage is known as [Segal's law](https://en.wikipedia.org/wiki/Segal%27s_law). On its surface, it seems to advocate that a single source of truth (i.e. only one method for determining time) allows for certainty, whereas having multiple measurements will lead to uncertainty. A deeper reading is that the man with only one watch is overconfident in the time; adding a new watch adds (rather than removes) information. In this case, the additional information was a measure of how much watches differ. The man with two watches is actually in a better position: he has an estimate of the time _and_ its uncertainty, whereas the first man doesn't know what the uncertainty is.

Having a **single source of truth** is important in a lot of software engineering applications, but isn't necessarily desirable in data science.

## When to have a single source of truth

To design robust software, it is important to have a single source of truth about the state the application is in. If there are multiple sources of truth, it is possible for different parts of the application to not recieve updates, and show inconsistent information. To make this a little more concrete, imagine an online shopping cart. When you put an item into a cart:
- the button displaying "X items in cart" has to know how many things are in the cart.
- the checkout page has to know what is in your cart
- the tax calculation component has to know what is in your cart, and where it is being sent
- the delivery componnet has to know whether anything in your cart has delivery exceptions

If each of these components kept their own record of what was in the cart, it is possible for the different sources to get out of sync when something unusual happens (e.g. the network connection drops, or the page is reloaded). You could end up in a situation where the page claims you have 5 items in your cart, but when you click on the checkout page there are only three things in the list.

The single source of truth approach to this problem is that there is one shopping cart for your user (the source of truth). The button component has to ask the shopping cart "how many items do you have?" and displays that, overriding whatever it had before. It doesn't try and manually track changes. Similarly, all the other pieces of the e-commerce website ask the _same_ shopping cart application for the information they need before displaying their output to the user. We can still have ambiguities (e.g. page refreshes) but at least our entire app will agree whether we added the item twice or not.

That last point is worth emphasizing. As a software engineer, you want to respect the users expectations. If they click a button, something should happen. If they change a dropdown, it should stay changed. However, if information does get lost or scrambled, it is important to remain consistent. If the user tries to change the dropdown to a new choice, but packets get dropped, it is better to reset the dropbox to what the application thinks it should be. Software engineers have a single source of truth to _define_ the state of the system.

## When to NOT have a single source of truth

A data scientist's job is different. She is trying to make a measurement about the world, while the software engineer is trying to make a self-consistent state of the world. A key part of making a measurement is knowing the uncertainty associated with it. The more expensive changes from an analysis are, the more confident we would want to be about the size of the benefit. Knowing that opening a new factory is predicted to bring in another $10M of profit isn't as useful as knowing that the prediction is $10M &pm; $1M (or $10M &pm; $20M!).

Where a single source of truth _does_ make sense for a data science team is when talking about definitions. When asking whether a user churned, what does this mean? Does it mean the user hasn't logged on for 7 days? 14 days? What if they visited the page, but no longer made any purchases? If you break your users churn rate down by age bracket, do you use the age when they joined, or the age when they churned? 

Having these definitions centralized helps people communicate more effectively, as two data scientists talking about user churn can be confident that they are talking about the same thing. It allows consistent tracking of a metric to help assess the impact of different decisions.

It does make sense to go back and address these definitions periodically. In a technical sense, a definition cannot be _wrong_, but it might be of limited use (or even harmful). It might be worth changing the definition of churn so that users that come from a search engine, and don't click on any links within the page, are not counted as a visit as they are not engaging with the community. Perhaps the appropriate thing to do would be to make an "engagement" metric to measure this instead. If people coming in and bouncing didn't used to be a big component of your traffic, but it is growing, changing the definition of churn can be a way of trying to make the metric "measure the same thing".

Controlling the metrics is important, because the metrics shape the discussion that occurs (and even the decisions made). If you think that a definition should never be changed, and instead we should just define a new metric, I'd encourage you to look at [this article](/changing_definitions.html)

### Proxies

Often times we are not able to find the features we actually want, so we use proxies -- features we _can_ find that we believe are highly correlated with the features we want but cannot get. For example, we might not know what the income-level of a client is, but we know thier shipping address. From data about property prices, and census data, we can use their location to estimate the income-level, but it is only approximate. Maybe this person is sharing the house with multiple flatmates. Maybe this person inherited the house. On an individual level, our proxies might be wrong, but (if it is a good proxy) it will be a good estimate in aggregate.

If we have _multiple_ independent proxies for the feature we want, then we are more confident when all our proxies tell us the same thing. Having an "ensemble" of proxies allows many of the same benefits that having an ensemble of models does: special cases may violate some of our proxies, but are unlikely to violate most of them. Taking multiple proxies is the opposite for having a "single source of truth" - instead we have multiple measures to allow us to estimate the unobtainable feature, as well as a degree of uncertainty. 

## Conclusion

Having a single source of truth allows us to operate without uncertainty, which for a software engineer is a good thing. When writing programs as a data scientist, you should also maintain a single "state" of your application and pipeline.

Dealing with the data is different. We want to use "multiple watches" to allow ourselves to estimate the uncertainty in our measurement. Any measurement that isn't just counting has an uncertainty attached to it. Even simple counting tasks, such as counting the number of unique users accessing your site, has some degree of uncertainty associated with it (thanks to ad blocking and private browsing modes). When assessing click though rates on ads, even if we can count what happened with no undertainty, the thing we are really trying to measure is the click-through rate, which is the rate in which our population would click on the ad, and we are inferring that from our _sample_ data. This inference introduces uncertainty as to how well our sample will generalize.

The idea of a single source of truth comes from software engineering, where it is used to ensure that our application is in one consistent state. In data science, in contrast:
* we should have a _single_ definition for our metric or target, 
* we should construct features multiple different ways, to see what effect it has (and what the uncertainty is)
* especially when using proxies, we should ensemble them to reduce "sterotyping" individual points, and make our inferences more robust.

## References

* Article on the [Pros and Cons of Changing definitions](/changing_definitions.html).

