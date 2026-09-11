const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('open', open);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  });
}
let dialogOpener;
document.addEventListener('click', event => {
  const opener = event.target.closest('[data-open]');
  if (opener) {
    const dialog = document.getElementById(opener.dataset.open);
    if (dialog instanceof HTMLDialogElement) { dialogOpener = opener; dialog.showModal(); }
  }
  const close = event.target.closest('[data-close]');
  if (close) close.closest('dialog')?.close();
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => dialogOpener?.focus());
});
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const params = new URLSearchParams(window.location.search);
  const topic = document.getElementById('anliegen');
  const message = document.getElementById('message');
  const requestedTopic = params.get('anliegen');
  if ([...topic.options].some(option => option.value === requestedTopic)) topic.value = requestedTopic;
  if (params.has('nachricht') && !message.value.trim()) message.value = params.get('nachricht').slice(0, 5000);
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const body = 'Hallo Löwenstark-Team,\n\n' + message.value.trim() + '\n\nViele Grüße\n' + name;
    window.location.href = 'mailto:vorstand@loewenstarkmh.de?subject=' + encodeURIComponent(topic.value) + '&body=' + encodeURIComponent(body);
    document.getElementById('contact-status').textContent = 'Dein E-Mail-Programm wird geöffnet. Falls nichts passiert, schreibe direkt an vorstand@loewenstarkmh.de. Es wurde noch keine Nachricht versendet.';
  });
}
document.getElementById('copy-iban')?.addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText('DE79300702070073443400');
    status.textContent = 'IBAN kopiert. Bitte den Kontoinhaber vor der Überweisung beim Verein prüfen.';
  } catch { status.textContent = 'Bitte kopiere die IBAN aus der Bankverbindung oben.'; }
});

document.querySelectorAll('[data-instagram-deck]').forEach(deck => {
  const cards = [...deck.querySelectorAll('[data-instagram-card]')];
  const section = deck.closest('.instagram-section');
  const status = section?.querySelector('.instagram-status');
  const dots = [...(section?.querySelectorAll('[data-instagram-dot]') || [])];
  let activeIndex = 0;
  let pointerStart = null;
  let dragged = false;

  const render = () => {
    cards.forEach((card, index) => {
      const distance = (index - activeIndex + cards.length) % cards.length;
      const state = distance === 0 ? 'active' : distance === 1 ? 'next' : 'previous';
      card.dataset.state = state;
      card.setAttribute('aria-hidden', String(state !== 'active'));
      card.querySelectorAll('a, button').forEach(control => {
        control.tabIndex = state === 'active' ? 0 : -1;
      });
    });
    dots.forEach((dot, index) => {
      if (index === activeIndex) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (status) status.textContent = `${activeIndex + 1} von ${cards.length}`;
  };

  const show = index => {
    activeIndex = (index + cards.length) % cards.length;
    render();
  };

  section?.querySelector('[data-instagram-prev]')?.addEventListener('click', () => show(activeIndex - 1));
  section?.querySelector('[data-instagram-next]')?.addEventListener('click', () => show(activeIndex + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
  deck.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(activeIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(activeIndex + 1); }
  });
  deck.addEventListener('pointerdown', event => {
    pointerStart = { x: event.clientX, y: event.clientY };
    dragged = false;
  });
  deck.addEventListener('pointermove', event => {
    if (!pointerStart) return;
    if (Math.abs(event.clientX - pointerStart.x) > 12) dragged = true;
  });
  deck.addEventListener('pointerup', event => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(activeIndex + (dx < 0 ? 1 : -1));
  });
  deck.addEventListener('pointercancel', () => { pointerStart = null; });
  deck.addEventListener('click', event => {
    if (!dragged) return;
    event.preventDefault();
    dragged = false;
  }, true);

  render();
});
