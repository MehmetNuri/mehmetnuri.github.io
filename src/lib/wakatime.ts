// WakaTime "son 7 gün" kodlama özetini BUILD ZAMANINDA çeker.
// API anahtarı yalnızca ortam değişkeninden okunur (repoya yazma):
//   WAKATIME_API_KEY=... ./node_modules/.bin/astro build
// Anahtar yoksa / hata olursa null döner ve widget gizlenir.

export interface WakaStat {
	totalText: string;
	languages: { name: string; percent: number; text: string }[];
}

export async function getWakaStats(): Promise<WakaStat | null> {
	const key = import.meta.env.WAKATIME_API_KEY;
	if (!key) return null;
	try {
		const auth = Buffer.from(key).toString('base64');
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 8000);
		const res = await fetch('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
			headers: { Authorization: `Basic ${auth}` },
			signal: ctrl.signal,
		});
		clearTimeout(timer);
		if (!res.ok) return null;
		const json = (await res.json()) as {
			data?: {
				human_readable_total?: string;
				languages?: { name: string; percent: number; text: string }[];
			};
		};
		const d = json.data;
		if (!d) return null;
		return {
			totalText: d.human_readable_total ?? '—',
			languages: (d.languages ?? []).slice(0, 5).map((l) => ({
				name: l.name,
				percent: Math.round(l.percent),
				text: l.text,
			})),
		};
	} catch {
		return null;
	}
}
