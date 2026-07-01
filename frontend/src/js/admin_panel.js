/**
 * js/admin_panel.js
 * Gestión de vistas y seguridad para el panel de administración
 */

// --- SEGURIDAD Y CARGA ---
document.addEventListener("DOMContentLoaded", () => {
    const adminEmail = localStorage.getItem("adminActivo");
    const emailSpan = document.getElementById("adminEmail");

    if (!adminEmail) {
        alert("Acceso denegado. Por favor, inicie sesión como administrador.");
        window.location.href = "loginAdmin.html";
        return;
    }

    if (emailSpan) {
        emailSpan.textContent = adminEmail;
    }
});

// --- ACCIONES ---
export function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        localStorage.removeItem("adminActivo");
        window.location.href = "loginAdmin.html";
    }
}

/**
 * Alterna entre vistas de forma eficiente.
 * @param {string} vistaId - El nombre de la vista (ej: 'dashboard', 'productos')
 */
export function mostrarVista(vistaId) {
    const vistas = ['dashboardView', 'productosView', 'reservasView', 'reportesView', 'ventasView'];
    
    // Asegura que el ID tenga el sufijo 'View'
    const vistaObjetivo = vistaId.endsWith('View') ? vistaId : `${vistaId}View`;

    vistas.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Alterna la clase d-none usando toggle
            el.classList.toggle('d-none', id !== vistaObjetivo);
        }
    });
}

// Exponer funciones al objeto window para los botones en HTML (onclick="mostrarVista('...')")
window.cerrarSesion = cerrarSesion;
window.mostrarVista = mostrarVista;