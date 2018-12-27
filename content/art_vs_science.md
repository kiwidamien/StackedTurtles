Title: Pet Peeve - Art vs Science
Tags: pet peeve, wisdom, quotes
Date: 2018-12-26 22:00
Category: Data Science
Summary: Hearing the expression _"Data science is more art than science"_ makes my skin crawl. Data science is a type of science, and while all sciences require strict methodology, we shouldn't underestimate the amount of creativity required in all scientific disciplines.

# Pet Peeve - Art vs Science

Occasionally, when listening to a data scientist describing the features they are engineering, or some odd tweak or term they have added to their model, I'll hear this expression bought out:

> Data science is more art than science.

Of course, I also encounter [articles](https://www.quora.com/Do-you-think-data-science-is-an-art-or-a-science) [with](https://www.elsevier.com/connect/why-data-science-is-an-art-and-how-to-support-the-people-who-do-it) [these](https://www.datasciencecentral.com/profiles/blogs/why-is-data-science-different-than-software-development-it-starts) [quotes](https://www.quora.com/Why-is-Deep-Learning-rather-like-an-art-than-science). I don't fundamentally disagree with the _message_ the speaker is trying to convey, namely that when doing data science we sometimes try things because they "feel right", and that we cannot give someone a cookbook that will enable them to be successful data scientists.

## So what's the problem?

Where I **strongly** disagree is that this makes data science less of a science. Science is another field where I cannot give you a cookbook and expect you to be a successful scientist. Good science starts with investigation and exploration, where we see patterns (along with our preconceived notions of the world) allow us to generate hypothesis. This is a _creative_ process, and a _biased_ process. A scientist then determines how to test the hypothesis, a process that can also require a great deal of thought and creativity (especially when trying to isolate confounding effects).

Once all of that work is done, we turn the results of the experiments over to analysis. Here the rules should be cut and dried, and ideally the analysis should be planned out in advance. Occasionally there will be a new analytic technique, but if it proves useful, we should be able to absorb it into a "recipe" for future analysts to follow.

Science (and data science) are fundamentally creative endeavors. The hypothesis we consider carry with them our cultural biases, as well as our insights as to how the world works. The thing that separates sciences from the arts isn't that the sciences lack creativity, but that once generated the creative suggestions live or die by a somewhat objective analysis.

## The view for new data scientists

I have most often encountered this quote when an aspiring data scientist expects to learn the steps to become a successful data scientist. Often this aspiring data scientist feels a little disillusioned when told there is no magic formula for success in this field.

For some data scientists working mostly in analytics in their first job, it can feel like the job is too prescriptive. The inspiration for this blog post was a conversation I had with one of Metis's recent graduates who was about to start working as an analyst. She was interested in using data science to improve media and content recommendations, and was concerned that her new career would be endless A/B tests to determine which color to make a button, with a very prescriptive recipe.

We talked about how the possibilities for creativity in data science didn't lie primarily in the algorithms you chose, but instead thinking about which problems needed solving, and generating the hypothesis for how you thought the world worked. Provided your work allows you the ability to propose questions, the exciting (and creative) parts of data science is generating the hypothesis and adjusting your mental model of how the world works.

Regardless of what type of data science you are doing, your verification and testing should be a robust pipeline that requires very little modification. We don't want to give a favorable analysis technique to
a hypothesis we like more.


## Summary

Data science -- at least if you are doing it right -- is a **science**. That doesn't mean it's note creative.

In a little more detail:

* Be creative with your hypothesis
* Be boring and reproducible with your analysis
