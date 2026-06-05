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
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

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
		mermaid({ theme: 'default', autoTheme: true }),
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
				else if (/\/(blog|java|notes)(\/|$)/.test(u)) item.priority = 0.8;
				else if (/\/(etiket|kategori|archive|page)\//.test(u)) item.priority = 0.5;
				else item.priority = 0.6;
				item.changefreq = 'weekly';
				return item;
			},
		}),
		robotsTxt(),
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
