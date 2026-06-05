import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { extendI18nLoaderSchema, i18nLoader } from 'astro-loader-i18n';

const blog = defineCollection({
	// Dosya adından dili algılar (örn. merhaba.tr.md / merhaba.en.md)
	// ve her girdiye locale + translationId ekler.
	loader: i18nLoader({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
	schema: ({ image }) =>
		extendI18nLoaderSchema(
			z.object({
				title: z.string(),
				description: z.string(),
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				heroImage: z.optional(image()),
				category: z.string().optional(),
				tags: z.array(z.string()).default([]),
				series: z.string().optional(),
				seriesOrder: z.number().optional(),
				// Teknik içerik → JSON-LD'de TechArticle tipi kullanılır.
				tech: z.boolean().optional(),
				// Yazı içi SSS — render edilir ve FAQPage structured data üretir.
				faq: z
					.array(z.object({ q: z.string(), a: z.string() }))
					.optional(),
			}),
		),
});

// Kısa notlar / TIL ("Today I Learned"). Atomik, hızlı yayınlanan parçalar.
// Dosya adı dilini belirler (örn. git-notu.tr.md / git-notu.en.md).
const notes = defineCollection({
	loader: i18nLoader({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/notes' }),
	schema: () =>
		extendI18nLoaderSchema(
			z.object({
				title: z.string(),
				description: z.string().optional(),
				pubDate: z.coerce.date(),
				tags: z.array(z.string()).default([]),
				// İsteğe bağlı kaynak bağlantısı (öğrenmenin geldiği yer).
				source: z.string().url().optional(),
			}),
		),
});

export const collections = { blog, notes };
