Title: The Bad Names In Classification Problems
Date: 2019-06-01 12:00
Tags: Metrics
Category: Data Science 
Summary: There are a proliferation of different metrics in classification problems: accuracy, precision, recall, and more! Many of these metrics are defined in terms of True Positives, True Negatives, False Positives, and False Negatives. Here we give alternatives for these poorly named classes.


Many binary classifiers can be _naturally_ phrased in terms of us trying to detect something, and we have two classes: the _positive_ class where the thing we are trying to detect is present, and a _negative_ class where it is absent. Some examples are

* __Metal detector__: Predicts if metal is present (positive class) or not (negative class)
* __Disease detector__: Predicts if a disease is present (positive class) or not (negative class)
* __Red light cameras__: Detects if a car moved through a red light (positive class) or not (negative class)
* __Fire alarms__: Detects if there is a fire (positive class) or not (negative class)

Notice that the positive case carries the connotation of requiring an action: a metal detector going off may mean digging in the sand or searching a passenger, a disease being detected would be escalated to a medical professional, the red light camera detecting someone running the light would send out a ticket, and a fire alarm going off should get people to evacuate. The negative class generally requires no action.

Binary classifiers by definition always differentiate between two classes, but there are cases where it doesn't make sense to distinguish one of the classes as positive. For example, if we had a collection of Chinese texts and were trying to classify them into Modern and Classical Chinese, neither class is really distingished as the one we are looking for (i.e. there isn't a _natural_ positive class). If we were building a image classifier that could distinguish between cats and dogs, there also isn't really a "positive" class.

Metrics like _precision_, _recall_, and _F<sub>1</sub>_ scores don't treat the positive and negative class symmetrically. While you could force one of the two classes to be positive (e.g. "Modern Chinese" or "images of cats"), this isn't recommended, as you will be mislead by your intuition of these metrics. For this article, we are going to assume that we are dealing with a binary classifier where we are trying to detect something (so the positive class is the presence, and the negative class is the absense). To help with the interpretation, we will talk about our classifier as an alarm going off. Note the alarm goes off based on what our classifier determines the class is, not what the actual class is (e.g. a fire alarm goes off when it "thinks" there is a fire, even though there may not be). 

### Problematic names

The different classes are described by the names True Positive (TP), False Positive (FP), True Negative (TN), and False Negative (FN). These names are problematic, as they invite confusion about their definition. The easiest one to remember is True Positive: this is the number of Positive cases our machine learning model identified as Positive. There really isn't any other way to interpret this. Consider the term False Positive, and the following explanations:

* A FP is a case that is _actually_ _positive_, but we made the (_false_) identification of negative (wrong)
* A FP is a case that is _actually_ negative, but we made the (_false_) identification of _positive_ (correct)

The problem is that we have to remember that the "positive"/"negative" refer to the _prediction_ rather than the actual nature of the class. The "true"/"false" refer to whether or not the prediction was correct. When we start building other concepts such as precision and recall on top of these already confusing names, it is no wonder that we can have trouble keeping them straight.

### A Problem of Ego

Sometimes ego can get in the way, claiming that it isn't that hard to keep these terms straight. After some experience, thinking for a few seconds is generally enough to remind ourselves of what the term means. At worst, knowing these (confusing) terms can be a way of marking whether or not someone "belongs" to the group of people that can talk about data in a meaningful way. After all, the reasoning goes, if you cannot keep these terms straight, how much could you have to say about data science or analysis?

Choosing names that doesn't require us to break our chain of thought to recall the definition (even for a few seconds) makes arguments much easier to think about, even for seasoned practitioners. Poor names also erect artifical barriers for people learning data science.

### Better names

Here are some alternative names for the four classes:

| Original Name | New Name | Description |
| --- | --- | --- |
| True Positive (TP) | Hits (HT) | The number of positive cases correctly identified |
| False Positive (FP) | False Alarms (FA) | The number of times we alerted the user, when the thing we were trying to detect wasn't present |
| True Negative (TN) | Correctly Dismissed (CD) | The number of negative cases correctly identified |
| False Negative (FN) | Overlooked (OL) | The number of times we missed a case (and didn't alert the user) |  

Let's translate precision and recall into these new names.

#### Precision

Precision asks "how confident am I that times my alarm went off, it was actually a positive case?". A precision of 80% would mean that 80% of the time that the alarm went off, we have a positive case (that presumably requires action on our part). Phrased in terms of a conditional probability:

$$\text{Precision} = \text{P}(\text{Was a positive case | Alarm went off})$$

In our traditional language:

$$\text{Precision} = \frac{\text{(positives detected)}}{\text{(number of positive identifications)}} = \frac{\text{TP}}{\text{TP} + \text{FP}}$$

In the new terminology

$$\text{Precision} = \frac{\text{Hits}}{\text{Hits} + \text{(False Alarms)}}$$

#### Recall

Recall asks "what fraction of the positive cases did I detect?". A recall of 70% would mean that 70% of the positive cases would trigger the detector. The remaining 30% would go undetected. Phrased in terms of a conditional probability:

$$\text{Recall} = \text{P}(\text{Set off alarm | Was a positive case})$$

In our traditional language:

$$\text{Recall} = \frac{\text{(positives detected)}}{\text{(total number of positive cases)}} = \frac{\text{TP}}{\text{TP} + \text{FN}}$$

In the new terminology

$$\text{Recall} = \frac{\text{Hits}}{\text{Hits} + \text{Overlooked}}$$

## Summary

As Netscape Designer Phil Karlton stated:
> There are two hard problems in Computer Science: cache invalidation and naming things.

This article clamed that the traditional names for binary classification (TP/FP/TN/FN) are problematic, as they require some thought to determine what the "positive" and "negative" refer to: the state of the clasifier (whether the "alarm" goes off or not) or the state of the observation (whether the case in question was _actually_ positive or negative). Alternative (but non-standard) names were put forward to try and simplify how we reason about these terms.

## Related Articles

* [Interview Practice with Precision and Recall](/interview-practice-with-precision-and-recall.html)
* [These aren't the metrics you're looking for]() (to come)

## References

* Chad Scherrer's artice on Precision and Recall as conditional probabilities [_Confusion confusion_](https://cscherrer.github.io/post/confusion-confusion/)
* Don Norman's [_The Design of Everyday Things_](https://www.amazon.com/Design-Everyday-Things-Revised-Expanded-ebook/dp/B00E257T6C/ref=sr_1_1?keywords=dan+norman&qid=1559371585&s=books&sr=1-1), which discusses how people will tolerate poor design and poor naming.
