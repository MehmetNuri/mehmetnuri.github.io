# mehmetnuri.com

Kişisel blogum. [Astro](https://astro.build) ile kuruldu; yazıları **Markdown**
olarak yazıyorum ve `main` dalına `git push` yaptığımda site otomatik olarak
derlenip **GitHub Pages** üzerinden yayınlanıyor.

## Özellikler

- ✍️ Markdown / MDX ile yazı yazma
- 🌍 Çok dilli (Türkçe + İngilizce) — dosya adından dil algılama, dil değiştirici
- 🗂️ Kategoriler ve etiketler (sol sidebar + filtre sayfaları)
- 💬 Yorumlar (Giscus) ve 👍 tepki/beğeni (FeelBack)
- 🌗 Açık & koyu tema (sistem tercihine uyar, üstten değiştirilebilir)
- ✨ Güzel kod blokları — kopyala butonu, tema uyumlu ([Expressive Code](https://expressive-code.com))
- ⏱️ Otomatik okuma süresi · 🔗 başlık çapa bağlantıları
- 🖼️ Yazı başına otomatik OG görseli · 🔎 RSS, sitemap, robots.txt, SEO meta

## Yeni yazı nasıl eklenir?

Yazılar `src/content/blog/` altında durur. **Dil, dosya adının uzantısından önceki
ek ile belirlenir:** `<slug>.tr.md` (Türkçe) ve `<slug>.en.md` (İngilizce).
Aynı `<slug>`'ı paylaşan dosyalar aynı yazının çevirileri sayılır ve dil değiştirici
otomatik birbirine bağlar.

```
src/content/blog/
├── react-notlari.tr.md   →  mehmetnuri.com/blog/react-notlari
└── react-notlari.en.md   →  mehmetnuri.com/en/blog/react-notlari
```

1. Dosyayı oluştur (en az TR; istersen EN çevirisini de ekle).
2. Frontmatter doldur:

   ```markdown
   ---
   title: 'Yazının başlığı'
   description: 'Listelerde ve SEO için kısa açıklama'
   pubDate: '2026-06-04'
   category: 'Genel' # opsiyonel
   tags: ['react', 'web'] # opsiyonel
   # heroImage: '../../assets/kapak.jpg'   # opsiyonel
   # updatedDate: '2026-06-10'             # opsiyonel
   ---

   Yazının içeriği buraya...
   ```

3. Commit edip push'la:

   ```bash
   git add src/content/blog/react-notlari.*.md
   git commit -m "Yeni yazı: React notları"
   git push
   ```

Birkaç dakika içinde yazı yayında olur. Durumu GitHub'daki **Actions** sekmesinden
izleyebilirsin.

> Yalnızca tek dilde yazarsan (örn. sadece `.tr.md`) yazı sadece o dilde yayınlanır.

### Frontmatter alanları

| Alan          | Zorunlu | Açıklama                                  |
| ------------- | ------- | ----------------------------------------- |
| `title`       | ✅      | Yazı başlığı                              |
| `description` | ✅      | Kısa açıklama (liste + SEO)               |
| `pubDate`     | ✅      | Yayın tarihi (örn. `'2026-06-04'`)        |
| `category`    | —       | Kategori (sidebar + /kategori sayfası)    |
| `tags`        | —       | Etiket listesi (sidebar + /etiket sayfası)|
| `updatedDate` | —       | Güncelleme tarihi                         |
| `heroImage`   | —       | Kapak görseli (`src/assets/` içine koy)   |

## Yerelde çalıştırma

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # üretim derlemesi -> dist/
pnpm preview  # derlemeyi yerelde önizle
```

## Proje yapısı

```text
src/
├── assets/            # görseller, fontlar
├── components/        # Header, Footer, Sidebar, PostList, Comments...
├── content/blog/      # ✍️ YAZILAR burada (<slug>.tr.md / <slug>.en.md)
├── i18n/ui.ts         # arayüz çevirileri (TR/EN) ve dil yardımcıları
├── layouts/           # Base.astro, BlogPost.astro
├── lib/               # utils (slug, kategori/etiket) + okuma süresi eklentisi
├── pages/
│   ├── [...locale]/   # tüm sayfalar (TR: /, EN: /en/) — index, about, blog, etiket, kategori
│   ├── open-graph/    # otomatik OG görselleri
│   └── rss.xml.js
├── styles/global.css  # Tailwind + tema (açık/koyu)
└── consts.ts          # site bilgileri + Giscus/FeelBack/GA kimlikleri
public/CNAME           # özel alan adı (mehmetnuri.com)
.github/workflows/deploy.yml  # GitHub Pages otomatik yayın
```

## İsteğe bağlı özellikleri açma

Hepsi `src/consts.ts` içinde; boşken ilgili özellik gizlenir:

- **Yorumlar (Giscus):** [giscus.app](https://giscus.app)'ten repo'yu seç, GitHub
  **Discussions**'ı aç, giscus uygulamasını kur ve `GISCUS` alanlarını doldur.
- **Beğeni/tepki (FeelBack):** [feelback.dev](https://www.feelback.dev) panelinden
  "content set" oluştur, `FEELBACK_CONTENT_SET_ID`'yi gir.
- **Analytics (GA4):** `GA_MEASUREMENT_ID`'ye `G-...` kimliğini gir (yalnızca production).

## Kurulum / Yayın (tek seferlik)

1. **GitHub Pages'i aç:** Repo → Settings → **Pages** → *Source* = **GitHub Actions**.
2. **DNS'i yönlendir** (alan adını GitHub Pages'e bağlamak için):
   - Apex (`mehmetnuri.com`) için A kayıtları:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (ve istersen AAAA: `2606:50c0:8000::153` … `8003::153`)
   - `www` için CNAME: `MehmetNuri.github.io`
3. `main`'e push → Actions çalışır → site yayında.

> Not: `public/CNAME` dosyası `mehmetnuri.com` içerir; GitHub Pages özel alan adını
> bundan okur.
