import rss from '@astrojs/rss';
import { getPostsByLocale, getNotesByLocale, postSlug, noteSlug } from './utils';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { ui, type Locale, localizePath } from '../i18n/ui';

/** Belirli bir dil için RSS beslemesi üretir. */
export async function buildFeed(locale: Locale, site: URL | undefined) {
	const posts = await getPostsByLocale(locale);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: site!,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: localizePath(locale, `/blog/${postSlug(post)}/`),
		})),
	});
}

/** Belirli bir dil için JSON Feed (1.1) üretir. */
export async function buildJsonFeed(locale: Locale, site: URL | undefined) {
	const base = site?.href.replace(/\/$/, '') ?? 'https://mehmetnuri.com';
	const posts = await getPostsByLocale(locale);
	const feedPath = locale === 'tr' ? '/feed.json' : `/${locale}/feed.json`;
	const feed = {
		version: 'https://jsonfeed.org/version/1.1',
		title: SITE_TITLE,
		home_page_url: base + (locale === 'tr' ? '/' : `/${locale}/`),
		feed_url: base + feedPath,
		description: SITE_DESCRIPTION,
		language: locale === 'en' ? 'en-US' : 'tr-TR',
		authors: [{ name: SITE_TITLE }],
		items: posts.map((post) => {
			const url = base + localizePath(locale, `/blog/${postSlug(post)}/`);
			return {
				id: url,
				url,
				title: post.data.title,
				summary: post.data.description,
				date_published: post.data.pubDate.toISOString(),
				date_modified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
				tags: post.data.tags,
			};
		}),
	};
	return new Response(JSON.stringify(feed, null, 2), {
		headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
	});
}

/** Belirli bir dil için NOTLAR (TIL) RSS beslemesi üretir. */
export async function buildNotesFeed(locale: Locale, site: URL | undefined) {
	const notes = await getNotesByLocale(locale);
	return rss({
		title: `${SITE_TITLE} — ${ui[locale]['notes.title']}`,
		description: ui[locale]['notes.subtitle'],
		site: site!,
		items: notes.map((note) => ({
			title: note.data.title,
			description: note.data.description ?? note.data.title,
			pubDate: note.data.pubDate,
			link: localizePath(locale, `/notes/${noteSlug(note)}/`),
		})),
	});
}
