// Este JS controla el funcionamiento del header según hasta que punto de la página se haya hecho scroll verticalmente
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  const y = window.scrollY;

  header.classList.toggle("scrolled", y > 1);
  header.classList.toggle("compacto", y > 80);
});
