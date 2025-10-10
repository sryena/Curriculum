function toggleMenu() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

// Efecto fade entre páginas
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("show");

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            if (this.getAttribute("href").includes(".html")) {
                e.preventDefault();
                let target = this.getAttribute("href");
                document.body.classList.remove("show");
                setTimeout(() => {
                    window.location.href = target;
                }, 600);
            }
        });
    });
});

const botonTema = document.getElementById('boton-tema');

botonTema.addEventListener('click', () => {
    if(document.documentElement.getAttribute('data-tema') === 'oscuro'){
        document.documentElement.setAttribute('data-tema', 'claro');
        botonTema.textContent = '🌙 Tema';
    } else {
        document.documentElement.setAttribute('data-tema', 'oscuro');
        botonTema.textContent = '☀️ Tema';
    }
});
