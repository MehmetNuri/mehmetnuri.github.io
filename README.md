# mehmetnuri.com

Kişisel blogum: Java, sistem tasarımı, DevOps ve Linux üzerine Türkçe ve İngilizce yazılar; yeni
başlayanlar için sıfırdan seriler. [Astro](https://astro.build) ile kurulu, `main`'e push edilince
GitHub Pages üzerinde otomatik yayınlanıyor.

## Seriler

| Seri | Durum | Giriş |
| --- | --- | --- |
| Algoritmalar | 10 bölüm, tamamlandı | [/blog/algoritma-nedir](https://mehmetnuri.com/blog/algoritma-nedir) |
| Java | devam ediyor | [/java](https://mehmetnuri.com/java) |
| Red Hat (RHEL ve Linux sistem yönetimi) | devam ediyor, 15 bölüm planlı | [/red-hat](https://mehmetnuri.com/red-hat) |

## Teknoloji

Astro 6 · MDX · Tailwind CSS v4 · `astro-loader-i18n` (TR/EN içerik) · Expressive Code (kod blokları)
· Mermaid (diyagramlar, tam ekran büyütme ile) · Giscus (yorumlar) · Pagefind (arama).
Build sırasında hreflang, canonical, Open Graph, JSON-LD (TechArticle, FAQPage, Breadcrumb), sitemap,
RSS/JSON feed ve `llms.txt` otomatik üretilir.

## Komutlar

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # üretim derlemesi -> dist/
pnpm preview   # derlemeyi yerelde önizle
```

## İçerik

Yazılar `src/content/blog/` altında, `<slug>.tr.mdx` ve `<slug>.en.mdx` olarak durur; aynı slug'ı
paylaşan dosyalar aynı yazının çevirileridir. EN dosyasına frontmatter'da İngilizce bir `slug` verilir.
Kapak görselleri `src/assets/` içindedir. Frontmatter şeması `src/content.config.ts`'te; yazım
kuralları, sözde kod konvansiyonları ve yeni yazı akışı [`CLAUDE.md`](CLAUDE.md) dosyasında.

## Yapı

```text
src/
├── content/blog/      # yazılar (<slug>.tr.mdx / <slug>.en.mdx)
├── assets/            # kapak ve içerik görselleri
├── components/        # Header, Footer, Callout, Figure, Steps, ...
├── layouts/           # Base.astro, BlogPost.astro
├── pages/[...locale]/ # tüm sayfalar (TR: /, EN: /en/), seri hub'ları: java, red-hat
├── scripts/           # istemci etkileşimleri (tema, arama, mermaid büyütme)
├── i18n/ui.ts         # arayüz çevirileri
└── consts.ts          # site bilgileri, Giscus ve analytics kimlikleri
```

## Yayın

`.github/workflows/deploy.yml` her push'ta siteyi derleyip GitHub Pages'e gönderir ve sitemap
URL'lerini IndexNow'a bildirir. Özel alan adı `public/CNAME` dosyasından okunur.
