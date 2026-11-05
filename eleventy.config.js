// Genera el sitio en _site/. Las páginas HTML principales se copian tal cual;
// solo el blog (Markdown + Nunjucks) se procesa como plantilla.
export default function (eleventyConfig) {
  for (const p of ["index.html", "pago.html", "styles.css", "main.js", "pago.js", "assets", "admin"]) {
    eleventyConfig.addPassthroughCopy(p);
  }
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("node_modules/**");

  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  eleventyConfig.addFilter("fecha", (d) => {
    const f = new Date(d);
    return `${f.getUTCDate()} de ${meses[f.getUTCMonth()]} de ${f.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("isoFecha", (d) => new Date(d).toISOString().slice(0, 10));

  return {
    dir: { input: ".", includes: "_includes", output: "_site" },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
  };
}
