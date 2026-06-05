// "/bookmarks" sayfası — beğendiğin/tavsiye ettiğin bağlantılar (elle düzenlenir).

export interface Bookmark {
	title: string;
	url: string;
	desc: { tr: string; en: string };
	category: { tr: string; en: string };
}

export const bookmarks: Bookmark[] = [
	{
		title: 'Astro Docs',
		url: 'https://docs.astro.build',
		desc: {
			tr: 'Astro öğrenirken sürekli döndüğüm kaynak.',
			en: 'The reference I keep coming back to while learning Astro.',
		},
		category: { tr: 'Dokümantasyon', en: 'Documentation' },
	},
	{
		title: 'MDN Web Docs',
		url: 'https://developer.mozilla.org',
		desc: {
			tr: 'Web platformu için tek doğru kaynak.',
			en: 'The single source of truth for the web platform.',
		},
		category: { tr: 'Dokümantasyon', en: 'Documentation' },
	},
	{
		title: 'System Design Primer',
		url: 'https://github.com/donnemartin/system-design-primer',
		desc: {
			tr: 'Sistem tasarımına başlamak için kapsamlı bir derleme.',
			en: 'A comprehensive starting point for system design.',
		},
		category: { tr: 'Öğrenme', en: 'Learning' },
	},
];
