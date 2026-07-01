import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE } from '../data/productos';

export default function Login({ setUsuario }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password.trim()) {
      setError('Completa todos los campos');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/usuario/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password
        })
      });

      if (!response.ok) {
        setError('Correo o contraseña incorrectos');
        return;
      }

      const usuario = await response.json();
      localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
      setUsuario(usuario);
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
            <span className="soft-badge">Acceso rápido</span>
          </div>
          <h2 className="text-center fw-bold mb-4">Acceso Mestrax</h2>

          {error && <div className="alert alert-danger py-2 mb-3 small text-center">{error}</div>}

          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="correo@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark w-100 mt-3 auth-submit-btn">Ingresar</button>
          </form>

          <p className="text-center mt-3 text-light mb-2">
            ¿No tienes cuenta? <Link to="/registro" className="fw-bold text-warning text-decoration-none">Regístrate</Link>
          </p>
          <p className="text-center mb-0 text-light">
            <Link to="/login-admin" className="text-info text-decoration-none">Ingresar como administrador</Link>
          </p>
        </div>
      </section>
    </main>
  );
}