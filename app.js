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
