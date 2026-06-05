// "/uses" sayfası verisi — her gün kullandığın donanım, yazılım ve araçlar.
// Düzenlemesi kolay olsun diye saf veri; sayfa bu listeyi render eder.
// İki dilli alanlar { tr, en } biçimindedir.

import type { Locale } from '../i18n/ui';

export interface UseItem {
	name: string;
	desc: { tr: string; en: string };
	url?: string;
}

export interface UseGroup {
	title: { tr: string; en: string };
	icon: 'desktop' | 'code' | 'terminal' | 'wrench' | 'globe';
	items: UseItem[];
}

export const useGroups: UseGroup[] = [
	{
		title: { tr: 'Donanım', en: 'Hardware' },
		icon: 'desktop',
		items: [
			{ name: 'Dizüstü', desc: { tr: 'Günlük geliştirme makinem.', en: 'My daily driver for development.' } },
			{ name: 'Harici monitör', desc: { tr: 'Kod + önizleme için ikinci ekran.', en: 'A second screen for code + preview.' } },
			{ name: 'Mekanik klavye', desc: { tr: 'Uzun yazma seansları için.', en: 'For long typing sessions.' } },
		],
	},
	{
		title: { tr: 'Editör & Terminal', en: 'Editor & Terminal' },
		icon: 'code',
		items: [
			{ name: 'VS Code', desc: { tr: 'Ana editörüm; eklentilerle hafif tuttum.', en: 'My main editor, kept light with extensions.' }, url: 'https://code.visualstudio.com' },
			{ name: 'Zsh', desc: { tr: 'Varsayılan kabuğum.', en: 'My default shell.' } },
			{ name: 'Git', desc: { tr: 'Sürüm kontrolü, her şey için.', en: 'Version control, for everything.' }, url: 'https://git-scm.com' },
		],
	},
	{
		title: { tr: 'Geliştirme', en: 'Development' },
		icon: 'terminal',
		items: [
			{ name: 'Astro', desc: { tr: 'Bu sitenin de üzerinde kurulu olduğu çatı.', en: 'The framework this very site runs on.' }, url: 'https://astro.build' },
			{ name: 'TypeScript', desc: { tr: 'JavaScript yazarken huzur.', en: 'Peace of mind while writing JavaScript.' }, url: 'https://www.typescriptlang.org' },
			{ name: 'Tailwind CSS', desc: { tr: 'Hızlı, tutarlı arayüz.', en: 'Fast, consistent UI.' }, url: 'https://tailwindcss.com' },
			{ name: '.NET', desc: { tr: 'Backend tarafında tercihim.', en: 'My go-to on the backend.' }, url: 'https://dotnet.microsoft.com' },
		],
	},
	{
		title: { tr: 'Araçlar & Servisler', en: 'Tools & Services' },
		icon: 'wrench',
		items: [
			{ name: 'GitHub', desc: { tr: 'Kod, CI/CD ve bu sitenin yayını.', en: 'Code, CI/CD and this site’s hosting.' }, url: 'https://github.com' },
			{ name: 'Docker', desc: { tr: 'Tutarlı ortamlar.', en: 'Consistent environments.' }, url: 'https://www.docker.com' },
			{ name: 'Figma', desc: { tr: 'Hızlı taslak ve tasarım.', en: 'Quick mockups and design.' }, url: 'https://figma.com' },
		],
	},
];

/** Yardımcı: iki dilli alandan aktif dili seç. */
export function pick<T>(field: { tr: T; en: T }, lang: Locale): T {
	return field[lang] ?? field.tr;
}
