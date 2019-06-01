Title: Interview Practice with Precision and Recall 
Date: 2019-06-01 14:00
Tags: Metrics
Category: Data Science 
Summary: How to prepare for those annoying questions about precision and recall in interviews.


### Problem 1: Disease detector

1. What is the positive class?
2. What would a recall of 80% mean?
3. What would a precision of 75% mean?

#### Answers

1. The positive class is the presence of the disease.
2. A recall of 80% would mean that 80% of the positive cases were found by the detector (if you submitted the entire population). Alternatively, a recall of 80% means that there is an 80% chance of someone with the disease setting off the detector.
3. A precision of 75% means 75% of the times the detector went off, they were actually positive cases.

### Problem 2: Breathalyzer Tests

1. What is the positive class?
2. What would a recall of 70% mean?
3. What would a precision of 90% mean?

#### Answers

1. 
2.
3.

### Problem 3: 

1. What is the positive class?
2. What would a recall of 75% mean?
3. What would a precision of 85% mean?

#### Answers

1.
2.
3.

### Problem 4: 

1. What is the positive class?
2. What would a recall of 80% mean?
3. What would a precision of 70% mean? 

#### Answers

1.
2.
3.

## Summary

When doing interview practice (and in actual interviews) you should translate from the more abstract "positive c;ass" and "negative class" to describe the meaning of precision and recall in the context of the problem you are trying to solve. The difference between precision and recall often trips up people when learning data science; they are nearly incomprehensible when talking to most executives.

You should also have an argument for whether you should be optimizing for precision or recall. In a realistic problem, you shouldn't be optimizing for one or the other -- rather you should look at the _tradeoff_ between precision and recall, and pick the best tradeoff for the problem at hand.

The purpose of this article was to provide practice for typical interview questions for data science and machine learning engineer positions. The article [_These are't the metrics you're looking for_]() looks at the problems that precision and recall have. These problems will be more important when you are actually on the job, or when interviewing for analyst positions.

## Related Articles

* [These aren't the metrics you're looking for]()
* [Bad names in Classification Problems](/the-bad-names-in-classification-problems.html)

