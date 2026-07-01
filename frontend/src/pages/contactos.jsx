import { useState, useEffect } from 'react';

const API_BASE = "https://nube-sz47.onrender.com/api";

export default function Contactos() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);

    try {
      const response = await fetch(`${API_BASE}/contactos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: String(data.get('nombre') || '').trim(),
          email: String(data.get('email') || '').trim(),
          telefono: String(data.get('telefono') || '').trim(),
          mensaje: String(data.get('mensaje') || '').trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar el contacto');
      }

      setMensaje('Mensaje guardado. Te responderemos a la brevedad.');
      form.reset();
    } catch (error) {
      console.error(error);
      setMensaje('No se pudo enviar el mensaje. Verifica el backend.');
    }
  };

  return (
    <main className="container py-5 page-shell">
      <div className="text-center mb-4">
        <span className="soft-badge">Atención personalizada</span>
        <h2 className="fw-bold mt-3 mb-2">Contáctanos</h2>
        <p className="text-center text-muted mb-4">
          ¿Tienes dudas, reservas o sugerencias? Escríbenos.
        </p>
      </div>
      
      <section className="card glass-panel p-4 mx-auto" style={{ maxWidth: '640px' }}>
        <form id="contactForm" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input type="text" id="nombre" name="nombre" className="form-control" placeholder="Tu nombre" required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo</label>
            <input type="email" id="email" name="email" className="form-control" placeholder="correo@mestrax.com" required />
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input type="text" id="telefono" name="telefono" className="form-control" placeholder="+56 9 1234 5678" required />
          </div>
          <div className="mb-3">
            <label htmlFor="mensajeTexto" className="form-label">Mensaje</label>
            <textarea id="mensajeTexto" name="mensaje" rows="4" className="form-control" placeholder="Escribe tu mensaje" required></textarea>
          </div>
          
          {mensaje && <div className="alert alert-success py-2 mt-2 transition-fade">{mensaje}</div>}
          
          <button type="submit" className="btn btn-dark w-100 mt-2">Enviar mensaje</button>
        </form>
      </section>
    </main>
  );
}