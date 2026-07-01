import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  PRODUCTOS_FALLBACK,
  PRODUCTOS_IMAGES,
  dinero,
  normalizeProducto,
} from '../data/productos';


const API_BASE = "https://nube-sz47.onrender.com/api";

export default function ProductoDetalle({ carrito, actualizarCarrito }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [notificacion, setNotificacion] = useState('');

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(`${API_BASE}/productos/${id}`);
        if (!response.ok) {
          throw new Error('Producto no encontrado en API');
        }

        const data = await response.json();
        setProducto(normalizeProducto(data));
      } catch {
        const fallback = PRODUCTOS_FALLBACK.find((item) => String(item.id) === String(id));
        setProducto(fallback || null);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  useEffect(() => {
    if (notificacion) {
      const timer = setTimeout(() => setNotificacion(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notificacion]);

  const agregarAlCarrito = () => {
    if (!producto || producto.estado !== 'Disponible') {
      return;
    }

    const nuevoCarrito = [...carrito];
    const index = nuevoCarrito.findIndex((item) => item.id === producto.id);

    if (index !== -1) {
      nuevoCarrito[index] = {
        ...nuevoCarrito[index],
        cantidad: (nuevoCarrito[index].cantidad || 1) + 1,
      };
    } else {
      nuevoCarrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito(nuevoCarrito);
    setNotificacion(`🛒 ${producto.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <main className="container py-5 text-center text-white">
        <div className="spinner-border text-primary mb-2" role="status"></div>
        <p className="mb-0">Cargando producto...</p>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="container py-5 page-shell text-center">
        <div className="card glass-panel p-4 mx-auto" style={{ maxWidth: '560px' }}>
          <h1 className="fw-bold mb-3">Producto no encontrado</h1>
          <Link to="/productos" className="btn btn-primary fw-bold">Volver al menú</Link>
        </div>
      </main>
    );
  }

  const disponible = producto.estado === 'Disponible';

  return (
    <main className="container py-5 page-shell">

      {notificacion && (
        <div 
          className="position-fixed bottom-0 end-0 m-4 alert alert-success shadow-lg z-3 transition-fade"
          style={{ minWidth: '280px' }}
        >
          {notificacion}
        </div>
      )}

      <div className="row g-4 align-items-center">
        <div className="col-lg-6">
          <img
            src={producto.img}
            alt={producto.nombre}
            className="rounded-4 shadow-lg w-100"
            style={{ maxHeight: '520px', objectFit: 'cover' }}
            onError={(event) => {
              event.currentTarget.src = PRODUCTOS_IMAGES.default || PRODUCTOS_FALLBACK[0].img;
            }}
          />
        </div>
        <div className="col-lg-6">
          <span className="soft-badge">{producto.categoria}</span>
          <h1 className="fw-bolder display-5 mt-3">{producto.nombre}</h1>
          <p className="text-muted mb-4">
            Producto de la carta Mestrax, listo para sumar a tu pedido.
          </p>
          <p className="fw-bold fs-2 mb-4" style={{ color: '#60a5fa' }}>{dinero(producto.precio)}</p>
          
          {!disponible && <div className="alert alert-warning py-2 mb-4">Este producto no está disponible por ahora.</div>}
          
          <div className="d-flex flex-wrap gap-3">
            <button className="btn-primary-modern px-4 py-2 fw-bold" type="button" onClick={agregarAlCarrito} disabled={!disponible}>
              Agregar al carrito
            </button>
            <Link to="/productos" className="btn-secondary-modern px-4 py-2 text-decoration-none d-flex align-items-center">Volver al menú</Link>
          </div>
        </div>
      </div>
    </main>
  );
}