function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.width = sidebar.style.width === "250px" ? "0" : "250px";
}

// Efecto fade entre páginas
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("show");

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            if (href && href.includes(".html")) {
                e.preventDefault();
                document.body.classList.remove("show");
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            }
        });
    });
});

const botonTema = document.getElementById("boton-tema");

botonTema.addEventListener("click", () => {
    if (document.documentElement.getAttribute("data-tema") === "oscuro") {
        document.documentElement.setAttribute("data-tema", "claro");
    } else {
        document.documentElement.setAttribute("data-tema", "oscuro");
    }
});
