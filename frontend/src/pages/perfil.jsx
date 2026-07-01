import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

function normalizarUsuario(usuario) {
  if (!usuario) return null;

  if (typeof usuario === 'string') {
    return {
      email: usuario,
      nombre: usuario.includes('@') ? usuario.split('@')[0] : usuario,
    };
  }

  return usuario;
}

export default function Perfil({ usuario, setUsuario }) {
  const navigate = useNavigate();

  const usuarioActual = useMemo(() => {
    return normalizarUsuario(usuario || JSON.parse(localStorage.getItem('usuarioActivo') || 'null'));
  }, [usuario]);

  const cerrarSesion = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('usuarioActivo');
      setUsuario(null);
      navigate('/');
    }
  };

  if (!usuarioActual) {
    return (
      <main className="container py-5 page-shell text-center">
        <div className="card glass-panel p-4 mx-auto" style={{ maxWidth: '480px' }}>
          <h2 className="fw-bold mb-3">Accede a tu cuenta</h2>
          <p className="text-muted mb-4">Debes iniciar sesión para ver tu perfil.</p>
          <button className="btn btn-primary px-4 fw-bold" onClick={() => navigate('/login')}>Ir al login</button>
        </div>
      </main>
    );
  }

  const fechaRegistro = usuarioActual.fechaRegistro
    ? new Date(usuarioActual.fechaRegistro).toLocaleDateString('es-ES')
    : 'Registro local';

  const inicialUsuario = (usuarioActual.nombre || usuarioActual.email || 'U').charAt(0).toUpperCase();

  return (
    <main className="container py-5 page-shell">
      <div className="text-center mb-4">
        <span className="soft-badge">Mi cuenta</span>
        <h2 className="fw-bold mt-3 mb-0">Mi Perfil</h2>
      </div>
      
      <div className="card glass-panel p-4 border-0 mx-auto" style={{ maxWidth: '640px' }}>
        <div className="text-center mb-4">
          <img 
            src={new URL('../img/unnamed.png', import.meta.url).href} 
            alt="Avatar Usuario" 
            className="rounded-circle border border-primary border-3" 
            style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
            onError={(e) => { 
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(inicialUsuario)}&background=3b82f6&color=fff&size=120`; 
            }} 
          />
        </div>
        
        <div id="perfilContent">
          <div className="mb-4 text-center">
            <h3 className="fw-bold text-dark mb-1">Información personal</h3>
            <p className="text-muted small mb-0">Bienvenido, {usuarioActual.nombre || (usuarioActual.email ? usuarioActual.email.split('@')[0] : 'Usuario')}.</p>
          </div>

          <div className="mb-3 border-bottom border-secondary border-opacity-25 pb-2">
            <span className="text-muted small d-block mb-1">Nombre</span>
            <p className="fw-semibold text-dark mb-0">{usuarioActual.nombre || 'Usuario'}</p>
          </div>

          <div className="mb-3 border-bottom border-secondary border-opacity-25 pb-2">
            <span className="text-muted small d-block mb-1">Correo electrónico</span>
            <p className="fw-semibold text-dark mb-0">{usuarioActual.email}</p>
          </div>

          <div className="mb-4 border-bottom border-secondary border-opacity-25 pb-2">
            <span className="text-muted small d-block mb-1">Miembro desde</span>
            <p className="fw-semibold text-dark mb-0">{fechaRegistro}</p>
          </div>

          <div className="d-flex flex-column gap-2 mt-4">
            <button className="btn btn-danger w-100 fw-bold" onClick={cerrarSesion}>Cerrar sesión</button>
            <button className="btn btn-outline-light w-100" type="button">Editar perfil</button>
          </div>
        </div>
      </div>
    </main>
  );
}