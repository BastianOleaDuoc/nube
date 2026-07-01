/**
 * js/producto.js
 * Lógica de negocio para productos y carrito.
 */
import { API_BASE } from '../data/productos';

// Esta variable contendrá los datos del servidor
let PRODUCTOS = [];

/** Formateo de dinero (Chile) */
export function dinero(valor) {
    const numero = Math.round(Number(valor) || 0);
    return "$" + numero.toLocaleString("es-CL");
}

/** Carga los productos desde Spring Boot en la NUBE (Render) */
export async function cargarProductos() {
    try {
        const response = await fetch(`${API_BASE}/productos`);
        if (!response.ok) throw new Error("Error en servidor");
        PRODUCTOS = await response.json();
        return PRODUCTOS;
    } catch (error) {
        console.error("No se pudo conectar con el backend en la nube:", error);
        return [];
    }
}

/** Lógica pura de carrito (sin tocar el DOM para que React lo gestione) */
export function agregarAlCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const producto = PRODUCTOS.find(p => p.id === id);

    if (producto) {
        const index = carrito.findIndex(p => p.id === id);
        if (index !== -1) {
            carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        return { success: true, nombre: producto.nombre || producto.name };
    }
    return { success: false };
}

/** Filtra el array de productos (lógica pura de JS) */
export function filtrarProductos(categoria, busqueda) {
    let lista = [...PRODUCTOS];
    
    if (categoria && categoria !== "Todas") {
        lista = lista.filter(p => (p.categoria || p.category) === categoria);
    }
    
    if (busqueda) {
        const term = busqueda.toLowerCase();
        lista = lista.filter(p => (p.nombre || p.name).toLowerCase().includes(term));
    }
    
    return lista;
}