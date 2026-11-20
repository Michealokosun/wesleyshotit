(() => {
  const carousel = document.getElementById('film-carousel');
  if (!carousel) return;

  const cards = [...carousel.querySelectorAll('.film-card')];
  const indicators = [...document.querySelectorAll('.film-indicator')];
  const previous = document.querySelector('.film-arrow-prev');
  const next = document.querySelector('.film-arrow-next');
  let activeIndex = 0;
  let scrollFrame = 0;

  function updateActiveCard() {
    const center = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
    let closest = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < closestDistance) {
        closest = index;
        closestDistance = distance;
      }
    });

    activeIndex = closest;
    indicators.forEach((indicator, index) => {
      const isActive = index === activeIndex;
      indicator.classList.toggle('is-active', isActive);
      indicator.setAttribute('aria-current', String(isActive));
    });
  }

  function showCard(index) {
    const target = cards[Math.max(0, Math.min(index, cards.length - 1))];
    if (!target) return;
    const left = target.getBoundingClientRect().left - carousel.getBoundingClientRect().left;
    const centeredLeft = carousel.scrollLeft + left - (carousel.clientWidth - target.clientWidth) / 2;
    carousel.scrollTo({
      left: centeredLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }

  previous?.addEventListener('click', () => showCard(activeIndex - 1));
  next?.addEventListener('click', () => showCard(activeIndex + 1));
  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => showCard(Number(indicator.dataset.filmIndex)));
  });

  carousel.addEventListener('scroll', () => {
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(updateActiveCard);
  }, { passive: true });

  cards.forEach((card) => {
    const video = card.querySelector('video');
    video.pause();
    video.muted = true;
    video.addEventListener('play', () => {
      cards.forEach((otherCard) => {
        const otherVideo = otherCard.querySelector('video');
        if (otherVideo !== video) otherVideo.pause();
      });
    });
  });
})();
