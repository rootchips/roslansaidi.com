---
title: "Technical Debt"
description: A beginner-friendly look at how coding shortcuts today can create bigger problems tomorrow.
date: 2025-11-04
image: https://images.unsplash.com/photo-1624811532681-e58a7e25f273?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170
minRead: 1
author:
  name: Roslan Saidi
  avatar:
    src: https://avatars.githubusercontent.com/u/13043860?v=4
    alt: Roslan Saidi
---

Technical debt means doing something quick today that saves time now but causes more work later.

For example, imagine we need to send emails from our system. The “clean” way is to use a `job queue` (background process). That way, the user clicks a button, and the email is sent in the background without slowing the app.

But if we’re in a hurry, we might just send the email directly in the request (“fire email immediately”).
- Short term: It works, no need to build a `job queue`. We save time.
- Long term: Problems start — the app gets slower, users wait for email sending, and if many emails are fired at once, the server crashes. Now we must rewrite the whole email process later.

That “extra work” is called technical debt.

It’s just like borrowing money: you get quick cash now, but you must repay it later with interest. In coding, the “interest” is bugs, crashes, and slow development speed.

Let me explain another analogy:
<br><br>

__Real-life analogies__

1. Car Maintenance
- Quick: Skip changing the oil to save time.
- Later: Engine breaks, expensive repair.<br>
🟰 `Weak foundation now` = costly repair later.

2. Building House Analogy
- Quick: Use cheap wood to finish fast.
- Later: Termites eat it, house repair costs more.<br>
🟰 `Weak foundation now` = costly repair later.
<br><br>

__Software Development analogies__

1. Skipping Documentation
- Quick: Don’t write docs to save time.
- Later: New developer takes weeks to understand system.<br>
🟰 `Debt` = onboarding costs increase.

2. Fire Email Without Job Queue
- Quick: Send emails directly in request.
- Later: Server slows, users wait, rewrite needed.<br>
🟰 `Debt` = shortcut now, pain later.

3. Copy-Paste Code
- Quick: Duplicate code instead of writing a reusable function.
- Later: Bug found → must fix in 5 different places.<br>
🟰 `Debt` = more work every time change happens.
<br><br>

## Summary

What is it?
- Shortcuts in code/design to save time now.
- But we pay the price later (bugs, slowness, rewrite).

Example
- Fire email immediately instead of using job queue.
- Works today → but tomorrow causes slowness and server crash.

Why it matters
- More bugs
- Slower system
- Harder to add new features

When it’s okay
- If deadline is very tight.
- But we must `“fix it later”` (repay the debt).

Rule
- Technical debt = shortcut today → headache tomorrow.