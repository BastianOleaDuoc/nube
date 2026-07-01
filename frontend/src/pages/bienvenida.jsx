import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WELCOME_IMAGE = new URL('../img/unnamed.png', import.meta.url).href;

export default function Bienvenida() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ margin: 0, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', overflow: 'hidden' }}>
      <div className="pantalla" style={{ textAlign: 'center', animation: 'fadeOut 1s ease 4s forwards' }}>
        <img 
          src={WELCOME_IMAGE} 
          alt="Logo Bienvenida" 
          style={{ width: '380px', maxWidth: '90%', height: 'auto', borderRadius: '18px', boxShadow: '0 0 25px rgba(255,255,255,.15)' }} 
        />
      </div>
    </div>
  );
}