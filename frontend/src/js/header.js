/**
 * js/header.js
 * Genera el header dinámicamente e inyecta la navegación
 */

export function generarHeader() {
    // Evitar duplicar el header si la función se llama dos veces
    if (document.querySelector("header")) return;

    const path = window.location.pathname;
    const currentPage = path.split("/").pop() || "index.html";

    function getActive(page) {
        if ((currentPage === "" || currentPage === "/") && page === "index.html") return "active";
        return currentPage === page ? "active" : "";
    }

    const isAdminLogueado = !!localStorage.getItem("adminActivo");
    const esAdminPanel = currentPage === "admin_panel.html";

    const adminLink = (esAdminPanel && isAdminLogueado) 
        ? `<a href="./admin_panel.html" class="active"><i class="bi bi-shield-lock me-1"></i>Panel</a>`
        : `<a href="./loginAdmin.html" class="${getActive('loginAdmin.html')}"><i class="bi bi-gear me-1"></i>Admin</a>`;
    
    const adminBadge = (esAdminPanel && isAdminLogueado) 
        ? `<span class="fs-6 text-danger ms-2 fw-bold">ADMIN</span>` 
        : '';

    const headerElement = document.createElement("header");
    headerElement.innerHTML = `
        <div class="container">
            <h1 class="m-0 d-flex align-items-center gap-2">
                <a href="./index.html" class="d-flex align-items-center text-decoration-none">
                    <img src="../img/unnamed.png" alt="Mestrax Logo" style="height: 100px; width: 100px; border-radius: 50%; object-fit: cover;">
                    ${adminBadge}
                </a>
            </h1>
            <nav>
                <a href="./index.html" class="${getActive('index.html')}"><i class="bi bi-house me-1"></i>Inicio</a>
                <a href="./producto.html" class="${getActive('producto.html')}"><i class="bi bi-shop me-1"></i>Productos</a>
                <a href="./carrito.html" class="${getActive('carrito.html')}"><i class="bi bi-cart me-1"></i>Carrito <span id="cart-count">0</span></a>
                <a href="./reserva.html" class="${getActive('reserva.html')}"><i class="bi bi-calendar-check me-1"></i>Reserva</a>
                <a href="./contactos.html" class="${getActive('contactos.html')}"><i class="bi bi-telephone me-1"></i>Contacto</a>
                ${adminLink}
            </nav>
        </div>
    `;

    document.body.prepend(headerElement);

    // Lógica de scroll (Header oculto al bajar)
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop && currentScroll > 80) {
            headerElement.classList.add("header-hidden");
        } else {
            headerElement.classList.remove("header-hidden");
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}