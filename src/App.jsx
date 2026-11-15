import { useState } from 'react';
import './App.css';
import Admin from './admin/admin.jsx';


const categorias = [
  {
    id: 'pulseras',
    nombre: 'Pulseras',
    descripcion: 'Diseños tejidos para cada estilo.',
    simbolo: '♡',
    subcategorias: [
      { id: 'macrame', nombre: 'Pulseras en macramé' },
      { id: 'mostacillas', nombre: 'Pulseras de mostacillas' },
      { id: 'murano', nombre: 'Pulseras de Murano' },
      { id: 'dijes', nombre: 'Pulseras con dijes' },
      { id: 'personalizadas', nombre: 'Pulseras personalizadas' },
    ],
  },
  {
    id: 'llaveros',
    nombre: 'Llaveros',
    descripcion: 'Pequeños detalles para llevar contigo.',
    simbolo: '✿',
    subcategorias: [
      { id: 'corazones', nombre: 'Llaveros de corazones' },
      { id: 'cruces', nombre: 'Llaveros de cruces' },
      { id: 'mini-bolsos', nombre: 'Llaveros de mini bolsos' },
      { id: 'frutas', nombre: 'Llaveros de frutas' },
      { id: 'llaveros-personalizados', nombre: 'Llaveros personalizados' },
    ],
  },
  {
    id: 'bolsos',
    nombre: 'Bolsos y accesorios',
    descripcion: 'Tejidos prácticos para acompañarte.',
    simbolo: '◇',
    subcategorias: [
      { id: 'tarjeteros', nombre: 'Tarjeteros tejidos' },
      { id: 'bolsos-celular', nombre: 'Bolsos para celular' },
      { id: 'otros-bolsos', nombre: 'Otros bolsos tejidos' },
    ],
  },
  {
    id: 'collares',
    nombre: 'Collares',
    descripcion: 'Accesorios que complementan tu estilo.',
    simbolo: '♡',
    subcategorias: [
      { id: 'murano-minimalista', nombre: 'Minimalistas de Murano' },
      { id: 'mostacillas-maximalista', nombre: 'Maximalistas de mostacillas' },
      { id: 'collares-personalizados', nombre: 'Collares personalizados' },
    ],
  },
  {
    id: 'aretes',
    nombre: 'Aretes',
    descripcion: 'Pequeños detalles que iluminan tu look.',
    simbolo: '✳',
    subcategorias: [
      { id: 'aretes-mostacillas', nombre: 'Aretes de mostacillas' },
      { id: 'aretes-murano', nombre: 'Aretes de Murano' },
      { id: 'aretes-florales', nombre: 'Aretes florales' },
      { id: 'otros-aretes', nombre: 'Otros diseños' },
    ],
  },
  {
    id: 'regalos',
    nombre: 'Regalos y combos',
    descripcion: 'Detalles especiales para compartir.',
    simbolo: '♡',
    subcategorias: [
      { id: 'combos', nombre: 'Combos de accesorios' },
      { id: 'regalos-personalizados', nombre: 'Regalos personalizados' },
      { id: 'ocasiones', nombre: 'Detalles para ocasiones especiales' },
    ],
  },
];
const productos = []
function App() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
  const [vistaAdmin, setVistaAdmin] = useState(false);

  if (vistaAdmin) {
    return <Admin onVolver={() => setVistaAdmin(false)} />;
  }

  return (
    <main>
      <header className="encabezado">
        <a href="#inicio" className="logo marca-logo">
          <img src="/logo-entre-hilos.png" alt="Logo de Entre Hilos" />
          <span className="marca-nombre">
            entre hilos<span className="punto-logo">.</span>
            <small>ACCESORIOS CON SIGNIFICADO</small>
          </span>
        </a>

        <nav className="navegacion">
          <a href="#inicio">Inicio</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#nosotros">Nuestra esencia</a>
          <a href="#contacto" className="boton-nav">
            Hablemos ↗
          </a>
          <button
            type="button"
            className="boton-admin-acceso"
            onClick={() => setVistaAdmin(true)}
          >
            Panel administrativo ↗
          </button>
        </nav>
      </header>

      <section className="portada" id="inicio">
        <div className="portada-texto">
          <span className="etiqueta">
            PEQUEÑOS DETALLES, GRANDES HISTORIAS
          </span>

          <h1>
            Hay cosas que se llevan.
            <br />
            Y otras que <em>significan.</em>
          </h1>

          <p>
            Accesorios tejidos hechos a mano, creados para
            acompañarte y contar un poquito de tu historia.
          </p>

          <div className="portada-botones">
            <a href="#catalogo" className="boton-principal">
              Descubre nuestros diseños ↗
            </a>

            <a href="#nosotros" className="boton-secundario">
              Conoce nuestra historia
            </a>
          </div>

        </div>

        <div className="portada-logo-visual">
          <div className="logo-fondo"></div>

          <img
            src="/logo-entre-hilos.png"
            alt="Logo de Entre Hilos: pulsera trenzada con una flor"
            className='logo-portada'
          />

          <span className='logo-frase'>
            Hecho a mano, pensado para ti.
          </span>
        </div>
      </section>

      <section className="franja">
        <span>✳ Accesorios artesanales</span>
        <span>♡ Personalización consciente</span>
        <span>✳ Detalles con significado</span>
      </section>

      <section className="catalogo" id="catalogo">
        <div className="seccion-encabezado">
          <div>
            <span className="etiqueta">DESCUBRE ENTRE HILOS</span>

            <h2>
              Nuestro <em>catálogo.</em>
            </h2>
          </div>

          <p>
            Explora nuestros accesorios tejidos y encuentra
            ese detalle que conecta contigo.
          </p>
        </div>

        {!categoriaSeleccionada ? (
          <div className="categorias-grid">
            {categorias.map((categoria, indice) => (
              <button
                type="button"
                className={`categoria-tarjeta categoria-color-${(indice % 3) + 1}`}
                key={categoria.id}
                onClick={() => {
                  setCategoriaSeleccionada(categoria);
                  setSubcategoriaSeleccionada(null);
                }}
              >
                <div className="categoria-imagen">
                  {categoria.imagen ? (
                    <img
                      src={categoria.imagen}
                      alt={`Accesorios de ${categoria.nombre}`}
                      className="imagen-categoria"
                    />
                  ) : (
                    <span className="simbolo-categoria">{categoria.simbolo}</span>
                  )}

                  <small>ENTRE HILOS</small>
                </div>

                <div className="categoria-informacion">
                  <div>
                    <h3>{categoria.nombre}</h3>
                    <p>{categoria.descripcion}</p>
                  </div>

                  <span className="categoria-flecha">↗</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="explorador-catalogo">
            <button
              type="button"
              className="volver-catalogo"
              onClick={() => {
                setCategoriaSeleccionada(null);
                setSubcategoriaSeleccionada(null);
              }}
            >
              ← Volver a todas las categorías
            </button>

            <h3 className="titulo-explorador">
              {categoriaSeleccionada.nombre}
            </h3>

            <p className="descripcion-explorador">
              {subcategoriaSeleccionada
                ? subcategoriaSeleccionada.nombre
                : 'Elige el tipo de accesorio que quieres descubrir.'}
            </p>

            {!subcategoriaSeleccionada ? (
              <div className="subcategorias-grid">
                {categoriaSeleccionada.subcategorias.map(
                  (subcategoria, indice) => (
                    <button
                      type="button"
                      className={`subcategoria-tarjeta categoria-color-${(indice % 3) + 1}`}
                      key={subcategoria.id}
                      onClick={() => setSubcategoriaSeleccionada(subcategoria)}
                    >
                      <div className="subcategoria-imagen">
                        <span>✳</span>
                      </div>

                      <div className="subcategoria-informacion">
                        <h4>{subcategoria.nombre}</h4>
                        <span>Explorar diseños ↗</span>
                      </div>
                    </button>
                  )
                )}
              </div>
            ) : (
              <div className="productos-pendientes">
                <span className="simbolo-pendiente">♡</span>

                <h4>
                  {subcategoriaSeleccionada.nombre}
                </h4>

                <p>
                  Aquí podrás descubrir nuestros diseños,
                  consultar sus precios y conocer las opciones
                  de personalización.
                </p>

                <p className="nota-catalogo">
                  Estamos preparando este espacio para tus productos.
                </p>

                <button
                  type="button"
                  className="volver-catalogo"
                  onClick={() => setSubcategoriaSeleccionada(null)}
                >
                  ← Volver a las subcategorías
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="esencia" id="nosotros">
        <div className="esencia-simbolo">∞</div>

        <div>
          <span className="etiqueta">MÁS QUE UN ACCESORIO</span>

          <h2>
            Tu idea también
            <br />
            tiene un lugar <em>aquí.</em>
          </h2>

          <p>
            En Entre Hilos creemos que los detalles más especiales
            nacen cuando una idea se encuentra con las manos
            correctas. Tú imaginas, nosotros creamos contigo.
          </p>

          <a href="#contacto" className="boton-principal">
            Hagamos realidad tu idea ↗
          </a>
        </div>
      </section>

      <section className="contacto" id="contacto">
        <span className="etiqueta">ESTAMOS PARA ESCUCHARTE</span>

        <h2>
          ¿Ya tienes una idea <em>en mente?</em>
        </h2>

        <p>
          Cuéntanos qué imaginas y empecemos a darle forma.
        </p>

        <a href="mailto:hola@entre-hilos.com" className="boton-principal">
          Conversemos sobre tu idea ↗
        </a>
      </section>

      <footer className="pie-pagina">
        <a href="#inicio" className="logo marca-logo">
          <img src="/logo-entre-hilos.png" alt="Logo de Entre Hilos" />
          <span className="marca-nombre">
            entre hilos<span className="punto-logo">.</span>
            <small>ACCESORIOS CON SIGNIFICADO</small>
          </span>
        </a>

        <p>Hecho a mano, pensado para ti. ♡</p>

        <a href="#inicio" className="volver-arriba">
          Volver arriba ↑
        </a>
      </footer>
    </main >
  );
}

export default App;