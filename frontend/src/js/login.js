/**
 * js/login.js
 * Lógica de autenticación centralizada para el frontend
 */


const API_BASE = "https://nube-nz47.onrender.com/api";

/**
 * Función genérica de login para evitar duplicar código
 */
async function realizarLogin(endpoint, credenciales) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciales)
    });

    if (!response.ok) throw new Error("Credenciales inválidas");
    return await response.json();
}

// --- Login Usuarios ---
export async function iniciarLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email")?.value.trim();
    const pass = document.getElementById("password")?.value.trim();

    if (!email || !pass) return alert("Completa todos los campos");

    try {
        const user = await realizarLogin("/usuario/login", { email, password: pass });
        localStorage.setItem("usuarioActivo", user.email);
        alert(`¡Bienvenido a Mestrax, ${user.nombre || 'Usuario'}!`);
        window.location.href = "perfil.html";
    } catch (err) {
        alert("Correo o contraseña incorrectos.");
    }
}

// --- Login Administradores ---
export async function iniciarLoginAdmin(e) {
    e.preventDefault();
    const email = document.getElementById("email")?.value.trim();
    const pass = document.getElementById("password")?.value.trim();

    if (!email || !pass) return alert("Completa todos los campos");

    try {
        const admin = await realizarLogin("/admin/login", { email, password: pass });
        localStorage.setItem("adminActivo", admin.email);
        alert("Bienvenido Administrador");
        window.location.href = "admin_panel.html";
    } catch (err) {
        alert("Credenciales de administrador incorrectas.");
    }
}

// Inicialización de eventos
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const adminForm = document.getElementById("adminForm");

    if (loginForm) loginForm.addEventListener("submit", iniciarLogin);
    if (adminForm) adminForm.addEventListener("submit", iniciarLoginAdmin);
});