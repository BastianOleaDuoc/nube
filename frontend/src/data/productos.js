const API_BASE = "https://nube-sz47.onrender.com/api";

export const PRODUCTOS_IMAGES = {
  mycelium: new URL('../img/mycelium.jpg', import.meta.url).href,
  klask: new URL('../img/klask.png', import.meta.url).href,
  ameri: new URL('../img/ameri.png', import.meta.url).href,
  blood: new URL('../img/blood.png', import.meta.url).href,
  aros: new URL('../img/aros.png', import.meta.url).href,
  chao: new URL('../img/chao.png', import.meta.url).href,
  camaron: new URL('../img/camaron.png', import.meta.url).href,
  mechada: new URL('../img/mechada.png', import.meta.url).href,
  rustica: new URL('../img/rustica.png', import.meta.url).href,
  everdel: new URL('../img/everdel.png', import.meta.url).href,
  pollo: new URL('../img/pollo.png', import.meta.url).href,
  cosmo: new URL('../img/cosmo.png', import.meta.url).href,
  bolafuego: new URL('../img/bolafuego.png', import.meta.url).href,
  tiki: new URL('../img/tiki.png', import.meta.url).href,
  margarita: new URL('../img/margarita.png', import.meta.url).href,
  negroni: new URL('../img/negroni.png', import.meta.url).href,
  rhino: new URL('../img/rhino.png', import.meta.url).href,
  virus: new URL('../img/virus.png', import.meta.url).href,
  fantasma: new URL('../img/fantasma.png', import.meta.url).href,
  latte: new URL('../img/latte.png', import.meta.url).href,
  cappuccino: new URL('../img/cappuccino.png', import.meta.url).href,
  chocolate: new URL('../img/chocolate.png', import.meta.url).href,
  brownie: new URL('../img/brownie.png', import.meta.url).href,
  copahelado: new URL('../img/copahelado.png', import.meta.url).href,
  celestino: new URL('../img/celestino.png', import.meta.url).href,
  default: new URL('../img/unnamed.png', import.meta.url).href,
};

const IMAGE_BY_NAME = {
  myceliumburger: 'mycelium',
  klaskburger: 'klask',
  ameriburger: 'ameri',
  bloodbbqrage: 'blood',
  arosdecebolla: 'aros',
  chaopescao: 'chao',
  empanadascamaron: 'camaron',
  empanadasmechada: 'mechada',
  paleorustica: 'rustica',
  everdell: 'everdel',
  mojateelpollito: 'pollo',
  cosmonopoly: 'cosmo',
  boladefuego: 'bolafuego',
  whiskeytiki: 'tiki',
  margarita: 'margarita',
  negroni: 'negroni',
  rhinohero: 'rhino',
  virus: 'virus',
  fantasmablitz: 'fantasma',
  cafelatte: 'latte',
  capuccino: 'cappuccino', 
  cappuccino: 'cappuccino', 
  chocolatepremium: 'chocolate',
  brownieconhelado: 'brownie',
  copadehelado: 'copahelado',
  celestinoconhelado: 'celestino',
};

export const PRODUCTOS_FALLBACK = [
  { id: 1, nombre: 'Mycelium Burger', categoria: 'Hamburguesas', precio: 11990 },
  { id: 2, nombre: 'Klask Burger', categoria: 'Hamburguesas', precio: 10900 },
  { id: 3, nombre: 'Ameri Burger', categoria: 'Hamburguesas', precio: 10900 },
  { id: 4, nombre: 'Blood BBQ Rage', categoria: 'Hamburguesas', precio: 10900 },
  { id: 5, nombre: 'Aros de Cebolla', categoria: 'Entradas', precio: 6400 },
  { id: 6, nombre: 'Chao Pescao', categoria: 'Entradas', precio: 9500 },
  { id: 7, nombre: 'Empanadas Camaron', categoria: 'Entradas', precio: 8900 },
  { id: 8, nombre: 'Empanadas Mechada', categoria: 'Entradas', precio: 6900 },
  { id: 9, nombre: 'Paleo Rustica', categoria: 'Chorrillanas', precio: 14900 },
  { id: 10, nombre: 'Everdell', categoria: 'Chorrillanas', precio: 14900 },
  { id: 11, nombre: 'Mojate el Pollito', categoria: 'Chorrillanas', precio: 14900 },
  { id: 12, merge: 'Cosmonopoly', nombre: 'Cosmonopoly', categoria: 'Tragos', precio: 6990 },
  { id: 13, nombre: 'Bola de Fuego', categoria: 'Tragos', precio: 8490 },
  { id: 14, nombre: 'Whiskey Tiki', categoria: 'Tragos', precio: 8490 },
  { id: 15, nombre: 'Margarita', categoria: 'Tragos', precio: 6990 },
  { id: 16, nombre: 'Negroni', categoria: 'Tragos', precio: 7490 },
  { id: 17, nombre: 'Rhino Hero', categoria: 'Mocktails', precio: 7490 },
  { id: 18, nombre: 'Virus', categoria: 'Mocktails', precio: 6490 },
  { id: 19, nombre: 'Fantasma Blitz', categoria: 'Mocktails', precio: 6990 },
  { id: 20, nombre: 'Cafe Latte', categoria: 'Cafeteria', precio: 4490 },
  { id: 21, nombre: 'Capuccino', categoria: 'Cafeteria', precio: 3990 },
  { id: 22, nombre: 'Chocolate Premium', categoria: 'Cafeteria', precio: 5490 },
  { id: 23, nombre: 'Brownie con Helado', categoria: 'Postres', precio: 7900 },
  { id: 24, nombre: 'Copa de Helado', categoria: 'Postres', precio: 4500 },
  { id: 25, nombre: 'Celestino con Helado', categoria: 'Postres', precio: 6900 },
].map((producto) => normalizeProducto(producto));

export function normalizarTexto(valor = '') {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function resolverImagenProducto(nombre, img) {
  if (img) {
    return img;
  }

  const key = IMAGE_BY_NAME[normalizarTexto(nombre)];
  return key ? PRODUCTOS_IMAGES[key] : PRODUCTOS_IMAGES.default;
}

export function normalizeProducto(producto = {}) {
  const nombre = producto.nombre ?? producto.name ?? 'Producto';
  const precio = Number(producto.precio ?? producto.price ?? 0);

  return {
    ...producto,
    nombre,
    categoria: producto.categoria ?? producto.category ?? 'Sin categoria',
    precio: Number.isNaN(precio) ? 0 : precio,
    stock: producto.stock ?? 0,
    estado: producto.estado ?? 'Disponible',
    img: resolverImagenProducto(nombre, producto.img),
  };
}

export function normalizeCarritoItem(item = {}) {
  const producto = normalizeProducto(item);
  const cantidad = Number(item.cantidad ?? 1);

  return {
    ...producto,
    cantidad: Number.isNaN(cantidad) || cantidad < 1 ? 1 : cantidad,
  };
}

export function dinero(valor) {
  const numeroSeguro = Math.round(Number(valor || 0));
  return `$${numeroSeguro.toLocaleString('es-CL')}`;
}