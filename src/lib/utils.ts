import { getCollection, type CollectionEntry } from 'astro:content';
import { type Locale } from '../i18n/ui';

export type Post = CollectionEntry<'blog'>;
export type Note = CollectionEntry<'notes'>;

const TR_MAP: Record<string, string> = {
	ç: 'c',
	ğ: 'g',
	ı: 'i',
	ö: 'o',
	ş: 's',
	ü: 'u',
	Ç: 'c',
	Ğ: 'g',
	İ: 'i',
	Ö: 'o',
	Ş: 's',
	Ü: 'u',
};

/** Türkçe karakterleri de düzgün ele alan URL slug üretici. */
export function slugify(input: string): string {
	return input
		.replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => TR_MAP[ch] ?? ch)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Yazı slug'ını belirler.
 * Frontmatter'da açık bir `slug` verilmişse onu kullanır (ör. EN yazılarda İngilizce
 * slug → /en/blog/flowcharts). Verilmemişse translationId'nin dosya adından türetir.
 * (Astro glob, id'deki noktayı sildiği için id güvenilir değil: merhaba.tr → merhabatr.)
 * translationId tüm diller için aynı kaldığından, slug farklı olsa da TR↔EN
 * hreflang eşleşmesi (getTranslations) bozulmaz.
 */
export function postSlug(post: Post): string {
	if (post.data.slug) return post.data.slug;
	const base = (post.data.translationId || post.id).split('/').pop() || post.id;
	return base.replace(/\.(md|mdx)$/i, '');
}

/** Yazı gövdesinden kabaca okuma süresi (dakika) tahmin eder. */
export function readingMinutes(body?: string): number {
	if (!body) return 1;
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}

/** Aynı dilde, ortak etiket/kategoriye sahip ilgili yazıları getirir. */
export function getRelatedPosts(post: Post, all: Post[], limit = 3): Post[] {
	const tags = new Set(post.data.tags ?? []);
	return all
		.filter((p) => p.id !== post.id)
		.map((p) => {
			let score = 0;
			if (p.data.category && p.data.category === post.data.category) score += 2;
			for (const tag of p.data.tags ?? []) if (tags.has(tag)) score += 1;
			return { p, score };
		})
		.filter((x) => x.score > 0)
		.sort((a, b) => b.score - a.score || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
		.slice(0, limit)
		.map((x) => x.p);
}

/** Belirli bir dildeki yazıları tarihe göre (yeni → eski) getirir. */
export async function getPostsByLocale(locale: Locale): Promise<Post[]> {
	const posts = await getCollection('blog');
	return posts
		.filter((p) => p.data.locale === locale)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Bir not girdisinin URL slug'ı (postSlug ile aynı mantık). */
export function noteSlug(note: Note): string {
	const base = (note.data.translationId || note.id).split('/').pop() || note.id;
	return base.replace(/\.(md|mdx)$/i, '');
}

/** Belirli bir dildeki notları tarihe göre (yeni → eski) getirir. */
export async function getNotesByLocale(locale: Locale): Promise<Note[]> {
	const notes = await getCollection('notes');
	return notes
		.filter((n) => n.data.locale === locale)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Verilen notun diğer dillerdeki sürümlerini döndürür. */
export async function getNoteTranslations(note: Note): Promise<Record<string, string>> {
	const notes = await getCollection('notes');
	const map: Record<string, string> = {};
	for (const n of notes) {
		if (n.data.translationId === note.data.translationId) {
			map[n.data.locale] = noteSlug(n);
		}
	}
	return map;
}

/** Verilen yazının diğer dillerdeki sürümlerini (translationId eşleşmesi) döndürür. */
export async function getTranslations(post: Post): Promise<Record<string, string>> {
	const posts = await getCollection('blog');
	const map: Record<string, string> = {};
	for (const p of posts) {
		if (p.data.translationId === post.data.translationId) {
			map[p.data.locale] = postSlug(p);
		}
	}
	return map;
}

/** Aynı seriye ait yazıları sıraya göre döndürür. */
export function getSeriesPosts(post: Post, all: Post[]): Post[] {
	if (!post.data.series) return [];
	return all
		.filter((p) => p.data.series === post.data.series)
		.sort(
			(a, b) =>
				(a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0) ||
				a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
		);
}

/** Tüm kategorileri ve yazı sayılarını döndürür. */
export function getCategories(posts: Post[]): { name: string; count: number }[] {
	const counts = new Map<string, number>();
	for (const p of posts) {
		if (p.data.category) counts.set(p.data.category, (counts.get(p.data.category) ?? 0) + 1);
	}
	return [...counts.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
}

/** Tüm etiketleri ve yazı sayılarını döndürür. */
export function getTags(posts: Post[]): { name: string; count: number }[] {
	const counts = new Map<string, number>();
	for (const p of posts) {
		for (const t of p.data.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
	}
	return [...counts.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'));
}
