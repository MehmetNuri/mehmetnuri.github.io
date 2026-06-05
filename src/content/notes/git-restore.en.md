---
title: 'Undo working-tree changes with git restore'
description: 'A more readable git restore instead of git checkout --.'
pubDate: '2026-06-04'
tags: ['git', 'cli']
source: 'https://git-scm.com/docs/git-restore'
---

I always confused what `git checkout -- file` actually did — am I switching
branches or discarding a file? Since Git 2.23 there's a dedicated, explicit
command for it:

```bash
# Discard changes in the working tree
git restore file.ts

# Unstage (but keep the change)
git restore --staged file.ts
```

The intent is now obvious from the command name. I keep `checkout` only for
switching branches.
