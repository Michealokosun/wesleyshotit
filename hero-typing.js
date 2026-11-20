(() => {
  const phrase = document.querySelector('.hero-copy h1 span');
  if (!phrase) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  const phrases = [
    'Beautifully Told',
    'Love Remembered',
    'Moments in Motion',
    'Forever Kept'
  ];
  let phraseIndex = 0;
  let characterCount = phrases[0].length;
  let deleting = true;
  let started = false;

  function typeNextCharacter() {
    const currentPhrase = phrases[phraseIndex];
    characterCount += deleting ? -1 : 1;
    phrase.textContent = currentPhrase.slice(0, characterCount);

    let wait = deleting ? 48 : 78;
    if (deleting && characterCount === 0) {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      deleting = false;
      wait = 220;
    } else if (!deleting && characterCount === phrases[phraseIndex].length) {
      deleting = true;
      wait = 1450;
    }

    window.setTimeout(typeNextCharacter, wait);
  }

  function startTyping() {
    if (started) return;
    started = true;
    window.setTimeout(typeNextCharacter, 1450);
  }

  if (document.body.classList.contains('page-revealed')) startTyping();
  else window.addEventListener('site:revealed', startTyping, { once: true });
})();
