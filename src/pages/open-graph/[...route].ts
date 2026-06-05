import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { SITE_TITLE } from '../../consts';

// Her blog yazısı VE her not için otomatik OG (sosyal paylaşım) görseli üret.
const posts = await getCollection('blog');
const notes = await getCollection('notes');
const pages = Object.fromEntries([
	...posts.map((post) => [post.id, { title: post.data.title, description: post.data.description }]),
	...notes.map((note) => [note.id, { title: note.data.title, description: note.data.description ?? '' }]),
]);

export const { getStaticPaths, GET } = await OGImageRoute({
	param: 'route',
	pages,
	getImageOptions: (_path, page) => ({
		title: page.title,
		description: page.description,
		logo: undefined,
		bgGradient: [
			[2, 6, 23],
			[15, 23, 42],
		],
		border: { color: [99, 102, 241], width: 16, side: 'inline-start' },
		padding: 60,
		font: {
			title: { color: [244, 248, 255], weight: 'Bold', size: 64 },
			description: { color: [148, 163, 184], weight: 'Normal', size: 30 },
		},
		fonts: [
			'https://api.fontsource.org/v1/fonts/inter/latin-700-normal.ttf',
			'https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf',
		],
	}),
});
