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

// Precios mensual / anual
const fmt = n => '$' + Number(n).toLocaleString('es-CL');
document.querySelectorAll('.toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const key = btn.dataset.period === 'anual' ? 'a' : 'm';
    document.querySelectorAll('.price span').forEach(s => { s.textContent = fmt(s.dataset[key]); });
  });
});

// Formulario (demo: falta conectar a un servicio real)
const form = document.querySelector('.signup');
form.addEventListener('submit', () => {
  const msg = document.querySelector('.form-msg');
  msg.textContent = '¡Gracias! Te avisaremos pronto.';
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
