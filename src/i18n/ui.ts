export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';

export const languageNames: Record<Locale, string> = {
	tr: 'Türkçe',
	en: 'English',
};

export const ui = {
	tr: {
		'nav.home': 'Anasayfa',
		'nav.blog': 'Blog',
		'nav.about': 'Hakkımda',
		'nav.search': 'Ara',
		'nav.projects': 'Projeler',
		'nav.notes': 'Notlar',
		'nav.uses': 'Kullandıklarım',
		'nav.now': 'Şu an',
		'nav.bookmarks': 'Yer imleri',
		'nav.archive': 'Arşiv',
		'nav.colophon': 'Künye',
		'nav.more': 'Daha fazla',
		'site.tagline': 'Yazılım meraklısı',
		'site.bio': 'Kod, sistem tasarımı ve öğrendiklerim üzerine yazıyorum.',
		'home.status': 'Yeni projelere açığım',
		'home.eyebrow': 'Merhaba, ben Mehmet Nuri',
		'home.heading.pre': 'Yazılımla uğraşmayı seven bir',
		'home.heading.accent': 'meraklı',
		'home.lede':
			'Kod yazmayı, sistemlerin nasıl çalıştığını anlamayı ve öğrendiklerimi paylaşmayı seviyorum. Bu blogda denediğim şeyleri, çözdüğüm problemleri ve yol boyunca öğrendiklerimi yazıyorum.',
		'home.readPosts': 'Yazıları oku',
		'home.recent': 'Son yazılar',
		'home.all': 'Tümü →',
		'home.empty': 'Henüz yazı yok — çok yakında ilk yazı burada olacak.',
		'blog.title': 'Blog',
		'blog.subtitle': 'Yazılım, sistem tasarımı ve yol boyunca öğrendiklerim.',
		'blog.empty': 'Henüz yazı yok — çok yakında!',
		'sidebar.categories': 'Kategoriler',
		'sidebar.tags': 'Etiketler',
		'sidebar.recent': 'Son yazılar',
		'post.back': '← Tüm yazılar',
		'post.updated': 'Son güncelleme:',
		'post.helpful': 'Bu yazı faydalı oldu mu?',
		'post.comments': 'Yorumlar',
		'post.toc': 'İçindekiler',
		'post.related': 'İlgili yazılar',
		'post.series': 'Seri',
		'post.share': 'Paylaş',
		'post.copy': 'Bağlantıyı kopyala',
		'post.copied': 'Kopyalandı!',
		'post.author.bio': 'Yazılımla uğraşmayı seven biri. Kod, sistem tasarımı ve öğrendiklerim üzerine yazıyorum.',
		'post.readMore': 'Devamını oku →',
		'tag.label': 'Etiket',
		'category.label': 'Kategori',
		'count.posts': 'yazı',
		'reading.suffix': 'dk okuma',
		'footer.rights': 'Tüm hakları saklıdır',
		'pager.prev': '← Önceki',
		'pager.next': 'Sonraki →',
		// Uses (kullandıklarım)
		'uses.title': 'Kullandıklarım',
		'uses.subtitle':
			'Her gün kullandığım donanım, yazılım, geliştirme araçları ve uygulamalar — kurulumumun güncel ve derlenmiş bir listesi.',
		// Now (şu an)
		'now.title': 'Şu an ne yapıyorum',
		'now.subtitle':
			'Hayatımda ve işimde şu sıralar olan biten; üzerinde çalıştığım projeler, öğrendiklerim ve önümüzdeki döneme dair odağım.',
		'now.updated': 'Güncellendi:',
		'now.what': 'Bu bir',
		'now.nowpage': 'now sayfası',
		'now.inspired': 've fikir',
		// Projects (projeler)
		'projects.title': 'Projeler',
		'projects.subtitle':
			'Üzerinde çalıştığım ve katkıda bulunduğum açık kaynak işler; yan projeler, deneyler ve zamanla derlediğim araçlar.',
		'projects.featured': 'Öne çıkanlar',
		'projects.fromGithub': "GitHub'dan son depolar",
		'projects.viewRepo': 'Depoyu gör',
		'projects.viewAll': "Tüm GitHub depoları →",
		'projects.empty': 'Henüz proje eklenmedi.',
		// Colophon (künye)
		'colophon.title': 'Künye',
		'colophon.subtitle': 'Bu site nasıl yapıldı — kullanılan teknolojiler ve kararlar.',
		// Archive (arşiv)
		'archive.title': 'Arşiv',
		'archive.subtitle':
			'Sitedeki tüm yazıların yıllara göre derlenmiş tam listesi; algoritma serisinden kısa notlara kadar yayımladığım her şey tek yerde.',
		'archive.allTags': 'Tüm etiketler',
		'archive.posts': 'yazı',
		// Bookmarks (yer imleri)
		'bookmarks.title': 'Yer imleri',
		'bookmarks.subtitle':
			'Beğendiğim, kaydettiğim ve tavsiye ettiğim bağlantılar; okuduğum yazılar, faydalı araçlar ve geri dönmeye değer kaynaklar.',
		'bookmarks.visit': 'Ziyaret et →',
		// Notes (TIL)
		'notes.title': 'Notlar',
		'notes.subtitle':
			'Kısa notlar ve günlük öğrendiğim küçük şeyler (TIL); tam yazıya dönüşmeyen ipuçları, komutlar ve hızlı keşifler.',
		'notes.empty': 'Henüz not yok — çok yakında!',
		'notes.source': 'Kaynak',
		'notes.back': '← Tüm notlar',
		'notes.all': 'Tümü →',
		// Newsletter (bülten)
		'newsletter.title': 'Bültene abone ol',
		'newsletter.desc': 'Yeni yazılardan haberdar ol. Spam yok, istediğin an çık.',
		'newsletter.placeholder': 'eposta@adresin.com',
		'newsletter.button': 'Abone ol',
		'newsletter.privacy': 'E-postanı kimseyle paylaşmam.',
		// Command palette (komut paleti)
		'cmd.placeholder': 'Sayfa ara veya komut çalıştır…',
		'cmd.nav': 'Git',
		'cmd.actions': 'Aksiyonlar',
		'cmd.searchPosts': 'Yazılarda ara…',
		'cmd.toggleTheme': 'Temayı değiştir',
		'cmd.accent': 'Vurgu rengi:',
		'cmd.copyUrl': 'Bağlantıyı kopyala',
		'cmd.empty': 'Sonuç yok.',
		// Webmention (etkileşimler)
		'wm.title': 'Etkileşimler',
		'wm.likes': 'beğeni',
		'wm.reposts': 'paylaşım',
		'wm.replies': 'Yanıtlar',
		'wm.none': 'Henüz etkileşim yok.',
		'wm.via': 'Bu yazı hakkında bir şey mi yazdın? Bağlantını',
		'wm.send': 'webmention',
		'wm.viaEnd': 'olarak gönder.',
		// WakaTime
		'wakatime.title': 'Kodlama bu hafta',
		'wakatime.thisweek': 'son 7 gün',
	},
	en: {
		'nav.home': 'Home',
		'nav.blog': 'Blog',
		'nav.about': 'About',
		'nav.search': 'Search',
		'nav.projects': 'Projects',
		'nav.notes': 'Notes',
		'nav.uses': 'Uses',
		'nav.now': 'Now',
		'nav.bookmarks': 'Bookmarks',
		'nav.archive': 'Archive',
		'nav.colophon': 'Colophon',
		'nav.more': 'More',
		'site.tagline': 'Software enthusiast',
		'site.bio': 'I write about code, system design and the things I learn.',
		'home.status': 'Available for new projects',
		'home.eyebrow': 'Hi, I’m Mehmet Nuri',
		'home.heading.pre': 'Someone who loves',
		'home.heading.accent': 'building software',
		'home.lede':
			'I enjoy writing code, understanding how systems work and sharing what I learn. On this blog I write about things I try, problems I solve and lessons I pick up along the way.',
		'home.readPosts': 'Read the blog',
		'home.recent': 'Latest posts',
		'home.all': 'All →',
		'home.empty': 'No posts yet — the first one will be here soon.',
		'blog.title': 'Blog',
		'blog.subtitle': 'Software, system design and lessons from the road.',
		'blog.empty': 'No posts yet — coming soon!',
		'sidebar.categories': 'Categories',
		'sidebar.tags': 'Tags',
		'sidebar.recent': 'Latest posts',
		'post.back': '← All posts',
		'post.updated': 'Last updated:',
		'post.helpful': 'Was this post helpful?',
		'post.comments': 'Comments',
		'post.toc': 'Contents',
		'post.related': 'Related posts',
		'post.series': 'Series',
		'post.share': 'Share',
		'post.copy': 'Copy link',
		'post.copied': 'Copied!',
		'post.author.bio': 'Someone who loves building software. I write about code, system design and the things I learn.',
		'post.readMore': 'Read more →',
		'tag.label': 'Tag',
		'category.label': 'Category',
		'count.posts': 'posts',
		'reading.suffix': 'min read',
		'footer.rights': 'All rights reserved',
		'pager.prev': '← Previous',
		'pager.next': 'Next →',
		// Uses
		'uses.title': 'Uses',
		'uses.subtitle':
			'The hardware, software, development tools and apps I use every day — a current, curated rundown of my whole setup and workflow.',
		// Now
		'now.title': 'What I’m doing now',
		'now.subtitle':
			'What’s going on in my life and work right now — the projects I’m focused on, what I’m learning and where my attention goes next.',
		'now.updated': 'Updated:',
		'now.what': 'This is a',
		'now.nowpage': 'now page',
		'now.inspired': 'and the idea',
		// Projects
		'projects.title': 'Projects',
		'projects.subtitle':
			'Open-source work I build and contribute to — side projects, experiments and tools I’ve put together over time.',
		'projects.featured': 'Featured',
		'projects.fromGithub': 'Latest repositories from GitHub',
		'projects.viewRepo': 'View repo',
		'projects.viewAll': 'All GitHub repositories →',
		'projects.empty': 'No projects added yet.',
		// Colophon
		'colophon.title': 'Colophon',
		'colophon.subtitle': 'How this site is built — the tech and the decisions behind it.',
		// Archive
		'archive.title': 'Archive',
		'archive.subtitle':
			'A complete, year-by-year list of everything published on the site — from the algorithms series to short notes, all in one place.',
		'archive.allTags': 'All tags',
		'archive.posts': 'posts',
		// Bookmarks
		'bookmarks.title': 'Bookmarks',
		'bookmarks.subtitle':
			'Links I like, save and recommend — articles worth reading, useful tools and resources I keep coming back to.',
		'bookmarks.visit': 'Visit →',
		// Notes (TIL)
		'notes.title': 'Notes',
		'notes.subtitle':
			'Short notes and small things I learn day to day (TIL) — tips, commands and quick discoveries that don’t need a full post.',
		'notes.empty': 'No notes yet — coming soon!',
		'notes.source': 'Source',
		'notes.back': '← All notes',
		'notes.all': 'All →',
		// Newsletter
		'newsletter.title': 'Subscribe to the newsletter',
		'newsletter.desc': 'Get notified about new posts. No spam, unsubscribe anytime.',
		'newsletter.placeholder': 'you@email.com',
		'newsletter.button': 'Subscribe',
		'newsletter.privacy': 'I’ll never share your email.',
		// Command palette
		'cmd.placeholder': 'Search pages or run a command…',
		'cmd.nav': 'Go to',
		'cmd.actions': 'Actions',
		'cmd.searchPosts': 'Search posts…',
		'cmd.toggleTheme': 'Toggle theme',
		'cmd.accent': 'Accent color:',
		'cmd.copyUrl': 'Copy link',
		'cmd.empty': 'No results.',
		// Webmention
		'wm.title': 'Interactions',
		'wm.likes': 'likes',
		'wm.reposts': 'reposts',
		'wm.replies': 'Replies',
		'wm.none': 'No interactions yet.',
		'wm.via': 'Wrote something about this post? Send your link as a',
		'wm.send': 'webmention',
		'wm.viaEnd': '.',
		// WakaTime
		'wakatime.title': 'Coding this week',
		'wakatime.thisweek': 'last 7 days',
	},
} as const;

export type UIKey = keyof (typeof ui)['tr'];

/** Belirli bir dil için çeviri fonksiyonu döndürür. */
export function useTranslations(lang: Locale) {
	return function t(key: UIKey): string {
		return ui[lang][key] ?? ui[defaultLocale][key];
	};
}

/** URL'den aktif dili çıkarır (örn. /en/blog → 'en'). */
export function getLocaleFromUrl(url: URL): Locale {
	const seg = url.pathname.split('/')[1];
	return (locales as readonly string[]).includes(seg) ? (seg as Locale) : defaultLocale;
}

/** Verilen yola dil önekini ekler (tr → önek yok, en → /en). */
export function localizePath(lang: Locale, path: string): string {
	const p = path.startsWith('/') ? path : `/${path}`;
	if (lang === defaultLocale) return p;
	return p === '/' ? `/${lang}/` : `/${lang}${p}`;
}

/** Aktif yolu başka bir dile çevirir (dil değiştirici için). */
export function pathForLocale(pathname: string, toLang: Locale): string {
	let base = pathname;
	for (const l of locales) {
		if (l === defaultLocale) continue;
		if (base === `/${l}` || base === `/${l}/`) base = '/';
		else if (base.startsWith(`/${l}/`)) base = base.slice(l.length + 1);
	}
	return localizePath(toLang, base);
}

/** Okuma süresini dile göre biçimlendirir. */
export function formatReadingTime(minutes: number, lang: Locale): string {
	return `${minutes} ${ui[lang]['reading.suffix']}`;
}
