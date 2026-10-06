# -*- coding: utf-8 -*-
"""拼装公式卡片图册博文：front matter + 导言 + 降级标题的图册正文 + 结尾链接。"""
import re

import os
HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
BODY = os.path.join(HERE, "formulas_atlas_body.md")
POST = os.path.join(REPO_ROOT, "source", "_posts",
                    "20261006-电子信息专升本-公式卡片图册.md")

with open(BODY, encoding="utf-8") as f:
    body = f.read()

# 标题层级适配博文：先降级章(##第N章 -> ###)，再降级部分(# -> ##)
body = body.replace("\n## 第", "\n### 第").replace("\n# ", "\n## ")

front = """---
title: 电子信息专升本 · 三科核心公式卡片图册（高清图片版）
date: 2026-10-06 15:00:00
tags: [专升本, 电子信息, 公式图册]
categories: 电子信息专升本
---

本篇将备考手册与 12 章学习要点中的全部核心符号表达式（数学/电路/模电/数电公式，共 76 个）按原资料章节顺序整理为高清白底图片，清晰可辨，可直接保存或打印成公式卡片，建议每天通读一遍、考前集中背诵。每张图片为 220 DPI 白底 PNG，公式编号与学习要点章节一一对应。

> 使用建议：先看公式名称回忆内容，再对照图片核验；模电公式注意字母下标（如 R_BE、r_be），数电公式注意撇号（非号）位置。配套文字讲解见各章学习要点，配套题目见各章例题集。

"""

tail = """

---

## 配套资源

- 备考总纲：[考试大纲总览与备考指南](https://su6660.github.io/2026/10/06/20261006-电子信息专升本-00-考试大纲总览与备考指南/)
- 完整文字版：[备考复习手册（完整纲要与学习要点）](https://su6660.github.io/2026/10/06/20261006-电子信息专升本-备考复习手册-完整纲要/)
- 逐章刷题：[例题集标签页](https://su6660.github.io/tags/例题集/) ｜ 全系列：[电子信息专升本分类页](https://su6660.github.io/categories/电子信息专升本/)
"""

with open(POST, "w", encoding="utf-8") as f:
    f.write(front + body.strip() + tail)
print("博文已生成：", POST)
