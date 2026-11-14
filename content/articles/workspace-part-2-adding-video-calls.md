---
title: "Workspace: Part 2 - Adding video calls"
description: Adding video calls to Workspace with LiveKit and WebRTC.
date: 2026-11-15
image: /images/workspace/video-call-preview.png
minRead: 2
author:
  name: Roslan Saidi
  avatar:
    src: https://avatars.githubusercontent.com/u/13043860?v=4
    alt: Roslan Saidi
---

I added audio and video calls to Workspace. Members can talk while working in a shared document, whiteboard, or task board.

![Workspace's Conversation preview showing a document beside the video call panel.](/images/workspace/video-call-preview.png)

## Using the call

The video button shows how many people are in the call. You can see their names before joining. On mobile, the button is under "More → Video call".

Opening the panel does not turn on your camera or microphone. Both start off, and you choose "Join call" to connect. Invitations also need your approval.

You can minimise the call or move between spaces while staying connected. Each user can only be in one call at a time. Other spaces show "User is busy" if they are already talking elsewhere.

## How I built it

I added LiveKit to handle the calls. It uses WebRTC, which lets browsers send live audio and video.

The app checks whether someone is a member of the space before letting them join. LiveKit handles the media, while shared editing continues through the existing system.

I kept the call outside the individual space page so navigating to another space would not disconnect it.

## Limits

Call quality depends on the internet connection and device. More people with cameras on means more data to send and more work for the server and each device.

There is no single user count that guarantees a smooth call. Video quality, other active calls, and shared server resources all affect capacity. Larger groups need testing before increasing the call limit.

Have a plan to discuss? [Try Workspace](https://workspace.roslansaidi.com) with a friend or teammate. Open a shared space, invite them, and start a call. You can write down decisions, sketch an idea, or turn the next step into a task while you talk.

