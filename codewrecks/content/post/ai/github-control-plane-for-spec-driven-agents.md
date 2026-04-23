---
title: "GitHub as a Primitive Control Plane for Spec-Driven Agents"
description: "How I used the speckit-full and speckit-gh skills in azdo-cli to turn GitHub issues and pull requests into a primitive natural-language control plane for a human-in-the-loop spec-to-PR workflow."
date: 2026-04-23T09:00:00+00:00
draft: false
tags: ["GitHub", "AI", "Agents", "Spec Driven Development"]
categories: ["AI", "Development Tools"]
---

> **This is an experiment.** The code in [azdo-cli](https://github.com/alkampfergit/azdo-cli/) is a personal sandbox, not a production-ready tool. The skills described here work well enough to demonstrate the idea, but they have known gaps: no real concurrency handling, limited error recovery, no support for multi-maintainer workflows, and prompt-level guards that a sufficiently adversarial input could bypass. I am sharing it because the pattern is interesting and worth discussing, not because the implementation is finished or hardened. Expect rough edges.

In the repository [azdo-cli](https://github.com/alkampfergit/azdo-cli/) I pushed a simple idea a little further: if GitHub issues and pull requests are already the collaboration surface for humans, why not use the same surface to steer an agent through a full spec-driven workflow?

In this context, `speckit` is the spec-driven workflow I use to move from issue to specification, clarification, plan, task list, implementation, and finally pull request follow-up. The result is a small family of skills, but the two key ones are `speckit-full` and `speckit-gh`.

- `speckit-full` watches a repository for issues with a specific label
- `speckit-gh` takes a single issue and drives it through the whole speckit pipeline

This is not "let the bot code and hope for the best". The whole flow is explicitly **human in the loop**, with approvals happening on GitHub itself.

Previously I experimented with a much simpler prompt: ask the agent to take an idea, implement it end to end, open a PR, wait for checks, fix problems, and then stop for final approval. That was useful, but it also made the early phases almost invisible. **The problem was not implementation quality, it was lack of control over the process before code existed.**

## The Real Problem

I like spec-driven development because it forces me to think in phases:

1. Write the specification
2. Clarify ambiguities
3. Create a plan
4. Break work into tasks
5. Implement
6. Validate with tests and CI

The problem is that when you do this with agents, the workflow often lives inside the chat session. That is convenient at the beginning, but after a while it becomes weak:

- decisions are buried in the console history
- approvals are not visible to the rest of the team
- if the session dies, the process becomes harder to reconstruct
- there is no natural bridge between specification, implementation, and PR review

GitHub already solves most of these problems. Issues and pull requests are durable, collaborative, and auditable. So I decided to use GitHub not only as the code hosting platform, but also as a **primitive control plane built with natural language** for speckit.

## `speckit-full`: Turn a Label into a Queue

The `speckit-full` skill is the outer loop. It polls GitHub for open issues with a given label, for example:

```text
ready-for-speckit
```

Once it finds a matching issue, it can claim it, skip already blocked items, and delegate the actual end-to-end execution to `speckit-gh`.

![Bot found my issue and starts working.](../images/bot-taking-issue.png)

***Figure 1:*** *Bot found my issue and starts working*

This is the first important transition: the issue is no longer just backlog text, it becomes an active workflow item. The point is not that the bot starts coding immediately, but that GitHub now shows, in plain sight, that the issue has been claimed and moved into a controlled pipeline.

The idea is intentionally simple: **a label becomes the contract that says this issue is ready to enter the pipeline**.

The skill supports three modes:

- `once`: process the queue one time
- `loop`: keep polling in-session
- `cron`: trigger the same logic on a durable schedule

That means I can test the automation manually, keep it alive for a session, or schedule it remotely.

## `speckit-gh`: One Issue, Full Lifecycle

If `speckit-full` is the dispatcher, `speckit-gh` is the worker. It takes one GitHub issue and moves it through a complete flow:

1. Read and understand the issue
2. Claim it with labels and assignee
3. Run `/speckit-specify`
4. Run `/speckit-clarify`
5. Run `/speckit-plan`
6. Run `/speckit-tasks`
7. Initialize a PR report
8. Open a draft PR
9. Run `/speckit-implement`
10. Execute tests
11. Finalize the PR and mark it ready
12. Watch CI
13. Follow reviewer comments until merge or stop

This is the part I really wanted: not just "generate code", but **treat the whole software workflow as a sequence of visible GitHub states**.

The second screenshot shows why this is better than a fire-and-forget agent. Instead of disappearing into a terminal session and inventing missing details, the workflow stops on GitHub and asks for clarification in a way that is visible and auditable.

![Bot posting to GH contains the NEEDS CLARIFICATION marker from speckit](../images/bot-needs-clarification.png)

***Figure 2:*** *Bot posting to GH contains the NEEDS CLARIFICATION marker from speckit*

That behavior is exactly the design goal: the agent advances the work, but every ambiguous step is surfaced back to the owner on the shared thread.

## The Inner Loop Inside `speckit-gh`

The outer loop is easy to understand: scan for issues with a label, pick one, and start working on it.

The interesting part is the **inner loop** inside `speckit-gh`, because that is where the workflow becomes reliable instead of merely clever.

For every major step, `speckit-gh` does roughly the same thing:

1. Produce an artifact or a question
2. Post it on the active GitHub thread
3. Wait for an explicit owner reply
4. Acknowledge the reply
5. Advance to the next step

This repeats for the spec, for each clarification question, for the plan, for the task list, and later for PR follow-up.

That means the real execution model is not "run once and finish". It is more like a small state machine that alternates between **do some work** and **wait for an approved transition**.

## Why The Inner Loop Matters

Without this inner loop, the outer label-driven automation would still look nice, but it would be fragile.

The hard part is not generating a spec or opening a PR. The hard part is making sure the agent does not miss a human answer, does not answer the wrong person, and does not continue after a stale assumption.

That is why the protocol inside `speckit-gh` is strict.

- every bot message gets a machine-readable marker
- every poll accepts replies only from the repository owner
- the skill switches from issue comments to PR comments at a fixed point
- after every blocking operation it re-reads GitHub before posting again

This is less glamorous than code generation, but it is what makes the flow usable in practice.

## Watermarks, Not Guesswork

One subtle problem in this kind of automation is missing replies that arrive between two polling cycles.

To avoid that, the inner loop does not use "current time" as a reference point. It uses the `createdAt` timestamp of the skill's own latest GitHub comment as the watermark.

So the logic is:

- post a comment
- store the exact timestamp GitHub returned for that comment
- on the next poll, only consider replies newer than that watermark

This avoids a very common race condition: if you post a question, then sleep for a minute, and use wall-clock time incorrectly, you can silently miss a reply that landed in the gap.

It sounds like an implementation detail, but it is actually one of the most important parts of the inner loop.

## The Thread Changes, The Loop Does Not

Another thing I like in this design is that the communication channel changes, but the model stays the same.

Before the draft PR exists, everything happens on the issue:

- spec approval
- clarification answers
- plan approval
- task approval

Once the draft PR is opened, the workflow moves to the PR thread:

- implementation updates
- test and CI status
- reviewer feedback
- final handoff until merge or stop

So the inner loop is stable even while the collaboration surface changes. The agent is always doing the same core operation: **post, poll, acknowledge, continue**.

## The Key Design Choice: All Communication Happens on GitHub

The strongest idea in these skills is that user communication does not happen in the console once the process starts. It happens on the active GitHub thread:

- issue comments in the specification phases
- PR comments after the draft PR is opened

This matters a lot.

When the spec is generated, it is posted on the issue for approval. When clarification is needed, questions are posted one by one on the issue. When planning is done, the plan is posted for approval. When tasks are ready, the task list is posted again for approval.

After that, the workflow moves to the pull request.

So the issue and the PR become the real shared memory of the process. Anyone can inspect what happened, why a decision was made, and where the automation is currently blocked.

## Human In The Loop Means Real Gates

Another important point is that this automation is not autonomous in the dangerous sense of the word.

Every meaningful phase is gated by explicit approval from the repository owner. The skill resolves the owner login and accepts directives only from that identity. It also refuses a series of risky shortcuts:

- no auto-answering clarify questions
- no auto-merging PRs
- no auto-closing PRs
- no automatic release or tagging
- no acting on state-changing comments from non-owners

What the agent does autonomously is react to multiple validation signals: formal ones such as GitHub Actions, CodeQL, and Sonar, and informal ones such as comments from a human user or another agent reviewer. When one of these signals indicates that something is wrong, it tries to fix the problem, or to close without fixing if it deems the requested change should not be applied.

The agent can and does make mistakes during execution. In the example above, it violated a guard condition, detected the problem itself, and rolled back. That matters, but it is worth being precise about what it proves.

![A guard was violated during execution, and the agent detected the problem and repaired the workflow state.](../images/guard-broken.png)

***Figure 3:*** *A broken guard is surfaced explicitly, then corrected by the agent instead of being silently ignored*

These guards are not externally enforced constraints. They are conventions encoded in the skill's prompt: the agent is instructed not to do certain things, and when it deviates, it can also be instructed to recognize the deviation. What the screenshot demonstrates is that the agent surfaces its own errors explicitly rather than continuing silently on bad state. That is genuinely useful. Failures show up in the GitHub thread as visible, auditable events rather than disappearing into a terminal log.

What it does not prove is that the guards cannot be bypassed. A more adversarial input or a subtly different phrasing could produce a different outcome. The honest framing is: the guards reduce the probability of unsafe behavior, and the self-repair behavior makes failures observable when they do occur. That is a meaningful property — just not the same as external enforcement.

## Labels Become Workflow State

I also like the fact that the flow maps cleanly to labels:

- `ready-for-speckit`
- `in-progress`
- `needs-human`
- `done`

This gives a compact state machine directly in GitHub. You can look at the issue list and immediately understand what the system is doing.

If something fails, the issue is not lost in some terminal output. It gets a visible state like `needs-human`, plus a comment explaining the reason.

## Why This Works Better Than Chat-Only Automation

The reason I like this approach is not that it is more "AI". It is better because it is more boring, more explicit, and more traceable.

GitHub becomes:

- the inbox, because labels decide what is ready
- the approval system, because comments authorize each step
- the audit log, because the full conversation is durable
- the delivery surface, because the PR is created early and then updated through the implementation

In practice this means the agent can do useful work asynchronously without forcing me to stay attached to a single chat session.

## A Concrete Example

A typical invocation looks like this:

```text
/speckit-full label=ready-for-speckit repo=alkampfergit/azdo-cli mode=once
```

The loop picks one issue, then delegates to:

```text
/speckit-gh alkampfergit/azdo-cli#123
```

From that point on, the process is visible in the issue and later in the PR:

- spec posted and approved
- clarifications answered on-thread
- plan posted and approved
- tasks posted and approved
- draft PR opened with links to generated artifacts
- implementation executed on the feature branch
- CI watched until terminal state
- reviewer feedback handled on the PR thread

This is the important shift: **GitHub is not just where code lands at the end, it is where the whole agent workflow is steered through a primitive natural-language control plane**.

## Is it SAFE?

The answer is: safer than a generic "go build this feature" agent, but the gap between "safer" and "safe" is worth being honest about.

The owner-only directive model does reduce one important attack surface. `speckit-gh` resolves the real repository owner and accepts state-changing directives only from that login. Every spec, clarify, plan, and tasks phase is blocked until the owner replies on GitHub itself, not in the console. When you design a system driven by an AI agent, whitelisting who can send instructions is a necessary baseline — prompt injection is a real threat and identity filtering is the right first response to it.

But identity filtering is not a complete defense. The agent also reads issue bodies, PR descriptions, linked content, generated artifacts, and diffs. Any of those surfaces can carry untrusted input that reaches the model without passing through the owner-identity gate. The correct framing is not "prompt injection is solved" but "one of its main entry points is controlled, and the others require separate attention."

The same skill explicitly refuses a set of dangerous shortcuts: it does not auto-answer clarification questions, does not auto-merge or auto-close PRs, does not tag or release on merge, and does not invoke `@copilot` or other action-triggering bots on behalf of the owner. The design principle here is important: **explicitly enumerate what the agent is allowed to do and reject everything else**. An open-ended natural language interface is more expressive, but it is also a larger attack surface.

![The skill rejects a prompt that asks it to perform an action outside its allowed workflow.](../images/rejecting-forbidden-prompt.png)

***Figure 4:*** *A forbidden prompt is rejected instead of being treated as an implicit extension of the agent's authority*

This is deliberately restrictive, and it has a real cost. As the repository owner I sometimes want to use natural language to request something the skill was not designed for. That tension between expressiveness and safety is genuine, and the current design resolves it conservatively: if the action was not predetermined, it is not allowed.

On top of that, the communication protocol uses machine-readable markers, watermark timestamps, and a re-fetch-before-post rule so the agent does not silently miss or overwrite human feedback. `speckit-full` adds outer-loop guardrails such as clean-tree checks, base-branch checks, a conservative `max-per-cycle` default of one issue, and a `needs-human` parking state instead of blindly pushing through failures.

Taken together, these measures make unsafe behavior structurally harder. They do not make it impossible. The right way to read the safety story here is: known risks have been reduced in specific, deliberate ways, and the remaining surface is smaller and more visible than in an unconstrained agent.

## Final Thoughts

What I did in `azdo-cli` is not really about one repository. It is a pattern I want to reuse: make the agent work through a structured pipeline, but keep every approval, artifact, and state transition in the same place where the team already collaborates.

For me this is one of the most promising ways to use agents seriously: not by hiding the process, but by making the process more visible. The goal is using GitHub for what it was designed for: collaboration, management and not only coding. The shift is that **now AI Agents are possible collaborators like humans**, but I do not want to change the process.

Also if you are already using spec-driven development, moving this primitive natural-language control surface to GitHub is a very natural next step that gives more visibility, greater collaboration and good traceability.

The most serious limits now are:
- the need for a human to trigger the process
- AI agents are not deterministic, sometimes the skill stop because it mistake what to do

The most interesting aspect is: I do **not need to write code to generate this automation** everything is done in natural language. If the skill misbehave I can correct and then tell the AI Agent to update the skill with the correction, so it can learn from the mistake and do better next time.

Gian Maria.
