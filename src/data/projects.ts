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
		name: 'Keydra',
		desc: {
			tr: 'Redis, Valkey, Aerospike ve TiKV için çok kullanıcılı web konsolu: anahtar tarayıcı, komut konsolu, izleme ve erişim denetimi. Quarkus (Java 21) arka uç, React + PatternFly arayüz, Kubernetes operatörü ve Helm chart ile.',
			en: 'A multi-user web console for Redis, Valkey, Aerospike and TiKV: key browser, command console, monitoring and access control. Quarkus (Java 21) backend, React + PatternFly UI, Kubernetes operator and Helm chart.',
		},
		url: 'https://github.com/keydrahq/keydra',
		repo: 'keydrahq/keydra',
		tags: ['Java', 'Quarkus', 'React', 'PatternFly', 'Kubernetes', 'Redis'],
	},
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
