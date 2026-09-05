// Mermaid diyagramları için iki iyileştirme:
//  1. Sayfa içi ölçek: dar diyagramlar sütuna göre biraz büyütülür (en fazla 1.4×),
//     geniş olanlar sütuna sığdırılır (astro-mermaid varsayılanı doğal genişlikte
//     sınırlıyor, geniş diyagramlar küçülüp okunmaz oluyordu).
//  2. "Büyüt" düğmesi / tıklama → tam ekran görüntüleyici: tekerlek ve pinch ile
//     yakınlaştırma, sürükleyerek kaydırma, +/−/Sığdır düğmeleri, Esc ile kapatma.
// Tema değişince astro-mermaid SVG'yi yeniden çizer; wrapper ve dinleyiciler `pre`
// üzerinde olduğu için korunur. Tam ekrandaki kopya `pre.mermaid` olarak klonlanır ki
// global.css'teki tema renkleri (pre.mermaid svg …) orada da geçerli olsun.

const LABELS = {
	tr: {
		open: 'Büyüt',
		zoomIn: 'Yakınlaştır',
		zoomOut: 'Uzaklaştır',
		fit: 'Sığdır',
		close: 'Kapat',
		hint: 'Tekerlek / iki parmak: yakınlaştır · Sürükle: kaydır · Çift tık: yakınlaştır · Esc: kapat',
	},
	en: {
		open: 'Enlarge',
		zoomIn: 'Zoom in',
		zoomOut: 'Zoom out',
		fit: 'Fit',
		close: 'Close',
		hint: 'Wheel / pinch: zoom · Drag: pan · Double-click: zoom · Esc: close',
	},
};

function labels() {
	return (document.documentElement.lang || '').toLowerCase().startsWith('en') ? LABELS.en : LABELS.tr;
}

const EXPAND_ICON =
	'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';

const MAX_INPAGE_SCALE = 1.4;
const MAX_INPAGE_HEIGHT = 820; // dikey diyagramlar büyütülürken bu yüksekliği aşmasın
const PADDING = 32; // pre.mermaid: 1rem padding × 2

function naturalSize(svg: SVGSVGElement): { w: number; h: number } {
	const vb = svg.viewBox?.baseVal;
	if (vb && vb.width > 0 && vb.height > 0) return { w: vb.width, h: vb.height };
	const r = svg.getBoundingClientRect();
	return { w: r.width || 800, h: r.height || 600 };
}

function fitInPage(pre: HTMLElement) {
	const svg = pre.querySelector('svg');
	if (!svg) return;
	const { w, h } = naturalSize(svg);
	const avail = pre.clientWidth - PADDING;
	if (avail <= 0 || w <= 0) return;
	let target = Math.min(avail, w * MAX_INPAGE_SCALE);
	// Dikey diyagramlar: büyütme sayfayı aşırı uzatmasın (doğal boyutun altına da inme).
	if (h > 0 && h * (target / w) > MAX_INPAGE_HEIGHT) {
		target = Math.max(Math.min(w, avail), (w * MAX_INPAGE_HEIGHT) / h);
	}
	svg.style.maxWidth = `${Math.round(target)}px`;
	svg.style.width = '100%';
	svg.style.height = 'auto';
}

function decorate(pre: HTMLElement) {
	if (pre.parentElement?.classList.contains('mm-wrap')) return;
	const L = labels();

	const wrap = document.createElement('div');
	wrap.className = 'mm-wrap';
	pre.parentNode?.insertBefore(wrap, pre);
	wrap.appendChild(pre);

	const btn = document.createElement('button');
	btn.type = 'button';
	btn.className = 'mm-zoom-btn';
	btn.title = L.open;
	btn.setAttribute('aria-label', L.open);
	btn.innerHTML = `${EXPAND_ICON}<span>${L.open}</span>`;
	btn.addEventListener('click', (e) => {
		e.stopPropagation();
		openLightbox(pre, btn);
	});
	wrap.appendChild(btn);

	pre.addEventListener('click', () => openLightbox(pre, btn));

	// astro-mermaid render bitince (ve tema değişip yeniden çizince) ölçeği uygula.
	const mo = new MutationObserver(() => {
		if (pre.hasAttribute('data-processed')) fitInPage(pre);
	});
	mo.observe(pre, { attributes: true, attributeFilter: ['data-processed'] });
	if (pre.hasAttribute('data-processed')) fitInPage(pre);
}

// ---- Tam ekran görüntüleyici ----
type LightboxState = {
	root: HTMLElement;
	stage: HTMLElement;
	canvas: HTMLElement;
	scaleEl: HTMLElement;
	w: number;
	h: number;
	s: number;
	tx: number;
	ty: number;
	fitScale: number;
	minS: number;
	maxS: number;
	trigger: HTMLElement | null;
	prevOverflow: string;
	onKey: (e: KeyboardEvent) => void;
};

let lb: LightboxState | null = null;

function applyTransform() {
	if (!lb) return;
	lb.canvas.style.transform = `translate(${lb.tx}px, ${lb.ty}px) scale(${lb.s})`;
	lb.scaleEl.textContent = `${Math.round(lb.s * 100)}%`;
}

function zoomAt(newS: number, cx: number, cy: number) {
	if (!lb) return;
	const s = Math.min(lb.maxS, Math.max(lb.minS, newS));
	const k = s / lb.s;
	lb.tx = cx - (cx - lb.tx) * k;
	lb.ty = cy - (cy - lb.ty) * k;
	lb.s = s;
	applyTransform();
}

function fitToStage() {
	if (!lb) return;
	const sw = lb.stage.clientWidth;
	const sh = lb.stage.clientHeight;
	const margin = 48;
	// Amaç büyütmek: sığdırırken 1×'in altına inme ihtiyacı olmadıkça 1×'in üstüne çık; ama
	// minik bir diyagramı da 2.5×'ten fazla şişirme.
	const fit = Math.min((sw - margin) / lb.w, (sh - margin * 2) / lb.h);
	lb.fitScale = Math.max(0.2, Math.min(2.5, fit));
	lb.minS = Math.min(0.25, lb.fitScale / 2);
	lb.maxS = Math.max(6, lb.fitScale * 4);
	lb.s = lb.fitScale;
	lb.tx = (sw - lb.w * lb.s) / 2;
	lb.ty = (sh - lb.h * lb.s) / 2;
	applyTransform();
}

function closeLightbox() {
	if (!lb) return;
	const cur = lb;
	lb = null;
	document.removeEventListener('keydown', cur.onKey);
	cur.root.remove();
	document.body.style.overflow = cur.prevOverflow;
	cur.trigger?.focus?.();
}

function openLightbox(pre: HTMLElement, trigger: HTMLElement | null) {
	const svg = pre.querySelector('svg');
	if (!svg) return;
	closeLightbox();
	const L = labels();
	const { w, h } = naturalSize(svg);

	const root = document.createElement('div');
	root.className = 'mm-lightbox';
	root.setAttribute('role', 'dialog');
	root.setAttribute('aria-modal', 'true');
	root.setAttribute('aria-label', L.open);
	root.innerHTML = `
		<div class="mm-lb-stage"><div class="mm-lb-canvas"></div></div>
		<div class="mm-lb-toolbar" role="toolbar">
			<button type="button" data-act="out" aria-label="${L.zoomOut}" title="${L.zoomOut}">−</button>
			<span class="mm-lb-scale" aria-live="polite">100%</span>
			<button type="button" data-act="in" aria-label="${L.zoomIn}" title="${L.zoomIn}">+</button>
			<button type="button" data-act="fit" aria-label="${L.fit}" title="${L.fit}">${L.fit}</button>
			<button type="button" data-act="close" aria-label="${L.close}" title="${L.close}">×</button>
		</div>
		<p class="mm-lb-hint">${L.hint}</p>`;

	const stage = root.querySelector<HTMLElement>('.mm-lb-stage')!;
	const canvas = root.querySelector<HTMLElement>('.mm-lb-canvas')!;
	const scaleEl = root.querySelector<HTMLElement>('.mm-lb-scale')!;

	// Klon: tema CSS'i pre.mermaid seçicilerine bağlı → pre'nin kendisini klonla.
	const clone = pre.cloneNode(true) as HTMLElement;
	clone.removeAttribute('style');
	canvas.style.setProperty('--mm-w', `${w}px`);
	canvas.style.setProperty('--mm-h', `${h}px`);
	canvas.style.width = `${w}px`;
	canvas.style.height = `${h}px`;
	canvas.appendChild(clone);

	const prevOverflow = document.body.style.overflow;
	document.body.style.overflow = 'hidden';
	document.body.appendChild(root);

	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			closeLightbox();
		} else if (e.key === '+' || e.key === '=') {
			zoomAt(lb!.s * 1.25, stage.clientWidth / 2, stage.clientHeight / 2);
		} else if (e.key === '-') {
			zoomAt(lb!.s / 1.25, stage.clientWidth / 2, stage.clientHeight / 2);
		} else if (e.key === '0') {
			fitToStage();
		}
	};
	document.addEventListener('keydown', onKey);

	lb = {
		root,
		stage,
		canvas,
		scaleEl,
		w,
		h,
		s: 1,
		tx: 0,
		ty: 0,
		fitScale: 1,
		minS: 0.25,
		maxS: 6,
		trigger,
		prevOverflow,
		onKey,
	};
	fitToStage();

	// Araç çubuğu
	root.querySelector('.mm-lb-toolbar')!.addEventListener('click', (e) => {
		const b = (e.target as HTMLElement).closest<HTMLElement>('button[data-act]');
		if (!b || !lb) return;
		const cx = stage.clientWidth / 2;
		const cy = stage.clientHeight / 2;
		switch (b.dataset.act) {
			case 'in':
				zoomAt(lb.s * 1.25, cx, cy);
				break;
			case 'out':
				zoomAt(lb.s / 1.25, cx, cy);
				break;
			case 'fit':
				fitToStage();
				break;
			case 'close':
				closeLightbox();
				break;
		}
	});

	// Tekerlek → imleç etrafında yakınlaştır
	stage.addEventListener(
		'wheel',
		(e) => {
			if (!lb) return;
			e.preventDefault();
			const r = stage.getBoundingClientRect();
			const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
			zoomAt(lb.s * factor, e.clientX - r.left, e.clientY - r.top);
		},
		{ passive: false },
	);

	// Sürükleme (tek işaretçi) + pinch (iki işaretçi)
	const pointers = new Map<number, { x: number; y: number }>();
	let dragStart: { x: number; y: number; tx: number; ty: number } | null = null;
	let moved = 0;
	let pinchStart: { dist: number; s: number; cx: number; cy: number } | null = null;

	const stagePoint = (e: PointerEvent) => {
		const r = stage.getBoundingClientRect();
		return { x: e.clientX - r.left, y: e.clientY - r.top };
	};

	stage.addEventListener('pointerdown', (e) => {
		if (!lb) return;
		stage.setPointerCapture(e.pointerId);
		pointers.set(e.pointerId, stagePoint(e));
		moved = 0;
		if (pointers.size === 1) {
			const p = stagePoint(e);
			dragStart = { x: p.x, y: p.y, tx: lb.tx, ty: lb.ty };
			stage.classList.add('dragging');
		} else if (pointers.size === 2) {
			const [a, b] = Array.from(pointers.values());
			pinchStart = {
				dist: Math.hypot(a.x - b.x, a.y - b.y),
				s: lb.s,
				cx: (a.x + b.x) / 2,
				cy: (a.y + b.y) / 2,
			};
			dragStart = null;
		}
	});

	stage.addEventListener('pointermove', (e) => {
		if (!lb || !pointers.has(e.pointerId)) return;
		const p = stagePoint(e);
		pointers.set(e.pointerId, p);
		if (pointers.size === 2 && pinchStart) {
			const [a, b] = Array.from(pointers.values());
			const dist = Math.hypot(a.x - b.x, a.y - b.y);
			if (pinchStart.dist > 0) {
				zoomAt(pinchStart.s * (dist / pinchStart.dist), (a.x + b.x) / 2, (a.y + b.y) / 2);
			}
			moved += 10;
		} else if (dragStart) {
			lb.tx = dragStart.tx + (p.x - dragStart.x);
			lb.ty = dragStart.ty + (p.y - dragStart.y);
			moved += Math.abs(e.movementX) + Math.abs(e.movementY);
			applyTransform();
		}
	});

	const endPointer = (e: PointerEvent) => {
		if (!pointers.has(e.pointerId)) return;
		pointers.delete(e.pointerId);
		if (pointers.size < 2) pinchStart = null;
		if (pointers.size === 0) {
			stage.classList.remove('dragging');
			// Sürüklemeden, boş alana tıklama → kapat
			const onCanvas = (e.target as HTMLElement).closest('.mm-lb-canvas');
			if (moved < 6 && !onCanvas && e.type === 'pointerup') closeLightbox();
			dragStart = null;
		}
	};
	stage.addEventListener('pointerup', endPointer);
	stage.addEventListener('pointercancel', endPointer);

	stage.addEventListener('dblclick', (e) => {
		if (!lb) return;
		const p = stagePoint(e as unknown as PointerEvent);
		const target = lb.s < lb.fitScale * 1.9 ? lb.fitScale * 2 : lb.fitScale;
		zoomAt(target, p.x, p.y);
	});

	root.querySelector<HTMLElement>('button[data-act="close"]')?.focus();
}

function refitAll() {
	document.querySelectorAll<HTMLElement>('pre.mermaid[data-processed]').forEach(fitInPage);
}

export function initMermaidZoom() {
	document.querySelectorAll<HTMLElement>('pre.mermaid').forEach(decorate);

	const w = window as unknown as { __mmZoomBound?: boolean };
	if (!w.__mmZoomBound) {
		w.__mmZoomBound = true;
		let t: number | undefined;
		window.addEventListener('resize', () => {
			window.clearTimeout(t);
			t = window.setTimeout(() => {
				refitAll();
				if (lb) fitToStage();
			}, 120);
		});
		// Sayfa geçişinde açık görüntüleyiciyi temizle (body değişiyor)
		document.addEventListener('astro:before-swap', closeLightbox);
	}
}
