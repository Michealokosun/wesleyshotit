(function () {
  'use strict';

  const screen = document.querySelector('.loading-screen');
  if (!screen) return;

  const startedAt = performance.now();
  const minimumDisplayTime = 2200;
  let finishStarted = false;

  function finishLoading() {
    if (finishStarted) return;
    finishStarted = true;

    const wait = Math.max(0, minimumDisplayTime - (performance.now() - startedAt));
    window.setTimeout(() => {
      screen.classList.add('is-flashing');
      window.setTimeout(() => {
        screen.classList.add('is-hidden');
        document.body.classList.remove('is-loading');
        window.setTimeout(() => screen.remove(), 600);
      }, 320);
    }, wait);
  }

  window.addEventListener('load', finishLoading, { once: true });
  window.setTimeout(finishLoading, 8000);
})();
