(() => {
  const scenes = [...document.querySelectorAll('.scene')];
  const dots = [...document.querySelectorAll('.scene-dot')];
  const labels = ['01 / MANIFESTO', '02 / THE THESIS', '03 / GOLD REWARDS', '04 / THE ENDGAME'];
  const label = document.querySelector('#sceneLabel');
  let current = 0;
  let locked = false;
  let touchY = null;

  function showScene(next) {
    const target = Math.max(0, Math.min(scenes.length - 1, next));
    if (target === current) return;
    scenes[current].classList.remove('is-active', 'is-entering');
    scenes[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('is-active');
    current = target;
    scenes[current].classList.add('is-active', 'is-entering');
    scenes[current].removeAttribute('aria-hidden');
    dots[current].classList.add('is-active');
    label.textContent = labels[current];
    history.replaceState(null, '', `#scene-${current + 1}`);
    window.setTimeout(() => scenes[current].classList.remove('is-entering'), 900);
  }

  function nudge(direction) {
    if (locked) return;
    const target = current + direction;
    if (target < 0 || target >= scenes.length) return;
    locked = true;
    showScene(target);
    window.setTimeout(() => { locked = false; }, 720);
  }

  window.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) < 18) return;
    event.preventDefault();
    nudge(event.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  window.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      nudge(1);
    }
    if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      nudge(-1);
    }
    if (event.key === 'Home') showScene(0);
    if (event.key === 'End') showScene(scenes.length - 1);
  });

  window.addEventListener('touchstart', (event) => {
    touchY = event.changedTouches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (event) => {
    if (touchY === null) return;
    const delta = touchY - event.changedTouches[0].clientY;
    touchY = null;
    if (Math.abs(delta) > 45) nudge(delta > 0 ? 1 : -1);
  }, { passive: true });

  document.querySelectorAll('[data-goto]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      showScene(Number(button.dataset.goto));
    });
  });

  const initial = Number((location.hash.match(/scene-(\d)/) || [])[1]) - 1;
  if (Number.isInteger(initial) && initial > 0 && initial < scenes.length) showScene(initial);
})();
