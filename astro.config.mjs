// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mermaid from 'astro-mermaid';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginFullscreen } from 'expressive-code-fullscreen';
import ecTwoSlash from 'expressive-code-twoslash';
import robotsTxt from 'astro-robots-txt';
import compress from '@playform/compress';
import pagefind from 'astro-pagefind';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { defineConfig } from 'astro/config';
import { readFileSync, readdirSync } from 'node:fs';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

// Blog yazıları iki dilde FARKLI slug taşır (ör. linux-dosya-sistemi ↔ the-linux-file-system).
// @astrojs/sitemap'in otomatik i18n eşleşmesi yalnızca "aynı yol + /en/ öneki" için çalıştığından
// yazıların hreflang alternatifleri sitemap'e düşmez. translationId (= dosya taban adı) ile eşleyip
// her iki URL'ye de xhtml:link alternatiflerini elle ekliyoruz (çift dilli SEO için kritik).
const SITE_URL = 'https://mehmetnuri.com';
const blogAlternates = (() => {
	const map = new Map();
	const dir = new URL('./src/content/blog/', import.meta.url);
	for (const file of readdirSync(dir)) {
		if (!file.endsWith('.en.mdx')) continue;
		const base = file.slice(0, -'.en.mdx'.length);
		const head = readFileSync(new URL(file, dir), 'utf8').slice(0, 1500);
		const m = head.match(/^slug:\s*['"]?([^'"\n]+?)['"]?\s*$/m);
		const enSlug = (m ? m[1] : base).trim();
		const trUrl = `${SITE_URL}/blog/${base}/`;
		const enUrl = `${SITE_URL}/en/blog/${enSlug}/`;
		const links = [
			{ lang: 'tr-TR', url: trUrl },
			{ lang: 'en-US', url: enUrl },
		];
		map.set(trUrl, links);
		map.set(enUrl, links);
	}
	return map;
})();

// https://astro.build/config
export default defineConfig({
	site: 'https://mehmetnuri.com',
	i18n: {
		defaultLocale: 'tr',
		locales: ['tr', 'en'],
		routing: { prefixDefaultLocale: false },
	},
	integrations: [
		// Mermaid, kod bloklarını işleyen diğer entegrasyonlardan (EC) ÖNCE gelmeli.
		mermaid({
			theme: 'default',
			autoTheme: true,
			// Diyagramlar sütuna sığsın diye düğüm/sıra aralıklarını sıkılaştır (varsayılan 50/50).
			mermaidConfig: {
				flowchart: { nodeSpacing: 28, rankSpacing: 32, padding: 8 },
			},
		}),
		// Expressive Code, mdx()'ten ÖNCE gelmeli.
		expressiveCode({
			themes: ['github-dark', 'github-light'],
			// Site teması (data-theme) ile kod bloğu temasını eşitle.
			themeCssSelector: (theme) => `[data-theme="${theme.type === 'light' ? 'light' : 'dark'}"]`,
			useDarkModeMediaQuery: false,
			plugins: [
				pluginLineNumbers(),
				pluginCollapsibleSections(),
				pluginFullscreen(),
				// Twoslash: yalnızca `twoslash` etiketli TS bloklarında hover tip bilgisi
				ecTwoSlash({ instanceConfigs: { twoslash: { explicitTrigger: true } } }),
			],
			defaultProps: {
				showLineNumbers: true,
				// Terminal/kabuk bloklarında satır numarası gösterme
				overridesByLang: {
					'bash,sh,shell,zsh,ansi,powershell,ps': { showLineNumbers: false },
				},
			},
			styleOverrides: {
				borderRadius: '0.6rem',
				codeFontFamily: 'var(--font-mono)',
			},
		}),
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: 'tr',
				locales: { tr: 'tr-TR', en: 'en-US' },
			},
			changefreq: 'weekly',
			priority: 0.7,
			serialize(item) {
				const u = item.url;
				// Anasayfa en yüksek, içerik yüksek, yardımcı sayfalar düşük öncelik.
				if (/^https?:\/\/[^/]+\/(en\/)?$/.test(u)) item.priority = 1.0;
				else if (/\/(blog|java|red-hat|notes)(\/|$)/.test(u)) item.priority = 0.8;
				else if (/\/(etiket|kategori|archive|page)\//.test(u)) item.priority = 0.5;
				else item.priority = 0.6;
				item.changefreq = 'weekly';
				// Farklı slug'lı blog yazılarına hreflang alternatiflerini ekle.
				const alt = blogAlternates.get(u);
				if (alt && (!item.links || item.links.length === 0)) item.links = alt;
				return item;
			},
		}),
		// robots.txt — AI arama/indeksleme botlarına açık izin (GEO).
		// '*' zaten hepsini kapsar; açık satırlar net bir "tarayın ve referans alın" sinyalidir.
		robotsTxt({
			sitemap: true,
			policy: [
				{ userAgent: '*', allow: '/' },
				// OpenAI / ChatGPT
				{ userAgent: 'GPTBot', allow: '/' },
				{ userAgent: 'OAI-SearchBot', allow: '/' },
				{ userAgent: 'ChatGPT-User', allow: '/' },
				// Anthropic / Claude
				{ userAgent: 'ClaudeBot', allow: '/' },
				{ userAgent: 'Claude-SearchBot', allow: '/' },
				{ userAgent: 'Claude-User', allow: '/' },
				// Perplexity
				{ userAgent: 'PerplexityBot', allow: '/' },
				{ userAgent: 'Perplexity-User', allow: '/' },
				// Google (AI Overviews / Gemini) & diğer Google botları
				{ userAgent: 'Google-Extended', allow: '/' },
				{ userAgent: 'GoogleOther', allow: '/' },
				// Apple, Amazon, Meta
				{ userAgent: 'Applebot-Extended', allow: '/' },
				{ userAgent: 'Amazonbot', allow: '/' },
				{ userAgent: 'Meta-ExternalAgent', allow: '/' },
				// Common Crawl (birçok LLM'i besler), Cohere, DuckDuckGo AI, You.com
				{ userAgent: 'CCBot', allow: '/' },
				{ userAgent: 'cohere-ai', allow: '/' },
				{ userAgent: 'DuckAssistBot', allow: '/' },
				{ userAgent: 'YouBot', allow: '/' },
			],
		}),
		// Çıktıyı (HTML/CSS/JS/SVG) sıkıştır.
		// Görseller Astro/Image ile zaten optimize edildiği için tekrar sıkıştırma.
		compress({ Image: false }),
		// Pagefind arama indeksi — compress'ten SONRA çalışsın (indeks sıkıştırılmasın).
		pagefind(),
	],
	markdown: {
		remarkPlugins: [remarkReadingTime],
		rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
