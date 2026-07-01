/**
 * js/navbar.js
 * Actualiza el enlace del usuario en el menú según si hay sesión iniciada.
 */

export function actualizarNavbar() {
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    const usuarioLink = document.getElementById("usuarioLink");

    if (!usuarioLink) return;

    if (usuarioActivo) {
        // Si hay sesión, el link lleva al perfil
        usuarioLink.href = "./perfil.html";
        usuarioLink.textContent = "Mi Perfil"; // Opcional: cambiar el texto
    } else {
        // Si no hay sesión, lleva al login
        usuarioLink.href = "./login.html";
        usuarioLink.textContent = "Login";
    }
}

// Mantenemos esto para cuando cargues el HTML estáticamente
document.addEventListener("DOMContentLoaded", actualizarNavbar);