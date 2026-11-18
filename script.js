(function () {
  'use strict';

  window.addEventListener('load', function () {
    document.querySelectorAll('link[data-async-fonts]').forEach(function (stylesheet) {
      stylesheet.media = 'all';
    });
  }, { once: true });

  function makeStars(el, count, blur, min, max) {
    const shadows = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 100).toFixed(2);
      const y = (Math.random() * 100).toFixed(2);
      const a = (min + Math.random() * (max - min)).toFixed(3);
      shadows.push(`${x}vw ${y}vh ${blur}px 0 rgba(255,255,255,${a})`);
    }
    el.style.boxShadow = shadows.join(',');
  }

  makeStars(document.getElementById('stA'), 110, 0, 0.04, 0.19);
  makeStars(document.getElementById('stB'), 14, 1.2, 0.25, 0.5);

  const footageSources = [
    'assets/slider/slide-01.mp4',
    'assets/slider/slide-02.mp4',
    'assets/slider/slide-03.mp4',
    'assets/slider/slide-04.mp4',
    'assets/slider/slide-05.mp4'
  ];
  const posterImages = [
    'assets/slider/video-thumb-01.webp',
    'assets/slider/video-thumb-02.webp',
    'assets/slider/video-thumb-03.webp',
    'assets/slider/video-thumb-04.webp',
    'assets/slider/video-thumb-05.webp'
  ];
  const captions = [
    'Wedding stories', 'Made to relive', 'Love, in focus', 'Every moment',
    'Your day, forever', 'The feeling remains', 'A story worth keeping'
  ];
  // Mirrored ends reverse the track without wrapping cards across the gallery.
  const route = [3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3];
  const gallery = document.getElementById('ring');
  const cards = route.map((shotIndex, index) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('aria-hidden', 'true');
    const footage = footageSources[shotIndex % footageSources.length];
    card.innerHTML = '<video muted playsinline preload="none" poster="' + posterImages[shotIndex % footageSources.length] + '" aria-hidden="true"></video><span class="card-caption">' + captions[shotIndex] + '</span><span class="edge"></span>';
    gallery.appendChild(card);
    return { card, video: card.querySelector('video'), footage, index };
  });

  let active = 3;
  let direction = 1;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function loadClip(item, preload) {
    const video = item.video;
    if (video.dataset.source !== item.footage) {
      video.pause();
      video.src = item.footage;
      video.dataset.source = item.footage;
      video.dataset.clipReady = '';
      video.preload = preload;
      video.load();
    } else if (preload === 'auto' && video.preload !== 'auto') {
      video.preload = 'auto';
      video.load();
    }
  }

  function releaseClip(item) {
    const video = item.video;
    if (!video.dataset.source) return;
    video.pause();
    video.removeAttribute('src');
    video.load();
    delete video.dataset.source;
    delete video.dataset.clipReady;
    delete video.dataset.clipStart;
    delete video.dataset.clipEnd;
  }

  function prepareClip(item) {
    const video = item.video;
    if (video.dataset.clipReady || !Number.isFinite(video.duration)) return;
    const segmentCount = Math.max(1, Math.floor(video.duration / 10));
    const start = (item.index % segmentCount) * 10;
    video.dataset.clipStart = String(start);
    video.dataset.clipEnd = String(Math.min(start + 10, video.duration));
    video.dataset.clipReady = 'true';
    video.currentTime = start;
  }

  function layoutGallery() {
    const width = window.innerWidth;
    const mobile = width <= 700;
    const radius = mobile ? Math.max(300, width * 1.2) : Math.max(560, width * 0.62);
    const angleStep = mobile ? 18 : 17;
    const baseCardWidth = parseFloat(getComputedStyle(cards[0].card).width);
    cards.forEach((item, index) => {
      const offset = index - active;
      const distance = Math.abs(offset);
      const angle = offset * angleStep;
      const radians = angle * Math.PI / 180;
      const x = Math.sign(offset) * baseCardWidth * (0.92 * distance + 0.05 * distance * (distance - 1));
      // Recess the center card and bring the outer cards toward the viewer,
      // matching the bowl-shaped panoramic carousel in the reference.
      const z = radius * (1 - Math.cos(radians));
      const card = item.card;
      card.style.visibility = 'visible';
      card.style.opacity = distance > 3 ? '0' : distance === 3 ? '.78' : distance === 2 ? '.92' : '1';
      card.style.zIndex = String(10 - distance);
      const scale = [0.82, 0.96, 1.08, 1.18][distance] || 1.18;
      card.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,' + z.toFixed(1) + 'px) rotateY(' + (-angle).toFixed(1) + 'deg) scale(' + scale + ')';
      card.style.filter = distance === 0 ? 'brightness(1)' : 'brightness(' + (1 - Math.min(distance * .11, .27)) + ')';

      const video = item.video;
      if (reduceMotion.matches) {
        releaseClip(item);
      } else {
        loadClip(item, 'auto');
        prepareClip(item);
        if (video.dataset.clipReady && video.currentTime < Number(video.dataset.clipStart)) video.currentTime = Number(video.dataset.clipStart);
        video.play().catch(() => {});
      }
    });
  }

  cards.forEach((item) => {
    item.video.addEventListener('loadedmetadata', () => {
      prepareClip(item);
      if (!reduceMotion.matches) item.video.play().catch(() => {});
    });
    item.video.addEventListener('timeupdate', () => {
      const end = Number(item.video.dataset.clipEnd);
      if (item.video.dataset.clipReady && item.video.currentTime >= end) {
        item.video.currentTime = Number(item.video.dataset.clipStart);
        if (!item.video.paused) item.video.play().catch(() => {});
      }
    });
  });

  layoutGallery();
  window.addEventListener('resize', layoutGallery);
  if (!reduceMotion.matches) {
    window.setInterval(() => {
      if (active >= 9) direction = -1;
      else if (active <= 3) direction = 1;
      active += direction;
      layoutGallery();
    }, 10000);
  }
  reduceMotion.addEventListener?.('change', layoutGallery);
})();
