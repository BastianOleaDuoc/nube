/**
 * js/registro.js
 * Lógica de comunicación con el backend para el registro de usuarios
 */

import { API_BASE } from './config'; // Asegúrate de tener tu URL base aquí o reemplázalo por el string directo

/**
 * Registra un nuevo usuario en la base de datos de Spring Boot
 * @param {Object} datos - Objeto con { nombre, email, password }
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function registrarUsuario(datos) {
    try {
        const response = await fetch(`${API_BASE}/usuarios/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: datos.nombre,
                email: datos.email,
                password: datos.password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Retorna un error con el mensaje del backend o uno genérico
            throw new Error(data.mensaje || "Error al registrar usuario en el servidor");
        }

        // Si todo sale bien, guardamos el correo en el almacenamiento local
        localStorage.setItem("usuarioActivo", data.email);
        return { success: true, usuario: data };

    } catch (error) {
        console.error("Error en registro.js:", error);
        return { success: false, message: error.message };
    }
}

/** * Validaciones cliente (puedes usarlas antes de llamar a la función de arriba) 
 */
export function validarRegistro(form) {
    if (!form.nombre.trim() || !form.email.trim() || !form.password) {
        return "Completa todos los campos";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
        return "Correo electrónico inválido";
    }
    if (form.password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres";
    }
    if (form.password !== form.confirmPassword) {
        return "Las contraseñas no coinciden";
    }
    return null; // Sin errores
}