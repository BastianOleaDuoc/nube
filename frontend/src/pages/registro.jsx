import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = "https://nube-sz47.onrender.com/api";

export default function Registro({ setUsuario }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const { nombre, email, password, confirmPassword } = form;

    if (!nombre.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Completa todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/usuario/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        setError(errorData || 'Error al registrar usuario');
        return;
      }

      const nuevoUsuario = await response.json();
      localStorage.setItem('usuarioActivo', JSON.stringify(nuevoUsuario));
      setUsuario(nuevoUsuario);
      navigate('/perfil');
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <main className="container auth-layout page-shell">
      <section className="auth-panel">
        <div className="card auth-card border-0">
          <div className="text-center mb-3">
            <span className="soft-badge">Únete a la experiencia</span>
          </div>
          <h2 className="text-center fw-bold mb-4">Crear Cuenta Mestrax</h2>
          
          {error && <div className="alert alert-danger py-2 mb-3 small text-center">{error}</div>}

          <form id="registroForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre completo</label>
              <input type="text" id="nombre" name="nombre" className="form-control" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input type="email" id="email" name="email" className="form-control" placeholder="correo@gmail.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input type="password" id="password" name="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
              <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-dark w-100 mt-3 auth-submit-btn">Registrarse</button>
          </form>
          <p className="text-center mt-3 text-light mb-0">
            ¿Ya tienes cuenta? <Link to="/login" className="fw-bold text-warning text-decoration-none">Inicia sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}