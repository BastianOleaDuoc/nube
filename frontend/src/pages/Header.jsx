import { useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ usuario, carrito }) {

  const cantidadCarrito = useMemo(() => {
    return (carrito || []).reduce((total, item) => total + (item.cantidad || 1), 0);
  }, [carrito]);

  const rutaUsuario = usuario ? '/perfil' : '/login';
  
  const textoUsuario = useMemo(() => {
    if (!usuario) return 'Login';
    if (typeof usuario === 'string') return usuario;
    return usuario.nombre || usuario.email || 'Perfil';
  }, [usuario]);

  return (
    <header className="navbar-shell">
      <div className="container d-flex flex-wrap justify-content-between align-items-center py-3">
        <h1 className="m-0 fs-3">
          <Link to="/" className="text-decoration-none fw-bold text-white d-flex align-items-center gap-2">
            <span className="soft-badge">M</span>
            Mestrax
          </Link>
        </h1>
        <nav className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/productos" className="nav-link">Productos</Link>
          <Link to="/reserva" className="nav-link">Reserva</Link>
          <Link to="/carrito" className="nav-link">
            Carrito <span className="badge bg-warning text-dark ms-1">{cantidadCarrito}</span>
          </Link>
          <Link to="/contactos" className="nav-link">Contacto</Link>
          <Link to={rutaUsuario} className="nav-link fw-semibold text-warning">{textoUsuario}</Link>
          <Link to="/login-admin" className="nav-link text-muted">Admin</Link>
        </nav>
      </div>
    </header>
  );
}