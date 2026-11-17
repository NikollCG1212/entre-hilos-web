import { useState, useEffect } from 'react';
import './App.css';
import Admin from './admin/admin.jsx';
import { supabase } from './lib/supabase';

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
function App() {
  // Carrito de compras
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem('entre-hilos-carrito');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(
      'entre-hilos-carrito',
      JSON.stringify(carrito)
    );
  }, [carrito]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  // Datos para finalizar el pedido
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    whatsapp: '',
    ciudad: '',
    entrega: 'Por acordar',
    direccion: '',
    observaciones: '',
  });
  const registrarPedido = async () => {
    const total = carrito.reduce(
      (suma, producto) =>
        suma + Number(producto.precio) * producto.cantidad,
      0
    );

    const pedido = {
      nombre: datosCliente.nombre.trim(),
      whatsapp: datosCliente.whatsapp.trim(),
      ciudad: datosCliente.ciudad.trim(),
      entrega: datosCliente.entrega,
      direccion: datosCliente.direccion.trim(),
      observaciones: datosCliente.observaciones.trim(),

      productos: carrito.map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        cantidad: producto.cantidad,
      })),

      total,
    };

    const { error } = await supabase
      .from('pedidos')
      .insert(pedido);

    if (error) {
      console.error('Error al registrar el pedido:', error.message);

      alert(
        'No pudimos registrar tu pedido. Inténtalo nuevamente. 💗'
      );

      return null;
    }

    console.log('Pedido registrado correctamente.');

    return true;
  };
  const prepararPedidoWhatsApp = (ventanaWhatsApp) => {
    const total = carrito.reduce(
      (suma, producto) =>
        suma + Number(producto.precio) * producto.cantidad,
      0
    );

    const detalleProductos = carrito
      .map(
        (producto) =>
          `• ${producto.cantidad} x ${producto.nombre} — ${(
            Number(producto.precio) * producto.cantidad
          ).toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
          })}`
      )
      .join('\n');

    const mensaje = `
    
    ¡Hola! Quiero realizar un pedido en Entre Hilos.
    
    MI PEDIDO:
    ${detalleProductos}
    
    Total provisional: ${total.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    })}
    
    DATOS DEL CLIENTE:
    Nombre: ${datosCliente.nombre}
    WhatsApp: ${datosCliente.whatsapp}
    Ciudad: ${datosCliente.ciudad}
    Entrega: ${datosCliente.entrega}
    Dirección: ${datosCliente.direccion || 'Por acordar'}
    Observaciones: ${datosCliente.observaciones || 'Ninguna'}
    
    Quedo pendiente de confirmar la disponibilidad y los detalles. ♡
    `.trim();

    const numeroWhatsApp = '573148574325';

    const enlace = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    ventanaWhatsApp.opener = null;
    ventanaWhatsApp.location.href = enlace;

  };
  // Agregar productos al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.id === producto.id
      );

      if (productoExistente) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  };
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState('');

  useEffect(() => {
    const cargarProductos = async () => {
      setCargandoProductos(true);
      setErrorProductos('');

      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('estado', 'Publicado')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar productos:', error.message);
        setErrorProductos('No pudimos cargar los productos. Inténtalo más tarde.');
        setProductos([]);
      } else {
        setProductos(data || []);
      }

      setCargandoProductos(false);
    };

    cargarProductos();
  }, []);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
  const [vistaAdmin, setVistaAdmin] = useState(false);

  useEffect(() => {
    const comprobarConexion = async () => {
      const { error } = await supabase
        .from('productos')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Error al conectar con Supabase:', error.message);
      } else {
        console.log('¡Entre Hilos está conectado con Supabase!');
      }
    };

    comprobarConexion();
  }, []);
  if (vistaAdmin) {
    return (
      <Admin
        onVolver={() => setVistaAdmin(false)}
        productos={productos}
        setProductos={setProductos}
        categorias={categorias}
      />
    );
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
          <button
            type="button"
            className="boton-carrito"
            onClick={() => setMostrarCarrito(true)}
          >
            Mi pedido (
            {carrito.reduce(
              (total, producto) => total + producto.cantidad,
              0
            )}
            )
          </button>
        </nav>
        {mostrarCarrito && (
          <div className="carrito-fondo">
            <section className="carrito-panel">
              <button
                type="button"
                className="carrito-cerrar"
                onClick={() => setMostrarCarrito(false)}
                aria-label="Cerrar carrito"
              >
                ✕
              </button>

              <h2>Tu pedido ♡</h2>
              <p>Pequeños detalles que elegiste con cariño.</p>

              {carrito.length === 0 ? (
                <p className="carrito-vacio">
                  Todavía no has agregado productos a tu pedido.
                </p>
              ) : (
                <>
                  <div className="carrito-productos">
                    {carrito.map((producto) => (
                      <article
                        className="carrito-producto"
                        key={producto.id}
                      >
                        {producto.imagen_url && (
                          <img
                            src={producto.imagen_url}
                            alt={producto.nombre}
                          />
                        )}

                        <div className="carrito-producto-info">
                          <h3>{producto.nombre}</h3>

                          <p>
                            {Number(producto.precio).toLocaleString('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              maximumFractionDigits: 0,
                            })}
                          </p>

                          <div className="carrito-cantidad">
                            <button
                              type="button"
                              onClick={() => {
                                setCarrito((actual) =>
                                  actual
                                    .map((item) =>
                                      item.id === producto.id
                                        ? {
                                          ...item,
                                          cantidad: item.cantidad - 1,
                                        }
                                        : item
                                    )
                                    .filter((item) => item.cantidad > 0)
                                );
                              }}
                            >
                              −
                            </button>

                            <span>{producto.cantidad}</span>

                            <button
                              type="button"
                              onClick={() => {
                                setCarrito((actual) =>
                                  actual.map((item) =>
                                    item.id === producto.id
                                      ? {
                                        ...item,
                                        cantidad: item.cantidad + 1,
                                      }
                                      : item
                                  )
                                );
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="carrito-eliminar"
                          onClick={() =>
                            setCarrito((actual) =>
                              actual.filter((item) => item.id !== producto.id)
                            )
                          }
                        >
                          Eliminar
                        </button>
                      </article>
                    ))}
                  </div>

                  <div className="carrito-total">
                    <span>Total provisional</span>

                    <strong>
                      {carrito
                        .reduce(
                          (total, producto) =>
                            total +
                            Number(producto.precio) * producto.cantidad,
                          0
                        )
                        .toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          maximumFractionDigits: 0,
                        })}
                    </strong>
                  </div>

                  <p className="carrito-nota">
                    El valor del envío y los detalles de entrega se acordarán
                    contigo.
                  </p>
                  <form
                    className="formulario-pedido"
                    onSubmit={async (e) => {
                      e.preventDefault();

                      if (carrito.length === 0) {
                        alert('Agrega al menos un producto a tu pedido. ♡');
                        return;
                      }

                      const ventanaWhatsApp = window.open('about:blank', '_blank');

                      if (!ventanaWhatsApp) {
                        alert('Permite las ventanas emergentes para continuar con tu pedido. ♡');
                        return;
                      }

                      const idPedido = await registrarPedido();

                      if (!idPedido) {
                        ventanaWhatsApp.close();
                        return;
                      }

                      prepararPedidoWhatsApp(ventanaWhatsApp);
                    }}
                  >
                    <h3>Cuéntanos a dónde va tu pedido ♡</h3>

                    <label>
                      Nombre completo
                      <input
                        type="text"
                        value={datosCliente.nombre}
                        onChange={(e) =>
                          setDatosCliente({
                            ...datosCliente,
                            nombre: e.target.value,
                          })
                        }
                        placeholder="Tu nombre"
                        required
                      />
                    </label>

                    <label>
                      Número de WhatsApp
                      <input
                        type="tel"
                        value={datosCliente.whatsapp}
                        onChange={(e) =>
                          setDatosCliente({
                            ...datosCliente,
                            whatsapp: e.target.value,
                          })
                        }
                        placeholder="Tu número de contacto"
                        required
                      />
                    </label>

                    <label>
                      Ciudad
                      <input
                        type="text"
                        value={datosCliente.ciudad}
                        onChange={(e) =>
                          setDatosCliente({
                            ...datosCliente,
                            ciudad: e.target.value,
                          })
                        }
                        placeholder="¿En qué ciudad estás?"
                        required
                      />
                    </label>

                    <label>
                      ¿Cómo prefieres recibir tu pedido?
                      <select
                        value={datosCliente.entrega}
                        onChange={(e) =>
                          setDatosCliente({
                            ...datosCliente,
                            entrega: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="Por acordar">Por acordar</option>
                        <option value="Entrega acordada">Entrega acordada</option>
                        <option value="Envío">Envío</option>
                      </select>
                    </label>

                    <label>
                      Dirección (opcional)
                      <input
                        type="text"
                        value={datosCliente.direccion}
                        onChange={(e) =>
                          setDatosCliente({
                            ...datosCliente,
                            direccion: e.target.value,
                          })
                        }
                        placeholder="Dirección de entrega"
                      />
                    </label>

                    <label>
                      ¿Quieres personalizar algo? ♡
                      <textarea
                        value={datosCliente.observaciones}
                        onChange={(e) =>
                          setDatosCliente({
                            ...datosCliente,
                            observaciones: e.target.value,
                          })
                        }
                        placeholder="Cuéntanos qué tienes en mente..."
                        rows={3}
                      />
                    </label>

                    <button type="submit" className="boton-finalizar-pedido">
                      Continuar con mi pedido ♡
                    </button>
                  </form>
                </>
              )}
            </section>
          </div>
        )}
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
                <h4>{subcategoriaSeleccionada.nombre}</h4>

                {productos.filter(
                  (producto) =>
                    producto.categoria === categoriaSeleccionada.nombre &&
                    producto.subcategoria === subcategoriaSeleccionada.id &&
                    producto.estado === 'Publicado'
                ).length > 0 ? (
                  <div className="productos-grid">
                    {productos
                      .filter(
                        (producto) =>
                          producto.categoria === categoriaSeleccionada.nombre &&
                          producto.subcategoria === subcategoriaSeleccionada.id &&
                          producto.estado === 'Publicado'
                      )
                      .map((producto) => (
                        <article className="producto-card" key={producto.id}>
                          <div className="producto-imagen-pendiente">
                            {producto.imagen_url ?
                              (<img src={producto.imagen_url}
                                alt={producto.nombre}
                                className="producto-fotografia"
                                loading="lazy" />) : (
                                <span className="producto-sin-imagen">♡</span>)}
                          </div>

                          <h5>{producto.nombre}</h5>

                          <p>{producto.descripcion}</p>

                          <strong>
                            {producto.precio.toLocaleString('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              maximumFractionDigits: 0,
                            })}
                          </strong>
                          <button
                            type="button"
                            className="boton-agregar-carrito"
                            onClick={() => agregarAlCarrito(producto)}
                          >
                            🛍️ Agregar al pedido
                          </button>
                        </article>
                      ))}
                  </div>
                ) : (
                  <div className="nota-catalogo">
                    <span className="simbolo-pendiente">♡</span>
                    <p>Pronto encontrarás aquí nuestros diseños.</p>
                    <p>
                      Estamos preparando creaciones especiales para ti.
                    </p>
                  </div>
                )}

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