Title: Pros and Cons of Changing Definitions
Slug: changing_definitions
Tags: metrics, definitions
Date: 2019-07-21 15:20
Category: Data Science
Summary: A definition cannot be _wrong_, but it can fail to be useful. Can you repurpose a definition, or should you start from scratch?

# True by definition

A definition creates a term that allows us to express a complicated idea, or make a fuzzy idea (hopefully) unambiguious. Making a definition also reduces our freedom to change the analysis to make things look more favorable, so that we can compare "like with like". For example, lets consider the fictious example of a rainy-day equipment review site `Umbrella.com`, and its attempt to measure how many users it loses a month, called user _churn_. 

To actually measure this, we need a more explicit definition of churn. What does it mean to lose a user? An online magazine company or newspaper that runs a subscription service has a reasonably clear definition to this question: a "lost user" is a cancelled subscription. The ad-supported `Umbrella.com` is trickier, as users just stop visiting the site without informing us of their intention to never return. How long after a user's most recent visit do we have to wait before claiming the user is no longer active?

After a lot of back and forth, the product team at `Umbrella.com` arrive at the following defintion:
> A churned user is a registered user that hasn't visited the site over the last 14 days.

The definition is important, because it helps shape conversations around the company. As a _definition_, using any number of days (e.g. 1 day, 14 days, or 144 days) makes sense. As a metric, you want it to be long enough that your long term users are not churning under the definition, but short enough that you can actually take action and see it reflected in the metric. A lot of time and thought should be put into your definition, especially if your definition is going to go into a metric as it is going to direct decisions.

## ... and now some wrinkles

After being in business a while, `Umbrella.com` notices a couple of things:
- We are seeing registered users whose only interaction with the site is when they get directed here from Google. Once they arrive, the don't click any ads or links on a page. Overall, we feel this shouldn't count as a visit.
- We are seeing in summer that there is less interest in umbrella reviews (outside of the coastal site). We are seeing that churn rates are high because our registered users are only browsing the site once a month, but are still coming back. Because it is more than two weeks between visits, they keep getting counted as churned.

Our product team would like to change the definition of churn to
> A churned user is a registered user that hasn't clicked a link on any page in the last 28 days

as they feel it would more accurately reflect what it means for a user be engaging with the site. Can we change the definition? Should we? What should we pay attention to when making a decision?

### The hardline approach: Never change a definition, use a new term

You'll most likely encounter this from former mathematicians. The argument goes that we have used the term "churn" to mean something, if we want to talk about something else that is inconsistent, we should use a new term. This minimizes the need to specify whether we are using "new churn" or "old churn", and allows us to track the metric -- with a consistent definition -- over the course of the business. When we change the definition, we will see a sudden shift in our churn metric that has nothing to do with the actual business changing, and only reflects the difference in what we mean by churn. (If you still have your original data, you can recalculate churn under the new definition, which mitigates this to an extent).

There is some merit to these points: changing a definition generally leads to some (hopefully temporary) confusion over which definition is being used as analysis get updated. If a new term was used instead, such as _engaged seasonally adjusted user_ (ESAU) then  we could update our analyses and use `churn` when we meant the old term, and use `ESAU` when we wanted the new term. It would be clear looking at a report which one was meant.

### The soft approach: We dictate the meanings of words, not the other way around

The opposite extreme is to consider that we started with a general concept of user churn as the number of users we were losing. We made an initial definition that tried to capture that, and defined it as _churn_. The definition we gave isn't as useful as we wanted in capturing the underlying idea, so we should be free to redefine it.

People generally don't work straight from definitions; instead the words we use guide the mental models that we use. It is true that we can make a new term to capture our new definition, but "churn" gets used so often in other companies that if we have an old term lying around called churn people will still use it, even if it isn't that useful.

Finally, there is a political dimension. If everyone has already agreed that churn as a metric already, but we now know some ways that it is flawed, it is generally easier to argue that we change the defintion than try to convert everyone over to a new metric. Functionally the end result is the same (every uses the new definition of churn or everyone uses the new definition of "ESAU"), but the question is whether we can get everyone to convert.

## Being pragmatic

Both approaches have their merits, and I have presented the extreme versions. What are some good guiding principles for whether or not you should create a new term, or redefine an existing term?

* __Is there a legal definition?__
  Some terms, such as "revenue" or "profit", may have technical legally binding terms. There are actually many different types of revenue and profit, but you should generally align on the definition used by the accounting department. Even if the data science team doesn't have regulatory reporting, you should use one of the legal definitions.
* __Is the term an industry standard term?__
  If you have a very ideosyncratic term in your buisness that isn't likely to be copied, then it is easier to change. For example, if `Umbrella.com` decided that it wanted to move plastic raincoats and "coats that were waterproof" into separate categories instead of having a single "coats" division, that would make sense. At the opposite extreme, most companies know what it means to be a "registered user", so you probably shouldn't have a custom definition of that.
* __How close is the term to your key metrics?__
  Terms that are close to key metrics should only be changed carefully, those that are used in day-to-day operations but far from the key metrics or KPIs are easier to rearrange. Considering whether to split coats would change the way marketing budgets were viewed, maybe some of the operational parts of the business, but wouldn't change key metrics like revenue, number of items purchased, number of users, ad revenue received.
* __How emotionally loaded is your term?__
  If you call your metric "active users", that is going to lead you (and others) to think about your term a particular way. Over time, people learn the nuances and how a metric differs from the impression that its name gives, but a bad name can still trick people familiar with it to use lazy mental models. This is why programmers put so much effort into picking good variable names. If your definition isn't that emotionally loaded (such as _engaged seasonally adjusted users_) there is a good case to be made for "the definition is whatever it is". If it _is_ emotionally loaded (such as _churn_) then people will think of it in a certain way, even if it is defined differently.
* __Has there been a change in the business?__
  If you have an emotionally loaded term, and the business has changed significantly, there is an argument to be made for adjusting the definition of the metric to keep it aligned with its original meaning. For example, if we had "enagage page views" originally mean "product page views" (in order to exclude things like users going to their own profile pages), we might decide to redefine "engaged page views" to include our recently lanuched blog or editorials feature, in keeping with the original intent of excluding "administrative" page views such as profile views.

How would I evaluate the idea of redefining `churn` as suggested above?

| Argument | How Churn fares |
| --- | --- |
| **Legal definition?** | There isn't a legal definition of churn |
| **Industry standard?** | The idea of churn meaning users are no longer engaged is a standard term, but the length of time before we consider someone no longer engaged is not. |
| **Close to key metrics?**| Our definition of churn is going to be used in growth of user base, and retention. We should be careful to maek sure the definition accuately captures that. |
| **Emotionally loaded?** | Yes. This is related to the previous two points: that churn relates to user turnover is an industry standard, and people will naturally use it for calculating retention. |
| **Change in business?** | Internally we didn't change the business. We are aware of seasonality that we were not aware of when we set up the definition. |

My personal changes would be to redefine churn in the following way:
> A churned user is a registered user that hasn't visited the site over the last 28 days.

I would introduce a new term, such as "engaged user", for registered users that had followed at least one link on a page. This is an acknowledgement that the original definition didn't serve a useful purpose with only 14 days, but moving to "following a link" moves me to far from what the usual industry "idea" of churn is.

## Conclusions

Making definitions is a lot like naming variables in code: it is hard to do right, and you will generally fail to capture some nuance with the name. One big difference is that codebases are self-contained, so "refactoring" to a new variable, renaming, or defining can generally be done with a code review. For company wide definitions and metrics, you have to change everyone's mindset, and it can be hard to judge a metric before and after a change.

However, the definitions should aim to not mislead people and leave as small a cognitive gap as possible. Once definitions are agreed upon, you should try not to change them, but don't be dogmatic about it. The more important principles are ensuring that the definitions are compliant with legal definitions, and represent the intuition people may have about them. 

For definitions closer to your key metrics, more care should be taken (this can be an argument for changing it, such as our churn case, or keeping it the same and introducing a new term). Ideally your definitions should be stable and easy to reason about.


### Nitpick about mathematicians

You might object to the idea that mathematicians try not to change definitions, as they do it all the time! I would claim mathematicians tend to _refine_ definitions. An example of how this happens is to consider the original definition of prime we learn in elementary school:
> A natural number greater than 1 is prime if and only if its only divisors are 1 and itself.

If you take an abstract algebra class, you will learn
> A non-zero, non-ideal element $p$ of a commutative ring $R$ is prime if and only if $p|ab$ implies $p|a$ or $p|b$ for all $a$, $b$ in $R$.

Don't worry if this definition doesn't make sense, but it is clear the second definition is not the same as the first definition. It is a _refinement_, in the sense that if you apply the second definition to the special case of the integers, you recover the first definition. So as long as we were interested in positive integers greater than one, people using the first and second definition would agree.
