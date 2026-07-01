// js/perfil.js

/**
 * Lógica pura de JS para gestionar la carga y cierre de sesión
 * independiente del componente React que lo llame.
 */

export async function obtenerDatosPerfil(email) {
    try {
        const response = await fetch(`http://localhost:8080/api/usuarios/buscar?email=${email}`);
        if (!response.ok) throw new Error("Error en servidor");
        return await response.json();
    } catch (error) {
        console.error("Fallo al obtener perfil:", error);
        return null;
    }
}

export function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "/";
}

// Si necesitas que esto interactúe con el DOM directamente (sin React):
document.addEventListener("DOMContentLoaded", async () => {
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    if (!usuarioActivo) return;

    const datos = await obtenerDatosPerfil(usuarioActivo);
    if (datos) {
        // Solo manipular si los elementos existen en el HTML plano
        const nombreEl = document.getElementById("nombreUsuario");
        if (nombreEl) nombreEl.textContent = datos.nombre;
    }
});