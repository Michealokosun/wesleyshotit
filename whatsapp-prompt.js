(() => {
  const button = document.querySelector('.wa');
  const prompt = document.getElementById('wa-prompt');
  if (!button || !prompt) return;

  window.setTimeout(() => {
    button.classList.add('is-prompt-visible');
    prompt.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => {
      button.classList.remove('is-prompt-visible');
      prompt.setAttribute('aria-hidden', 'true');
    }, 7000);
  }, 60000);
})();
