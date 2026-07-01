/**
 * js/producto.js
 * Lógica de negocio para productos y carrito.
 */

const API_BASE = "https://nube-nz47.onrender.com/api";

// Esta variable contendrá los datos del servidor
let PRODUCTOS = [];

/** AGREGADO: Fallback de productos e imágenes para evitar que falle el Frontend */
export const PRODUCTOS_IMAGES = {
    default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
};

export const PRODUCTOS_FALLBACK = [
    { id: 1, nombre: "Hamburguesa Mestrax", categoria: "Hamburguesas", precio: 8990, estado: "Disponible", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
    { id: 2, nombre: "Papas Chorrillanas", categoria: "Chorrillanas", precio: 12990, estado: "Disponible", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500" }
];

/** Formateo de dinero (Chile) */
export function dinero(valor) {
    const numero = Math.round(Number(valor) || 0);
    return "$" + numero.toLocaleString("es-CL");
}

/** AGREGADO: Funciones de normalización requeridas por Producto.jsx */
export function normalizeProducto(p) {
    if (!p) return {};
    return {
        id: p.id || p._id,
        nombre: p.nombre || p.name || "Producto sin nombre",
        categoria: p.categoria || p.category || "General",
        precio: Number(p.precio || p.price || 0),
        estado: p.estado || p.status || "Disponible",
        img: p.img || p.imagen || PRODUCTOS_IMAGES.default
    };
}

export function normalizarTexto(texto) {
    if (!texto) return "";
    return texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Carga los productos desde el servidor */
export async function cargarProductos() {
    try {
        const response = await fetch(`${API_BASE}/productos`);
        if (!response.ok) throw new Error("Error en servidor");
        PRODUCTOS = await response.json();
        return PRODUCTOS;
    } catch (error) {
        console.error("No se pudo conectar con el backend:", error);
        return [];
    }
}

/** Lógica pura de carrito */
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

/** Filtra el array de productos */
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