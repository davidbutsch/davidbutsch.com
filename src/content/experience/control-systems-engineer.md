---
title: Control Systems Engineer
subtitle: Texas A&M Solar Car Racing
start: "2025-09"
end: "present"
blurb: Developed vehicle firmware for telemetry broadcast, processing, and display.
tags: [Embedded C, STM32, CAN bus, Node.js]
links:
  - label: www.tamusolar.org
    href: https://www.tamusolar.org/
---

In 2026 I worked on on Texas A&M Solar Car Racing as it built EOS, our first ground-up solar car [in over 20 years](https://www.tamusolar.org/legacy03)!

## What I worked on

On the control systems team I was responsible for collecting and broadcasting vehicle telemetry for the race crew to monitor.

I opted to use STM32's HAL as opposed to the Arduino library. This gave me a chance to work directly with the interrupt service routine flow as opposed to interacting with higher-level APIs.

On the master telemetry board ([designed by my brother!!](https://www.linkedin.com/in/andrew-butsch/)) CAN packets are pushed into a circular queue and we immediately exit from the ISR. During regular processor cycles we pop and forward queue contents to downstream devices for publishing. Specifically, an XBEE for RF, and an IoT equipped Raspberry Pi for HTTP.

For the 2026 car we experimented with an on-board telemetry feedback dashboard as an innovation project. This is what motivated the on-board Raspberry Pi computer. I implemented a local Node.js server to ingest incoming packets from serial. These packets were published to the local display client and an AWS MQTT message topic.

![](https://assets.davidbutsch.com/uploads/IMG_0578.jpg)
<p align="center" style="font-style: italic;">Primitive version of vehicle dashboard</p>

We also had to address dropped packets or out-of-sync packets. Because we are operating at the byte level, it was important to correctly identify and drop malformed data. This is nothing novel, but was definitely a new _type_ of problem for me. A simple sync-byte did the trick.

## What I learned

Solar was an opportunity to formalize my very sparse working knowledge of low-level computer systems. It's not something I thought I would need to know, but it's an intuition that I consider crucial today.

I've also gained an ability to just jump into other projects using electronic technologies. Right now I am actively thinking up ideas to integrate this with my interests in reinforcement learning. Something with drones...

![](https://assets.davidbutsch.com/uploads/745123621_17961557499133908_1728223321788495456_n.jpg)
