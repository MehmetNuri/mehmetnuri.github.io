import {
	SITE_TITLE,
	SITE_DESCRIPTION,
	AUTHOR_NAME,
	SOCIAL_PROFILES,
	AUTHOR_JOB_TITLE,
	AUTHOR_KNOWS_ABOUT,
} from '../consts';

const SCHEMA = 'https://schema.org';

/** Site sahibi (Person) — E-E-A-T: jobTitle, knowsAbout, sameAs. */
export function personSchema(siteUrl: string, lang: 'tr' | 'en' = 'tr') {
	return {
		'@context': SCHEMA,
		'@type': 'Person',
		'@id': `${siteUrl}#person`,
		name: AUTHOR_NAME,
		url: siteUrl,
		jobTitle: AUTHOR_JOB_TITLE[lang],
		knowsAbout: AUTHOR_KNOWS_ABOUT,
		sameAs: SOCIAL_PROFILES.filter(Boolean),
	};
}

/** Site geneli (WebSite). */
export function websiteSchema(siteUrl: string, lang: string) {
	return {
		'@context': SCHEMA,
		'@type': 'WebSite',
		'@id': `${siteUrl}#website`,
		url: siteUrl,
		name: SITE_TITLE,
		description: SITE_DESCRIPTION,
		inLanguage: lang,
		publisher: { '@id': `${siteUrl}#person` },
	};
}

/** Blog ana sayfası (Blog) — yazı listesiyle. */
export function blogSchema(
	siteUrl: string,
	blogUrl: string,
	lang: string,
	posts: { url: string; title: string; datePublished: string }[],
) {
	return {
		'@context': SCHEMA,
		'@type': 'Blog',
		'@id': `${blogUrl}#blog`,
		url: blogUrl,
		name: SITE_TITLE,
		description: SITE_DESCRIPTION,
		inLanguage: lang,
		isPartOf: { '@id': `${siteUrl}#website` },
		author: { '@id': `${siteUrl}#person` },
		blogPost: posts.map((p) => ({
			'@type': 'BlogPosting',
			headline: p.title,
			url: p.url,
			datePublished: p.datePublished,
		})),
	};
}

/** Liste / arşiv sayfaları (CollectionPage) — etiket, kategori, arşiv. */
export function collectionPageSchema(input: {
	url: string;
	name: string;
	description: string;
	lang: string;
	siteUrl: string;
}) {
	return {
		'@context': SCHEMA,
		'@type': 'CollectionPage',
		'@id': `${input.url}#collection`,
		url: input.url,
		name: input.name,
		description: input.description,
		inLanguage: input.lang,
		isPartOf: { '@id': `${input.siteUrl}#website` },
	};
}

interface BlogPostingInput {
	url: string;
	title: string;
	description: string;
	image: string;
	datePublished: string;
	dateModified?: string;
	lang: string;
	siteUrl: string;
	keywords?: string[];
	wordCount?: number;
	articleSection?: string;
	/** Teknik içerik için BlogPosting yerine TechArticle tipi kullan. */
	tech?: boolean;
}

/** Tek bir blog yazısı (BlogPosting/TechArticle) — zengin sonuçlar için. */
export function blogPostingSchema(input: BlogPostingInput) {
	return {
		'@context': SCHEMA,
		'@type': input.tech ? 'TechArticle' : 'BlogPosting',
		'@id': `${input.url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
		headline: input.title,
		description: input.description,
		image: [input.image],
		datePublished: input.datePublished,
		dateModified: input.dateModified ?? input.datePublished,
		inLanguage: input.lang,
		...(input.keywords && input.keywords.length ? { keywords: input.keywords.join(', ') } : {}),
		...(input.wordCount ? { wordCount: input.wordCount } : {}),
		...(input.articleSection ? { articleSection: input.articleSection } : {}),
		isPartOf: { '@id': `${input.siteUrl}#website` },
		author: { '@type': 'Person', '@id': `${input.siteUrl}#person`, name: AUTHOR_NAME, url: input.siteUrl },
		publisher: { '@id': `${input.siteUrl}#person` },
	};
}

/** Sık sorulan sorular (FAQPage) — yazı içi SSS bölümü için. */
export function faqSchema(items: { q: string; a: string }[]) {
	return {
		'@context': SCHEMA,
		'@type': 'FAQPage',
		mainEntity: items.map((it) => ({
			'@type': 'Question',
			name: it.q,
			acceptedAnswer: { '@type': 'Answer', text: it.a },
		})),
	};
}

/** Adım adım rehber (HowTo) — eğitim/tutorial yazıları için. */
export function howToSchema(input: { name: string; steps: { name: string; text: string }[] }) {
	return {
		'@context': SCHEMA,
		'@type': 'HowTo',
		name: input.name,
		step: input.steps.map((s, i) => ({
			'@type': 'HowToStep',
			position: i + 1,
			name: s.name,
			text: s.text,
		})),
	};
}

/** Breadcrumb (Anasayfa > Blog > Yazı). */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
	return {
		'@context': SCHEMA,
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url,
		})),
	};
}
