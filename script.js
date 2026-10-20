// Currículum de Yenai: tema claro/oscuro, menú, animaciones al bajar y detalles.
const raiz = document.documentElement;
const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tema: se recuerda en este navegador; la primera vez sigue al sistema (ver el <script> del <head>)
const botonTema = document.getElementById("boton-tema");
function ponerTema(tema) {
  raiz.setAttribute("data-tema", tema);
  botonTema.setAttribute("aria-label", tema === "oscuro" ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
}
ponerTema(raiz.getAttribute("data-tema") || "claro");
botonTema.addEventListener("click", () => {
  const nuevo = raiz.getAttribute("data-tema") === "oscuro" ? "claro" : "oscuro";
  ponerTema(nuevo);
  try { localStorage.setItem("tema", nuevo); } catch (e) {}
});

// Menú de la hamburguesa: panel lateral a la izquierda
const hamburguesa = document.getElementById("hamburguesa");
const menu = document.getElementById("menu");
const velo = document.getElementById("velo");
function toggleMenu(abrir = hamburguesa.getAttribute("aria-expanded") !== "true") {
  hamburguesa.setAttribute("aria-expanded", abrir);
  hamburguesa.setAttribute("aria-label", abrir ? "Cerrar el menú" : "Abrir el menú");
  menu.classList.toggle("abierto", abrir);
  velo.classList.toggle("abierto", abrir);
  menu.inert = !abrir;
  if (abrir) setTimeout(() => menu.querySelector("a").focus({ preventScroll: true }), 200);
}
hamburguesa.addEventListener("click", () => toggleMenu());
velo.addEventListener("click", () => toggleMenu(false));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && menu.classList.contains("abierto")) { toggleMenu(false); hamburguesa.focus(); }
});
menu.inert = true;

// Nombre: cada letra sube por separado
let n = 0;
document.querySelectorAll(".nombre .linea").forEach(linea => {
  const texto = linea.textContent; linea.textContent = "";
  for (const ch of texto) {
    const s = document.createElement("span"); s.className = "letra"; s.style.setProperty("--i", n++);
    s.textContent = ch === " " ? " " : ch; s.setAttribute("aria-hidden", "true"); linea.append(s);
  }
});

// Frase que se escribe sola
const escritura = document.getElementById("escritura");
const palabras = ["sistemas", "redes", "Linux", "soporte técnico", "bases de datos"];
if (reducido) escritura.textContent = palabras[0];
else {
  let p = 0, i = 0, borrando = false;
  (function escribir() {
    const palabra = palabras[p];
    escritura.textContent = palabra.slice(0, i);
    if (!borrando && i === palabra.length) { borrando = true; return setTimeout(escribir, 1600); }
    if (borrando && i === 0) { borrando = false; p = (p + 1) % palabras.length; }
    i += borrando ? -1 : 1;
    setTimeout(escribir, borrando ? 45 : 90);
  })();
}

// Cinta: se duplica para que el bucle no tenga corte
const pista = document.querySelector(".cinta-pista");
const originales = pista.children.length;
pista.innerHTML += pista.innerHTML;
[...pista.children].forEach((s, k) => { if (k >= originales) s.setAttribute("aria-hidden", "true"); });

// Aparición al bajar. Lo que empieza recortado (.revela) no cuenta como visible para Chrome,
// así que se vigila su sección y, cuando entra, se descubre todo lo que tiene dentro.
const observador = new IntersectionObserver(entradas => {
  for (const e of entradas) if (e.isIntersecting) {
    e.target.classList.add("visto");
    e.target.querySelectorAll(".revela").forEach(r => r.classList.add("visto"));
    observador.unobserve(e.target);
  }
}, { threshold: 0.15 });
const vigilados = new Set(document.querySelectorAll(".hito, .proyecto, .niveles"));
document.querySelectorAll(".revela").forEach(r => vigilados.add(r.closest("section, .fila") || r.parentElement));
vigilados.forEach(el => reducido ? (el.classList.add("visto"), el.querySelectorAll(".revela").forEach(r => r.classList.add("visto"))) : observador.observe(el));

// Notas que cuentan hacia arriba
const contador = new IntersectionObserver(entradas => {
  for (const e of entradas) {
    if (!e.isIntersecting) continue;
    contador.unobserve(e.target);
    if (reducido) continue;
    const texto = e.target.dataset.nota, fin = parseFloat(texto.replace(",", ".")), dec = (texto.split(",")[1] || "").length;
    const inicio = performance.now(), dur = 1200;
    (function paso(t) {
      const k = Math.min(1, (t - inicio) / dur), v = fin * (1 - Math.pow(1 - k, 3));
      e.target.textContent = v.toFixed(dec).replace(".", ",");
      if (k < 1) requestAnimationFrame(paso);
    })(inicio);
  }
}, { threshold: 0.6 });
document.querySelectorAll("[data-nota]").forEach(el => contador.observe(el));

// Barra de progreso y línea de tiempo que se rellena
const progreso = document.querySelector(".progreso");
const tiempo = document.querySelector(".tiempo");
const relleno = document.querySelector(".tiempo-relleno");
function alBajar() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progreso.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  const r = tiempo.getBoundingClientRect();
  relleno.style.setProperty("--avance", Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height)));
}
addEventListener("scroll", alBajar, { passive: true });
alBajar();

// Enlace activo del menú de arriba según la sección
const enlaces = [...document.querySelectorAll(".nav-escritorio a, .menu a:not(.boton)")];
const vigia = new IntersectionObserver(entradas => {
  for (const e of entradas) if (e.isIntersecting)
    enlaces.forEach(a => a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id));
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => vigia.observe(s));

// Desplegar los módulos de cada estudio
document.querySelectorAll(".desplegar").forEach(b => b.addEventListener("click", () => {
  const abierto = b.getAttribute("aria-expanded") === "true";
  b.setAttribute("aria-expanded", !abierto);
  b.querySelector("span").textContent = abierto ? "Ver los módulos" : "Ocultar los módulos";
  document.getElementById(b.getAttribute("aria-controls")).classList.toggle("abierto", !abierto);
}));

// Copiar el correo
const copiar = document.getElementById("copiar-correo");
copiar.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText("sryenalc@gmail.com"); copiar.textContent = "Correo copiado"; }
  catch (e) { copiar.textContent = "sryenalc@gmail.com"; }
  setTimeout(() => copiar.textContent = "Copiar el correo", 1800);
});
