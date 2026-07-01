// js/perfil.js

/**
 * Lógica pura de JS para gestionar la carga y cierre de sesión
 * independiente del componente React que lo llame.
 */


const API_BASE = "https://nube-nz47.onrender.com/api";

export async function obtenerDatosPerfil(email) {
    try {
        // CORREGIDO: Se cambia http://localhost:8080/api por la variable API_BASE de Render
        const response = await fetch(`${API_BASE}/usuarios/buscar?email=${email}`);
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