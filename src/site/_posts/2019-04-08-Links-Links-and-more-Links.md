---
layout: post
title: This is a post with links
date: 2019-04-08
description: "This is a post with links."
tags: [links]
links:
  marriott:
    href: "https://www.vocativ.com/356376/sportswriters-love-marriotts-more-than-you-love-anything/index.html"
    title: "Sportswriters Love Marriotts More Than You Love Anything"
    author: "Joe Lemire"
  pedantic:
    href: "https://www.chronicle.com/article/The-Rise-of-the-Pedantic/245808/"
    title: "The Rise of the Pedantic Professor"
    author: "Sam Fallon"
  timwu:
    href: "https://www.nytimes.com/2019/03/05/opinion/oppression-majority.html"
    title: "The Oppression of the Supermajority"
    author: Tim Wu
  fox:
    href: "https://www.newyorker.com/magazine/2019/03/11/the-making-of-the-fox-news-white-house"
    title: "The Making of the Fox News White House"
    author: Jane Meyer
  staceyabrams:
    href: "https://www.foreignaffairs.com/articles/2019-02-01/stacey-abrams-response-to-francis-fukuyama-identity-politics-article"
    title: "E Pluribus Unum?"
    author: "Stacey Abrams"
  mossad:
    href: "https://www.newyorker.com/magazine/2019/02/18/private-mossad-for-hire"
    title: "Private Mossad for Hire"
    author: "Adam Entous and Ronan Farrow"
---

{% from "link_macro.njk" import link_heading %}

I've been thinking about something I head Pete Buttigieg say.[^6]
It was in an interview on _Pod Save America_ and he was talking about how Democrats could regain the midwest/white working class vote.
This topic is litigated with some frequency and is pretty problematic seeing as there are a ton of non-white working class people that are constantly overlooked, but he made what I see as a broader point.
He invoked a concept that gets bandied about by people who discuss this issue: the concept of "not talking down to them."

He gave an example: a liberal lawyer[^4] goes up to a Republican voting midwesterner, and complains that the midwesterner is voting against their own interest.
This is another point that gets brought up when trying to crack the white code; how could _these people_ act so illogically?
The midwesterner replies to the lawyer: "Well so are you."
Anyways, I thought that his little anecdote was a good illustration of the potential for condescension and paternalism that can come with being a liberal.

{{ link_heading(links.marriott) }}
I have stayed at many a Marriott hotel.
But compared to these people, I have never even seen a Marriott.

{{ link_heading(links.pedantic) }}
I'm using this as a prop to reiterate an annoyance I have with the scientific community (and academic community writ large, I guess).
My annoyance is essentially the thesis of this article, that oftentimes, academic types[^1] focus too much on being "_correct_," as opposed to "_right_," or, like "_making a cogent/coherent/convincing argument_."
And I know that I am not innocent in all this, I have been a pedant in my life.

The most recognizable microcosm of this phenomenon about which I rant and rave is the "well actually" guy.
It's ignoring, intentionally or not, the broader point for the satisfaction of being able to point out a technical problem with an argument.
And all this is not to say that being technically correct is _per se_ pointless.[^2]
But it shouldn't be the entire point of an argument.
If the fulcrum of a debate or of an argument is a technical point, then the parties can just look it up and the debate will be settled; philosophical and moral disagreements are not settled so easily.

{{ link_heading(links.timwu) }}
I read this dude's book.[^3]
Antitrust laws should be enforced more rigorously.

{{ link_heading(links.fox) }}
The lack of surprise that I felt upon reading this article was probably the most disturbing part of it.

{{ link_heading(links.staceyabrams) }}
Yay Stacey Abrams.

{{ link_heading(links.mossad) }}
Unlike the Fox News article, this one had me kinda freaking out.
And it's one thing to interfere in a high profile national election, but to screw around in such a specific election seems almost sociopathic.[^5]

[^1]: I'm including myself in that group, even though I am not currently in academia.
[^2]: Again, relating this to my engineering education, I tend to get annoyed when efficiency is used as the ultimate benchmark for efficacy, but efficiency is, obviously, not in and of itself a vice. And a lot of the time efficiency is measured narrowly, i.e., in terms of dollars and/or time (the two are equivalent in a capitalist society). To take a contemporary example, A.I. is an efficient tool for classifying data, e.g., finding hate speech on Facebook or identifying obscenity on YouTube; there are great fiscal gains in not having to pay human beings to do things. But the built in biases to such a system are inefficient in a much different way.
[^3]: [The Curse of Bigness: Antitrust in the New Gilded Age](https://www.amazon.com/dp/B07HRLQSLG/). Basically a pamphlet, just 150 pages.
[^4]: I'm pretty sure lawyer was essentially a stand in for "person of means."
[^5]: Not that it's okay to screw around in a higher profile election.
[^6]: Yes, I did have to look up how to spell his name.
