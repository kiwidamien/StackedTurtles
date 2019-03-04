Title: What is a ROC Curve? A visualization with credit scores.
Date: 2019-03-03 16:00
Category: Tools/Javascript
Tags: data, visualization, metrics, roc
JavaScripts: https://d3js.org/d3.v3.min.js, roc_rates.js, roc_tableUpdate.js, roc_plot.js
Stylesheets: roc_tables.css, roc_style.css, roc_layout.css
Summary: ROC (Receiver Operator Characteristic) curves are a great way for measuring the performance of binary classifiers. They show how well a classifier's score (where a higher score means more likely to be in the "positive" class) does at separating the two classes. Unlike accuracy, the ROC curve is not biased by class imbalance, and unlike precision and recall, you can make a thresholding decision later. This article explains an ROC curve using credit scores.

## Classification: Hard vs Soft Predictions

We usually think of a classifier as being a model that takes in a set of features, and predicts a single class for that object. For example, a classifier might process a picture and classify it as a "cat" or a "dog". These predictions are called _hard predictions_, insofar as we only get the predicted class with no indication of the "confidence" that the model has in its prediction. A _soft prediction_ is when we assign each category a score, with a higher score meaning we have more confidence in that answer. One natural score to use is the "probability" that an image belongs to a certain category. For an example of the difference, an image classifier might classify the image on the left as a cat (hard prediction) but only give it a low score (soft prediction) as it isn't entirely sure it isn't a croissant.

<img src="images/roc/catcroissant.png" width="80%" />

If we have a soft prediction, one way of generating a hard prediction is to guess the class with the highest score. If your model is well-trained, and your goal is to maximize accuracy, this is the best approach to take. If, however, the costs of misclassication are drastically different for the different classes, predicting accuracy might not be the right thing to measure. An example of this in a multiclass setting might be a test to determine if food is still good: after putting a sample of milk in I might receive the following predictions:

| Class | Fine | Taste Funny | Nautious | Food poising | Kills me |
|------ |------|-------------|----------|--------------|----------|
| Score / probability | 70% | 15% | 7% | 5% | 3% |

I'd want the "food classifier" to predict "Kills you", not because it is the most likely outcome, but because the chance is high enough that I would want to know (especially since the consequence of it being wrong is that I have to spend a little more on milk than I otherwise would have).

The process of taking a soft prediction and turning it into a hard prediction is known as "thresholding". For non-trivial problems, where the right answer isn't just "take the category with the biggest score", thresholding the soft predictions into hard ones is an important part of the problem. This **doesn't** mean that you can just use the hard `predict` method of your model - all that does is force your software to make the thresholding decision for you! 

### The special case of binary classifiers

Binary classifiers are usually phrased in terms of trying to detect a positive class. For such classifiers, we only need one score, with a higher score meaning we are more confident that our example belongs to the positive class. For example:

* A "cat classifier" gives a score to images, with higher scores corresponding to more confidence the image is a cat,
* An airport "metal detector" uses magnets to assign a score (induced current) to objects that pass through it, with higher score meaning more confidence or amount of metal detected,
* A "movie recommender" uses features of a film and assigns a score to determine if you would like it,
* A "cancer detector" reads in measurements from a patient and returns a score, with a higher score meaning more likely to have cancer.

For the cat classifier, we could imagine that the output is a "probability" the model assigns to the image being a cat. For an airport metal detector, the "score" is usually the amount of current induced in the detector, but the "hard prediction" of making the alarm go off only occurs once that current crosses a threshold. This is a nice example because a metal detector doesn't give the probability that metal is present or not (that is actually very high - even if you remove all jewelry you probably still have metal shoelace eyelets on your shoes), but instead tries to detect if you have _too much_ metal on you. How much is too much? Well, that depends entirely on how the machine's threshold is set up. When setting it, security staff are balancing letting people through with weapons that we hope to detect against having to spend time searching every person with even a tiny amount of metal on them. There isn't really a nice translation from the current score to a "probability" person has metal on them (which as mentioned above, is cloes to 1).

A movie recommender might predict what it thinks your star rating of a movie might be (a score). I can decide that I am only interested in movies that are predicted to be a 7/10 or above for me. It isn't that a 7/10 movie means there is a 70% chance I like it, while an 8/10 has an 80% chance I like it. If the predictions were perfect, it means that I would like both movies, but I would like the 8/10 movie more. If the predicitons are not perfect (i.e. any real classifier) I might or might not like either movie, but chances are that I am more likely to like the (predicted) 8/10 movie than the (predicted) 7/10 movie.

So we have seen some examples of scores that are not probabilities. Our basic criteria for scores are the following:

* The higher the model scores an example, the more confident it is that the example is in the "positive class",
* A good model will tend to give higher scores to objects in the positive class,
* A perfect model will give all examples in the positive class higher scores than any example not in the positive class.

This last bullet point means that for a perfect model, there is a threshold score so that all positive class examples greater than 

## The ROC and Area Under The Curve

## Credit score example

You can try adjusting the threshold to see how it relates to the ROC curve below (or use the [full page version](/d3_roc_vanilla)).

<div class='container'>
  <div id='people'>
  </div>

  <div class='label_area'>
    <div>
      <div class='title'>Threshold: <span class='threshold_label'></span></div>
      <div class='subtitle'>i.e. accept everyone with credit scores above <span class='threshold_label'></span></div>
      <div class='subtitle'>People shown in <b><span style="color: red;">red</span></b> actually defaulted</div>
      <div class='subtitle'>People shown in <b><span style="color: black;">black</span></b> actually repaid</div>
    </div>
  </div>

  <div id='plot_area'>
  </div>

  <div class='table_area'>
    <div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Accepted</th>
            <th>Total</th>
            <th>Positive rate</th>
            <th></th>
          </tr>
          <tr>
            <td class='actual_payment_class'>Pay back</td>
            <td><span id='table_payback_accepted'></span></td>
            <td><span id='table_payback_total'></span></td>
            <td><span id='table_payback_ratio'></span></td>
            <td>(TPR)</td>
          </tr>
          <tr>
            <td class='actual_payment_class'>Default</td>
            <td><span id='table_default_accepted'></span></td>
            <td><span id='table_default_total'></span></td>
            <td><span id='table_default_ratio'></span></td>
            <td>(FPR)</td>
          </tr>
          <tr>
            <td class='actual_payment_class'>Total</td>
            <td><span id='table_total_accepted'></span></td>
            <td><span id='table_total'></span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
     <table>
       <tbody>
         <tr>
           <th>Measurement</th>
           <th>Fraction</th>
           <th>Value</th>
         </tr>
         <tr>
           <td class='actual_payment_class'>True positive rate</td>
           <td><span id='table_tpr_ratio'></span></td>
           <td><span id='table_tpr_float'></span></td>
         </tr>
         <tr>
           <td class='actual_payment_class'>False positive rate</td>
           <td><span id='table_fpr_ratio'></span></td>
           <td><span id='table_fpr_float'></span></td>
         </tr>
         <tr>
           <td class='actual_payment_class'>Precision</td>
           <td><span id='table_precision_ratio'></span></td>
           <td><span id='table_precision_float'></span></td>
         </tr>
         <tr>
           <td class='actual_payment_class'>Recall</td>
           <td><span id='table_recall_ratio'></span></td>
           <td><span id='table_recall_float'></span></td>
         </tr>
       </tbody>
     </table>
     </div>

     <div class='model_choice'>
       <h5>Model choice</h5>
       <div>
         <input type="radio" name="model" onChange="changeModelNumber(0)">&nbsp;&nbsp;Perfect Model
       </div>
       <div>
         <input type="radio" name="model" onChange="changeModelNumber(1)" checked="true">&nbsp;&nbsp;Model 1
       </div>
       <div>
         <input type="radio" name="model" onChange="changeModelNumber(2)">&nbsp;&nbsp;Model 2
       </div>
    </div>
  </div>
</div>

## Summary

## Acknowledgements 

I'd like to thank [Brendan Rossin](https://github.com/brendenrossin) for pointing out an error I made while going through this example in a review session, which gave me the motivation to write this up properly.

## Related articles

* Article on how probabilities from `predict_proba` are not probabilities (to come)
* Article on the proliferation of bad names in classification (to come)

