---
title: Jot
start: "2025-06"
end: "2025-12"
blurb: Built a real-time collaborative note-taking app with a Tiptap rich-text editor, deployed on AWS Fargate.
tags: [TypeScript, Node.js, React, AWS Fargate, DynamoDB, AWS S3, Cloudflare]
links:
  - label: Client Repository
    href: https://github.com/davidbutsch/jot-client
  - label: API Repository
    href: https://github.com/davidbutsch/jot-api
---

Jot was a proof of concept for shared note-taking. You join a note with a shared code and can publish archived notes.

I built the frontend and API from scratch. The editor is WYSIWYG using Tiptap. Jots can be archived into snapshots states so you can reference or publish an old version later. You can also upload images and other file types for easy file sharing. File contents were uploaded and retreived from S3.

There's no authentication because Jot was intended to host short lived scratch notes. Clear your browser storage and you lose your old notes.

Note contents were stored in DynamoDB, and the backend ran on AWS Fargate. The frontend was static, and Cloudflare sat in front as the CDN.

![](https://assets.davidbutsch.com/uploads/jot_banner.png)
<p align="center" style="font-style: italic;">Jot Product Banner</p>

I actually used this thing quite often during hackathons. It served as a quick and easy dumping grounds for collecting ideas or saving important links.

Also not vibe-coded.
