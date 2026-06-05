import type { APIRoute } from 'astro';
import { getPostsByLocale, getNotesByLocale, postSlug, noteSlug } from '../lib/utils';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { localizePath } from '../i18n/ui';

// llms-full.txt — tüm içeriğin tam metni (AI ajanları için tek dosyada).
// https://llmstxt.org
export const GET: APIRoute = async ({ site }) => {
	const base = site?.href.replace(/\/$/, '') ?? 'https://mehmetnuri.com';
	const posts = await getPostsByLocale('tr');
	const notes = await getNotesByLocale('tr');
	const abs = (p: string) => `${base}${p}`;

	const out: string[] = [];
	out.push(`# ${SITE_TITLE}`);
	out.push('');
	out.push(`> ${SITE_DESCRIPTION}`);
	out.push('');
	out.push('Bu dosya, sitedeki tüm yazıların tam metnini içerir (Türkçe).');
	out.push('');

	for (const p of posts) {
		out.push('---');
		out.push('');
		out.push(`# ${p.data.title}`);
		out.push('');
		out.push(`URL: ${abs(localizePath('tr', `/blog/${postSlug(p)}`))}`);
		out.push(`Tarih: ${p.data.pubDate.toISOString().slice(0, 10)}`);
		if (p.data.tags.length) out.push(`Etiketler: ${p.data.tags.join(', ')}`);
		out.push('');
		out.push((p.body ?? '').trim());
		out.push('');
	}

	for (const n of notes) {
		out.push('---');
		out.push('');
		out.push(`# (Not) ${n.data.title}`);
		out.push('');
		out.push(`URL: ${abs(localizePath('tr', `/notes/${noteSlug(n)}`))}`);
		out.push('');
		out.push((n.body ?? '').trim());
		out.push('');
	}

	return new Response(out.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
