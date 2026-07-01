import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-modern mt-auto py-3">
      <div className="container text-center text-md-start">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="mb-0 text-muted">Reserva tu mesa y disfruta la noche. © 2026 Mestrax</p>
          <div className="d-flex gap-3 text-muted small">
            <Link to="/productos" className="text-muted text-decoration-none hover-link">Restaurante</Link>
            <Link to="/contactos" className="text-muted text-decoration-none hover-link">Eventos</Link>
            <Link to="/reserva" className="text-muted text-decoration-none hover-link">Reservas</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}