---
title: "Workspace: Building a Real-Time Home for Team Collaboration"
description: A full-stack case study in collaborative editing, resilient synchronization, and thoughtful product design.
date: 2026-11-08
image: /images/workspace/kanban.png
minRead: 8
author:
  name: Roslan Saidi
  avatar:
    src: https://avatars.githubusercontent.com/u/13043860?v=4
    alt: Roslan Saidi
---

Workspace brings documents, whiteboards, and task boards into one shared environment. Teams can write a brief, sketch an idea, discuss the details, and organize the work without switching between disconnected tools.

The project combines **Next.js, React, TypeScript, Tailwind CSS, Tiptap, Yjs, Elixir/Phoenix, PostgreSQL, Redis, IndexedDB, and Docker Compose**. My focus was the connection between the interface and the distributed system underneath it: collaboration should feel immediate, while permissions, persistence, and recovery remain dependable.

> All screenshots show the running application with portfolio demonstration content and the existing demo accounts: Roslan Saidi, Sabrina Shahril, and Mocha Ochi. They are actual interface captures, not design mockups or customer data.

## The Problem: Shared Work Needs Shared Context

A team's work rarely fits into a single format. A written plan needs discussion. A rough idea needs room to become a diagram. A decision eventually needs an owner and a place on the task board.

The challenge was to connect these activities without making the product feel crowded. It was also a technical challenge: two people should be able to edit together, recover from an interrupted connection, and understand what their teammates are doing without replacing a teammate's document with a stale copy.

I built around three priorities:

- **A consistent experience:** familiar navigation, controls, sharing, and history across different kinds of spaces.
- **Collaboration people can see:** live cursors, contextual activity, comments, and drag previews.
- **Recovery people can trust:** local persistence, retry-safe updates, explicit permissions, and guarded version restoration.

## One Workspace, Three Ways to Work

Home provides a clear entry point into the product. Recent helps people return to their work, personal categories organize spaces, and Trash provides a recovery path for deleted content. Search and the command palette make larger workspaces easier to navigate.

![Workspace Home showing shared navigation, workspace counts, recent activity, and organized spaces](/images/workspace/home.png)

*Home, Recent, Trash, and Kanban use the same content width and responsive gutters, making navigation feel consistent.*

### Documents for Shared Understanding

The document editor supports structured writing with headings, lists, checklists, tables, code blocks, and private image attachments. Comments and replies keep discussion close to the work; selected-text anchors help people refer to a specific passage instead of describing its location.

Structured mentions connect comments to the notification inbox. Notifications can take a recipient back to the exact discussion, including a reply or a resolved thread.

![A launch brief in the collaborative document editor with a teammate's comment](/images/workspace/editor.png)

*Writing and feedback sit together, with a shared editor and a dedicated discussion panel.*

### Whiteboards for Exploring Ideas

Whiteboards provide a spatial alternative to a document. Teams can arrange sticky notes, text, shapes, images, drawings, and connectors. Connected arrows follow their shapes, while local pan and zoom let each person explore independently.

The board includes grouping, alignment, styling, undo/redo, and export. The important distinction is between shared content and personal view state: moving a shape is collaborative; changing your zoom should not move anyone else's view.

![A collaborative whiteboard mapping discovery, design, and delivery with connected shapes and sticky notes](/images/workspace/whiteboard.png)

*A customer journey combines a high-level flow with the questions and decisions behind it.*

### Kanban for Turning Decisions into Action

Kanban adds a delivery workflow with **To do, In progress, and Done**. Cards carry descriptions, member assignments, priorities, and due dates. Search, priority filters, My tasks, completion progress, and quick complete/reopen controls help people focus on the next action.

The card form uses an explicit draft: cancelling a new card does not leave an empty task behind. Existing cards save as people edit. Priority uses green, amber, and red alongside text labels, so colour is not the only signal.

Assigning a teammate creates a durable bell notification with a link to the exact card. Self-assignment stays quiet, and retried updates do not produce duplicate alerts.

## Making Collaboration Visible Without Getting in the Way

An early distinction became important: synchronizing the final result is different from showing the interaction as it happens.

A card can move correctly after release while still leaving teammates unaware that someone is dragging it. Workspace therefore sends a small, temporary drag preview: a named outline identifies the held card, and a named insertion marker shows the proposed destination before the drop.

![A teammate's view of a live Kanban drag, showing the held card and proposed drop position](/images/workspace/live-drag.png)

*The receiving user's view shows Roslan dragging a card before its durable position changes.*

The insertion marker stays thin so it does not cover the card being targeted. Preview messages are throttled and validated. A heartbeat keeps a stationary held drag visible, while explicit cleanup and expiry prevent abandoned previews from lingering.

These cues are **presence**, not document content. They do not belong in saved revisions or the durable update log.

## The Architecture Behind the Experience

The stack has clear responsibilities:

| Layer | Responsibility |
| --- | --- |
| Next.js, React, and Tiptap | Application interface, navigation, and rich-text interaction |
| Yjs | Concurrent content changes and conflict resolution |
| IndexedDB and the service worker | Local edits and reopening previously visited spaces during an outage |
| Phoenix and Phoenix Channels | Authentication, authorization, transport, update sequencing, and application workflows |
| PostgreSQL | Durable accounts, permissions, metadata, updates, snapshots, comments, revisions, and notifications |
| Redis | Replaceable PubSub, presence infrastructure, and rate-limit state |
| Trusted Yjs worker | Snapshot compaction, state-vector diffs, and assignment-notification projection |

The browser synchronizes with Phoenix over HTTP and Channels, while keeping local state in IndexedDB. Phoenix coordinates PostgreSQL persistence, Redis PubSub, and the trusted Yjs worker.

Phoenix stores CRDT updates as opaque binary payloads. It authorizes a write, allocates its server sequence transactionally, persists it, and then acknowledges or broadcasts it. Yjs handles how concurrent content changes merge.

Each update has a stable client-generated ID. If a connection drops after the server accepts an update but before the client receives the acknowledgement, the client can retry without creating a second logical update.

## The Engineering Challenges That Shaped the Product

### Reconnecting Without Replacing Someone Else's Work

Offline support needs more than a cached interface. Local changes must survive a reload, and reconnecting clients must merge with the server's snapshot and update tail rather than replace newer content.

Workspace partitions browser persistence by user and space. Previously opened spaces can reopen offline, while the collaboration provider reconciles server state and local work on reconnect. First-time access, uploads, and permission changes still require connectivity.

### Notifications From Collaborative State

Assignment alerts need durable delivery, but temporary drag previews do not. Treating them as the same kind of event would either lose useful notifications or persist unnecessary interaction data.

For assignments, Phoenix writes a PostgreSQL outbox job in the same transaction as the accepted update. The trusted Yjs worker derives assignment transitions in order. Projection progress, alert changes, and job removal commit together, allowing failed processing to retry without duplicating alerts. The queued payloads also preserve pending work when the main update log is compacted.

### History That Does Not Silently Overwrite a Teammate

Named versions can be previewed without changing the live space. A restore is prepared separately and submitted with an expected server sequence. If someone edits before it commits, the restore is rejected for review rather than replacing that newer state.

A successful restore creates a backup of the previous version. Comments, sharing permissions, and the space title remain separate from content restoration.

### Permissions That Apply Beyond the Interface

Owners, editors, commenters, and viewers have different capabilities. Those rules are checked in Phoenix, not just represented by disabled buttons. Membership is rechecked on channel operations and reconnects, and private notification queries use current access.

![Workspace sharing dialog showing people with access and role controls](/images/workspace/sharing.png)

*Sharing makes the access model visible while server-side checks enforce it.*

## A Calm, Consistent Interface

The visual system uses cream surfaces, purple accents, DM Sans interface text, and Newsreader titles. Shared modal headers, field styling, buttons, feedback messages, and responsive spacing help the three space types feel like one product.

Light and dark themes retain the same hierarchy. On mobile, controls wrap and boards stack within the viewport. Motion is purposeful and respects reduced-motion preferences. The bell's refresh animation is limited to two ringing cycles when unread notifications exist, rather than restarting whenever the user changes pages.

| Dark theme | Mobile layout |
| --- | --- |
| <img src="/images/workspace/dark-mode.png" width="640" alt="Kanban board in Workspace’s dark theme"> | <img src="/images/workspace/mobile.png" width="200" alt="Workspace Home on a mobile viewport"> |

## Verification and What I Learned

The project includes automated checks for CRDT convergence, offline replay, duplicate delivery, presence scheduling, role enforcement, snapshot compaction, and notification behavior. Browser scenarios exercise real interactions across independent users, including drag-and-drop, live previews, discussion navigation, and desktop/mobile layouts.

The recorded backend verification includes **104 passing tests**. The project also has optional full-browser and multi-node recovery checks, which run separately from the backend suite.

The biggest lesson was that real-time software needs two kinds of correctness: the data must converge, and the interface must make the current situation understandable. A correct final card position is only part of the experience. People also need to see who is holding the card, where it is going, and whether their work is safely synchronized.

Workspace is a working full-stack project, with room to grow. Kanban currently has three fixed columns, assignment delivery is in-app, and first-time offline access is outside the supported flow. The result demonstrates a connected set of product and engineering decisions: one interface for shared context, backed by explicit ownership, resilient synchronization, and recoverable state.
