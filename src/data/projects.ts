// "/projects" sayfası — öne çıkan projeler (elle düzenlenir).
// Bunun altında ayrıca GitHub'dan son depolar otomatik çekilir (src/lib/github.ts).

export interface FeaturedProject {
	name: string;
	desc: { tr: string; en: string };
	url: string;
	repo?: string;
	tags: string[];
}

export const featuredProjects: FeaturedProject[] = [
	{
		name: 'mehmetnuri.com',
		desc: {
			tr: 'Şu an okuduğun site. Astro + Tailwind ile kurulu, iki dilli kişisel blog.',
			en: 'The site you’re reading. A bilingual personal blog built with Astro + Tailwind.',
		},
		url: 'https://mehmetnuri.com',
		repo: 'MehmetNuri/mehmetnuri.com',
		tags: ['Astro', 'TypeScript', 'Tailwind'],
	},
];
