(() => {
  const images = [...document.querySelectorAll('.gallery-mosaic img, .gallery-page-card img')];
  if (!images.length) return;

  const viewer = document.createElement('div');
  viewer.className = 'image-viewer';
  viewer.hidden = true;
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-label', 'Image viewer');
  viewer.innerHTML = `
    <button class="image-viewer-close" type="button" aria-label="Close image viewer">×</button>
    <button class="image-viewer-arrow image-viewer-prev" type="button" aria-label="Previous image">‹</button>
    <figure class="image-viewer-figure">
      <img class="image-viewer-image" alt="" />
      <figcaption class="image-viewer-caption"></figcaption>
    </figure>
    <button class="image-viewer-arrow image-viewer-next" type="button" aria-label="Next image">›</button>
    <span class="image-viewer-count" aria-live="polite"></span>`;
  document.body.append(viewer);

  const largeImage = viewer.querySelector('.image-viewer-image');
  const caption = viewer.querySelector('.image-viewer-caption');
  const counter = viewer.querySelector('.image-viewer-count');
  let activeIndex = 0;
  let lastFocused = null;

  function showImage(index) {
    activeIndex = (index + images.length) % images.length;
    const source = images[activeIndex];
    largeImage.src = source.currentSrc || source.src;
    largeImage.alt = source.alt;
    caption.textContent = source.alt;
    counter.textContent = `${activeIndex + 1} / ${images.length}`;
  }

  function closeViewer() {
    viewer.hidden = true;
    document.body.classList.remove('image-viewer-open');
    lastFocused?.focus();
  }

  images.forEach((image, index) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `View larger image: ${image.alt}`);
    image.addEventListener('click', () => {
      lastFocused = image;
      showImage(index);
      viewer.hidden = false;
      document.body.classList.add('image-viewer-open');
      viewer.querySelector('.image-viewer-close').focus();
    });
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        image.click();
      }
    });
  });

  viewer.querySelector('.image-viewer-close').addEventListener('click', closeViewer);
  viewer.querySelector('.image-viewer-prev').addEventListener('click', () => showImage(activeIndex - 1));
  viewer.querySelector('.image-viewer-next').addEventListener('click', () => showImage(activeIndex + 1));
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) closeViewer();
  });
  document.addEventListener('keydown', (event) => {
    if (viewer.hidden) return;
    if (event.key === 'Escape') closeViewer();
    if (event.key === 'ArrowLeft') showImage(activeIndex - 1);
    if (event.key === 'ArrowRight') showImage(activeIndex + 1);
  });
})();
