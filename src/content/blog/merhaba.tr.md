---
title: 'Yeni blogum yayında'
description: 'mehmetnuri.com artık Astro ile çalışıyor. Yazıları Markdown olarak yazıp git ile yayınlıyorum — tamamen kendi kontrolümde.'
pubDate: '2026-06-04'
heroImage: '../../assets/blog-placeholder-3.jpg'
category: 'Genel'
tags: ['astro', 'blog', 'web']
series: 'Bu siteyi kurarken'
seriesOrder: 1
---

Merhaba! Bu, blogun yeni halindeki ilk yazı. 👋

Artık yazılarımı bir web panelinden değil, doğrudan **Markdown dosyaları** olarak
yazıyorum. Repoya bir `.md` dosyası ekleyip `git push` yaptığımda site otomatik
olarak derlenip yayına alınıyor. Hızlı, sade ve tamamen kendi kontrolümde.

## Nasıl çalışıyor?

Site [Astro](https://astro.build) ile kuruldu. Akış şöyle:

1. `src/content/blog/` altına yeni bir `.md` dosyası ekliyorum.
2. Dosyanın başına başlık, açıklama ve tarih (frontmatter) yazıyorum.
3. `git push` yapıyorum.
4. GitHub Actions siteyi derleyip yayınlıyor.

```mermaid
flowchart LR
    A[Markdown yaz] --> B[git push]
    B --> C[GitHub Actions]
    C --> D[Astro build]
    D --> E[GitHub Pages]
    E --> F[mehmetnuri.com]
```

```bash
# Yeni yazı
git add src/content/blog/yeni-yazi.md
git commit -m "Yeni yazı"
git push
```

## Neler yazacağım?

Bu blogda ağırlıklı olarak şu konularda yazacağım:

- Web ve yazılım geliştirme
- Sistem tasarımı ve sistemlerin nasıl çalıştığı
- Sürdürülebilir, temiz kod
- Yol boyunca öğrendiklerim

> Bu yazı bir başlangıç. Devamı yakında gelecek.
