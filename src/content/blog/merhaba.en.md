---
title: 'My new blog is live'
description: 'mehmetnuri.com now runs on Astro. I write posts in Markdown and publish them through git — fully in my control.'
pubDate: '2026-06-04'
heroImage: '../../assets/blog-placeholder-3.jpg'
category: 'General'
tags: ['astro', 'blog', 'web']
---

Hi! This is the first post on the new version of the blog. 👋

I no longer write my posts in a web panel — I write them as plain **Markdown files**.
I add a `.md` file to the repo, run `git push`, and the site builds and deploys
automatically. Fast, simple and fully in my control.

## How does it work?

The site is built with [Astro](https://astro.build). The flow is:

1. I add a new `.md` file under `src/content/blog/`.
2. I write the title, description and date (frontmatter) at the top.
3. I run `git push`.
4. GitHub Actions builds and deploys the site.

```mermaid
flowchart LR
    A[Write Markdown] --> B[git push]
    B --> C[GitHub Actions]
    C --> D[Astro build]
    D --> E[GitHub Pages]
    E --> F[mehmetnuri.com]
```

```bash
# A new post
git add src/content/blog/new-post.en.md
git commit -m "New post"
git push
```

## What will I write about?

Mostly these topics:

- Web and software development
- System design and how systems work
- Clean, maintainable code
- Lessons I learn along the way

> This is just the beginning. More to come soon.
