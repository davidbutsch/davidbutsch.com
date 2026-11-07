---
title: Transformer From Scratch
start: "2026-03"
end: "present"
blurb: Implemented a decoder-only transformer in PyTorch and pretrained a 695M-parameter GPT-2-scale model on ~13B tokens of OpenWebText, deployed via vLLM.
tags: [PyTorch, HuggingFace, Numpy, Weights & Biases (W&B), vLLM, CUDA]
links:
  - label: Live Demo
    href: https://chat.davidbutsch.com
  - label: Repository
    href: https://github.com/davidbutsch/PyTorch-Transformer
  - label: 355M Train Logs
    href: https://wandb.ai/dcbutsch-texas-a-m-university/355M-transformer/reports/335M-Pretraining-Finetuning--VmlldzoxNzEyNjAzMQ?accessToken=1rhbinuapefu4at1l15c6pmk2za6prka239er94u8lx0ho6hac0esut2uqd358sz
---

Check out the [live demo](https://chat.davidbutsch.com)!

---

The transformer from scratch project is a response to my reading of the [Attention Is All You Need](https://arxiv.org/pdf/1706.03762) paper. I'd intended to "learn AI" for many years, and I only wish I'd been exposed to this material sooner. It has fundamentally changed my career/academic intentions.

I went into this with no background. A friend had recommended supplementing the paper with [Umar Jamil's video](https://www.youtube.com/watch?v=bCz4OMemCcA) on the topic. I also opted to use [Karpathy's video](https://www.youtube.com/watch?v=zduSFxRajkE) on the original GPT2 tokenizer. All of this is in addition to plenty of other source material (and many claude sessions).

As of writing this (07-29-26) I have completed pretraining of a 695 million parameter model, trained to chinchilla optimal over ~13B tokens from the [openwebtext dataset](https://huggingface.co/datasets/Skylion007/openwebtext). This was roughly 6 weeks of actual compute on a local RTX 3090 24GB.

![](https://assets.davidbutsch.com/uploads/tfs695_logs.png)
<p align="center" style="font-style: italic;">Ignore the messy logs :)</p>

Prior to this, I completed a GPT2-Medium scale model pretrained on ~8B OWT tokens. This one is published in the live demo.

Both models were instruction tuned with the [alpaca-cleaned dataset](https://huggingface.co/datasets/yahma/alpaca-cleaned), although the instruction following capability is... lacking. That's expected at this scale, however. I opted to build everything from the ground up so as to have real working experience with the underlying patterns and technologies at play. This includes things like my incomplete attempt at writing a flash attention kernel ([sauce](https://www.youtube.com/watch?v=LKwyHWYEIMQ)), my own sinusodial positional encoding implementation, or higher level things like experimenting with vLLM for inference optimizations.

This was also my introduction to PyTorch, HuggingFace, Numpy, and W&B. I was taking Linear Algebra at the time of this project and it was really cool being able to apply a lot of working knowledge from lectures in code.

## Next steps

I'm working on hooking up the 695M param model with DINOv2. I've got a lot of the working theory conceptually down from the [LLaVA paper](https://arxiv.org/pdf/2304.08485). Specifically, the linear layer that projects patch tokens to the language space, the pretraining necessary for feature alignment between the two spaces, and the fine-tuning for instruction following with images. I'll be working on pretraining the connector module with the [LLaVA-Pretrain dataset](https://huggingface.co/datasets/liuhaotian/LLaVA-Pretrain) as a next step.

I'm also experimenting with PCA analysis and visualizing DINOv2's raw output representation spreads across multiple images. It's an attempt to reproduce the demonstration from the original paper and to get a feel for how latent spaces "look".

![](https://assets.davidbutsch.com/uploads/tmp7o_3zgfk.PNG)
<p align="center" style="font-style: italic;">DINOv2 PCA Visualization</p>

DINOv2's learned representation for these birds map to a red/pink region of the color space. Conversely, the planes map to a darker blue region. This is despite their similarities (wings, flight, etc). In reality, the intended demonstration should illustrate DINOv2's ability to embed similar sub-features to local neighborhoods. That is, the color for a plane's landing gear should match that of a bird's talon or leg.
