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
			{ name: 'RHEL 10 Workstation', desc: { tr: 'Red Hat Enterprise Linux 10, GNOME masaüstü.', en: 'Red Hat Enterprise Linux 10, GNOME desktop.' }, url: 'https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux' },
			{ name: 'Harici monitör', desc: { tr: 'Kod + önizleme için ikinci ekran.', en: 'A second screen for code + preview.' } },
			{ name: 'Mekanik klavye', desc: { tr: 'Uzun yazma seansları için.', en: 'For long typing sessions.' } },
		],
	},
	{
		title: { tr: 'Editör & Terminal', en: 'Editor & Terminal' },
		icon: 'code',
		items: [
			{ name: 'JetBrains IDE’leri', desc: { tr: 'Ana geliştirme ortamım — özellikle IntelliJ IDEA.', en: 'My main dev environment — IntelliJ IDEA in particular.' }, url: 'https://www.jetbrains.com' },
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
			{ name: 'Java', desc: { tr: 'Backend tarafında ana dilim (JVM).', en: 'My main backend language (JVM).' }, url: 'https://dev.java' },
			{ name: 'Spring Boot', desc: { tr: 'Backend servislerini hızlı kurmak için.', en: 'For spinning up backend services fast.' }, url: 'https://spring.io/projects/spring-boot' },
			{ name: 'Quarkus', desc: { tr: 'Hızlı açılış ve düşük bellek için Supersonic Java.', en: 'Supersonic Java for fast startup and low memory.' }, url: 'https://quarkus.io' },
		],
	},
	{
		title: { tr: 'Araçlar & Servisler', en: 'Tools & Services' },
		icon: 'wrench',
		items: [
			{ name: 'GitHub', desc: { tr: 'Kod, CI/CD ve bu sitenin yayını.', en: 'Code, CI/CD and this site’s hosting.' }, url: 'https://github.com' },
			{ name: 'Podman', desc: { tr: 'Konteynerler için — daemonsız, Docker uyumlu.', en: 'For containers — daemonless, Docker-compatible.' }, url: 'https://podman.io' },
			{ name: 'Figma', desc: { tr: 'Hızlı taslak ve tasarım.', en: 'Quick mockups and design.' }, url: 'https://figma.com' },
		],
	},
];

/** Yardımcı: iki dilli alandan aktif dili seç. */
export function pick<T>(field: { tr: T; en: T }, lang: Locale): T {
	return field[lang] ?? field.tr;
}
