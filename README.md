# sabiosrelatos.cl

Sitio de Sabios Relatos, publicado en Netlify desde la rama `main`.

## Estructura
- `index.html`: página principal
- `pago.html` + `pago.js`: pantalla de pago (por ahora envía una *solicitud de compra* a Netlify Forms; los precios se editan al inicio de `pago.js`)
- `blog/posts/*.md`: noticias (una por archivo)
- `blog/index.njk`, `_includes/`: plantillas del blog
- `admin/`: panel para escribir noticias desde el navegador (Decap CMS) → https://sabiosrelatos.cl/admin
- `styles.css`, `main.js`, `assets/`: estilos, código y anexos

## Cómo se genera
Netlify ejecuta `npm run build` (Eleventy) y publica la carpeta `_site/`.
Para verlo localmente: `npm install` y luego `npm run dev`.

## Formularios (Netlify → Forms)
- `lista-espera`: correos de interesados
- `solicitud-compra`: solicitudes desde la pantalla de pago
