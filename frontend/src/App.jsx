import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importaciones corregidas según tu estructura de archivos en /pages
import Header from './pages/Header';
import Footer from './pages/Footer';
import Home from './pages/index';
import Productos from './pages/producto'; // Ajustado según tu lista de archivos
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/carrito';
import Login from './pages/login';
import Registro from './pages/registro';
import Perfil from './pages/perfil';
import AdminPanel from './pages/admin_panel';
import LoginAdmin from './pages/loginAdmin';
import Contactos from './pages/contactos';
import Reserva from './pages/reserva';

// Asumo que tienes un componente para proteger rutas
// Si no lo tienes, simplemente usa el componente que quieras proteger
const ProtectedRoute = ({ adminActivo, children }) => {
  return adminActivo ? children : <Navigate to="/login-admin" />;
};

function App() {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('usuarioActivo') || localStorage.getItem('usuario')) || null; } 
    catch { return null; }
  });
  
  const [carrito, setCarrito] = useState(() => {
    try { return JSON.parse(localStorage.getItem('carrito')) || []; } 
    catch { return []; }
  });

  const [adminActivo, setAdminActivo] = useState(() => localStorage.getItem('adminActivo') || null);

  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  return (
    <Router>
      <Header usuario={usuario} carrito={carrito} />
      <div className="app-content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos carrito={carrito} actualizarCarrito={actualizarCarrito} />} />
          <Route path="/producto/:id" element={<ProductoDetalle carrito={carrito} actualizarCarrito={actualizarCarrito} />} />
          <Route path="/carrito" element={<Carrito usuario={usuario} carrito={carrito} actualizarCarrito={actualizarCarrito} />} />
          <Route path="/reserva" element={<Reserva usuario={usuario} />} />
          <Route path="/contactos" element={<Contactos />} />

          <Route path="/login" element={usuario ? <Navigate to="/perfil" /> : <Login setUsuario={setUsuario} />} />
          <Route path="/registro" element={usuario ? <Navigate to="/perfil" /> : <Registro setUsuario={setUsuario} />} />
          <Route path="/perfil" element={usuario ? <Perfil usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" />} />

          <Route path="/admin" element={
            <ProtectedRoute adminActivo={adminActivo}>
              <AdminPanel setAdminActivo={setAdminActivo} />
            </ProtectedRoute>
          } />
          <Route path="/admin_panel" element={<Navigate to="/admin" replace />} />
          <Route path="/login-admin" element={adminActivo ? <Navigate to="/admin" /> : <LoginAdmin setAdminActivo={setAdminActivo} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;