import { Link } from 'react-router-dom';

const HOME_IMAGES = {
  mycelium: new URL('../img/mycelium.jpg', import.meta.url).href,
  cosmo: new URL('../img/cosmo.png', import.meta.url).href,
  rustica: new URL('../img/rustica.png', import.meta.url).href,
  brownie: new URL('../img/brownie.png', import.meta.url).href,
  fallback: new URL('../img/unnamed.png', import.meta.url).href,
};

export default function Home() {
  return (
    <main className="container py-5">
      <section className="row align-items-center hero-modern mb-5 pt-4">
        <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
          <div className="badge-modern mb-3">La mejor experiencia gastronómica</div>
          <h1 className="display-4 fw-bolder mb-3">
            Bienvenido a <span className="text-gradient">Mestrax</span>
          </h1>
          <p className="lead text-muted mx-auto mx-lg-0 mb-4" style={{ maxWidth: '600px' }}>
            Descubre nuestra fusión única de sabores, hamburguesas de autor y mixología en un ambiente inigualable. Todo acompañado de los mejores juegos de mesa.
          </p>
          <div className="d-flex justify-content-center justify-content-lg-start gap-3">
            <Link to="/reserva" className="btn-primary-modern px-4 py-2 text-decoration-none">Reservar Mesa</Link>
            <Link to="/productos" className="btn-secondary-modern px-4 py-2 text-decoration-none">Ver Menú</Link>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="position-relative">
            <img 
              src={HOME_IMAGES.mycelium} 
              alt="Mestrax Experience" 
              className="img-fluid rounded-4 shadow-lg w-100" 
              style={{ maxHeight: '450px', objectFit: 'cover' }} 
              onError={(e) => { e.target.src = HOME_IMAGES.fallback; }}
            />
            <div className="position-absolute bottom-0 start-0 m-3 p-3 bg-dark bg-opacity-75 rounded-3 border border-secondary border-opacity-25" style={{ backdropFilter: 'blur(8px)' }}>
              <h5 className="text-white mb-0 fw-bold">Mycelium Burger</h5>
              <small className="text-warning">★ Especial de la casa</small>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 pt-5 mb-5 border-top border-secondary border-opacity-25">
        <div className="text-center mb-5">
          <h2 className="fw-bolder display-6">Nuestros <span className="text-gradient">Favoritos</span></h2>
          <p className="text-muted">Lo más pedido por nuestros clientes</p>
        </div>
        <div className="row g-4">
          <article className="col-md-4">
            <div className="card h-100 feature-card p-0 overflow-hidden">
              <img src={HOME_IMAGES.cosmo} alt="Cosmonopoly" className="card-img-top" style={{ height: '250px', objectFit: 'cover' }} onError={(e) => { e.target.src = HOME_IMAGES.fallback; }} />
              <div className="p-4">
                <h5 className="fw-bold">Cosmonopoly</h5>
                <p className="text-muted small">Nuestro trago estrella para acompañar tus partidas más largas.</p>
              </div>
            </div>
          </article>
          <article className="col-md-4">
            <div className="card h-100 feature-card p-0 overflow-hidden">
              <img src={HOME_IMAGES.rustica} alt="Paleo Rústica" className="card-img-top" style={{ height: '250px', objectFit: 'cover' }} onError={(e) => { e.target.src = HOME_IMAGES.fallback; }} />
              <div className="p-4">
                <h5 className="fw-bold">Paleo Rústica</h5>
                <p className="text-muted small">La chorrillana perfecta para compartir entre amigos.</p>
              </div>
            </div>
          </article>
          <article className="col-md-4">
            <div className="card h-100 feature-card p-0 overflow-hidden">
              <img src={HOME_IMAGES.brownie} alt="Brownie con Helado" className="card-img-top" style={{ height: '250px', objectFit: 'cover' }} onError={(e) => { e.target.src = HOME_IMAGES.fallback; }} />
              <div className="p-4">
                <h5 className="fw-bold">Brownie Mágico</h5>
                <p className="text-muted small">El postre ideal para cerrar una noche de victorias.</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="row g-4 mt-5">
        <article className="col-md-4">
          <div className="feature-card p-4 text-center h-100">
            <div className="icon-box mx-auto mb-3"><i className="bi bi-egg-fried fs-3 text-warning"></i></div>
            <h4 className="fw-bold">Sabores Únicos</h4>
            <p className="text-muted small m-0">Ingredientes frescos y de la más alta calidad en cada plato que servimos.</p>
          </div>
        </article>
        <article className="col-md-4">
          <div className="feature-card p-4 text-center h-100">
            <div className="icon-box mx-auto mb-3"><i className="bi bi-cup-straw fs-3 text-info"></i></div>
            <h4 className="fw-bold">Mixología de Autor</h4>
            <p className="text-muted small m-0">Disfruta de nuestros tragos y mocktails preparados por expertos.</p>
          </div>
        </article>
        <article className="col-md-4">
          <div className="feature-card p-4 text-center h-100">
            <div className="icon-box mx-auto mb-3"><i className="bi bi-dice-5 fs-3 text-danger"></i></div>
            <h4 className="fw-bold">Juegos de Mesa</h4>
            <p className="text-muted small m-0">Comparte momentos inolvidables jugando mientras disfrutas tu comida.</p>
          </div>
        </article>
      </section>
    </main>
  );
}