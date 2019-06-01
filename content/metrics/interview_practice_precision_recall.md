Title: Interview Practice with Precision and Recall 
Date: 2019-06-01 14:00
Tags: Metrics
Category: Data Science 
Summary: How to prepare for those annoying questions about precision and recall in interviews.

When interviewing for data science positions, you are likely to be asked what sort of metric you would use in a classification problem. If a product manager is asking you this question, then the answer is almost certainly more nuenced than "precision" or "recall". The problem (as discussed [here]()) is that "precision" and "recall" are more academic in that they prioritize the performance of the _model_, rather than the actual business problem which may require a more nuanced metric.

If you are being interviewed by a data scientist or a machine learning engineer, however,  they may want you to use the terms "precision" and "recall". Part of this is because they are easy metrics to use in cross-validation (both recall and precision are built-in), part of it is because they are used frequently in articles and blogs. A small part is probably "if I had to learn this, you should know it too"! 

Here we will assume that you are being asked a question by a data scientist or ML engineer, and give some tips on how to structure your response. Before starting, here are the definitions of precision and recall as a quick reminder:

<table>
<tr>
  <th>Term</th>
  <th>Description</th>
  <th>Probability notation</th>
</tr>
<tr>
  <td>Precision</td>
  <td>Fraction of actually positive cases among those predicted to be positive</td>
  <td> P(actually positive | predicted positive)</td>
</tr>
<tr>
  <td>Recall</td>
  <td>Fraction of actually positive cases found from all positive cases</td>
  <td> P(predicted positive | actually positive)</td>
</tr>
<tr>
  <td>True positive rate (TPR)</td>
  <td>Same as recall; fraction of positive cases found</td>
  <td>P(predicted positive | actually positive)</td>
</tr>
<tr>
  <td>False positive rate (FPR)</td>
  <td>Fraction of actually negative cases identified as positive </td>
  <td>P(predicted positive | actually negative)</td>
</tr>
</table>

A previous article, [_Bad Names In Classification Problems_](/the-bad-names-in-classification-problems.html), also defines precision and recall (and gives some alternatives to the names TP/FP/TN/FN). The TPR and FPR are the vertical and horizontal axes on the [ROC](/what-is-a-roc-curve-a-visualization-with-credit-scores.html) curve, respectively.

## Sample interview question

An interview question might be 
> We are trying to build a classifier to identify whether a particular insurance claim is fraudulent. What do recall and precision mean in this context, and which is a better metric for our problem? Why?

**Don't** answer this question by repeating the definition of precision and recall back to the interviewer. Telling her that "precision is the fraction of actually positive cases from those our classifier labeled as positive" is going to ding you on communication. Instead, identify what the positive case is in this example, and explain what the terms would mean _in this context_. 

Since we are also asked which we should prioritize, we should also explain what the consequences of having a low precision or recall score are _in this context_. We focus on the low case as it is always good to have precision and recall as high as possible; by talking about what the problems with a low precision or recall are allow us to discuss the tradeoffs in terms relevant to the business.

Using this example, we are trying to detect fradulent claims. This makes the "positive case" (the thing we are trying to detect) the fraudulent claims. Giving our definitions in terms of fraud vs not-fraud (instead of positive and negative) gives us the following:

* __Precision__ is the fraction of cases that are fraudulent out of those that our classifier labelled as positive. The problem with a low precision is that our investigators will spend a lot of time investigating claims that are actually legitimate.
* __Recall__ is the fraction of fraudulent cases our classifier finds. The problem with a low recall is that we would be paying out on a lot of undetected fraudulent claims.

This would give you a basis for discussing how to trade recall vs precision. In this example, paying a claim you didn't have to is more expensive than paying someone to investigate the claim, so recall would be more important. The easiest way to maximize recall is to flag _every_ claim, which clearly makes the classifier useless, so even though recall is more important, phrasing it this way can help determine how you would evaluate a trade-off between precision and recall.

## Sample problems

To help get some experience with this, try answering the following questions by rephrasing the meaning of precision and recall in the context of each problem. When doing this, also practice evaluating what the downside of having too low a precision or recall is for that problem. Answers are available (but start collapsed).

### Problem 1: Disease detector

1. What is the positive class?
2. What would a recall of 80% mean?
3. What would a precision of 75% mean?
4. If the recall is 80% and the precision is 75%, what is the FPR?
5. If the recall is 80% and the precision is 75%, what is the FNR?

#### Answers

1. The positive class is the presence of the disease.
2. A recall of 80% would mean that 80% of the positive cases were found by the detector (if you submitted the entire population). Alternatively, a recall of 80% means that there is an 80% chance of someone with the disease setting off the detector.
3. A precision of 75% means 75% of the times the detector went off, they were actually positive cases.

### Problem 2: Breathalyzer Tests

1. What is the positive class?
2. What would a recall of 70% mean?
3. What would a precision of 90% mean?

#### Answers

1. Todo
2. Todo
3. Todo

### Problem 3: 

1. What is the positive class?
2. What would a recall of 75% mean?
3. What would a precision of 85% mean?

#### Answers

1. Todo
2. Todo
3. Todo

### Problem 4: 

1. What is the positive class?
2. What would a recall of 80% mean?
3. What would a precision of 70% mean? 

#### Answers

1. Todo
2. Todo
3. Todo

## Summary

When doing interview practice (and in actual interviews) you should translate from the more abstract "positive c;ass" and "negative class" to describe the meaning of precision and recall in the context of the problem you are trying to solve. The difference between precision and recall often trips up people when learning data science; they are nearly incomprehensible when talking to most executives.

You should also have an argument for whether you should be optimizing for precision or recall. In a realistic problem, you shouldn't be optimizing for one or the other -- rather you should look at the _tradeoff_ between precision and recall, and pick the best tradeoff for the problem at hand.

The purpose of this article was to provide practice for typical interview questions for data science and machine learning engineer positions. The article [_These are't the metrics you're looking for_]() looks at the problems that precision and recall have. These problems will be more important when you are actually on the job, or when interviewing for analyst positions.

## Related Articles

* [These aren't the metrics you're looking for]()
* [Bad names in Classification Problems](/the-bad-names-in-classification-problems.html)
* [What is a ROC curve?](/what-is-a-roc-curve-a-visualization-with-credit-scores.html)
