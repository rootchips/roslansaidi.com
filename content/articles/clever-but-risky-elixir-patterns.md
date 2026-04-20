---
title: "Clever but risky Elixir patterns"
description: Selective receive is a hidden Elixir behavior where a process looks through its waiting messages for one match, while the other messages stay there and can slowly make the process slower.
date: 2026-04-17
image: https://images.unsplash.com/photo-1646514626278-ff2ae5e88f0d?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
minRead: 2
author:
  name: Roslan Saidi
  avatar:
    src: https://avatars.githubusercontent.com/u/13043860?v=4
    alt: Roslan Saidi
---

In Elixir, we create a process that can wait for a specific message:

```elixir
receive do
  {:ok, data} -> data
end
```

Kinda looks simple. But the weird part is, if the mailbox already has many other messages that do not match `{:ok, data}`, Elixir will scan through them one by one until it finds the matching one. Those unmatched messages are not removed. So over time, the process mailbox can fill with useless messages and every receive becomes slower. That is what makes it risky:
the code looks correct, but the process becomes slow quietly.

### Why some of us miss it?

We often think “receive waits for the next correct message". But the real behaviour is “receive searches through all messages until it finds the correct one".

### Simple use case
```elixir
def wait_result do
  receive do
    {:result, value} -> value
  end
end
```

Now imagine the process receives many unrelated messages first:
```elixir
send(pid, {:log, "start"})
send(pid, {:heartbeat})
send(pid, {:debug, 123})
send(pid, {:result, 42})
```

### TLDR
Selective receive is risky because it fails silently. The code still works, but the mailbox slowly poisons the process.
