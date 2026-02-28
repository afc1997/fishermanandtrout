(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function ready(fn) {
    if (typeof gsap === 'undefined') {
      window.addEventListener('load', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    gsap.registerPlugin(ScrollTrigger);
    initCursor();
    initNav();
    initHero();
    initScrollReveal();
    initOverlay();
    initFooter();
  });

  // ─── CURSOR ──────────────────────────────────────────────────────
  function initCursor() {
    const dot  = $('#cursor-dot');
    const ring = $('#cursor-ring');
    if (!dot || window.matchMedia('(hover: none)').matches) {
      if (dot)  dot.style.display  = 'none';
      if (ring) ring.style.display = 'none';
      return;
    }

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const xDot  = gsap.quickTo(dot,  'x', { duration: 0.12, ease: 'power3.out' });
    const yDot  = gsap.quickTo(dot,  'y', { duration: 0.12, ease: 'power3.out' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.5,  ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.5,  ease: 'power3.out' });

    window.addEventListener('mousemove', function (e) {
      xDot(e.clientX);  yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    });

    // Fade in on first move
    window.addEventListener('mousemove', function show() {
      gsap.to([dot, ring], { opacity: 1, duration: 0.4 });
      window.removeEventListener('mousemove', show);
    }, { once: true });

    // Ring expands on interactive elements
    const targets = 'a, button, .project-card, .ondeck-row, [role="button"]';
    $$(targets).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to(ring, { scale: 2.2, duration: 0.35, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(ring, { scale: 1, duration: 0.35, ease: 'power2.out' });
      });
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', function () {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    });
    document.addEventListener('mouseenter', function () {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    });
  }

  // ─── NAV — hide on scroll down, show on scroll up ────────────────
  function initNav() {
    const nav = $('#site-nav');
    let lastY = 0;
    let ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        const y = window.scrollY;
        if (y > 80 && y > lastY) {
          nav.classList.add('nav-hidden');
        } else {
          nav.classList.remove('nav-hidden');
        }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });

    // Smooth-scroll nav + arrow links
    $$('.nav-links a, .scroll-arrow').forEach(function (el) {
      el.addEventListener('click', function (e) {
        const href = el.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        nav.classList.remove('nav-hidden');
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ─── HERO ────────────────────────────────────────────────────────
  function initHero() {
    gsap.to('.scroll-arrow', {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.9,
    });
  }

  // ─── SCROLL REVEAL ───────────────────────────────────────────────
  function initScrollReveal() {
    $$('.project-card').forEach(function (card, i) {
      gsap.fromTo(card,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.65,
          ease: 'power3.out',
          delay: (i % 4) * 0.08,
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    $$('.ondeck-row').forEach(function (row, i) {
      gsap.fromTo(row,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          delay: i * 0.05,
          scrollTrigger: {
            trigger: row,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }

  // ─── OVERLAY ────────────────────────────────────────────────────
  function initOverlay() {
    $$('.project-card').forEach(function (card) {
      card.addEventListener('click', function () { openOverlay(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openOverlay(card); }
      });
    });

    $('#overlay-close').addEventListener('click', closeOverlay);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('#project-overlay').classList.contains('is-open')) {
        closeOverlay();
      }
    });
  }

  function openOverlay(card) {
    const overlay    = $('#project-overlay');
    const videoWrap  = $('#overlay-video-wrap');
    const stillsEl   = $('#overlay-stills');
    const infoEl     = $('#overlay-info');

    const title    = card.dataset.title    || '';
    const year     = card.dataset.year     || '';
    const type     = card.dataset.type     || '';
    const status   = card.dataset.status   || '';
    const logline  = card.dataset.logline  || '';
    const festival = card.dataset.festival || '';
    const vimeo    = card.dataset.vimeo    || '';
    const vimeoHash = card.dataset.vimeoHash || '';
    const stills   = card.dataset.stills ? card.dataset.stills.split('|') : [];

    // Video
    if (vimeo) {
      const h = vimeoHash ? `&h=${vimeoHash}` : '';
      videoWrap.innerHTML = `<iframe
        src="https://player.vimeo.com/video/${vimeo}?autoplay=1&loop=0&title=0&byline=0&portrait=0${h}"
        allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      videoWrap.style.display = '';
    } else {
      videoWrap.innerHTML = '';
      videoWrap.style.display = 'none';
    }

    // Stills
    if (stills.length) {
      stillsEl.innerHTML = stills.map(function (src) {
        return `<div class="overlay-still"><img src="${src}" alt="" loading="lazy" /></div>`;
      }).join('');
      stillsEl.style.display = '';
    } else {
      stillsEl.innerHTML = '';
      stillsEl.style.display = 'none';
    }

    // Info
    const statusLabel = status === 'completed' ? 'Completed' : 'In Development';
    const yearRow = year ? `<span class="overlay-label">Year</span><span class="overlay-value">${year}</span>` : '';
    const festivalRow = festival ? `<span class="overlay-label">Festivals</span><span class="overlay-value">${festival}</span>` : '';
    const loglineRow = logline ? `<span class="overlay-label">Logline</span><span class="overlay-value">${logline}</span>` : '';

    infoEl.innerHTML = `
      <div class="overlay-title-block">
        <span class="overlay-title">${title}</span>
        <span class="overlay-type">${type} · ${statusLabel}</span>
      </div>
      ${yearRow}${festivalRow}${loglineRow}
    `;

    document.body.style.overflow = 'hidden';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.scrollTop = 0;
    $('#overlay-close').focus();
  }

  function closeOverlay() {
    const overlay = $('#project-overlay');
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () { $('#overlay-video-wrap').innerHTML = ''; }, 350);
  }

  // ─── FOOTER ─────────────────────────────────────────────────────
  function initFooter() {
    const el = $('#footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

}());
