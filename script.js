/* ==========================================================================
   Tanvi Shastri — Portfolio
   script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* Page loader                                                        */
  /* ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), prefersReducedMotion ? 0 : 500);
  });

  /* ------------------------------------------------------------------ */
  /* Theme toggle (dark default, saved to localStorage)                 */
  /* ------------------------------------------------------------------ */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('tanvi-theme');
  if (savedTheme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeToggle.setAttribute('aria-pressed', 'true');
  }
  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('tanvi-theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'false');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('tanvi-theme', 'light');
      themeToggle.setAttribute('aria-pressed', 'true');
    }
  });

  /* ------------------------------------------------------------------ */
  /* Mobile nav toggle                                                   */
  /* ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------ */
  /* Scroll progress bar + active nav link + back-to-top                */
  /* ------------------------------------------------------------------ */
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    backToTop.classList.toggle('is-visible', scrollTop > 600);

    let current = sections[0]?.id;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140) current = section.id;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ------------------------------------------------------------------ */
  /* Scroll reveal for sections/cards                                    */
  /* ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    '.about-card, .skill-group, .project-card, .timeline-item, .accordion-item, .contact-link, .section-head'
  );
  revealTargets.forEach(el => el.classList.add('reveal-up'));

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------ */
  /* Terminal typing effect                                              */
  /* ------------------------------------------------------------------ */
  const terminalBody = document.getElementById('terminalBody');
  const terminalScript = [
    { type: 'cmd', text: 'whoami' },
    { type: 'out', text: 'Tanvi Shastri' },
    { type: 'cmd', text: 'role' },
    { type: 'out', text: 'IT Undergraduate' },
    { type: 'cmd', text: 'currently_learning' },
    { type: 'out', text: 'HTML · CSS · JavaScript · C++' },
    { type: 'cmd', text: 'status' },
    { type: 'out', text: 'Building & Learning...' }
  ];

  function typeTerminal() {
    let i = 0;
    terminalBody.innerHTML = '';

    function typeLine(line, el, cb) {
      let j = 0;
      const speed = prefersReducedMotion ? 0 : 18;
      function step() {
        el.textContent = line.slice(0, j) + (j < line.length ? '' : '');
        j++;
        if (j <= line.length) {
          el.textContent = line.slice(0, j);
          setTimeout(step, speed);
        } else if (cb) cb();
      }
      step();
    }

    function next() {
      if (i >= terminalScript.length) return;
      const entry = terminalScript[i];
      const lineEl = document.createElement('span');
      lineEl.className = 'terminal-line';

      if (entry.type === 'cmd') {
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = 'tanvi@portfolio:~$ ';
        const cmdText = document.createElement('span');
        lineEl.appendChild(prompt);
        lineEl.appendChild(cmdText);
        terminalBody.appendChild(lineEl);
        typeLine(entry.text, cmdText, () => {
          i++;
          setTimeout(next, 220);
        });
      } else {
        lineEl.innerHTML = '<span class="terminal-arrow">→</span> ';
        const outText = document.createElement('span');
        outText.className = 'terminal-output-inline';
        lineEl.appendChild(outText);
        terminalBody.appendChild(lineEl);
        typeLine(entry.text, outText, () => {
          i++;
          setTimeout(next, 260);
        });
      }
    }
    next();
  }

  if ('IntersectionObserver' in window) {
    const terminalIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeTerminal();
          terminalIO.disconnect();
        }
      });
    }, { threshold: 0.4 });
    terminalIO.observe(document.getElementById('terminal'));
  } else {
    typeTerminal();
  }

  /* ------------------------------------------------------------------ */
  /* Project filter                                                      */
  /* ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        const match = filter === 'all' || categories.includes(filter);
        card.classList.toggle('is-filtered-out', !match);
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Achievements accordion                                              */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* ------------------------------------------------------------------ */
  /* Custom cursor (desktop / fine-pointer only)                         */
  /* ------------------------------------------------------------------ */
  const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (supportsFinePointer && !prefersReducedMotion) {
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    document.body.classList.add('cursor-ready');

    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX; targetY = e.clientY;
      cursorDot.style.left = targetX + 'px';
      cursorDot.style.top = targetY + 'px';
    });

    function animateRing() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
    });
  }

});