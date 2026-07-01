import { useCallback, useEffect, useMemo, useState } from 'react';


const API_BASE = "https://nube-sz47.onrender.com/api";

const RESERVA_IMAGES = {
  fondo: new URL('../img/rustica.png', import.meta.url).href,
  fallback: new URL('../img/unnamed.png', import.meta.url).href,
};

const POSICIONES_MESAS = [
  { id: 1, top: '10%', left: '10%' }, { id: 2, top: '10%', left: '30%' },
  { id: 3, top: '10%', left: '50%' }, { id: 4, top: '10%', left: '70%' },
  { id: 5, top: '30%', left: '10%' }, { id: 6, top: '30%', left: '30%' },
  { id: 7, top: '30%', left: '50%' }, { id: 8, top: '30%', left: '70%' },
  { id: 9, top: '50%', left: '20%' }, { id: 10, top: '50%', left: '40%' },
  { id: 11, top: '50%', left: '60%' }, { id: 12, top: '70%', left: '15%' },
  { id: 13, top: '70%', left: '35%' }, { id: 14, top: '70%', left: '55%' },
  { id: 15, top: '70%', left: '75%' },
];

function crearFormularioInicial(usuario) {
  return {
    cliente: usuario?.nombre || '',
    telefono: '',
    email: usuario?.email || '',
    personas: 2,
    fecha: '',
    hora: '',
    comentarios: '',
  };
}

export default function Reserva({ usuario }) {
  const [form, setForm] = useState(() => crearFormularioInicial(usuario));
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [reservasOcupadas, setReservasOcupadas] = useState([]);
  const [isLoadingOcupadas, setIsLoadingOcupadas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const fechaMinima = useMemo(() => new Date().toISOString().split('T')[0], []);

  const mesasOcupadas = useMemo(() => [
    ...new Set(reservasOcupadas.map((r) => Number(r.mesa)).filter((m) => m > 0))
  ], [reservasOcupadas]);

  const mesasDisponibles = useMemo(() => 
    POSICIONES_MESAS.map(m => m.id).filter(id => !mesasOcupadas.includes(id)),
  [mesasOcupadas]);

  const cargarMesasOcupadas = useCallback(async (fecha, hora) => {
    if (!fecha || !hora) {
      setReservasOcupadas([]);
      setMesaSeleccionada(null);
      return;
    }
    setIsLoadingOcupadas(true);
    try {
      const params = new URLSearchParams({ fecha, hora });
      const response = await fetch(`${API_BASE}/reservas/ocupadas?${params.toString()}`);
      if (!response.ok) throw new Error('Error al cargar disponibilidad.');
      const data = await response.json();
      setReservasOcupadas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Error al sincronizar mesas.');
    } finally {
      setIsLoadingOcupadas(false);
    }
  }, []);

  useEffect(() => {
    cargarMesasOcupadas(form.fecha, form.hora);
  }, [form.fecha, form.hora, cargarMesasOcupadas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'fecha' || name === 'hora') setMesaSeleccionada(null);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mesaSeleccionada) return setError('Selecciona una mesa primero.');
    setIsSubmitting(true);
    setError('');
    setMensaje('');
    
    try {
      const response = await fetch(`${API_BASE}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mesa: mesaSeleccionada, estado: 'Pendiente' }),
      });
      if (!response.ok) throw new Error('No se pudo guardar la reserva.');
      setMensaje(`Reserva exitosa: Mesa ${mesaSeleccionada}.`);
      setMesaSeleccionada(null);
      setForm(crearFormularioInicial(usuario));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container py-5 page-shell">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <section className="hero p-0 mb-4 rounded-4 shadow-sm bg-dark text-white position-relative" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={RESERVA_IMAGES.fondo} alt="Fondo" className="w-100 h-100 position-absolute" style={{ objectFit: 'cover', opacity: '0.3' }} onError={(e) => e.target.src = RESERVA_IMAGES.fallback} />
            <div className="position-relative p-4 text-center">
              <h2 className="fw-bold display-6">Reserva tu mesa</h2>
            </div>
          </section>

          <div className="card shadow-lg border-0 rounded-4 bg-black text-light p-4">
            <form onSubmit={handleSubmit}>
              <div className="row gy-3">
                <div className="col-md-6"><label>Nombre</label><input type="text" name="cliente" className="form-control" value={form.cliente} onChange={handleChange} required /></div>
                <div className="col-md-6"><label>Teléfono</label><input type="tel" name="telefono" className="form-control" value={form.telefono} onChange={handleChange} required /></div>
                <div className="col-md-6"><label>Fecha</label><input type="date" name="fecha" className="form-control" min={fechaMinima} value={form.fecha} onChange={handleChange} required /></div>
                <div className="col-md-6"><label>Hora</label><input type="time" name="hora" className="form-control" value={form.hora} onChange={handleChange} required /></div>
                <div className="col-12 text-end">
                    <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
                      {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                    </button>
                </div>
              </div>
            </form>
            {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>

          <div className="mt-4">
            <h3 className="mb-3">Selecciona tu mesa: {mesaSeleccionada || 'Ninguna'}</h3>
            <div className="restaurante-layout position-relative" style={{ height: '400px' }}>
              {POSICIONES_MESAS.map((m) => {
                const ocupada = mesasOcupadas.includes(m.id);
                return (
                  <button key={m.id} 
                    type="button"
                    className={`mesa ${ocupada ? 'ocupada' : 'libre'} ${mesaSeleccionada === m.id ? 'seleccionada' : ''}`}
                    style={{ position: 'absolute', top: m.top, left: m.left }}
                    disabled={ocupada || !form.fecha || !form.hora}
                    onClick={() => {
                      setMesaSeleccionada(m.id);
                      if (error) setError('');
                    }}>
                    {m.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}