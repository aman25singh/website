# Systems Thinking for Everyday Problems
I used to think systems thinking was something you applied to large-scale infrastructure — distributed databases, microservice orchestration, deployment pipelines.
It took me a while to notice I was using it everywhere else too.

## What it actually means

A system is just a set of parts with relationships. The interesting work is usually not in the parts themselves but in how they interact — and what happens at the boundaries.
When a process feels broken, the instinct is to fix the part that's most visible. But the visible part is often just where the failure surfaces, not where it originates.

## A simple example

My mornings used to be chaotic. I'd spend the first hour reacting — to notifications, to a vague sense of what I was supposed to do that day, to whatever felt most urgent.
The fix wasn't discipline. The fix was a system: a short evening note with three things I want done by noon. That note is the upstream output that the morning process depends on.
The chaos wasn't a morning problem. It was a feedback loop problem.

## Where this applies in engineering

- A slow deploy pipeline is usually a test architecture problem, not a CI problem
- A buggy feature is usually a requirements communication problem, not a code quality problem
- An unreliable service is usually an interface contract problem, not a reliability problem

Fix upstream. The downstream symptoms take care of themselves.
