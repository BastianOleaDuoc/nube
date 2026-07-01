import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { PRODUCTOS_IMAGES, dinero, normalizeCarritoItem } from '../data/productos';


const API_BASE = "https://nube-nz47.onrender.com/api";

export default function Carrito({ usuario, carrito, actualizarCarrito }) {
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const items = useMemo(() => carrito.map(normalizeCarritoItem), [carrito]);
  const total = useMemo(() => items.reduce((acc, item) => acc + item.precio * item.cantidad, 0), [items]);

  const vaciarCarrito = () => {
    if (items.length === 0) return;
    if (window.confirm('¿Quieres vaciar el carrito?')) {
      actualizarCarrito([]);
    }
  };

  const eliminarProducto = (id) => {
    actualizarCarrito(items.filter((item) => item.id !== id));
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarProducto(id);
      return;
    }
    actualizarCarrito(
      items.map((item) => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item))
    );
  };

  const obtenerCliente = () => {
    if (!usuario) return 'Cliente invitado';
    if (typeof usuario === 'string') return usuario;
    return usuario.nombre || usuario.email || 'Cliente invitado';
  };

  const obtenerResumenProductos = () => {
    return items.map((item) => `${item.cantidad}x ${item.nombre}`).join(', ');
  };

  const finalizarPedido = async () => {
    if (items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    setIsSubmitting(true);
    setMensaje('');
    setError('');

    try {
      const response = await fetch(`${API_BASE}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: obtenerCliente(),
          producto: obtenerResumenProductos(),
          total: total,
          metodo: metodoPago,
          estado: 'Pagada',
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo registrar la venta');
      }

      setMensaje(`Venta registrada por ${dinero(total)}. Gracias por comprar en Mestrax.`);
      actualizarCarrito([]);
    } catch (submitError) {
      console.error(submitError);
      setError('No se pudo registrar la venta. Revisa que el backend esté ejecutándose.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container py-5 page-shell">
      <div className="text-center mb-4">
        <span className="soft-badge">Tu pedido</span>
        <h2 className="fw-bold mt-3 mb-0">Carrito de Compras</h2>
      </div>

      {items.length === 0 ? (
        <section className="card p-4 text-center shadow">
          {mensaje ? (
            <div className="alert alert-success py-3 mb-3">{mensaje}</div>
          ) : (
            <p className="mb-3">Tu carrito está vacío</p>
          )}
          <Link to="/productos" className="btn btn-dark w-auto mx-auto px-4">Ver productos</Link>
        </section>
      ) : (
        <section>
          <div className="table-responsive shadow rounded-4 border border-secondary border-opacity-25">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-end">Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                  <th className="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.img}
                          alt={item.nombre}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                          onError={(event) => {
                            event.currentTarget.src = PRODUCTOS_IMAGES.default;
                          }}
                        />
                        <span className="fw-medium">{item.nombre}</span>
                      </div>
                    </td>
                    <td className="text-end">{dinero(item.precio)}</td>
                    <td className="text-center">
                      <div className="d-inline-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-light"
                          type="button"
                          onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                        >
                          -
                        </button>
                        <span className="fw-bold" style={{ minWidth: '28px', display: 'inline-block' }}>{item.cantidad}</span>
                        <button
                          className="btn btn-sm btn-outline-light"
                          type="button"
                          onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-end text-primary fw-bold">{dinero(item.precio * item.cantidad)}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => eliminarProducto(item.id)}>
                        <i className="bi bi-trash me-1"></i> Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">Total a pagar:</td>
                  <td className="text-end fw-bold text-success fs-5">{dinero(total)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="card glass-panel p-3 mt-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-5">
                <label className="form-label">Método de pago</label>
                <select className="form-select" value={metodoPago} onChange={(event) => setMetodoPago(event.target.value)}>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
              <div className="col-md-7 text-md-end">
                <p className="text-muted mb-1">La venta quedará registrada en el panel admin.</p>
                <strong className="text-success fs-5">{dinero(total)}</strong>
              </div>
            </div>
            {error && <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div>}
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
            <button className="btn btn-outline-danger px-4" type="button" onClick={vaciarCarrito}>Vaciar carrito</button>
            <button className="btn btn-primary px-5 fw-bold" type="button" onClick={finalizarPedido} disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Finalizar pedido'}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}