import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginAdmin({ setAdminActivo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      const data = await response.json();

      // Guardar sesión del administrador
      localStorage.setItem("adminActivo", data.email);

      // Actualizar el estado del App
      if (setAdminActivo) {
        setAdminActivo(data.email);
      }

      alert("Bienvenido Administrador");

      // Ir al panel
      navigate("/admin");

    } catch (error) {
      console.error("Error al conectar:", error);
      alert("Error de conexión. Asegúrate de que el backend esté encendido.");
    }
  };

  return (
    <main className="container auth-layout page-shell">
      <section className="auth-panel">
        <div className="card auth-card border-0">
          <div className="text-center mb-3">
            <span className="soft-badge">Acceso administrativo</span>
          </div>

          <h2 className="text-center fw-bold mb-4">Panel Admin</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Correo corporativo</label>
              <input
                type="email"
                className="form-control"
                placeholder="admin@mestrax.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 mt-3 auth-submit-btn"
            >
              Ingresar
            </button>
          </form>

          <p className="text-center mt-3 text-light mb-0">
            <Link
              to="/login"
              className="fw-bold text-warning text-decoration-none"
            >
              Volver al acceso de clientes
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginAdmin;