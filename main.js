// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Formulario (Netlify Forms)
const form = document.querySelector('.signup');
const msg = document.querySelector('.form-msg');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
    if (!res.ok) throw new Error();
    msg.textContent = '¡Gracias! Te avisaremos pronto.';
    form.reset();
  } catch {
    msg.textContent = 'No pudimos registrar tu correo. Intenta de nuevo.';
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
