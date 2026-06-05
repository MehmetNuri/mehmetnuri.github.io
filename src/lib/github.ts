// GitHub depolarını BUILD ZAMANINDA çeker (kimlik doğrulamasız genel API).
// Hata / ağ yoksa sessizce boş döner — build asla kırılmaz.

import { GITHUB_USERNAME } from '../consts';

export interface Repo {
	name: string;
	description: string | null;
	url: string;
	stars: number;
	forks: number;
	language: string | null;
	updatedAt: string;
}

interface GhRepo {
	name: string;
	description: string | null;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	language: string | null;
	pushed_at: string;
	fork: boolean;
	archived: boolean;
}

/** Kullanıcının kendi (fork olmayan) depolarını yıldıza göre sıralı getirir. */
export async function getRepos(limit = 6): Promise<Repo[]> {
	if (!GITHUB_USERNAME) return [];
	try {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 8000);
		const res = await fetch(
			`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
			{
				headers: {
					Accept: 'application/vnd.github+json',
					'User-Agent': 'mehmetnuri.com-build',
					// İsteğe bağlı: rate-limit'i artırmak için ortam değişkeniyle token ver.
					...(import.meta.env.GITHUB_TOKEN
						? { Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}` }
						: {}),
				},
				signal: ctrl.signal,
			},
		);
		clearTimeout(timer);
		if (!res.ok) return [];
		const data = (await res.json()) as GhRepo[];
		return data
			.filter((r) => !r.fork && !r.archived)
			.sort((a, b) => b.stargazers_count - a.stargazers_count)
			.slice(0, limit)
			.map((r) => ({
				name: r.name,
				description: r.description,
				url: r.html_url,
				stars: r.stargazers_count,
				forks: r.forks_count,
				language: r.language,
				updatedAt: r.pushed_at,
			}));
	} catch {
		return [];
	}
}

/** Tek bir deponun özetini getirir (GitHubCard bileşeni için). */
export async function getRepo(fullName: string): Promise<Repo | null> {
	try {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 8000);
		const res = await fetch(`https://api.github.com/repos/${fullName}`, {
			headers: {
				Accept: 'application/vnd.github+json',
				'User-Agent': 'mehmetnuri.com-build',
				...(import.meta.env.GITHUB_TOKEN
					? { Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}` }
					: {}),
			},
			signal: ctrl.signal,
		});
		clearTimeout(timer);
		if (!res.ok) return null;
		const r = (await res.json()) as GhRepo;
		return {
			name: fullName,
			description: r.description,
			url: r.html_url,
			stars: r.stargazers_count,
			forks: r.forks_count,
			language: r.language,
			updatedAt: r.pushed_at,
		};
	} catch {
		return null;
	}
}
