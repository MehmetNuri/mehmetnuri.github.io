// Merkezi istemci etkileşimleri — Astro ClientRouter (View Transitions) uyumlu.
// Sayfaya özel başlatma `astro:page-load`'da çalışır; global dinleyiciler bir kez bağlanır.

function openSearch() {
	const m = document.getElementById('search-modal');
	if (!m) return;
	m.classList.remove('hidden');
	m.classList.add('flex');
	document.body.style.overflow = 'hidden';
	setTimeout(() => {
		const i = m.querySelector('input') as HTMLInputElement | null;
		i?.focus();
	}, 60);
}
function closeSearch() {
	const m = document.getElementById('search-modal');
	if (!m) return;
	m.classList.add('hidden');
	m.classList.remove('flex');
	document.body.style.overflow = '';
}

function toggleTheme() {
	const cur = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
	const next = cur === 'light' ? 'dark' : 'light';
	document.documentElement.dataset.theme = next;
	try {
		localStorage.setItem('theme', next);
	} catch {}
	window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
}

function openHelp() {
	const m = document.getElementById('help-modal');
	if (!m) return;
	m.classList.remove('hidden');
	m.classList.add('flex');
	document.body.style.overflow = 'hidden';
}
function closeHelp() {
	const m = document.getElementById('help-modal');
	if (!m) return;
	m.classList.add('hidden');
	m.classList.remove('flex');
	document.body.style.overflow = '';
}

// ---- Komut paleti (⌘K) ----
function paletteSelectable(): HTMLElement[] {
	const list = document.getElementById('cmdk-list');
	if (!list) return [];
	return Array.from(
		list.querySelectorAll<HTMLElement>('a.cmdk-item, button.cmdk-item'),
	).filter((el) => !el.hidden && el.offsetParent !== null);
}

function paletteSetActive(idx: number) {
	const items = paletteSelectable();
	items.forEach((el, i) => {
		if (i === idx) {
			el.setAttribute('aria-selected', 'true');
			el.scrollIntoView({ block: 'nearest' });
		} else {
			el.removeAttribute('aria-selected');
		}
	});
}

function paletteFilter(q: string) {
	const query = q.trim().toLowerCase();
	const list = document.getElementById('cmdk-list');
	if (!list) return;
	list.querySelectorAll<HTMLElement>('.cmdk-item').forEach((el) => {
		const text = (el.getAttribute('data-text') || el.textContent || '').toLowerCase();
		el.hidden = query !== '' && !text.includes(query);
	});
	// Tüm öğeleri gizli olan grupları gizle
	list.querySelectorAll<HTMLElement>('.cmdk-group').forEach((g) => {
		const anyVisible = Array.from(g.querySelectorAll<HTMLElement>('.cmdk-item')).some((i) => !i.hidden);
		g.hidden = !anyVisible;
	});
	const empty = document.getElementById('cmdk-empty');
	if (empty) empty.hidden = paletteSelectable().length > 0;
	paletteSetActive(0);
}

function openPalette() {
	const m = document.getElementById('cmdk-modal');
	if (!m) return;
	m.classList.remove('hidden');
	m.classList.add('flex');
	document.body.style.overflow = 'hidden';
	const input = document.getElementById('cmdk-input') as HTMLInputElement | null;
	if (input) {
		input.value = '';
		setTimeout(() => input.focus(), 50);
	}
	paletteFilter('');
}

function closePalette() {
	const m = document.getElementById('cmdk-modal');
	if (!m) return;
	m.classList.add('hidden');
	m.classList.remove('flex');
	document.body.style.overflow = '';
}

function paletteMove(dir: 1 | -1) {
	const items = paletteSelectable();
	if (!items.length) return;
	const cur = items.findIndex((el) => el.getAttribute('aria-selected') === 'true');
	const next = (cur + dir + items.length) % items.length;
	paletteSetActive(next);
}

function paletteActivate() {
	const items = paletteSelectable();
	const el = items.find((x) => x.getAttribute('aria-selected') === 'true') || items[0];
	el?.click();
}

function initPalette() {
	const list = document.getElementById('cmdk-list');
	const input = document.getElementById('cmdk-input') as HTMLInputElement | null;
	bindOnce(document.getElementById('cmdk-backdrop'), () =>
		document.getElementById('cmdk-backdrop')!.addEventListener('click', closePalette),
	);
	bindOnce(input, () => input!.addEventListener('input', () => paletteFilter(input!.value)));
	bindOnce(list, () =>
		list!.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			// Aksan rengi
			const dot = target.closest<HTMLElement>('.cmdk-accent');
			if (dot) {
				const a = dot.dataset.accent!;
				document.documentElement.dataset.accent = a;
				try {
					localStorage.setItem('accent', a);
				} catch {}
				return;
			}
			const item = target.closest<HTMLElement>('a.cmdk-item, button.cmdk-item');
			if (!item) return;
			const cmd = item.dataset.cmd;
			if (cmd === 'nav') {
				closePalette(); // anchor varsayılan gezinmesi devam eder
				return;
			}
			if (cmd === 'search') {
				closePalette();
				openSearch();
			} else if (cmd === 'theme') {
				toggleTheme();
				closePalette();
			} else if (cmd === 'copy') {
				if (navigator.clipboard) navigator.clipboard.writeText(location.href).catch(() => {});
				closePalette();
			}
		}),
	);
}

function bindOnce(el: HTMLElement | null, fn: () => void) {
	if (el && !el.dataset.bound) {
		el.dataset.bound = '1';
		fn();
	}
}

function initThemeToggle() {
	const btn = document.getElementById('theme-toggle');
	bindOnce(btn, () => btn!.addEventListener('click', toggleTheme));
}

function initSearch() {
	// Üstteki arama düğmesi artık komut paletini açar (arama da onun içinde).
	bindOnce(document.getElementById('search-open'), () =>
		document.getElementById('search-open')!.addEventListener('click', openPalette),
	);
	bindOnce(document.getElementById('search-backdrop'), () =>
		document.getElementById('search-backdrop')!.addEventListener('click', closeSearch),
	);
	bindOnce(document.getElementById('help-backdrop'), () =>
		document.getElementById('help-backdrop')!.addEventListener('click', closeHelp),
	);
}

function initBackToTop() {
	const b = document.getElementById('back-to-top');
	bindOnce(b, () => b!.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })));
}

function initReveal() {
	const els = document.querySelectorAll('[data-reveal]:not(.is-visible)');
	if (!els.length) return;
	if (!('IntersectionObserver' in window)) {
		els.forEach((e) => e.classList.add('is-visible'));
		return;
	}
	const obs = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add('is-visible');
					obs.unobserve(e.target);
				}
			});
		},
		{ rootMargin: '0px 0px -8% 0px' },
	);
	els.forEach((e) => obs.observe(e));
}

function initToc() {
	const links = Array.from(document.querySelectorAll('[data-toc-link]')) as HTMLElement[];
	if (!links.length) return;
	const byId = new Map<string, HTMLElement>();
	links.forEach((l) => byId.set(l.getAttribute('data-toc-link')!, l));
	const heads = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
	if (!heads.length) return;
	const obs = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					links.forEach((l) =>
						l.classList.remove('text-brand-600', 'dark:text-brand-400', 'border-brand-500'),
					);
					byId.get(e.target.id)?.classList.add('text-brand-600', 'dark:text-brand-400', 'border-brand-500');
				}
			});
		},
		{ rootMargin: '-80px 0px -70% 0px' },
	);
	heads.forEach((h) => obs.observe(h));
}

function initCopyLink() {
	const b = document.getElementById('copy-link');
	if (!b || !navigator.clipboard) return;
	bindOnce(b, () =>
		b.addEventListener('click', () => {
			navigator.clipboard.writeText(b.getAttribute('data-url') || '').then(() => {
				const l = b.querySelector('[data-copy-text]');
				if (!l) return;
				l.textContent = b.getAttribute('data-label-copied');
				setTimeout(() => (l.textContent = b.getAttribute('data-label-copy')), 1600);
			});
		}),
	);
}

function initCodeGroups() {
	document.querySelectorAll<HTMLElement>('.code-group').forEach((g) => {
		if (g.dataset.bound) return;
		g.dataset.bound = '1';
		const tabs = Array.from(g.querySelectorAll('.cg-tab'));
		const wrap = g.querySelector('.cg-panels');
		if (!wrap) return;
		const panels = Array.from(wrap.children) as HTMLElement[];
		const show = (i: number) => {
			tabs.forEach((t, j) => t.setAttribute('aria-selected', j === i ? 'true' : 'false'));
			panels.forEach((p, j) => (p.hidden = j !== i));
		};
		tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
		show(0);
	});
}

function initZoom() {
	if (!document.querySelector('.prose img')) return;
	import('medium-zoom').then(({ default: mediumZoom }) => {
		mediumZoom('.prose img:not([data-zoomed])', { background: 'rgba(2, 6, 23, 0.92)', margin: 28 });
		document.querySelectorAll('.prose img').forEach((img) => img.setAttribute('data-zoomed', '1'));
	});
}

function initGiscus() {
	const c = document.getElementById('giscus-container') as HTMLElement | null;
	if (!c || c.dataset.loaded || !c.dataset.giscusRepo) return;
	c.dataset.loaded = '1';
	const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
	const s = document.createElement('script');
	s.src = 'https://giscus.app/client.js';
	s.async = true;
	s.crossOrigin = 'anonymous';
	s.setAttribute('data-repo', c.dataset.giscusRepo);
	s.setAttribute('data-repo-id', c.dataset.giscusRepoId || '');
	s.setAttribute('data-category', c.dataset.giscusCategory || '');
	s.setAttribute('data-category-id', c.dataset.giscusCategoryId || '');
	s.setAttribute('data-mapping', 'pathname');
	s.setAttribute('data-strict', '0');
	s.setAttribute('data-reactions-enabled', '1');
	s.setAttribute('data-input-position', 'top');
	s.setAttribute('data-theme', theme);
	s.setAttribute('data-lang', c.dataset.giscusLang || 'tr');
	c.appendChild(s);
}

function initCountUp() {
	const nums = document.querySelectorAll<HTMLElement>('.stat-num:not([data-counted])');
	if (!nums.length) return;
	if (!('IntersectionObserver' in window)) {
		nums.forEach((n) => {
			n.textContent = (n.dataset.to || '0') + (n.dataset.suffix || '');
			n.dataset.counted = '1';
		});
		return;
	}
	const obs = new IntersectionObserver(
		(entries) => {
			entries.forEach((en) => {
				if (!en.isIntersecting) return;
				const el = en.target as HTMLElement;
				obs.unobserve(el);
				el.dataset.counted = '1';
				const to = parseInt(el.dataset.to || '0', 10);
				const suf = el.dataset.suffix || '';
				const dur = 900;
				const start = performance.now();
				const tick = (now: number) => {
					const p = Math.min(1, (now - start) / dur);
					const eased = 0.5 - Math.cos(p * Math.PI) / 2;
					el.textContent = Math.round(to * eased) + suf;
					if (p < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
			});
		},
		{ rootMargin: '0px 0px -10% 0px' },
	);
	nums.forEach((n) => obs.observe(n));
}

function ensureMainId() {
	const main = document.querySelector('main');
	if (main && !main.id) main.id = 'main-content';
}

function initAccent() {
	const toggle = document.getElementById('accent-toggle');
	const pop = document.getElementById('accent-popover');
	bindOnce(toggle, () =>
		toggle!.addEventListener('click', (e) => {
			e.stopPropagation();
			pop?.classList.toggle('hidden');
		}),
	);
	document.querySelectorAll<HTMLElement>('.accent-dot').forEach((dot) => {
		bindOnce(dot, () =>
			dot.addEventListener('click', () => {
				const a = dot.dataset.accent!;
				document.documentElement.dataset.accent = a;
				try {
					localStorage.setItem('accent', a);
				} catch {}
				pop?.classList.add('hidden');
			}),
		);
	});
}

function pageInit() {
	ensureMainId();
	initAccent();
	initThemeToggle();
	initSearch();
	initPalette();
	initBackToTop();
	initReveal();
	initToc();
	initCopyLink();
	initCodeGroups();
	initZoom();
	initGiscus();
	initCountUp();
}

// Global dinleyiciler (bir kez)
if (!(window as any).__siteBound) {
	(window as any).__siteBound = true;

	document.addEventListener(
		'scroll',
		() => {
			const bar = document.getElementById('reading-progress');
			if (bar) {
				const h = document.documentElement;
				const max = h.scrollHeight - h.clientHeight;
				bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
			}
			const b2t = document.getElementById('back-to-top');
			if (b2t) {
				if (window.scrollY > 500) {
					b2t.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
				} else {
					b2t.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
				}
			}
		},
		{ passive: true },
	);

	// Aksan popover'ını dışarı tıklayınca kapat
	document.addEventListener('click', (e) => {
		const pop = document.getElementById('accent-popover');
		if (!pop || pop.classList.contains('hidden')) return;
		if (!(e.target as HTMLElement).closest('#accent-popover, #accent-toggle')) {
			pop.classList.add('hidden');
		}
	});

	// Kartlarda fare-takipli spotlight
	document.addEventListener(
		'mousemove',
		(e) => {
			const card = (e.target as HTMLElement).closest('.card-hover') as HTMLElement | null;
			if (!card) return;
			const r = card.getBoundingClientRect();
			card.style.setProperty('--mx', `${e.clientX - r.left}px`);
			card.style.setProperty('--my', `${e.clientY - r.top}px`);
		},
		{ passive: true },
	);

	document.addEventListener('keydown', (e) => {
		const typing = /^(input|textarea|select)$/i.test(
			((document.activeElement as HTMLElement)?.tagName) || '',
		);
		const paletteOpen = !document
			.getElementById('cmdk-modal')
			?.classList.contains('hidden');

		// Palet açıkken ok tuşları / Enter ile gezin
		if (paletteOpen) {
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				paletteMove(1);
				return;
			}
			if (e.key === 'ArrowUp') {
				e.preventDefault();
				paletteMove(-1);
				return;
			}
			if (e.key === 'Enter') {
				e.preventDefault();
				paletteActivate();
				return;
			}
		}

		if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			openPalette();
		} else if (e.key === '/' && !typing) {
			e.preventDefault();
			openSearch();
		} else if (e.key === '?' && !typing) {
			e.preventDefault();
			openHelp();
		} else if ((e.key === 't' || e.key === 'T') && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
			toggleTheme();
		} else if (e.key === 'Escape') {
			closeSearch();
			closeHelp();
			closePalette();
			document.getElementById('accent-popover')?.classList.add('hidden');
		}
	});

	// Tema değişince Giscus'u güncelle
	window.addEventListener('themechange', (e) => {
		const t = (e as CustomEvent).detail === 'light' ? 'light' : 'dark';
		const frame = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null;
		frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme: t } } }, 'https://giscus.app');
	});

	// View Transitions sonrası temayı yeniden uygula (yeni sayfanın <html>'i data-theme içermez)
	document.addEventListener('astro:after-swap', () => {
		try {
			const saved = localStorage.getItem('theme');
			document.documentElement.dataset.theme =
				saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
			const accent = localStorage.getItem('accent');
			if (accent) document.documentElement.dataset.accent = accent;
		} catch {
			document.documentElement.dataset.theme = 'dark';
		}
	});
}

document.addEventListener('astro:page-load', pageInit);
