---
title: "Workspace: Building a real-time collaboration app"
description: How I built Workspace with Next.js and Elixir, and what I learned about editing together, offline changes, and keeping everyone's work safe.
date: 2026-11-08
image: /images/workspace/kanban.png
minRead: 6
author:
  name: Roslan Saidi
  avatar:
    src: https://avatars.githubusercontent.com/u/13043860?v=4
    alt: Roslan Saidi
---

Workspace is an app I built where people can write documents, draw on a whiteboard, and manage tasks together. The idea is simple: keep the discussion, the plan, and the tasks in the same place.

You can [try Workspace for yourself](https://workspace.roslansaidi.com). Invite a friend and see what happens when you both edit at the same time.

I used **Next.js, React, TypeScript, and Tailwind CSS** for the frontend, with **Elixir/Phoenix** for the backend. For the editor and live changes, I used **Tiptap and Yjs**. PostgreSQL stores the data, Redis handles PubSub and presence, and Docker Compose brings the services together.

There are quite a few parts here. But the main question was pretty simple: what happens when two people change something at the same time? And what happens if one of them loses their connection?

Those questions are where most of the interesting work came from.

*The screenshots in this article are from the running app, using demo accounts and sample content.*

## What can you do in Workspace?

There are three main types of spaces: documents, whiteboards, and Kanban boards.

The home page lists your spaces. There is also Recent to find something you just opened, categories to organise things, and Trash if you need to recover a deleted space.

![Workspace Home showing navigation, recent activity, and spaces](/images/workspace/home.png)

### Write a document together

The editor supports headings, lists, checklists, tables, code blocks, and image attachments. People can edit the same document and leave comments beside it.

You can also select some text and comment on that part. This helps when someone asks for a change. They can point to the exact sentence instead of saying “the paragraph somewhere near the bottom”.

Mentions create a notification, and clicking it brings you back to the discussion.

![A document in Workspace with a teammate's comment](/images/workspace/editor.png)

### Sketch an idea

Sometimes a document is not enough to explain an idea. The whiteboard lets you add sticky notes, shapes, text, images, drawings, and arrows.

Arrows stay connected when you move a shape. You can also group items, align them, undo changes, and export the board.

One detail here: zoom and position belong to each user. If I zoom in to read a sticky note, it should not change your view. But if I move the sticky note itself, everyone should see that change.

![A whiteboard with connected shapes and sticky notes](/images/workspace/whiteboard.png)

### Keep track of tasks

The Kanban board has three columns: **To do, In progress, and Done**. Each card can have a description, an assigned member, a priority, and a due date.

There are filters and a My tasks view to make the board easier to use when more cards are added. Assigning someone sends them an in-app notification with a link to the card. Assigning yourself does not send an alert.

I also kept new cards as drafts until they are created. If you open the form and cancel, it should not leave an empty card on the board. Small thing, but it would be annoying otherwise.

## Showing someone dragging a card

Moving a card sounds straightforward. You drag it, release it, and everyone sees the new position.

But what does the other person see while you are still holding it?

If the app only sends the final position, they have no idea you are moving anything until the card suddenly changes place. So I added a live preview. Other users can see your name on the card you are holding, along with a marker showing where you plan to drop it.

![Another user's view of Roslan dragging a Kanban card](/images/workspace/live-drag.png)

The preview sends small updates at a limited rate. It also sends a regular signal while the card is held, even if the mouse stops moving. If the user disconnects, the preview expires so it does not stay on screen forever.

This is temporary activity. It does not need to be saved in the document history. The final card position does.

## How the updates work

Yjs handles merging changes when people edit at the same time. Phoenix handles the connection, checks permissions, and saves accepted updates to PostgreSQL.

The browser also keeps a local copy in **IndexedDB**. This lets a user keep their edits locally and reopen a space they have visited before when the connection is down.

A separate Yjs worker handles things like combining older updates into snapshots and checking task assignment changes. Redis supports PubSub, presence, and rate limiting.

Each update gets an ID from the browser. That matters when the connection drops at an awkward moment.

For example:

1. You make a change.
2. The server saves it.
3. Your connection drops before the server can confirm it.
4. Your browser sends the same update again after reconnecting.

Without a way to recognise that update, the server could save it twice. Using the same ID lets it recognise the retry.

## What happens when you go offline?

Keeping the page open is only one part of offline support. The harder part is reconnecting without losing what anyone wrote.

Imagine you edit a document offline while your teammate keeps editing online. When you come back, sending your whole copy over theirs would lose their changes. Workspace uses Yjs to merge the changes instead.

Local data is kept separately for each user and space. Previously opened spaces can work offline, but opening a space for the first time still needs a connection. Uploads and permission changes also need to be online.

## A few things that needed extra care

### Sending notifications once

A task assignment should create a notification even if processing fails and needs to retry. But the retry should not send the same alert again.

When Phoenix accepts an update, it saves a notification job in the same database transaction. The Yjs worker checks the assignment changes and processes the job. The notification and the job's completion are saved together, so a failed attempt can be retried safely.

There is more going on behind the bell icon than it first seems.

### Restoring an older version

You can preview a saved version before restoring it. But someone else might still be editing the current version while you are looking at the old one.

The restore checks whether new updates have arrived. If they have, it stops and asks for review. Otherwise, restoring could quietly replace work your teammate just added.

A successful restore also creates a backup of the previous content. Comments, sharing settings, and the space title are kept separately.

### Checking access on the server

Workspace has owners, editors, commenters, and viewers. Hiding an edit button is useful for the interface, but the server still needs to check what each person is allowed to do.

Phoenix checks permissions on channel operations and reconnects. Notifications also check current access, so an old notification does not give someone access to a space they can no longer open.

![The sharing dialog with members and their access roles](/images/workspace/sharing.png)

## The interface

I used cream backgrounds, purple accents, DM Sans for the interface, and Newsreader for titles. Documents, whiteboards, and task boards share the same navigation and controls, so users do not need to learn everything again when switching spaces.

There are light and dark themes, plus layouts for smaller screens. Animations also respect the user's reduced-motion setting.

| Dark theme | Mobile layout |
| --- | --- |
| <img src="/images/workspace/dark-mode.png" width="640" alt="Workspace Kanban board in dark mode"> | <img src="/images/workspace/mobile.png" width="200" alt="Workspace Home on mobile"> |

## What I learned

The backend verification recorded **104 passing tests**. The checks cover things like merging edits, replaying offline changes, duplicate updates, permissions, snapshots, and notifications. There are separate browser and multi-node recovery checks too.

The part that stood out to me was how much happens between making a change and seeing it on another screen. A card can end up in the right place, but the experience still feels confusing if nobody can see who is moving it.

The same goes for saving. People need their work to survive a disconnect, and reconnecting should not mean choosing whose changes to throw away.

There are still limits. Kanban has three fixed columns, notifications stay inside the app, and you cannot open a new space offline. But building Workspace gave me a better understanding of how the editor, the connection, and the database need to work together. Even a small action like assigning a task can involve all three.
