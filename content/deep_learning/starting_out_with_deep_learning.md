Title: Getting started with Deep Learning
Tags: deep learning, neural network
Date: 2021-09-23 22:00
Category: Data Science
Summary: Deep learning models ar  often slow to train, and require trying multiple different architecture. This article documents a some advice found about starting a deep learning project.

# Overview

Neural networks are incredibly flexible models for fitting data and making predictons. Slightly more technically, the [universal approximation theorem](https://en.wikipedia.org/wiki/Universal_approximation_theorem) tells us that a neural network with sufficent parameters can do an arbitrarily good job of approximating any function.

Despite their power, neural networks come with significant disadvantages. Most significantly, they only encode the correlatons, not the causes. That is, our model will continue to work well, as long as the relationships between the features work well. In mostcases, we build a model so that we can then optimize for theresult that we want. This sort of intervention will ruin the correlations the neural net assumes, and we won't be sure it generalizes well. For mre on this point, see the article [Why we need more than predictive mdels]().

Sometimes neural networks, or other black-box models, are an appropriate tool for the job. We care about the predictions, and we thik we have enough data in a wide enough variety of inputs, that we trust the results to generalize. Computer vision tasks often fall into this role. Once we have decided that a neural network is the appropriate approach, we have practical problems toconsider:

1. There are a wide variety of architectures to choose from,
.We can accidently "wire up" our moel incorrectly, so certain layers never get up updated,
3. Training neural networks on our data can be slow. 

Matt Niessner put together a [Twitter thread](https://twitter.com/MattNiessner/status/1441027263554744326) on best practices when starting a new neural network project. The work here is not mine, I have reproduced it here to make it easy to find.

## The basics

We are going to start off with horrible data science practices, in particular, we are going to aim to massively overfit by using relativelysmall amounts of data.
Our goal at this stage is to set up our network, metrics, and monitoring, so that we are confident that the model is actually reading data and updating.

### Start simple

Use a small architecture (e.g. fewer than 1 million parameters). For computer vision, Matt makes the recommendation of the first few blocks of E-Net or ResNet-18.
You don't want to train for multiple weeks only to discover the data loader is broken!

Also disable any fancy feautures, like dropout/batch normalization/learning rate decay. These things are useful for controlling overfitting, and increasing the training accuracy, but as you will see in the next few steps, we are going to try to overfit (initially). Having a plain model that is prone to overfitting makes it easy to check that the training examples reach zero loss, so we can check the model is converging.

### Use a single example first

Train on a single example first. You will expect your network to just memorize this result and ignore the input. If you turn off weight decay and all normalization, you should get zero training loss very rapidly.

This enables you to check that your weights are being updated, and that you get training loss as an output of your model. If you try looking at validation loss, you should have it be high as well. This step checks the output of your model, and that everything is updating as expected.

### Set up training / validation curves

Using TensorBoard, or another tool, look at your curves with the loss evaluated on every batch, not just once an epoch. To start with, you are only looking at a single example, so there is no difference between batch and epoch, but you will want to log the losses per epoch as you throw more data at the problem.

### Overfit to 5-10 examples

Now that you have your pipeline set up, and you loss monitoring, go ahead an overfit to 5-10 examples in your data. You should still see your training loss go to zero. You will probably see your validation loss stay roughly constant, as your model is still mmemorizing instead oflearning propperties of the features.

### Now start throwing data at the problem

You are now looking to see your model start to generalize. Hopefully the validation error will start going down, as you move beyond just memorizing the specific examples.

### Performance

Try to understand where your bottlenecks are. Is the issue loading the data? Transforming the data? Back-propagation? Ideally you will want each batch processed in under a second, to give you time to experiment with different architectures.

### Now monitor the real metrics

So far we have just been monitoring the loss, to check that everything is wired correctly. Now set up the remaining "real" metrics, like accuracy, recall, F1 score, etc. 
You will want to be able to visualize these during training, to quickly evaluate whether a particular model or set of hyperparameters are working well.

## Getting to your final model

Now that we have a pipeline, it is time to increase the number of parameters and try different architectures.

### Run many experiments in parallel

Try many different hyperparameters and architectures. After a few minutes of training / a few iterations, look at the metrics you are logging on the validation sets. Stop any experiments that are not showing promise quickly. This should allow you to quickly explore the different models.


# Summary

Matt's advice can be summarized largely as "start simple, monitor everything, expand until amount of data you have is a limiting factor, and keep it simple".

# Resources

* [Matt Niessner's original Twitter threadd](https://twitter.com/MattNiessner/status/1441027263554744326)
* [Universal Approximation Theorem](https://en.wikipedia.org/wiki/Universal_approximation_theorem) wikipedia page, which basically states that a multi-layer neural network can approximate functions arbitrarily well (with increased accuracy requiring more and more nodes)
* [Introduction to deep learnng coursee](https://niessner.github.io/I2DL/)
* [Why we need more than predictive models]()
 	
