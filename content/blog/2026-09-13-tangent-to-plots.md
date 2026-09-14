---

title: "Tangent to Plots"
description: "How practicing mental math for a trading interview turned into building a game, collecting data, and obsessing over plots."
date: "2026-09-13"
updated: "2026-09-13"
tags:
  - software
  - plotting-and-charting
  - goofing-around
published: true
featured: true
slug: "tangent-to-plots"

---

## The Origin

Somewhere around early 2024, I was looking into quant/trading as a possible career. I bought some books, signed up for courses, started learning, and—you know how the circle goes.

Around that time, I came across a company called Akuna Capital, headquartered in Chicago. If I remember correctly, they also have offices in Sydney and Singapore. Akuna Capital is a proprietary trading firm whose main specialty is options market making. At the time, I didn't fully understand what options were or how trading firms actually operated. Not that I know everything now, but I definitely have a better understanding than I did then.

Anyway, coming back from that tangent.

One of the screening rounds for the position I applied for involved mental math and finding patterns in numerical sequences. Their recruiting process tested things like mental arithmetic, probability, sequence and pattern recognition, expected value, and the ability to make decisions quickly.

So naturally, I started looking for ways to practice mental math online. That's how I found **Zetamac**.

It was perfect: a timer, arithmetic problems, and a score at the end. Nothing complicated. I also found videos of people putting up absurdly high Zetamac scores on YouTube, which was enough to turn what should have been interview preparation into a small competition with people who did not know I existed.

Then I started wondering about something else. I didn't just want to know my score. I wanted to know **why** my score was what it was. Were there certain operations slowing me down? Was multiplication worse than division? Were larger numbers disproportionately expensive? Were there particular combinations of numbers that consistently caused hesitation?

I had a suspicion that there were patterns hiding inside the answers.Part of this came from a weird thing I've noticed about myself since childhood: I don't like the number **7**. Not in a superstitious way. My brain just seems to take slightly longer when 7 is involved. `8 + 7`, `17 - 9`, multiples of 7; something about them feels less automatic than neighboring numbers.

Maybe this was real. Maybe I was imagining it.But now I wanted data and this is where the original objective started falling apart.Instead of continuing to practice mental math so I could get better at mental math, I decided it would obviously be more productive to build an entire application that could measure how bad I was at mental math. So, I started working on a small arithmetic game.

## The Game

The first version was simple. Generate a problem, start a timer, accept an answer, and generate another problem. But once I was storing the results, the questions became much more interesting than the game itself.

A score like: `42 correct answers` doesn't tell me very much. But a dataset containing:

* the operation,
* both operands,
* the expected answer,
* whether I answered correctly,
* how long I took,
* and where in the session the question appeared

could tell me quite a bit.

Now I could ask questions like:

**Do I actually take longer when 7 appears?**

**Does my multiplication performance deteriorate faster than addition?**

And, most importantly:

**Can I plot this?**

That last question created another tangent.

## The Plots

Once I had data, naturally I wanted charts.At first this sounds trivial. Throw the results into a dataframe, call a plotting library, and look at a bar chart.But the more I played with it, the more I realized that plotting something and learning something from a plot are very different things.

So now I wasn't just thinking about a mental-math game anymore. I was thinking about what data I needed to collect, how much of it I needed, how to compare different kinds of questions, and eventually how I could visualize all of this without convincing myself that random noise was some profound discovery about my relationship with the number 7.

So I started experimenting with different ways of looking at the same data: averages, distributions, operation breakdowns, rolling performance, response-time buckets, mistakes, and eventually combinations of these.

And then, I didnt do any of it. I did not spend enough time practicing for the assessment and didnt finish the game either. Life got in the way, my attention moved somewhere else, and eventually I lost interest in the whole thing. The codebase ended up joining that very large category of side projects that were interesting enought to start but apparently not interesting enough to finishing them lol. It sat there for a couple of years. Which bring me to now.

## Opening the old Codebase

I'm going throught the project again in 2026, mostly out of curiosity. After spending some time on the code, parts of it seemed reasonable and some were like what was I tring to do ? I'm not trying to resurrect the original grand plan. The goal is very simple now, figure out what is worth salvaging, refactor it into a small web-based game something different than Zetamac.

Ideally, it should be simple enough to host for little to no money, work directly in a browser, and still keep enough of the original data collection idea that I can eventually answer some of those questions. But I'm trying very hard not to turn that into another giant project.Salvage the code. Make the game work. Put it on the web. Call it a day. lol.

Check out the codebase here : [text](https://github.com/aman25singh/math-drill)
