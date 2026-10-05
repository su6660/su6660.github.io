---
title: hexo博客的生成
date: 2026-10-05 23:43:59
tags:
  - Hexo
---

Hexo 的博客是「生成」出来的：我们写的是 Markdown 源文件，`hexo generate` 会把这些源文件渲染成一堆静态 HTML 页面，输出到 `public/` 目录，再把目录部署到服务器或 GitHub Pages 上。

## 生成做了什么

运行 `hexo generate`（简写 `hexo g`）时，Hexo 大致会做这几步：

1. **读取源文件**：扫描 `source/_posts` 下的 Markdown 文件，以及 `source` 下的页面。
2. **解析 Front-matter**：读取每篇文章开头 `---` 之间的元信息，比如 `title`、`date`、`tags`。
3. **渲染正文**：用渲染引擎（如 marked）把 Markdown 转成 HTML。
4. **套用主题**：把渲染结果填充进主题模板，生成最终页面。
5. **输出到 public**：把生成的 HTML、CSS、JS、图片等写入 `public/` 目录。

## 常用命令

| 命令 | 作用 |
|------|------|
| `hexo clean` | 清空 `public/` 和缓存数据库 `db.json` |
| `hexo generate` | 重新生成静态文件 |
| `hexo server` | 本地预览 |
| `hexo deploy` | 部署到远程 |

## 生成结果

生成完成后，`public/` 目录里会有：

- `index.html`：首页
- `archives/`：归档页
- `categories/`、`tags/`：分类和标签页
- 每篇文章对应的 `年/月/日/标题/index.html`

把整个 `public/` 目录推到 GitHub Pages 的 `main` 分支，博客就上线了。