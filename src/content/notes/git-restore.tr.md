---
title: 'git restore ile çalışma alanını geri al'
description: 'git checkout -- yerine daha okunaklı git restore.'
pubDate: '2026-06-04'
tags: ['git', 'cli']
source: 'https://git-scm.com/docs/git-restore'
---

`git checkout -- dosya` komutunun ne yaptığını her zaman karıştırırdım — dal mı
değiştiriyorum, dosya mı geri alıyorum? Git 2.23'ten beri bunun için ayrı ve
açık bir komut var:

```bash
# Çalışma alanındaki değişiklikleri geri al
git restore dosya.ts

# Stage'den çıkar (ama değişikliği koru)
git restore --staged dosya.ts
```

Niyet artık komutun adından belli. `checkout`'u sadece dal değiştirmek için
kullanıyorum.
