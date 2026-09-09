---
title: "Giving an AI Agent SSH Access Without Giving It Your Password"
description: "Use OpenSSH connection multiplexing to let an AI agent run SSH commands without exposing your password."
date: 2026-09-09T00:00:00+00:00
draft: false
tags: ["AI", "Security"]
categories: ["AI"]
---

# Giving an AI Agent SSH Access Without Giving It Your Password

An AI agent may need to run commands on a remote machine during a one-off administrative task. It needs a shell, but it does *not* need your SSH password.

Letting your agent, codex or claude code or GH Copilot, directly access a remote machine with SSH and giving it the ability to directly interact with the session can be risky, but it cut of tremendously administrative tasks.

When I create a new VM it is especially interesting because even if the agent completely messes up, the VM is not a problem, it is a new machine. Also with Snapshot I can always come back to a snapshot that points to state before the agent ran.

The real risk is **the agent being malicious and it can implant backdoors, exfiltrate data, or otherwise compromise the system**, but this is a standard risk when you are using agent. Always weigh the convenience against the potential security implications.

![A human-controlled SSH connection lets an AI agent access a remote server without exposing a password.](../images/ssh-image.png)

***Figure 1:*** *Temporary, human-controlled SSH access for an AI agent.*

## The problem

Two facts collide.

**Fact one:** the agent needs a shell on a machine that only accepts password authentication. The machine running the agent does not have a ssh key, because it cannot open the connection on its own.

**Fact two:** an agent's shell tool has **no TTY**. When `ssh` wants a password it can't ask the password to the user, also I prefer to control the SSH connection **outside the agent, and I want to be able to kill the connection if something is not ok**

**Fact Three** I will never include the real password in the prompt to let the agent open the connection. It will leave the password exposed in the chat or logs, which is unacceptable. Also it collide with the Fact two, the agent now own the password and can access the remote machine whenever it wants.

## The technique: one authenticated socket, shared

OpenSSH can multiplex many sessions over a single TCP connection. That machinery exists for speed, but it has a property that matters more here: **the authenticated connection is exposed as a file on disk.**

You authenticate once, interactively, as a human. The agent then rides that already-authenticated connection. It never sees a credential, because there is no credential to see — just a socket.

> With this technique you open **manually** the connection then let the agent uses it. You can close the connection whenever you want from the terminal.

### Step 1 — you open the master, in a real terminal

```bash
mkdir -p ~/.ssh/cm && chmod 700 ~/.ssh/cm

ssh -M -N -f -S ~/.ssh/cm/host -o ControlPersist=8h user@host
```

- `-M` — be the **master** for this socket
- `-S <path>` — the control socket to create
- `-N` — don't run a command, just hold the connection
- `-f` — background after authenticating
- `ControlPersist=8h` — keep it alive this long after the last use

It asks for the password, then hands your shell straight back. **This must be a real terminal.** Running it through an agent fails for exactly the TTY reason above.

### Step 2 — the agent uses the socket

```bash
ssh -o BatchMode=yes -S ~/.ssh/cm/host user@host 'hostnamectl'
```

`BatchMode=yes` is the safety belt: it forbids any interactive prompt. If the socket is dead, the command **fails immediately** rather than hanging or quietly asking for a password.

That's the whole technique. Each non-interactive command the agent runs goes through that one already-authenticated connection.

## Killing it instantly

This is the part worth internalising before you start. From **your** terminal, any of these ends the agent's access:

```bash
# Cleanest — tell the master to exit
ssh -O exit -S ~/.ssh/cm/host user@host
```

The next command the agent issues gets `Control socket connect(...): No such file or directory` and stops. No lingering session, no half-open channel.

Other options, in increasing order of bluntness:

```bash
# Stop accepting NEW sessions, let existing ones finish
ssh -O stop -S ~/.ssh/cm/host user@host

# Check what you have first
ssh -O check -S ~/.ssh/cm/host user@host     # -> Master running (pid=70458)

# Kill the master process directly
kill "$(ssh -O check -S ~/.ssh/cm/host user@host 2>&1 | grep -oE '[0-9]+')"

# Nuclear: kill every master and remove every socket
pkill -f 'ssh -M -N -f -S'
rm -f ~/.ssh/cm/*
```

Deleting the socket file alone is *not* enough on its own — the master process keeps running and any session already attached keeps working. Use `-O exit`.

Three things make this a genuinely good revocation story:

1. **It's instant.** No token to expire, no cache to clear.
2. **It's unilateral.** You don't need the agent's cooperation, and it cannot re-establish the connection — it has no password.
3. **It's automatic.** `ControlPersist` means access dies on its own if you forget.

## What the agent can and cannot do

**Can:** run any non-interactive command as that user. Which is to say — if it connects as `root`, it is root. Multiplexing is not a sandbox. It removes the *credential* from the agent's reach, not the *authority*.

**Cannot:**

- Learn the password. It isn't in the socket.
- Re-open the connection after you close it.
- Extend its own access beyond `ControlPersist`.
- Run anything that needs a TTY, such as an interactive terminal, full-screen process monitor, or login program. This is a useful natural boundary: anything genuinely interactive stays yours.

## The honest security limits

Be clear-eyed about the boundary this does and does not draw.

**Any process running as you can use that socket.** It's a filesystem object at mode `0600`, owned by you. That is the same trust boundary as your SSH agent or your private key file. If you don't trust local processes running as your own user, this is not your problem to solve here.

**Scope it deliberately.** Nothing stops you opening the master as a *limited* account rather than `root`. For anything narrower, connect as a user with narrower rights. **The socket inherits whatever the master authenticated as — so choose that carefully, because it is the actual permission boundary.**

**It's a bootstrap, not a destination.** The right end state is a dedicated keypair with a scoped `authorized_keys` entry — ideally with `command=`, `from=`, and `restrict` options. Multiplexing is how you get a shell to install that key in the first place, and a reasonable stopping point for one-off work.

## Operational gotchas

A few details are worth planning for.

**Expiry mid-task.** `ControlPersist` resets on each use, so a socket used constantly survives while an idle one dies. Choose a duration that fits the task, or install keys for longer-lived access.

**Stale sockets.** If the master dies badly, the file remains and you get:

```
muxclient: master hello exchange failed
```

`rm -f` the socket, then reopen. A plain `ssh -M` over an existing file will refuse with `ControlSocket ... already exists, disabling multiplexing`.

**`MaxSessions`.** The default is 10 concurrent channels per connection. Sequential commands are fine, but a burst of parallel ones can hit the limit.

**Not every server multiplexes.** Verify that the target SSH server accepts a second session over the connection; failure can look like a permissions problem.

**Interrupt the right thing.** The socket outlives the agent session. Ending your chat does *not* close it. `-O exit` does.

## When to use something else

| Situation | Better tool |
|---|---|
| Ongoing automation | Dedicated keypair, `authorized_keys` with `restrict` + `from=` |
| Untrusted agent | Don't. Use a bastion with session recording and a scoped account |
| One-off admin work with an agent | This technique |
| Bootstrapping key auth on a password-only host | This technique, then install the key |

## The short version

```bash
# You, once, in a real terminal:
ssh -M -N -f -S ~/.ssh/cm/host -o ControlPersist=8h user@host

# The agent, as often as it likes:
ssh -o BatchMode=yes -S ~/.ssh/cm/host user@host 'command'

# You, the moment you want it to stop:
ssh -O exit -S ~/.ssh/cm/host user@host
```

The agent gets a shell. You keep the password. And access ends the second you
decide it should — no negotiation, no cleanup, no trust required.
