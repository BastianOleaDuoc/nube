import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { dinero } from '../data/productos';

const API_BASE = "https://nube-sz47.onrender.com/api";

const menuItems = [
  { icon: 'bi-speedometer2', label: 'Dashboard' },
  { icon: 'bi-box-seam', label: 'Productos' },
  { icon: 'bi-calendar2-check', label: 'Reservas' },
  { icon: 'bi-cash-coin', label: 'Ventas' },
  { icon: 'bi-chat-dots', label: 'Contactos' },
  { icon: 'bi-graph-up', label: 'Reportes' },
];

const categorias = [
  'Hamburguesas',
  'Entradas',
  'Chorrillanas',
  'Tragos',
  'Mocktails',
  'Cafeteria',
  'Postres',
  'Bebidas',
];

const estadosProducto = ['Disponible', 'No disponible'];
const estadosReserva = ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'];
const estadosReservaBloqueantes = ['Pendiente', 'Confirmada'];
const estadosVenta = ['Pagada', 'Pendiente', 'Anulada'];
const metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia'];
const mesasRestaurante = Array.from({ length: 15 }, (_, index) => index + 1);

const productoInicial = {
  nombre: '',
  categoria: 'Hamburguesas',
  precio: '',
  stock: '',
  estado: 'Disponible',
};

const reservaInicial = {
  cliente: '',
  telefono: '',
  email: '',
  fecha: '',
  hora: '',
  personas: 2,
  mesa: '',
  estado: 'Pendiente',
  comentarios: '',
};

const ventaInicial = {
  cliente: '',
  producto: '',
  total: '',
  metodo: 'Efectivo',
  estado: 'Pagada',
};

const normalizar = (valor = '') =>
  String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const fechaCorta = (valor) => {
  if (!valor) {
    return '-';
  }

  return new Date(valor).toLocaleDateString('es-CL');
};

const descargarCsv = (nombreArchivo, encabezados, filas) => {
  const escapeCsv = (valor) => `"${String(valor ?? '').replace(/"/g, '""')}"`;
  const csv = [
    encabezados.map(escapeCsv).join(','),
    ...filas.map((fila) => encabezados.map((header) => escapeCsv(fila[header])).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(url);
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [productos, setProductos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [alerta, setAlerta] = useState({ type: '', message: '' });
  const [isSaving, setIsSaving] = useState(false);

  const [productoForm, setProductoForm] = useState(productoInicial);
  const [productoEditId, setProductoEditId] = useState(null);
  const [productoFiltro, setProductoFiltro] = useState({ texto: '', categoria: 'Todas', estado: 'Todos' });

  const [reservaForm, setReservaForm] = useState(reservaInicial);
  const [reservaEditId, setReservaEditId] = useState(null);
  const [reservaFiltro, setReservaFiltro] = useState({ texto: '', estado: 'Todos' });

  const [ventaForm, setVentaForm] = useState(ventaInicial);
  const [ventaEditId, setVentaEditId] = useState(null);
  const [ventaFiltro, setVentaFiltro] = useState({ texto: '', estado: 'Todos' });

  const [contactoFiltro, setContactoFiltro] = useState('');

  const adminEmail = localStorage.getItem('adminActivo') || 'Administrador';

  const cargarDatos = async () => {
    setLoadingData(true);
    setAlerta({ type: '', message: '' });

    try {
      const [productosRes, reservasRes, ventasRes, contactosRes] = await Promise.all([
        fetch(`${API_BASE}/productos`),
        fetch(`${API_BASE}/reservas`),
        fetch(`${API_BASE}/ventas`),
        fetch(`${API_BASE}/contactos`),
      ]);

      if (!productosRes.ok || !reservasRes.ok || !ventasRes.ok || !contactosRes.ok) {
        throw new Error('No se pudieron cargar los datos del panel');
      }

      const [productosData, reservasData, ventasData, contactosData] = await Promise.all([
        productosRes.json(),
        reservasRes.json(),
        ventasRes.json(),
        contactosRes.json(),
      ]);

      setProductos(Array.isArray(productosData) ? productosData : []);
      setReservas(Array.isArray(reservasData) ? reservasData : []);
      setVentas(Array.isArray(ventasData) ? ventasData : []);
      setContactos(Array.isArray(contactosData) ? contactosData : []);
    } catch (error) {
      console.error(error);
      setAlerta({ type: 'danger', message: 'No se pudieron cargar los datos. Revisa que el backend este ejecutandose.' });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('adminActivo')) {
      navigate('/login-admin');
      return;
    }

    const timer = window.setTimeout(() => {
      cargarDatos();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  const resumen = useMemo(() => {
    const productosActivos = productos.filter((item) => item.estado === 'Disponible').length;
    const productosBajoStock = productos.filter((item) => Number(item.stock || 0) <= 5).length;
    const reservasPendientes = reservas.filter((item) => item.estado === 'Pendiente').length;
    const reservasConfirmadas = reservas.filter((item) => item.estado === 'Confirmada').length;
    const ventasValidas = ventas.filter((item) => item.estado !== 'Anulada');
    const totalVentas = ventasValidas.reduce((sum, item) => sum + Number(item.total || 0), 0);

    return {
      productosActivos,
      productosBajoStock,
      reservasPendientes,
      reservasConfirmadas,
      totalVentas,
      ventasValidas: ventasValidas.length,
    };
  }, [productos, reservas, ventas]);

  const productosFiltrados = useMemo(() => {
    const texto = normalizar(productoFiltro.texto);

    return productos.filter((item) => {
      const coincideTexto = normalizar(`${item.nombre} ${item.categoria}`).includes(texto);
      const coincideCategoria = productoFiltro.categoria === 'Todas' || item.categoria === productoFiltro.categoria;
      const coincideEstado = productoFiltro.estado === 'Todos' || item.estado === productoFiltro.estado;
      return coincideTexto && coincideCategoria && coincideEstado;
    });
  }, [productos, productoFiltro]);

  const reservasFiltradas = useMemo(() => {
    const texto = normalizar(reservaFiltro.texto);

    return reservas.filter((item) => {
      const coincideTexto = normalizar(`${item.cliente} ${item.email} ${item.telefono} ${item.mesa}`).includes(texto);
      const coincideEstado = reservaFiltro.estado === 'Todos' || item.estado === reservaFiltro.estado;
      return coincideTexto && coincideEstado;
    });
  }, [reservas, reservaFiltro]);

  const disponibilidadReserva = useMemo(() => {
    if (!reservaForm.fecha || !reservaForm.hora) {
      return { disponibles: [], ocupadas: [] };
    }

    const ocupadas = [
      ...new Set(
        reservas
          .filter((item) =>
            item.fecha === reservaForm.fecha
            && item.hora === reservaForm.hora
            && estadosReservaBloqueantes.includes(item.estado)
          )
          .map((item) => Number(item.mesa))
          .filter((mesa) => Number.isInteger(mesa) && mesa > 0)
      ),
    ];

    return {
      ocupadas,
      disponibles: mesasRestaurante.filter((mesa) => !ocupadas.includes(mesa)),
    };
  }, [reservaForm.fecha, reservaForm.hora, reservas]);

  const ventasFiltradas = useMemo(() => {
    const texto = normalizar(ventaFiltro.texto);

    return ventas.filter((item) => {
      const coincideTexto = normalizar(`${item.cliente} ${item.producto} ${item.metodo}`).includes(texto);
      const coincideEstado = ventaFiltro.estado === 'Todos' || item.estado === ventaFiltro.estado;
      return coincideTexto && coincideEstado;
    });
  }, [ventas, ventaFiltro]);

  const actividadReciente = useMemo(() => {
    const reservasItems = reservas.slice(-3).map((item) => `Reserva ${item.estado || 'Pendiente'}: ${item.cliente || 'Cliente'} mesa ${item.mesa || '-'}`);
    const ventasItems = ventas.slice(-3).map((item) => `Venta ${item.estado || 'Pagada'}: ${item.producto || 'Producto'} por ${dinero(item.total)}`);
    const contactosItems = contactos.slice(-3).map((item) => `Contacto: ${item.nombre || 'Cliente'} (${item.email || '-'})`);
    return [...reservasItems, ...ventasItems, ...contactosItems].slice(-5).reverse();
  }, [reservas, ventas, contactos]);

  const cerrarSesion = () => {
    localStorage.removeItem('adminActivo');
    navigate('/login-admin');
  };

  const mostrarMensaje = (message, type = 'success') => {
    setAlerta({ type, message });
  };

  const limpiarProductoForm = () => {
    setProductoEditId(null);
    setProductoForm(productoInicial);
  };

  const limpiarReservaForm = () => {
    setReservaEditId(null);
    setReservaForm(reservaInicial);
  };

  const limpiarVentaForm = () => {
    setVentaEditId(null);
    setVentaForm(ventaInicial);
  };

  const guardarProducto = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const payload = {
      nombre: productoForm.nombre.trim(),
      categoria: productoForm.categoria,
      precio: Number(productoForm.precio),
      stock: Number(productoForm.stock),
      estado: productoForm.estado,
    };

    if (!payload.nombre || Number.isNaN(payload.precio) || Number.isNaN(payload.stock)) {
      mostrarMensaje('Completa nombre, precio y stock del producto.', 'danger');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/productos${productoEditId ? `/${productoEditId}` : ''}`, {
        method: productoEditId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar el producto');
      }

      const productoGuardado = await response.json();
      setProductos((prev) =>
        productoEditId
          ? prev.map((item) => (item.id === productoEditId ? productoGuardado : item))
          : [productoGuardado, ...prev]
      );
      limpiarProductoForm();
      mostrarMensaje(productoEditId ? 'Producto actualizado.' : 'Producto creado.');
    } catch (error) {
      console.error(error);
      mostrarMensaje('No se pudo guardar el producto.', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const editarProducto = (producto) => {
    setProductoEditId(producto.id);
    setProductoForm({
      nombre: producto.nombre || '',
      categoria: producto.categoria || 'Hamburguesas',
      precio: producto.precio ?? '',
      stock: producto.stock ?? '',
      estado: producto.estado || 'Disponible',
    });
    setActiveSection('Productos');
  };

  const cambiarEstadoProducto = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/productos/${id}/toggle`, { method: 'PUT' });
      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado');
      }

      const actualizado = await response.json();
      setProductos((prev) => prev.map((item) => (item.id === id ? actualizado : item)));
      mostrarMensaje('Estado de producto actualizado.');
    } catch (error) {
      console.error(error);
      mostrarMensaje('No se pudo actualizar el producto.', 'danger');
    }
  };

  const eliminarProducto = async (producto) => {
    if (!window.confirm(`Eliminar ${producto.nombre}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/productos/${producto.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto');
      }

      setProductos((prev) => prev.filter((item) => item.id !== producto.id));
      mostrarMensaje('Producto eliminado.');
    } catch (error) {
      console.error(error);
      mostrarMensaje('No se pudo eliminar el producto.', 'danger');
    }
  };

  const guardarReserva = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const payload = {
      cliente: reservaForm.cliente.trim(),
      telefono: reservaForm.telefono.trim(),
      email: reservaForm.email.trim(),
      fecha: reservaForm.fecha,
      hora: reservaForm.hora,
      personas: Number(reservaForm.personas),
      mesa: reservaForm.mesa === '' ? null : Number(reservaForm.mesa),
      comentarios: reservaForm.comentarios.trim(),
      estado: reservaForm.estado,
    };

    if (!payload.cliente || !payload.fecha || !payload.hora || Number.isNaN(payload.personas)) {
      mostrarMensaje('Completa cliente, fecha, hora y personas de la reserva.', 'danger');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/reservas${reservaEditId ? `/${reservaEditId}` : ''}`, {
        method: reservaEditId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('La mesa ya esta reservada para ese horario.');
        }

        throw new Error('No se pudo guardar la reserva');
      }

      const reservaGuardada = await response.json();
      setReservas((prev) =>
        reservaEditId
          ? prev.map((item) => (item.id === reservaEditId ? reservaGuardada : item))
          : [reservaGuardada, ...prev]
      );
      limpiarReservaForm();
      mostrarMensaje(reservaEditId ? 'Reserva actualizada.' : 'Reserva creada.');
    } catch (error) {
      console.error(error);
      mostrarMensaje(error.message || 'No se pudo guardar la reserva.', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const editarReserva = (reserva) => {
    setReservaEditId(reserva.id);
    setReservaForm({
      cliente: reserva.cliente || '',
      telefono: reserva.telefono || '',
      email: reserva.email || '',
      fecha: reserva.fecha || '',
      hora: reserva.hora || '',
      personas: reserva.personas || 2,
      mesa: reserva.mesa ?? '',
      estado: reserva.estado || 'Pendiente',
      comentarios: reserva.comentarios || '',
    });
    setActiveSection('Reservas');
  };

  const cambiarEstadoReserva = async (reserva, estado) => {
    try {
      const response = await fetch(`${API_BASE}/reservas/${reserva.id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('La mesa ya esta reservada para ese horario.');
        }

        throw new Error('No se pudo actualizar la reserva');
      }

      const actualizada = await response.json();
      setReservas((prev) => prev.map((item) => (item.id === reserva.id ? actualizada : item)));
      mostrarMensaje('Estado de reserva actualizado.');
    } catch (error) {
      console.error(error);
      mostrarMensaje(error.message || 'No se pudo actualizar la reserva.', 'danger');
    }
  };

  const eliminarReserva = async (reserva) => {
    if (!window.confirm(`Eliminar la reserva de ${reserva.cliente}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/reservas/${reserva.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('No se pudo eliminar la reserva');
      }

      setReservas((prev) => prev.filter((item) => item.id !== reserva.id));
      mostrarMensaje('Reserva eliminada.');
    } catch (error) {
      console.error(error);
      mostrarMensaje('No se pudo eliminar la reserva.', 'danger');
    }
  };

  const guardarVenta = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const payload = {
      cliente: ventaForm.cliente.trim(),
      producto: ventaForm.producto.trim(),
      total: Number(ventaForm.total),
      metodo: ventaForm.metodo,
      estado: ventaForm.estado,
    };

    if (!payload.cliente || !payload.producto || Number.isNaN(payload.total)) {
      mostrarMensaje('Completa cliente, producto y total de la venta.', 'danger');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/ventas${ventaEditId ? `/${ventaEditId}` : ''}`, {
        method: ventaEditId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar la venta');
      }

      const ventaGuardada = await response.json();
      setVentas((prev) =>
        ventaEditId
          ? prev.map((item) => (item.id === ventaEditId ? ventaGuardada : item))
          : [ventaGuardada, ...prev]
      );
      limpiarVentaForm();
      mostrarMensaje(ventaEditId ? 'Venta actualizada.' : 'Venta registrada.');
    } catch (error) {
      console.error(error);
      mostrarMensaje('No se pudo guardar la venta.', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const editarVenta = (venta) => {
    setVentaEditId(venta.id);
    setVentaForm({
      cliente: venta.cliente || '',
      producto: venta.producto || '',
      total: venta.total ?? '',
      metodo: venta.metodo || 'Efectivo',
      estado: venta.estado || 'Pagada',
    });
    setActiveSection('Ventas');
  };

  const cambiarEstadoVenta = async (venta, estado) => {
    try {
      const response = await fetch(`${API_BASE}/ventas/${venta.id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar la venta');
      }

      const actualizada = await response.json();
      setVentas((prev) => prev.map((item) => (item.id === venta.id ? actualizada : item)));
      mostrarMensaje('Estado de venta actualizado.');
    } catch (error) {
      console.error(error);
      mostrarMensaje('No se pudo actualizar la venta.', 'danger');
    }
  };

  const eliminarVenta = async (venta) => {
    if (!window.confirm(`Eliminar venta de ${venta.cliente}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/ventas/${venta.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('No se pudo eliminar la venta');
      }

      setVentas((prev) => prev.filter((item) => item.id !== venta.id));
      mostrarMensaje('Venta eliminada.');
    } catch (error) {
      console.error(error);
      mostrarMensaje('No se pudo eliminar la venta.', 'danger');
    }
  };

  const exportarProductos = () => {
    descargarCsv('productos-mestrax.csv', ['id', 'nombre', 'categoria', 'precio', 'stock', 'estado'], productos);
  };

  const exportarReservas = () => {
    descargarCsv('reservas-mestrax.csv', ['id', 'cliente', 'telefono', 'email', 'fecha', 'hora', 'personas', 'mesa', 'estado'], reservas);
  };

  const exportarVentas = () => {
    descargarCsv('ventas-mestrax.csv', ['id', 'cliente', 'producto', 'total', 'metodo', 'estado', 'fechaRegistro'], ventas);
  };

  const exportarContactos = () => {
    descargarCsv('contactos-mestrax.csv', ['id', 'nombre', 'email', 'telefono', 'mensaje', 'fechaRegistro'], contactos);
  };

  const renderAlerta = () =>
    alerta.message ? <div className={`alert alert-${alerta.type || 'info'} py-2`}>{alerta.message}</div> : null;

  const renderDashboard = () => (
    <>
      <div className="card admin-hero p-4 mb-4 shadow">
        <div className="row g-3 align-items-center">
          <div className="col-lg-8">
            <p className="text-light mb-1 fs-5">Bienvenido, <span className="text-warning fw-bold">{adminEmail}</span>.</p>
            <p className="text-light mb-0">Resumen activo de productos, reservas y ventas del restaurante.</p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <button className="btn btn-outline-light" type="button" onClick={cargarDatos}>Actualizar datos</button>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <article className="card stat-card p-4 shadow h-100">
            <p className="small text-uppercase text-muted mb-2">Ventas reales</p>
            <h3 className="fw-bold text-success m-0">{dinero(resumen.totalVentas)}</h3>
            <small className="text-muted">{resumen.ventasValidas} ventas activas</small>
          </article>
        </div>
        <div className="col-md-6 col-xl-3">
          <article className="card stat-card p-4 shadow h-100">
            <p className="small text-uppercase text-muted mb-2">Reservas confirmadas</p>
            <h3 className="fw-bold text-warning m-0">{resumen.reservasConfirmadas}</h3>
            <small className="text-muted">{resumen.reservasPendientes} pendientes</small>
          </article>
        </div>
        <div className="col-md-6 col-xl-3">
          <article className="card stat-card p-4 shadow h-100">
            <p className="small text-uppercase text-muted mb-2">Productos activos</p>
            <h3 className="fw-bold text-info m-0">{resumen.productosActivos}</h3>
            <small className="text-muted">{productos.length} productos totales</small>
          </article>
        </div>
        <div className="col-md-6 col-xl-3">
          <article className="card stat-card p-4 shadow h-100">
            <p className="small text-uppercase text-muted mb-2">Stock bajo</p>
            <h3 className="fw-bold text-danger m-0">{resumen.productosBajoStock}</h3>
            <small className="text-muted">productos con 5 o menos</small>
          </article>
        </div>
      </div>

      <div className="row g-4">
        <article className="col-xl-7">
          <div className="card p-4 shadow h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p className="text-warning small text-uppercase mb-1">Acciones rapidas</p>
                <h5 className="fw-semibold mb-0">Operacion diaria</h5>
              </div>
              <span className="admin-chip">En linea</span>
            </div>
            <div className="row g-2">
              <div className="col-md-4">
                <button className="btn btn-outline-light w-100 text-start" type="button" onClick={() => setActiveSection('Productos')}>
                  <i className="bi bi-plus-circle me-2"></i>Productos
                </button>
              </div>
              <div className="col-md-4">
                <button className="btn btn-outline-light w-100 text-start" type="button" onClick={() => setActiveSection('Reservas')}>
                  <i className="bi bi-calendar2-plus me-2"></i>Reservas
                </button>
              </div>
              <div className="col-md-4">
                <button className="btn btn-outline-light w-100 text-start" type="button" onClick={() => setActiveSection('Ventas')}>
                  <i className="bi bi-cash-coin me-2"></i>Ventas
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between mb-1 small text-muted">
                <span>Productos disponibles</span>
                <strong>{productos.length ? Math.round((resumen.productosActivos / productos.length) * 100) : 0}%</strong>
              </div>
              <div className="progress-track">
                <span style={{ width: `${productos.length ? Math.round((resumen.productosActivos / productos.length) * 100) : 0}%` }}></span>
              </div>
            </div>
          </div>
        </article>

        <article className="col-xl-5">
          <div className="card p-4 shadow h-100">
            <p className="text-warning small text-uppercase mb-1">Actividad reciente</p>
            <h5 className="fw-semibold mb-3">Ultimos movimientos</h5>
            {actividadReciente.length === 0 ? (
              <p className="text-muted">Aun no hay movimientos registrados.</p>
            ) : (
              <ul className="admin-list mb-0 ps-3">
                {actividadReciente.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </div>
        </article>
      </div>
    </>
  );

  const renderProductos = () => (
    <div className="card p-4 shadow">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div>
          <p className="text-warning small text-uppercase mb-1">Inventario</p>
          <h4 className="fw-semibold mb-0">{productoEditId ? 'Editar producto' : 'Productos'}</h4>
        </div>
        <button className="btn btn-outline-light" type="button" onClick={exportarProductos}>Exportar CSV</button>
      </div>

      <form className="row g-2 mb-4" onSubmit={guardarProducto}>
        <div className="col-md-3">
          <input className="form-control" name="nombre" placeholder="Nombre" value={productoForm.nombre} onChange={(event) => setProductoForm((prev) => ({ ...prev, nombre: event.target.value }))} />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={productoForm.categoria} onChange={(event) => setProductoForm((prev) => ({ ...prev, categoria: event.target.value }))}>
            {categorias.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <input className="form-control" type="number" min="0" placeholder="Precio" value={productoForm.precio} onChange={(event) => setProductoForm((prev) => ({ ...prev, precio: event.target.value }))} />
        </div>
        <div className="col-md-1">
          <input className="form-control" type="number" min="0" placeholder="Stock" value={productoForm.stock} onChange={(event) => setProductoForm((prev) => ({ ...prev, stock: event.target.value }))} />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={productoForm.estado} onChange={(event) => setProductoForm((prev) => ({ ...prev, estado: event.target.value }))}>
            {estadosProducto.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button className="btn btn-warning flex-fill" type="submit" disabled={isSaving}>{isSaving ? '...' : productoEditId ? 'Guardar' : 'Agregar'}</button>
          {productoEditId && <button className="btn btn-outline-light" type="button" onClick={limpiarProductoForm}>Cancelar</button>}
        </div>
      </form>

      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <input className="form-control" placeholder="Buscar producto" value={productoFiltro.texto} onChange={(event) => setProductoFiltro((prev) => ({ ...prev, texto: event.target.value }))} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={productoFiltro.categoria} onChange={(event) => setProductoFiltro((prev) => ({ ...prev, categoria: event.target.value }))}>
            <option value="Todas">Todas las categorias</option>
            {categorias.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={productoFiltro.estado} onChange={(event) => setProductoFiltro((prev) => ({ ...prev, estado: event.target.value }))}>
            <option value="Todos">Todos los estados</option>
            {estadosProducto.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-borderless align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoria</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-muted py-4">No hay productos con esos filtros.</td></tr>
            ) : (
              productosFiltrados.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>{dinero(producto.precio)}</td>
                  <td className={Number(producto.stock || 0) <= 5 ? 'text-danger fw-bold' : ''}>{producto.stock}</td>
                  <td><span className="admin-chip">{producto.estado}</span></td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-sm btn-outline-light" type="button" onClick={() => editarProducto(producto)}>Editar</button>
                      <button className="btn btn-sm btn-outline-light" type="button" onClick={() => cambiarEstadoProducto(producto.id)}>{producto.estado === 'Disponible' ? 'Pausar' : 'Activar'}</button>
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => eliminarProducto(producto)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReservas = () => (
    <div className="card p-4 shadow">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div>
          <p className="text-warning small text-uppercase mb-1">Agenda</p>
          <h4 className="fw-semibold mb-0">{reservaEditId ? 'Editar reserva' : 'Reservas'}</h4>
        </div>
        <button className="btn btn-outline-light" type="button" onClick={exportarReservas}>Exportar CSV</button>
      </div>

      <form className="row g-2 mb-4" onSubmit={guardarReserva}>
        <div className="col-md-3">
          <input className="form-control" placeholder="Cliente" value={reservaForm.cliente} onChange={(event) => setReservaForm((prev) => ({ ...prev, cliente: event.target.value }))} />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Telefono" value={reservaForm.telefono} onChange={(event) => setReservaForm((prev) => ({ ...prev, telefono: event.target.value }))} />
        </div>
        <div className="col-md-3">
          <input className="form-control" type="email" placeholder="Correo" value={reservaForm.email} onChange={(event) => setReservaForm((prev) => ({ ...prev, email: event.target.value }))} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="date" value={reservaForm.fecha} onChange={(event) => setReservaForm((prev) => ({ ...prev, fecha: event.target.value }))} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="time" value={reservaForm.hora} onChange={(event) => setReservaForm((prev) => ({ ...prev, hora: event.target.value }))} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="number" min="1" placeholder="Personas" value={reservaForm.personas} onChange={(event) => setReservaForm((prev) => ({ ...prev, personas: event.target.value }))} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="number" min="1" placeholder="Mesa" value={reservaForm.mesa} onChange={(event) => setReservaForm((prev) => ({ ...prev, mesa: event.target.value }))} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={reservaForm.estado} onChange={(event) => setReservaForm((prev) => ({ ...prev, estado: event.target.value }))}>
            {estadosReserva.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Comentarios" value={reservaForm.comentarios} onChange={(event) => setReservaForm((prev) => ({ ...prev, comentarios: event.target.value }))} />
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button className="btn btn-warning flex-fill" type="submit" disabled={isSaving}>{isSaving ? '...' : reservaEditId ? 'Guardar' : 'Agregar'}</button>
          {reservaEditId && <button className="btn btn-outline-light" type="button" onClick={limpiarReservaForm}>Cancelar</button>}
        </div>
      </form>

      <div className="mesa-status-grid admin-availability mb-4">
        <div className="mesa-status-box libre">
          <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
            <span className="fw-semibold">Mesas disponibles</span>
            <strong>{reservaForm.fecha && reservaForm.hora ? disponibilidadReserva.disponibles.length : '-'}</strong>
          </div>
          <div className="mesa-chip-list">
            {reservaForm.fecha && reservaForm.hora ? (
              disponibilidadReserva.disponibles.map((mesa) => (
                <span key={`admin-disponible-${mesa}`} className="mesa-chip mesa-chip-libre">Mesa {mesa}</span>
              ))
            ) : (
              <span className="text-muted small">Completa fecha y hora para revisar disponibilidad.</span>
            )}
          </div>
        </div>
        <div className="mesa-status-box ocupada">
          <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
            <span className="fw-semibold">Mesas ocupadas</span>
            <strong>{reservaForm.fecha && reservaForm.hora ? disponibilidadReserva.ocupadas.length : '-'}</strong>
          </div>
          <div className="mesa-chip-list">
            {reservaForm.fecha && reservaForm.hora && disponibilidadReserva.ocupadas.length > 0 ? (
              disponibilidadReserva.ocupadas.map((mesa) => (
                <span key={`admin-ocupada-${mesa}`} className="mesa-chip mesa-chip-ocupada">Mesa {mesa}</span>
              ))
            ) : (
              <span className="text-muted small">
                {reservaForm.fecha && reservaForm.hora ? 'No hay mesas ocupadas.' : 'Completa fecha y hora para revisar disponibilidad.'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-7">
          <input className="form-control" placeholder="Buscar por cliente, correo, telefono o mesa" value={reservaFiltro.texto} onChange={(event) => setReservaFiltro((prev) => ({ ...prev, texto: event.target.value }))} />
        </div>
        <div className="col-md-5">
          <select className="form-select" value={reservaFiltro.estado} onChange={(event) => setReservaFiltro((prev) => ({ ...prev, estado: event.target.value }))}>
            <option value="Todos">Todos los estados</option>
            {estadosReserva.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-borderless align-middle">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Fecha</th>
              <th>Mesa</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-muted py-4">No hay reservas con esos filtros.</td></tr>
            ) : (
              reservasFiltradas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>
                    <div className="fw-bold">{reserva.cliente}</div>
                    <small className="text-muted">{reserva.personas} personas</small>
                  </td>
                  <td>
                    <div>{reserva.telefono || '-'}</div>
                    <small className="text-muted">{reserva.email || '-'}</small>
                  </td>
                  <td>
                    <div>{reserva.fecha || '-'}</div>
                    <small className="text-muted">{reserva.hora || '-'}</small>
                  </td>
                  <td>{reserva.mesa || '-'}</td>
                  <td><span className="admin-chip">{reserva.estado}</span></td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-sm btn-outline-light" type="button" onClick={() => editarReserva(reserva)}>Editar</button>
                      {reserva.estado !== 'Confirmada' && <button className="btn btn-sm btn-outline-light" type="button" onClick={() => cambiarEstadoReserva(reserva, 'Confirmada')}>Confirmar</button>}
                      {reserva.estado !== 'Completada' && <button className="btn btn-sm btn-outline-light" type="button" onClick={() => cambiarEstadoReserva(reserva, 'Completada')}>Completar</button>}
                      {reserva.estado !== 'Cancelada' && <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => cambiarEstadoReserva(reserva, 'Cancelada')}>Cancelar</button>}
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => eliminarReserva(reserva)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVentas = () => (
    <div className="card p-4 shadow">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div>
          <p className="text-warning small text-uppercase mb-1">Caja</p>
          <h4 className="fw-semibold mb-0">{ventaEditId ? 'Editar venta' : 'Ventas'}</h4>
        </div>
        <button className="btn btn-outline-light" type="button" onClick={exportarVentas}>Exportar CSV</button>
      </div>

      <form className="row g-2 mb-4" onSubmit={guardarVenta}>
        <div className="col-md-3">
          <input className="form-control" placeholder="Cliente" value={ventaForm.cliente} onChange={(event) => setVentaForm((prev) => ({ ...prev, cliente: event.target.value }))} />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Producto vendido" value={ventaForm.producto} onChange={(event) => setVentaForm((prev) => ({ ...prev, producto: event.target.value }))} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="number" min="0" placeholder="Total" value={ventaForm.total} onChange={(event) => setVentaForm((prev) => ({ ...prev, total: event.target.value }))} />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={ventaForm.metodo} onChange={(event) => setVentaForm((prev) => ({ ...prev, metodo: event.target.value }))}>
            {metodosPago.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={ventaForm.estado} onChange={(event) => setVentaForm((prev) => ({ ...prev, estado: event.target.value }))}>
            {estadosVenta.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="col-12 d-flex justify-content-end gap-2">
          <button className="btn btn-warning" type="submit" disabled={isSaving}>{isSaving ? '...' : ventaEditId ? 'Guardar venta' : 'Registrar venta'}</button>
          {ventaEditId && <button className="btn btn-outline-light" type="button" onClick={limpiarVentaForm}>Cancelar</button>}
        </div>
      </form>

      <div className="row g-2 mb-3">
        <div className="col-md-7">
          <input className="form-control" placeholder="Buscar venta" value={ventaFiltro.texto} onChange={(event) => setVentaFiltro((prev) => ({ ...prev, texto: event.target.value }))} />
        </div>
        <div className="col-md-5">
          <select className="form-select" value={ventaFiltro.estado} onChange={(event) => setVentaFiltro((prev) => ({ ...prev, estado: event.target.value }))}>
            <option value="Todos">Todos los estados</option>
            {estadosVenta.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-borderless align-middle">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Total</th>
              <th>Metodo</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted py-4">No hay ventas con esos filtros.</td></tr>
            ) : (
              ventasFiltradas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.cliente}</td>
                  <td>{venta.producto}</td>
                  <td className="text-success fw-bold">{dinero(venta.total)}</td>
                  <td>{venta.metodo}</td>
                  <td><span className="admin-chip">{venta.estado}</span></td>
                  <td>{fechaCorta(venta.fechaRegistro)}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-sm btn-outline-light" type="button" onClick={() => editarVenta(venta)}>Editar</button>
                      {venta.estado !== 'Pagada' && <button className="btn btn-sm btn-outline-light" type="button" onClick={() => cambiarEstadoVenta(venta, 'Pagada')}>Pagar</button>}
                      {venta.estado !== 'Anulada' && <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => cambiarEstadoVenta(venta, 'Anulada')}>Anular</button>}
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => eliminarVenta(venta)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContactos = () => {
    const contactosFiltrados = contactos.filter((contacto) =>
      normalizar(`${contacto.nombre} ${contacto.email} ${contacto.telefono} ${contacto.mensaje}`).includes(normalizar(contactoFiltro))
    );

    return (
      <div className="card p-4 shadow">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <p className="text-warning small text-uppercase mb-1">Mensajes</p>
            <h4 className="fw-semibold mb-0">Contactos</h4>
          </div>
          <button className="btn btn-outline-light" type="button" onClick={exportarContactos}>Exportar CSV</button>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-8">
            <input className="form-control" placeholder="Buscar contacto" value={contactoFiltro} onChange={(event) => setContactoFiltro(event.target.value)} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-borderless align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {contactosFiltrados.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted py-4">No hay contactos registrados.</td></tr>
              ) : (
                contactosFiltrados.map((contacto) => (
                  <tr key={contacto.id}>
                    <td className="fw-bold">{contacto.nombre}</td>
                    <td>{contacto.email || '-'}</td>
                    <td>{contacto.telefono || '-'}</td>
                    <td style={{ maxWidth: '360px' }}>{contacto.mensaje || '-'}</td>
                    <td>{contacto.fechaRegistro ? fechaCorta(contacto.fechaRegistro) : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderReportes = () => (
    <div className="card p-4 shadow">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div>
          <p className="text-warning small text-uppercase mb-1">Reportes</p>
          <h4 className="fw-semibold mb-0">Resumen operativo</h4>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-light" type="button" onClick={exportarProductos}>Productos</button>
          <button className="btn btn-outline-light" type="button" onClick={exportarReservas}>Reservas</button>
          <button className="btn btn-outline-light" type="button" onClick={exportarVentas}>Ventas</button>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="mini-card p-3 rounded-4 h-100">
            <p className="small text-uppercase text-warning mb-1">Total ventas</p>
            <h3 className="fw-bold text-success mb-1">{dinero(resumen.totalVentas)}</h3>
            <p className="text-muted small mb-0">{ventas.length} registros de venta</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mini-card p-3 rounded-4 h-100">
            <p className="small text-uppercase text-warning mb-1">Reservas</p>
            <h3 className="fw-bold text-info mb-1">{reservas.length}</h3>
            <p className="text-muted small mb-0">{resumen.reservasPendientes} pendientes</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mini-card p-3 rounded-4 h-100">
            <p className="small text-uppercase text-warning mb-1">Inventario</p>
            <h3 className="fw-bold text-warning mb-1">{productos.length}</h3>
            <p className="text-muted small mb-0">{resumen.productosBajoStock} con stock bajo</p>
          </div>
        </div>
      </div>

      <div className="mini-card p-3 rounded-4 mt-4">
        <p className="small text-uppercase text-warning mb-2">Alertas operativas</p>
        <ul className="admin-list mb-0 ps-3">
          <li>{resumen.productosBajoStock} productos necesitan revision de stock.</li>
          <li>{resumen.reservasPendientes} reservas esperan confirmacion.</li>
          <li>{ventas.filter((item) => item.estado === 'Pendiente').length} ventas estan pendientes de pago.</li>
        </ul>
      </div>
    </div>
  );

  if (loadingData) {
    return (
      <main className="container py-5 text-center text-white">
        <p className="mb-0">Cargando panel administrativo...</p>
      </main>
    );
  }

  return (
    <main className="container-fluid admin-dashboard py-4" style={{ maxWidth: '1500px' }}>
      <div className="row g-4 align-items-start">
        <aside className="col-lg-3 col-xl-3">
          <div className="card admin-sidebar p-3 shadow h-100">
            <div className="text-center mb-4">
              <div className="admin-brand-badge">Admin</div>
              <h4 className="fw-bold mb-1 mt-3">Menu de control</h4>
              <p className="text-muted small mb-0">Gestion de productos, reservas, ventas y reportes.</p>
            </div>

            <div className="d-flex flex-column gap-2 mb-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  className={`w-100 text-start btn btn-link text-decoration-none admin-menu-btn ${activeSection === item.label ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveSection(item.label)}
                >
                  <i className={`bi ${item.icon} me-2`}></i>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mini-card p-3 rounded-4">
              <p className="small text-uppercase text-warning mb-2">Sesion</p>
              <h6 className="fw-semibold mb-1">{adminEmail}</h6>
              <button className="btn btn-danger w-100 mt-3" type="button" onClick={cerrarSesion}>
                <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesion
              </button>
            </div>
          </div>
        </aside>

        <section className="col-lg-9 col-xl-9">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <p className="text-warning fw-semibold mb-1">Panel administrativo</p>
              <h2 className="fw-bold m-0">{activeSection === 'Dashboard' ? 'Dashboard del restaurante' : activeSection}</h2>
            </div>
            <button className="btn btn-outline-light" type="button" onClick={cargarDatos}>
              <i className="bi bi-arrow-clockwise me-1"></i> Actualizar
            </button>
          </div>

          {renderAlerta()}
          {activeSection === 'Dashboard' && renderDashboard()}
          {activeSection === 'Productos' && renderProductos()}
          {activeSection === 'Reservas' && renderReservas()}
          {activeSection === 'Ventas' && renderVentas()}
          {activeSection === 'Contactos' && renderContactos()}
          {activeSection === 'Reportes' && renderReportes()}
        </section>
      </div>
    </main>
  );
}
