// Basit, güvenli service worker — çevrimdışı okuma için.
// Strateji:
//  - Gezinme (HTML): önce ağ, başarısızsa önbellek (varsa).
//  - Aynı köken statik varlıklar (JS/CSS/font/görsel): stale-while-revalidate.
// Sürüm değişince eski önbellekler temizlenir.

const VERSION = 'v1';
const CACHE = `mn-${VERSION}`;

self.addEventListener('install', (event) => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
			await self.clients.claim();
		})(),
	);
});

self.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;

	const url = new URL(req.url);
	// Yalnızca aynı kökeni yönet; çapraz köken (CDN, gömülüler) doğrudan geçsin.
	if (url.origin !== self.location.origin) return;

	const isNavigation = req.mode === 'navigate';

	if (isNavigation) {
		event.respondWith(
			(async () => {
				try {
					const fresh = await fetch(req);
					const cache = await caches.open(CACHE);
					cache.put(req, fresh.clone());
					return fresh;
				} catch {
					const cached = await caches.match(req);
					return cached || (await caches.match('/')) || Response.error();
				}
			})(),
		);
		return;
	}

	// Statik varlıklar: stale-while-revalidate
	const dest = req.destination;
	if (['style', 'script', 'font', 'image'].includes(dest)) {
		event.respondWith(
			(async () => {
				const cache = await caches.open(CACHE);
				const cached = await cache.match(req);
				const network = fetch(req)
					.then((res) => {
						if (res && res.status === 200) cache.put(req, res.clone());
						return res;
					})
					.catch(() => cached);
				return cached || network;
			})(),
		);
	}
});
