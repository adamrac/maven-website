/**
 * Marlo motion.
 *
 * The page tells a story top to bottom, and motion is how it paces it:
 *
 *   - one rAF loop every scrubbed effect hangs off (scrolling is native)
 *   - staggered entrance reveals (.reveal), split headlines ([data-split])
 *   - words that brighten as they're scrolled past ([data-scrub])
 *   - a list that lights up line by line ([data-spotlight])
 *   - numbers that count up ([data-count]), strokes that draw (.draw)
 *   - a little parallax ([data-parallax]) and pointer drift ([data-drift])
 *   - magnetic buttons ([data-magnetic]) on fine pointers
 *
 * Everything hiding or moving is gated on prefers-reduced-motion and on the
 * .js-motion class, so if this never runs the page is complete and still.
 */

import { APP_STORE_URL, PLAY_STORE_URL } from '../site';

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

type Tick = () => void;
const ticks: Tick[] = [];
let vh = window.innerHeight;
window.addEventListener('resize', () => (vh = window.innerHeight));

/* ------------------------------------------------------------------- loop */

/** One rAF loop for everything scrubbed. Scrolling itself is the browser's. */
function initLoop() {
  function raf() {
    for (const t of ticks) t();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* -------------------------------------------------------- split headlines */

/** Wraps each word of [data-split] in a mask so it can rise into place. */
function initSplit() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    let i = 0;
    const walk = (node: Node) => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = (child.textContent ?? '').split(/(\s+)/);
          const frag = document.createDocumentFragment();
          for (const part of parts) {
            if (!part) continue;
            if (/^\s+$/.test(part)) {
              frag.append(document.createTextNode(part));
              continue;
            }
            const mask = document.createElement('span');
            mask.className = 'split-word';
            const inner = document.createElement('span');
            inner.textContent = part;
            inner.style.setProperty('--i', String(i++));
            mask.append(inner);
            frag.append(mask);
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
          walk(child);
        }
      }
    };
    // Screen readers get the sentence once, not word by word.
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', el.textContent?.trim() ?? '');
    walk(el);
    el.querySelectorAll('.split-word').forEach((w) => w.setAttribute('aria-hidden', 'true'));
    el.classList.add('is-split');
  });
}

/* ---------------------------------------------------------------- reveals */

function initReveals() {
  const items = document.querySelectorAll<HTMLElement>('.reveal, [data-split], .draw, [data-inview]');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }


  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );
  items.forEach((el) => io.observe(el));

  // Safety net: anything on screen shortly after load is shown.
  window.addEventListener('load', () => {
    setTimeout(() => {
      items.forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.top < vh && b.bottom > 0) el.classList.add('is-in');
      });
    }, 400);
  });
}

/* ------------------------------------------------------------- scrub words */

/** [data-scrub] - each word brightens as the block travels up the screen. */
function initScrub() {
  document.querySelectorAll<HTMLElement>('[data-scrub]').forEach((el) => {
    const words: HTMLElement[] = [];
    const walk = (node: Node) => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          for (const part of (child.textContent ?? '').split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) frag.append(document.createTextNode(part));
            else {
              const s = document.createElement('span');
              s.className = 'scrub-word';
              s.textContent = part;
              words.push(s);
              frag.append(s);
            }
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
          walk(child);
        }
      }
    };
    walk(el);

    ticks.push(() => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      // 0 when the block's top hits 85% of the viewport, 1 when it reaches 35%.
      const p = clamp((vh * 0.85 - r.top) / (vh * 0.5));
      const n = words.length;
      words.forEach((w, i) => {
        const local = clamp(p * (n + 2) - i);
        w.style.setProperty('--o', (0.18 + local * 0.82).toFixed(3));
      });
    });
  });
}

/* ---------------------------------------------------------------- spotlight */

/** [data-spotlight] > li - the line nearest the middle of the screen is lit. */
function initSpotlight() {
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((list) => {
    const items = Array.from(list.children) as HTMLElement[];
    list.classList.add('is-spotlit');
    ticks.push(() => {
      const r = list.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const mid = vh * 0.55;
      let best = 0;
      let bestD = Infinity;
      items.forEach((li, i) => {
        const b = li.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      items.forEach((li, i) => li.classList.toggle('is-lit', i <= best));
      list.style.setProperty('--progress', String((best + 1) / items.length));
    });
  });
}

/* ------------------------------------------------------------------ counts */

/** [data-count="142"] counts up from zero once it's on screen. */
function initCounts() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const to = parseFloat(el.dataset.count || '0');
        const dur = 1600;
        const start = performance.now() + parseFloat(el.dataset.countDelay || '0');
        const step = (now: number) => {
          const t = clamp((now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = String(Math.round(to * eased));
          if (t < 1) requestAnimationFrame(step);
        };
        el.textContent = '0';
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------- parallax */

/** [data-parallax="-0.06"] drifts by n× the element's travel through view. */
function initParallax() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]')).map((el) => ({
    el,
    amount: parseFloat(el.dataset.parallax || '0.08'),
  }));
  if (!items.length) return;

  ticks.push(() => {
    for (const { el, amount } of items) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const p = clamp((vh - r.top) / (vh + r.height));
      el.style.translate = `0 ${((p - 0.5) * 2 * amount * 100).toFixed(2)}px`;
    }
  });
}

/** [data-drift="20"] - elements inside lean gently toward the pointer. */
function initDrift() {
  if (!finePointer()) return;
  document.querySelectorAll<HTMLElement>('[data-drift-area]').forEach((area) => {
    const nodes = Array.from(area.querySelectorAll<HTMLElement>('[data-drift]'));
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0;
    area.addEventListener('pointermove', (e) => {
      const r = area.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
    });
    area.addEventListener('pointerleave', () => (tx = ty = 0));
    ticks.push(() => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      for (const n of nodes) {
        const k = parseFloat(n.dataset.drift || '16');
        n.style.translate = `${(x * k).toFixed(2)}px ${(y * k).toFixed(2)}px`;
      }
    });
  });
}

/* ---------------------------------------------------------------- magnetic */

function initMagnetic() {
  if (!finePointer()) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px`);
      el.style.setProperty('--my', `${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });
}

/* ---------------------------------------------------------- page progress */

function initProgress() {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (!bar) return;
  ticks.push(() => {
    const max = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${clamp(window.scrollY / Math.max(1, max)).toFixed(4)})`;
  });
}

/* ------------------------------------------------------------- download */

/** On a phone, send "Download the app" straight to the right store. */
function initDownloadLinks() {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  const url = ios ? APP_STORE_URL : android ? PLAY_STORE_URL : '';
  if (!url) return;
  document.querySelectorAll<HTMLAnchorElement>('a[data-download]').forEach((a) => {
    a.href = url;
    a.rel = 'noopener';
  });
}

/* -------------------------------------------------------------------- init */

export function initMotion() {
  initDownloadLinks();
  initLoop();
  initProgress();

  if (prefersReduced()) return;

  document.documentElement.classList.add('js-motion', 'js-ready');
  initSplit();
  initScrub();
  // Commit the hidden starting state before anything is revealed, otherwise
  // the browser never sees a "before" and entrances snap instead of animating.
  void document.documentElement.offsetHeight;
  requestAnimationFrame(() => requestAnimationFrame(initReveals));
  initSpotlight();
  initCounts();
  initParallax();
  initDrift();
  initMagnetic();
}
