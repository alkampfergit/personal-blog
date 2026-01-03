---
title: "GitHub Copilot Plan-Then-Execute: Leveraging Background Agents and Git Worktrees"
description: "Explore how GitHub Copilot's plan-then-execute workflow with git worktrees enables true parallel development, allowing developers to delegate tasks to autonomous AI agents while maintaining productivity on other work."
date: 2026-01-03T10:00:00+00:00
draft: true
tags: ["GitHub Copilot", "Git", "AI", ]
categories: ["AI", "Development Tools"]
---

# GitHub Copilot: Plan Then Execute in Background with Git Worktree

GitHub Copilot's recent evolution has introduced a revolutionary capability that fundamentally changes how developers can delegate work to AI: the ability to **plan first and then execute in background** using **git worktrees**. This feature represents a real evolution of your everyday worfklow with AI coding assistants.

## The Problem with Synchronous AI Development

When working with traditional AI assistants in the IDE, we often find ourselves in a situation of **tight coupling** between us and the AI: the process is synchronous, it is like asking to a colleague to write some code, then wait for them to finish and review. **The problem with AI assistant is that I do not want to waste my time waiting for it to finish**: I want to be able to delegate the work and continue working on other tasks while the AI works in background and finally presents me with the results.

Also, to maximize my token usage, I usually ask GitHub copilot to perform a task, then I start another task on Claude Code, or simply I continue to work on something else. The problem is while the agent is working **code in my working folder is not stable**, because copilot is working on it. Usually I opened the same solution in two different folders, using two different branches, and everything is ok, but it is clumsy.

### The Advantage of Plan/Execute Separation

The "plan then execute" approach solves these problems by introducing **two distinct phases**:

**1. Planning Phase (Synchronous)**

One of the most annoying problem is, you ask something to the AI, it starts writing code, but then you realize that the approach is not what you want. Class names, interfaces, the code could be good but not **according to your design**. With plan/execute separation, you can:

- Interact with the Plan agent to define **what** needs to be done
- The AI creates a detailed implementation plan
- You can review, modify, and refine the plan before it gets executed
- The plan becomes a **documented artifact** of your decision

This has the distinct advantage of using copilot without changing the code, you can still use Claude Code or other agent in the same folder to do other stuff, **in the meanwhile you refine the plan using GitHub Copilot**.

Another big advantage is that the feedback is quicker, usually copilot search codes, analyze them, and then propose a plan. Since **it is not writing code yet, the response is quicker** and you can refine the plan faster.

![GitHub Copilot Planning mode, refining specification without it writing code](../images/gh-copilot-plan.png)

***Figure 1:*** *GitHub Copilot Planning mode, refining specification without it writing code*

Also if you use a capable models, it will usually ask you **for refinements if the plan is not clear enough**. 

![GitHub Copilot prompting for further consideration when the plan is not clear enough](../images/gh-plan-clarification.png)

***Figure 2:*** *GitHub Copilot prompting for further consideration when the plan is not clear enough*

The introduction of Handoff in GitHub Copilot agents allows you to simply decide how the plan should be executed: you can either execute it in foreground (usual mode) or in background (worktree mode).

![Handoff for plan execution, where you can choose if to execute in background or even in Cloud](../images/gh-handoff.png)

***Figure 3:*** *Handoff for plan execution, where you can choose if to execute in background or even in Cloud*

### How to keep working while the Agent Executes

Now there is another problem, during the execution of the plan the **agent is continuously modifying files, so you cannot work on the same codebase**. With plan/execute separation, you can:

- Once the plan is approved, you delegate the implementation to a background agent
- The agent works **autonomously** in an isolated environment
- You can continue working on your main code without interruptions
- When the agent finishes, you receive a complete pull request to review

This model better reflects the **real development workflow**: we think about how to solve a problem first, then we implement it. With this separation, we can maximize both our productivity and the AI's.

## How Background Execution Works with Git Worktree

The heart of the background execution functionality is the use of **git worktrees**. Let's see in detail how it works.

### What is a Git Worktree?

A git worktree is a Git feature that allows you to have **multiple working directories** associated with a single repository. In practice, instead of having to `git checkout` to change branches (and thus change all files in the same directory), you can have different branches in separate directories.

```bash
# Main repository
/projects/myapp/              # branch: main

# Worktrees for features
/projects/myapp-feature-1/    # branch: feature/user-authentication
/projects/myapp-feature-2/    # branch: feature/dark-mode
```

All these worktrees share the **same Git repository** (`.git`), so they share:
- The commit history
- Branch references
- Configurations
- Git objects

### How GitHub Copilot Uses Worktrees

When you start a **background agent** with worktree mode in VS Code, GitHub Copilot creates a worktree.

![Handoff creates a new worktree](../images/gh-handoff-worktree.png)

***Figure 4:*** *Handoff creates a new worktree*

Now the agents can work in the isolated worktree, while you continue working in your main workspace. Here's how it works under the hood:

**1. Automatic Worktree Creation**

```bash
# VS Code automatically executes something like:
git worktree add ../copilot-worktree/task-123 -b copilot/implement-feature
```

This command:
- Creates a new separate directory
- Creates a new branch for the task
- Checks out the branch in the new worktree
  
**2. Environment Isolation**

The background agent operates exclusively in the isolated worktree. It can modify files, run tests and builds, and make commits there without touching your main workspace or disrupting your ongoing work, so all changes remain contained and easy to review or discard.

While executing, **the agent analyzes the code within the worktree and implements the approved plan, producing iterative commits as it progresses.** It runs tests and linters, attempts to resolve routine errors and blockers on its own, and surfaces any issues that require your input or escalation.

While you continue working in your main workspace **you can see the agent’s status in the Chat view, monitor progress in the Sessions view, view worktree changes in the Source Control view**, and receive notifications when the agent completes its work or runs into problems.

![GitHub Copilot background agent working in an isolated worktree](../images/worktree-isolation.png)

***Figure 5:*** *GitHub Copilot background agent working in an isolated worktree*

As you can see from the picture git status does not show any changes in the main workspace, because all changes are done in the worktree. **At the same time in Visual Studio Code you can see all the changes easily because **it lists changes made in the worktree in the Source Control view**.

![isual Studio Code can easily show diffs in the isolated worktree letting you review changes](../images/vs-code-worktree.png)

***Figure 6:*** *Visual Studio Code can easily show diffs in the isolated worktree letting you review changes*


### Practical Workflow

Here's a concrete example of how it works for your everyday development:

```
1. You in the main workspace (/projects/myapp):
   - Working on bug fixes on the main branch
   
2. Ask the Plan Agent:
   "Create a plan to add a dark/light theme toggle"
   
3. Review and approve the plan
   
4. Delegate to Background Agent:
   - VS Code automatically creates /projects/myapp-worktree-darktheme
   - The agent works in this isolated worktree
   - You continue working on bug fixes in /projects/myapp
   
5. Agent completes:
   - Creates commits: "feat: add theme toggle component"
                      "feat: implement theme persistence"
                      "test: add theme toggle tests"
   
6. Review:
   - View changes in the worktree
   - Decide whether to apply them to main workspace with "Apply"
   - Or create a PR for code review
```

## Advantages of Git Worktrees

Git worktrees offer significant benefits, especially when combined with AI coding agents.

### 1. True Parallel Development

**Traditional scenario** (without worktrees):
```bash
# Working on feature-A
# Urgent request arrives for hotfix-B
git stash              # Stash your changes
git checkout -b hotfix-B
# Work on hotfix
git checkout feature-A
git stash pop          # Restore changes
```

**With worktrees**:
```bash
# Continue working on feature-A in /projects/app
# In parallel:
git worktree add ../app-hotfix -b hotfix-B
cd ../app-hotfix
# Work on hotfix in a separate directory
# feature-A remains intact and accessible
```

You can literally open two VS Code windows side-by-side and see both branches simultaneously.

### 2. Change Isolation

Each worktree has:
- **Separate file system**: changes in one worktree don't affect others
- **Independent working directory**: `.env` and local config files are isolated
- **Separate Git state**: each worktree has its own index and working tree state

This is **crucial for background agents** because:
- The agent can make aggressive changes without risking breaking your work
- You can test the agent's results without having to merge
- If something goes wrong, just delete the worktree

### 3. Optimal Performance

This is really better than having your solution cloned multiple times in different folders, because everything is managed by Git. Performances are really better also because switching between worktrees is instant (different folders), no need to re-index the project or reload dependencies. Actually you can have multiple VS Code windows open, each one pointing to a different worktree, and everything works smoothly while **git is managing all the branches and references behind the scenes**.

Remember, in the worktree directory there are all the files, **so disk space usage is similar to having multiple clones of the repository**, but without the overhead of multiple `.git` folders. Only one `.git` folder exists in the main repository, and worktrees share the same Git objects, making them efficient in terms of storage especially for large repositories with lots of history.

## How to Close and Manage Worktrees

Properly managing worktrees is important to keep the repository clean and organized, especially if you close GitHub Copilot chat or if **you feel lost because you do not know where the agent made the changes**. First of all you can list all worktrees with a simple command.

```bash
git worktree list
```

Example output:
```
/projects/myapp              abc1234 [main]
/projects/myapp-feature-1    def5678 [feature/auth]
/projects/myapp-hotfix       ghi9012 [hotfix/security]
```

In **VS Code**, you can see worktrees in the **Worktrees section** of the Source Control view (if using GitLens), so you do not even need to really know **the exact path** of the worktree. When you finally **decide to remove a worktree**, the optimal solution is to use the git command. This because the command verify there are not uncommitted changes, then it removes the worktree folder and also cleans up metadata in `.git/worktrees/`.

```bash
git worktree remove ../myapp-feature-1
```
If there are uncommitted changes, you can simply go in workspace folder, then simply commit manually. Then you **can merge or rebase the changes in the worktree back to main workspace** and finally you can delete the worktree.


### Complete Workflow for Background Agents

When working with GitHub Copilot background agents:

**1. Agent completes work**
```
✓ Background agent completed
  - 3 files changed
  - 5 commits created
  - All tests passing
```

**2. Review in worktree**
```bash
# Option A: From VS Code
# - Click on session in Chat view
# - View changes in Source Control view
# - Review modified files

# Option B: From terminal
cd /path/to/worktree
git log --oneline
git diff main
npm test  # Verify everything works
```

**3. Apply changes**

In VS Code:
```
Chat view → Session details → "Keep" → "Apply"
```

This command:
- Applies changes to main workspace
- Automatically removes the worktree
- Allows you to continue working

Alternatively, create a PR:
```bash
git push origin copilot/feature-branch
# Then create PR on GitHub for code review
```

**4. Worktree cleanup**

After merging or applying changes:
```bash
git worktree remove /path/to/worktree
```

If the worktree was already manually deleted:
```bash
git worktree prune
```

This cleans up metadata for worktrees that no longer exist.

### Best Practices for Management

**1. Consistent Naming Convention**
```bash
# For background agents
git worktree add ../copilot-issue-123 -b copilot/feature-name

# For PR review
git worktree add ../review-pr-456 -b pr-456

# For hotfix
git worktree add ../hotfix-security -b hotfix/security-patch
```

**2. Directory Organization**
```
/projects/
  ├── myapp/                    # Main workspace
  ├── myapp-worktrees/          # Dedicated directory for worktrees
  │   ├── feature-1/
  │   ├── feature-2/
  │   └── hotfix-1/
```


### VS Code Integration

When using background agents in VS Code:

**Viewing worktree changes**:
- The Chat view shows active background sessions
- Source Control view displays the worktree when selected
- You can open the worktree in a new window for side-by-side comparison

**Applying changes**:
When a background agent completes:
1. Click on the completed session in Chat view
2. Review the changes in the session details
3. Choose "Keep" to accept the changes
4. Select "Apply" to merge changes into your main workspace

**Direct worktree actions**:
```
Command Palette → "Git: Create Worktree"
Command Palette → "Git: Open Worktree"
Command Palette → "Git: Delete Worktree"
```

## Conclusion

The combination of **plan-then-execute** and **git worktrees** in GitHub Copilot represents a significant evolution in how developers can collaborate with AI. It's no longer just synchronous assistance, but true **work delegation** that allows you to:

1. **Plan** carefully what the AI should do
2. **Delegate** implementation to an autonomous agent
3. **Work in parallel** on other tasks without interruption
4. **Review** results safely and in isolation
5. **Collaborate** through PRs and code reviews

Git worktrees are the technology that makes all this possible, providing:
- Perfect isolation between your work and the agent's
- Optimal performance without data duplication
- Flexibility to work on multiple branches simultaneously
- Safety that agent changes won't interfere with your code

This evolution transforms GitHub Copilot from a simple **coding assistant** to a true **team member** that can work autonomously on well-defined tasks, leaving you free to focus on more complex and creative problems.

The future of development is not about replacing developers with AI, but about **empowering developers** with AI teammates that can handle the routine implementation work while humans focus on architecture, planning, and creative problem-solving. Plan-then-execute with git worktrees is a concrete step toward that future.

---

*References:*
- [Background agents in VS Code](https://code.visualstudio.com/docs/copilot/agents/background-agents)
- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [Using agents in Visual Studio Code](https://code.visualstudio.com/docs/copilot/agents/overview)
- [About GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent)
