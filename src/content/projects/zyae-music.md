---
title: Zyae Music
start: "2021"
end: "2023"
blurb: Built a microservice-based music streaming app with Redis for message queuing and session management.
tags:
  [
    Typescript,
    Node.js,
    Docker,
    JSON Web Token (JWT),
    Redis,
    MongoDB,
    Nginx,
    Cloudflare,
  ]
links:
  - label: Live Archive
    href: https://music.zyae.net
  - label: Repository
    href: https://github.com/davidbutsch/zyae-music_v3
---

Before I payed for Spotify I used Zyae Music as my own music streaming app.

![](https://assets.davidbutsch.com/uploads/zm_home.png)
<p align="center" style="font-style: italic;">Zyae Music Landing Page</p>

The core of it was scraping YouTube using yt-dlp, parsing out the audio, saving it to disk, and serving that audio back as streamable content. For music metadata, artist pages, albums, playlists, and search, I used a Python library that emulates the YouTube Music Android client to extract access tokens and then parsed usable data from YouTube Music's API.

Everything was locally hosted as I hadn't yet used cloud technologies. Since my parents machine ran windows and I wanted to use Redis, I ended up spinning up a container in Docker. That ended up being my first exposure to both Docker and containerization. Redis did two things for me: a pub/sub for for song load jobs, and a in-memory session database for my local auth implementation. I treated it as a source of truth, and my actual API existed behind an upstream Nginx server. I bounced between JWTs and statefull session management over the years, eventually adopting this pattern with Redis.

This project is also where I learned React, Typescript, SASS, and then later Material-UI. I'm honestly very proud of how good the user experience was.

![](https://assets.davidbutsch.com/uploads/desktop2.png)
<p align="center" style="font-style: italic;">Zyae Music Desktop Application</p>

The whole idea was to automatically download songs to my server's local disk and stream them back. I ended up running it as a PWA on my phone and used it as my actual daily music app for around two years. Eventually YouTube Music changed their API and broke the parsing system. I was already paying for Spotify at that point and never fixed it.

The frontend is still online but everything else has been torn down.
