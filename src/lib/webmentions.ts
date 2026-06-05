// Webmention.io üzerinden bir yazıya gelen etkileşimleri BUILD ZAMANINDA çeker.
// WEBMENTION.domain boşsa veya hata olursa boş sonuç döner (özellik kapalı).

import { WEBMENTION } from '../consts';

export interface Webmention {
	type: 'like' | 'repost' | 'reply' | 'mention';
	author: { name: string; photo: string; url: string };
	url: string;
	content?: string;
	published?: string;
}

export interface WebmentionSummary {
	likes: Webmention[];
	reposts: Webmention[];
	replies: Webmention[];
	mentions: Webmention[];
	total: number;
}

const EMPTY: WebmentionSummary = { likes: [], reposts: [], replies: [], mentions: [], total: 0 };

interface WmEntry {
	'wm-property': string;
	url: string;
	content?: { text?: string };
	published?: string;
	author?: { name?: string; photo?: string; url?: string };
}

/** Webmention'ın etkin olup olmadığını söyler. */
export function webmentionsEnabled(): boolean {
	return Boolean(WEBMENTION.domain);
}

/** webmention.io <link rel="webmention"> uç noktası. */
export function webmentionEndpoint(): string | null {
	if (WEBMENTION.endpoint) return WEBMENTION.endpoint;
	if (!WEBMENTION.domain) return null;
	return `https://webmention.io/${WEBMENTION.domain}/webmention`;
}

const mapType = (p: string): Webmention['type'] => {
	if (p === 'like-of') return 'like';
	if (p === 'repost-of') return 'repost';
	if (p === 'in-reply-to') return 'reply';
	return 'mention';
};

export async function getWebmentions(targetUrl: string): Promise<WebmentionSummary> {
	if (!WEBMENTION.domain) return EMPTY;
	try {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 8000);
		const res = await fetch(
			`https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(targetUrl)}&per-page=100`,
			{ signal: ctrl.signal },
		);
		clearTimeout(timer);
		if (!res.ok) return EMPTY;
		const json = (await res.json()) as { children?: WmEntry[] };
		const out: WebmentionSummary = { likes: [], reposts: [], replies: [], mentions: [], total: 0 };
		for (const e of json.children ?? []) {
			const type = mapType(e['wm-property']);
			const wm: Webmention = {
				type,
				author: {
					name: e.author?.name ?? 'Biri',
					photo: e.author?.photo ?? '',
					url: e.author?.url ?? e.url,
				},
				url: e.url,
				content: e.content?.text,
				published: e.published,
			};
			if (type === 'like') out.likes.push(wm);
			else if (type === 'repost') out.reposts.push(wm);
			else if (type === 'reply') out.replies.push(wm);
			else out.mentions.push(wm);
		}
		out.total = out.likes.length + out.reposts.length + out.replies.length + out.mentions.length;
		return out;
	} catch {
		return EMPTY;
	}
}
