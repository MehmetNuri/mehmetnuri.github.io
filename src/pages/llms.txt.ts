import type { APIRoute } from 'astro';
import { getPostsByLocale, getNotesByLocale, postSlug, noteSlug } from '../lib/utils';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { localizePath } from '../i18n/ui';

// llms.txt — AI ajanlarının siteyi doğru özetlemesi için içerik haritası.
// https://llmstxt.org
export const GET: APIRoute = async ({ site }) => {
	const base = site?.href.replace(/\/$/, '') ?? 'https://mehmetnuri.com';
	const posts = await getPostsByLocale('tr');
	const notes = await getNotesByLocale('tr');

	const abs = (p: string) => `${base}${p}`;

	const lines: string[] = [];
	lines.push(`# ${SITE_TITLE}`);
	lines.push('');
	lines.push(`> ${SITE_DESCRIPTION}`);
	lines.push('');
	lines.push(
		'Bu, Mehmet Nuri Öztürk’ün kişisel sitesidir: yazılım, sistem tasarımı ve öğrenilenler üzerine Türkçe ve İngilizce yazılar. Aşağıda öne çıkan içerikler listelenmiştir.',
	);
	lines.push('');

	lines.push('## Sayfalar');
	lines.push(`- [Anasayfa](${abs('/')})`);
	lines.push(`- [Blog](${abs(localizePath('tr', '/blog'))})`);
	lines.push(`- [Notlar (TIL)](${abs(localizePath('tr', '/notes'))})`);
	lines.push(`- [Projeler](${abs(localizePath('tr', '/projects'))})`);
	lines.push(`- [Hakkımda](${abs(localizePath('tr', '/about'))})`);
	lines.push(`- [Kullandıklarım](${abs(localizePath('tr', '/uses'))})`);
	lines.push(`- [Künye](${abs(localizePath('tr', '/colophon'))})`);
	lines.push('');

	lines.push('## Blog yazıları');
	for (const p of posts) {
		const url = abs(localizePath('tr', `/blog/${postSlug(p)}`));
		lines.push(`- [${p.data.title}](${url}): ${p.data.description}`);
	}
	lines.push('');

	if (notes.length) {
		lines.push('## Notlar');
		for (const n of notes) {
			const url = abs(localizePath('tr', `/notes/${noteSlug(n)}`));
			lines.push(`- [${n.data.title}](${url})${n.data.description ? `: ${n.data.description}` : ''}`);
		}
		lines.push('');
	}

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
