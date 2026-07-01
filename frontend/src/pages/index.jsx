import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero-modern container text-center py-5 mt-4">
        <div className="badge-modern mb-3">✨ Nueva Experiencia Digital</div>
        <h1 className="display-3 fw-bolder mb-4">El futuro de la <br/><span className="text-gradient">Alta Gastronomía</span></h1>
        <p className="lead mb-5 text-muted mx-auto" style={{maxWidth: '600px', fontSize: '1.1rem'}}>Disfruta de una selección exclusiva de hamburguesas de autor, mixología premium y un ambiente inigualable. Todo a un clic de distancia.</p>
        
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/productos" className="btn-primary-modern btn btn-lg px-4 text-decoration-none d-flex align-items-center justify-content-center">Ver menú completo</Link>
          <Link to="/reserva" className="btn-secondary-modern btn btn-lg px-4 text-decoration-none d-flex align-items-center justify-content-center">Reservar mesa</Link>
        </div>
      </section>

      <section className="container my-5 py-5 border-top border-dark">
        <div className="row g-4 text-center">
          <article className="col-md-4">
            <div className="feature-card p-4 h-100">
              <div className="icon-box mx-auto mb-4">
                <i className="bi bi-star-fill text-gradient fs-3"></i>
              </div>
              <h4 className="fw-bold mb-3">Calidad Premium</h4>
              <p className="text-muted m-0">Ingredientes frescos y seleccionados para brindarte una explosión de sabor.</p>
            </div>
          </article>
          
          <article className="col-md-4">
            <div className="feature-card p-4 h-100">
              <div className="icon-box mx-auto mb-4">
                <i className="bi bi-lightning-charge-fill text-gradient fs-3"></i>
              </div>
              <h4 className="fw-bold mb-3">Servicio Rápido</h4>
              <p className="text-muted m-0">Optimizado para que tu pedido llegue caliente y en tiempo récord.</p>
            </div>
          </article>
          
          <article className="col-md-4">
            <div className="feature-card p-4 h-100">
              <div className="icon-box mx-auto mb-4">
                <i className="bi bi-calendar2-check-fill text-gradient fs-3"></i>
              </div>
              <h4 className="fw-bold mb-3">Reservas Inteligentes</h4>
              <p className="text-muted m-0">Elige tu mesa ideal desde nuestro mapa interactivo.</p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}