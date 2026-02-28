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

  // ─── FILM DATA ──────────────────────────────────────────────────
  var filmData = {
    pika: {
      synopsis: 'A desperate man wakes up with an unbearable itch, anxious to find a cure, he embarks on a nightmarish odyssey in search of relief. Screener available upon request.',
      statement: [
        'With ¡PIKA! (The Itch), I wanted to make a movie that would make the audience uncomfortable; to immerse the viewer in a place that feels like another world. To make an epic, unpredictable journey that would make viewers feel just as devastated as our main character.',
        'My biggest inspiration for the film was how anxiety feels in my body, and the moment where that intense fear can lead to paralysis. I\'m making fun of myself with this movie. It\'s exposing some of my most absurd and cowardly traits and putting them into a nightmarish journey.',
        'Originally, Trout (Trout Cohen, Writer/Producer) wrote a script about a man with an itch on his chest. His script stuck with me and years later, as I slipped into a depressive hole, I realized it was the perfect metaphor to describe what I was going through.',
        'Inspired by films like The Trial, Good Time, Fight Club, and Beau Is Afraid, we wanted to craft a nightmarish world — in ours, even the smallest errand becomes an impossible hurdle. Together with our department heads we designed spaces for the viewer to feel gross, dirty, and surreal.',
        'This is an epic story contained in a short form film.',
      ],
      credits: [
        { role: 'Directed by',        name: 'Alex Fischman Cárdenas' },
        { role: 'Written by',         name: 'Trout Cohen' },
        { role: 'Produced by',        name: 'Morella Moret, Etienne Talbot, Alex Fischman Cárdenas, Trout Cohen' },
        { role: 'Cinematography',     name: 'Mika Altskan' },
        { role: 'Production Design',  name: 'Renzo Bazan' },
        { role: 'Edit',               name: 'Ben Schwaeber' },
        { role: 'Music',              name: 'Daniel Brandt, Paulo Gallo' },
        { role: 'Sound Design',       name: 'Nikolay Antonov' },
      ],
    },
  };

  function renderExtended(ext) {
    var html = '';

    if (ext.synopsis) {
      html += '<div class="overlay-ext-block">';
      html += '<span class="overlay-ext-label">Synopsis</span>';
      html += '<p class="overlay-ext-text">' + ext.synopsis + '</p>';
      html += '</div>';
    }

    if (ext.statement && ext.statement.length) {
      html += '<div class="overlay-ext-block">';
      html += '<span class="overlay-ext-label">Director\'s Statement</span>';
      html += '<div class="overlay-ext-body">';
      html += ext.statement.map(function (p) {
        return '<p class="overlay-ext-text">' + p + '</p>';
      }).join('');
      html += '</div></div>';
    }

    if (ext.credits && ext.credits.length) {
      html += '<div class="overlay-ext-block">';
      html += '<span class="overlay-ext-label">Credits</span>';
      html += '<div class="overlay-credits">';
      ext.credits.forEach(function (c) {
        html += '<span class="overlay-credit-role">' + c.role + '</span>';
        html += '<span class="overlay-credit-name">' + c.name + '</span>';
      });
      html += '</div></div>';
    }

    return html;
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
    const extEl      = $('#overlay-extended');

    const title    = card.dataset.title    || '';
    const year     = card.dataset.year     || '';
    const type     = card.dataset.type     || '';
    const status   = card.dataset.status   || '';
    const logline  = card.dataset.logline  || '';
    const festival = card.dataset.festival || '';
    const vimeo    = card.dataset.vimeo    || '';
    const vimeoHash = card.dataset.vimeoHash || '';
    const stills   = card.dataset.stills ? card.dataset.stills.split('|') : [];
    const slug     = card.dataset.slug     || '';

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

    // Extended content
    const ext = filmData[slug];
    if (ext) {
      extEl.innerHTML = renderExtended(ext);
      extEl.style.display = '';
    } else {
      extEl.innerHTML = '';
      extEl.style.display = 'none';
    }

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
    setTimeout(function () {
      $('#overlay-video-wrap').innerHTML = '';
      $('#overlay-extended').innerHTML = '';
    }, 350);
  }

  // ─── FOOTER ─────────────────────────────────────────────────────
  function initFooter() {
    const el = $('#footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

}());
