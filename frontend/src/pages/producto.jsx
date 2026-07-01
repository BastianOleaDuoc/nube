import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = "https://nube-nz47.onrender.com/api";

const CATEGORIAS = [
  'Todas',
  'Hamburguesas',
  'Entradas',
  'Chorrillanas',
  'Tragos',
  'Mocktails',
  'Cafeteria',
  'Postres',
  'Bebidas',
];

// 🛠️ FUNCIONES DE RESPALDO DIRECTAMENTE AQUÍ PARA EVITAR FALLAS DE IMPORTACIÓN
function dineroLocal(valor) {
  const numero = Math.round(Number(valor) || 0);
  return "$" + numero.toLocaleString("es-CL");
}

function normalizarTextoLocal(texto) {
  if (!texto) return "";
  return texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeProductoLocal(p) {
  if (!p) return {};
  return {
    id: p.id || p._id,
    nombre: p.nombre || p.name || "Producto sin nombre",
    categoria: p.categoria || p.category || "General",
    precio: Number(p.precio || p.price || 0),
    estado: p.estado || p.status || "Disponible",
    img: p.img || p.imagen || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
  };
}

const FALLBACK_LOCAL = [
  { id: 1, nombre: "Hamburguesa Mestrax", categoria: "Hamburguesas", precio: 8990, estado: "Disponible", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
  { id: 2, nombre: "Papas Chorrillanas", categoria: "Chorrillanas", precio: 12990, estado: "Disponible", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500" }
];

export default function Producto({ carrito, actualizarCarrito }) {
  const [categoria, setCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState(FALLBACK_LOCAL);
  const [loading, setLoading] = useState(true);
  const [notificacion, setNotificacion] = useState('');

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch(`${API_BASE}/productos`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el menú');
        }

        const data = await response.json();
        setProductos(Array.isArray(data) && data.length > 0 ? data.map(normalizeProductoLocal) : FALLBACK_LOCAL);
      } catch (error) {
        console.error(error);
        setProductos(FALLBACK_LOCAL);
      } finally {
        // CORREGIDO: Se cambió 'loading(false)' por 'setLoading(false)'
        setLoading(false); 
      }
    };

    cargarProductos();
  }, []);

  useEffect(() => {
    if (notificacion) {
      const timer = setTimeout(() => setNotificacion(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notificacion]);

  const productosFiltrados = useMemo(() => {
    const textoBusqueda = normalizarTextoLocal(busqueda);

    return productos.filter((producto) => {
      const coincideCategoria = categoria === 'Todas' || producto.categoria === categoria;
      const coincideBusqueda = normalizarTextoLocal(producto.nombre).includes(textoBusqueda);
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, categoria, busqueda]);

  const agregarAlCarrito = (producto) => {
    const productoNormalizado = normalizeProductoLocal(producto);

    if (productoNormalizado.estado !== 'Disponible') {
      setNotificacion(`⚠️ ${productoNormalizado.nombre} no está disponible por ahora`);
      return;
    }

    const nuevoCarrito = [...(carrito || [])];
    const index = nuevoCarrito.findIndex((item) => item.id === productoNormalizado.id);

    if (index !== -1) {
      nuevoCarrito[index] = {
        ...nuevoCarrito[index],
        cantidad: (nuevoCarrito[index].cantidad || 1) + 1,
      };
    } else {
      nuevoCarrito.push({ ...productoNormalizado, cantidad: 1 });
    }

    if (actualizarCarrito) {
      actualizarCarrito(nuevoCarrito);
    }
    setNotificacion(`🛒 ${productoNormalizado.nombre} agregado al carrito`);
  };

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

      <section className="text-center mb-5 mt-3">
        <div className="badge-modern mb-3">Menú Exclusivo</div>
        <h2 className="fw-bolder m-0 display-5">Nuestra <span className="text-gradient">Selección</span></h2>
      </section>

      <section className="mb-5">
        <div className="filter-bar-modern d-flex flex-column flex-md-row align-items-center gap-2 p-2 mx-auto" style={{ maxWidth: '900px' }}>
          <div className="position-relative flex-grow-1 w-100">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-4 text-muted fs-5"></i>
            <input
              type="text"
              className="form-control border-0 ps-5 py-3 shadow-none text-white w-100"
              placeholder="Busca tu plato o bebida favorita..."
              style={{ background: 'transparent', fontSize: '1.05rem' }}
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>

          <div className="divider"></div>

          <div className="position-relative w-100 category-select-container">
            <i className="bi bi-funnel position-absolute top-50 start-0 translate-middle-y ms-4 text-muted z-1"></i>
            <select
              className="form-select border-0 ps-5 py-3 shadow-none text-white w-100 fw-medium"
              style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            >
              {CATEGORIAS.map((item) => (
                <option key={item} value={item} className="text-dark">
                  {item === 'Todas' ? 'Todo el menú' : item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <div className="text-center text-white py-5">Cargando menú...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="card glass-panel p-4 text-center">
            <p className="mb-0">No encontramos productos con esos filtros.</p>
          </div>
        ) : (
          <div className="grid row g-4">
            {productosFiltrados.map((producto) => {
              const disponible = producto.estado === 'Disponible';

              return (
                <article key={producto.id} className="col-md-4 col-lg-3 mb-4">
                  <div className="card h-100">
                    <Link to={`/producto/${producto.id}`} className="text-decoration-none">
                      <img
                        src={producto.img}
                        className="card-img-top rounded-top"
                        alt={producto.nombre}
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(event) => {
                          event.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                        }}
                      />
                    </Link>
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between gap-2 align-items-start mb-1">
                        <h5 className="card-title fw-bold text-dark mb-0">{producto.nombre}</h5>
                        {!disponible && <span className="badge bg-secondary">Pausado</span>}
                      </div>
                      <p className="card-text text-muted small">{producto.categoria}</p>
                      <p className="card-text fw-bold mt-auto fs-5" style={{ color: '#60a5fa' }}>
                        {dineroLocal(producto.precio)}
                      </p>
                      <button
                        className="btn-primary-modern w-100 mt-2 fw-bold"
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={!disponible}
                      >
                        {disponible ? 'Agregar al carrito' : 'No disponible'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}