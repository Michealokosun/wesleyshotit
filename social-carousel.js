(() => {
  const track = document.getElementById("social-track");
  if (!track) return;
  const cards = [...track.querySelectorAll(".social-card")];
  const indicators = [...document.querySelectorAll(".social-indicator")];
  if (!cards.length || !indicators.length) return;

  function currentIndex() {
    return Math.round(track.scrollLeft / (track.clientWidth + 16));
  }

  function setActive(index) {
    const active = Math.max(0, Math.min(cards.length - 1, index));
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("is-active", i === active);
      indicator.setAttribute("aria-current", i === active ? "true" : "false");
    });
  }

  function goTo(index) {
    const active = Math.max(0, Math.min(cards.length - 1, index));
    track.scrollTo({
      left: active * (track.clientWidth + 16),
      behavior: "smooth",
    });
    setActive(active);
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => goTo(index));
  });

  let touchStart = null;
  let suppressClickUntil = 0;
  track.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true },
  );

  track.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        goTo(currentIndex() + (deltaX < 0 ? 1 : -1));
        suppressClickUntil = Date.now() + 450;
      }
      touchStart = null;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchcancel",
    () => {
      touchStart = null;
    },
    { passive: true },
  );
  track.addEventListener(
    "click",
    (event) => {
      if (Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        suppressClickUntil = 0;
      }
    },
    true,
  );

  let scrollFrame = 0;
  track.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => setActive(currentIndex()));
    },
    { passive: true },
  );
})();
