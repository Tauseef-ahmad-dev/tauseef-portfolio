const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Scroll progress indicator
const progress = document.getElementById('scrollProgress');
let progressQueued = false;
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = percentage + '%';
  progressQueued = false;
};
window.addEventListener('scroll', () => {
  if (!progressQueued) {
    window.requestAnimationFrame(updateProgress);
    progressQueued = true;
  }
}, { passive: true });
updateProgress();

// Reveal sections and cards as they enter the viewport.
// Content remains visible if IntersectionObserver is unavailable or motion is reduced.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.section-kicker, .section-intro, .expertise-card, .experience-item, .section-heading, .project-row, .approach-copy, .approach-points > div, .contact-section'
  );
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    if (element.classList.contains('expertise-card') || element.classList.contains('approach-points')) {
      element.style.setProperty('--reveal-delay', (index % 4) * 75 + 'ms');
    } else if (element.classList.contains('project-row')) {
      element.style.setProperty('--reveal-delay', '70ms');
    }
  });
  document.documentElement.classList.add('reveal-ready');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach((element) => observer.observe(element));
}
