(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const progress = document.getElementById('progress');
  const year = document.getElementById('year');
  year.textContent = new Date().getFullYear();

  // Reveal elements once, with no scroll listeners or layout thrashing.
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -35px 0px' });
    reveals.forEach(element => observer.observe(element));
  } else {
    reveals.forEach(element => element.classList.add('visible'));
  }

  // One passive scroll listener, one scheduled paint, transform-only progress update.
  let scheduled = false;
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  const closeMenu = () => {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };
  menuButton.addEventListener('click', () => {
    const opening = mobileNav.hidden;
    mobileNav.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
  });
  window.matchMedia('(min-width: 721px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
})();
