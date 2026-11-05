// ===== Precios (referenciales: editar aquí cuando estén definidos) =====
const PLANES = {
  libro:   { nombre: 'Libro completo',      detalle: 'Pago único · acceso por 6 meses', precio: 99000 },
  mensual: { nombre: 'Suscripción mensual', detalle: 'Cobro mensual',                   precio: 19000 },
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clp = (n) => '$' + Number(n).toLocaleString('es-CL');
const form = $('.co-form');

// --- Plan seleccionado (acepta ?plan=libro|mensual en la URL) ---
const planUrl = new URLSearchParams(location.search).get('plan');
if (PLANES[planUrl]) $(`input[name="plan-opcion"][value="${planUrl}"]`).checked = true;
$$('[data-price]').forEach((el) => { el.textContent = clp(PLANES[el.dataset.price].precio); });

function actualizarResumen() {
  const key = $('input[name="plan-opcion"]:checked').value;
  const p = PLANES[key];
  $$('[data-plan-nombre]').forEach((el) => (el.textContent = p.nombre));
  $$('[data-plan-detalle]').forEach((el) => (el.textContent = p.detalle));
  $$('[data-subtotal], [data-total]').forEach((el) => (el.textContent = clp(p.precio)));
  form.elements.plan.value = p.nombre;
  form.elements.total.value = clp(p.precio);
}
$$('input[name="plan-opcion"]').forEach((r) => r.addEventListener('change', actualizarResumen));
actualizarResumen();

// --- Resumen plegable en celular ---
const toggle = $('.co-summary-toggle');
toggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('summary-open');
  toggle.setAttribute('aria-expanded', open);
});

// --- Mostrar campos según opciones ---
function mostrar(selector, visible, requeridos = []) {
  const box = $(selector);
  box.hidden = !visible;
  requeridos.forEach((n) => { form.elements[n].required = visible; });
}
$$('input[name="para"]').forEach((r) => r.addEventListener('change', () =>
  mostrar('[data-familiar]', r.value === 'Para un familiar' && r.checked, ['nombre-autor'])));
$$('input[name="documento"]').forEach((r) => r.addEventListener('change', () =>
  mostrar('[data-factura]', $('input[name="documento"]:checked').value === 'Factura',
    ['razon-social', 'rut-empresa', 'giro', 'direccion-empresa'])));

// --- RUT chileno: formato y dígito verificador ---
function limpiarRut(v) { return v.replace(/[^0-9kK]/g, '').toUpperCase(); }
function formatearRut(v) {
  const r = limpiarRut(v);
  if (r.length < 2) return r;
  const cuerpo = r.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${cuerpo}-${r.slice(-1)}`;
}
function rutValido(v) {
  const r = limpiarRut(v);
  if (r.length < 2) return false;
  const cuerpo = r.slice(0, -1), dv = r.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;
  let suma = 0, mul = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) { suma += Number(cuerpo[i]) * mul; mul = mul === 7 ? 2 : mul + 1; }
  const res = 11 - (suma % 11);
  const esperado = res === 11 ? '0' : res === 10 ? 'K' : String(res);
  return dv === esperado;
}
['rut', 'rut-empresa'].forEach((n) => {
  const input = form.elements[n];
  input.addEventListener('blur', () => {
    input.value = formatearRut(input.value);
    if (input.value) marcarRut(n);
  });
});
function marcarRut(n) {
  const ok = rutValido(form.elements[n].value);
  form.elements[n].closest('.field').classList.toggle('invalid', !ok);
  return ok;
}

// --- Envío (Netlify Forms) ---
const msg = $('.co-msg');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  let ok = form.checkValidity();
  ok = marcarRut('rut') && ok;
  if (!$('[data-factura]').hidden) ok = marcarRut('rut-empresa') && ok;
  if (!ok) {
    form.classList.add('tried');
    msg.textContent = 'Revise los campos marcados.';
    const primero = form.querySelector(':invalid, .invalid input');
    if (primero) primero.focus();
    return;
  }
  const btn = $('.co-pay');
  btn.disabled = true;
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
    if (!res.ok) throw new Error();
    $('[data-email]').textContent = form.elements.email.value;
    $('.co-layout').hidden = true;
    toggle.hidden = true;
    $('.co-done').hidden = false;
    window.scrollTo(0, 0);
  } catch {
    msg.textContent = 'No pudimos enviar su solicitud. Intente de nuevo o escríbanos a hola@sabiosrelatos.cl.';
    btn.disabled = false;
  }
});
