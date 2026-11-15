import { useState } from 'react';
import './admin.css';

const categoriasProducto = [
  'Pulseras',
  'Aretes',
  'Llaveros',
  'Bolsos y accesorios',
  'Collares',
  'Regalos y combos',
];
function Admin({ onVolver }) {
  const [productos, setProductos] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: 'Pulseras',
    precio: '',
    descripcion: '',
    estado: 'Borrador',
  });
  const [seccion, setSeccion] = useState('productos');

  const opciones = [
    { id: 'resumen', icono: '⌂', nombre: 'Resumen' },
    { id: 'productos', icono: '◇', nombre: 'Productos' },
    { id: 'categorias', icono: '▦', nombre: 'Categorías' },
    { id: 'pedidos', icono: '♡', nombre: 'Pedidos' },
    { id: 'configuracion', icono: '⚙', nombre: 'Configuración' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-marca">
          <img
            src="/logo-entre-hilos.png"
            alt="Entre Hilos"
          />
          <div>
            <h2>Entre Hilos</h2>
            <span>Panel administrativo</span>
          </div>
        </div>

        <div className="admin-menu-titulo">GESTIÓN DE TIENDA</div>

        <nav className="admin-menu">
          {opciones.map((opcion) => (
            <button
              key={opcion.id}
              className={
                seccion === opcion.id
                  ? 'admin-menu-item activo'
                  : 'admin-menu-item'
              }
              onClick={() => setSeccion(opcion.id)}
            >
              <span>{opcion.icono}</span>
              {opcion.nombre}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-pie">
          <span>Hecho a mano, con cariño ♡</span>

          <button
            className="admin-volver"
            onClick={onVolver}
          >
            ← Volver a la tienda
          </button>
        </div>
      </aside>

      <main className="admin-contenido">
        <header className="admin-header">
          <div>
            <span className="admin-etiqueta">
              ENTRE HILOS · ADMINISTRACIÓN
            </span>

            <h1>
              {seccion === 'productos'
                ? 'Tus productos'
                : opciones.find((opcion) => opcion.id === seccion)
                  ?.nombre}
            </h1>

            <p>
              Administra tu tienda y dale vida a cada una de tus creaciones.
            </p>
          </div>

          <div className="admin-avatar" title="Administradora">
            EH
          </div>
        </header>

        <section className="admin-bienvenida">
          <div>
            <span>UN ESPACIO PARA TUS CREACIONES</span>
            <h2>Tu emprendimiento, un hilo a la vez.</h2>
            <p>
              Organiza tu catálogo y prepara tus productos para mostrarlos
              al mundo.
            </p>
          </div>

          <span className="admin-corazon">♡</span>
        </section>

        <section className="admin-estadisticas">
          <article className="admin-stat">
            <span className="admin-stat-icono">◇</span>
            <div>
              <p>Productos registrados</p>
              <strong>{productos.length}</strong>
            </div>
          </article>

          <article className="admin-stat">
            <span className="admin-stat-icono">♡</span>
            <div>
              <p>Productos publicados</p>
              <strong>{productos.filter((producto) => producto.estado === 'Publicado').length}</strong>
            </div>
          </article>

          <article className="admin-stat">
            <span className="admin-stat-icono">✿</span>
            <div>
              <p>Categorías</p>
              <strong>{new Set(productos.map((producto) => producto.categoria)).size}</strong>
            </div>
          </article>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>
                {seccion === 'productos'
                  ? 'Catálogo de productos'
                  : opciones.find((opcion) => opcion.id === seccion)
                    ?.nombre}
              </h2>

              <p>
                {seccion === 'productos'
                  ? 'Aquí podrás organizar las creaciones de Entre Hilos.'
                  : 'Esta sección se habilitará durante las siguientes etapas.'}
              </p>
            </div>

            {seccion === 'productos' && (
              <button
                className="admin-boton-principal"
                onClick={() => setMostrarFormulario(true)}
              >
                + Nuevo producto
              </button>
            )}
          </div>
          {mostrarFormulario && (
            <form
              className="admin-formulario"
              onSubmit={(e) => {
                e.preventDefault();

                const producto = {
                  id: Date.now(),
                  ...nuevoProducto,
                  precio: Number(nuevoProducto.precio),
                };

                setProductos((anteriores) => [...anteriores, producto]);

                setNuevoProducto({
                  nombre: '',
                  categoria: 'Pulseras',
                  precio: '',
                  descripcion: '',
                  estado: 'Borrador',
                });

                setMostrarFormulario(false);
              }}
            >
              <h3>Registrar una nueva creación</h3>
              <p>Agrega los detalles de tu producto para organizar tu catálogo.</p>

              <div className="admin-formulario-campos">
                <label>
                  Nombre del producto
                  <input
                    type="text"
                    value={nuevoProducto.nombre}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        nombre: e.target.value,
                      })
                    }
                    placeholder="Ej. Pulsera tejida personalizada"
                    required
                  />
                </label>

                <label>
                  Categoría
                  <select
                    value={nuevoProducto.categoria}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        categoria: e.target.value,
                      })
                    }
                  >
                    {categoriasProducto.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Precio (COP)
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={nuevoProducto.precio}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        precio: e.target.value,
                      })
                    }
                    placeholder="Ej. 15000"
                    required
                  />
                </label>

                <label>
                  Estado del producto
                  <select
                    value={nuevoProducto.estado}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        estado: e.target.value,
                      })
                    }
                  >
                    <option value="Borrador">Borrador</option>
                    <option value="Publicado">Publicado</option>
                  </select>
                </label>

                <label className="admin-campo-completo">
                  Descripción
                  <textarea
                    value={nuevoProducto.descripcion}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        descripcion: e.target.value,
                      })
                    }
                    placeholder="Cuéntanos qué hace especial esta creación..."
                    rows="3"
                  />
                </label>
              </div>

              <div className="admin-formulario-acciones">
                <button
                  type="button"
                  className="admin-boton-cancelar"
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="admin-boton-principal">
                  Guardar producto
                </button>
              </div>
            </form>
          )}
          <div className="admin-tabla-encabezado">
            <span>PRODUCTO</span>
            <span>CATEGORÍA</span>
            <span>PRECIO</span>
            <span>ESTADO</span>
          </div>

          {productos.length === 0 ? (
            <div className="admin-vacio">
              <span className="admin-vacio-icono">♡</span>
              <h3>Tu catálogo comienza aquí</h3>
              <p>
                Tus creaciones aparecerán aquí cuando registres tu primer producto.
              </p>
            </div>
          ) : (
            <div className="admin-lista-productos">
              {productos.map((producto) => (
                <div className="admin-fila-producto" key={producto.id}>
                  <div>
                    <strong>{producto.nombre}</strong>
                    <small>
                      {producto.descripcion || 'Sin descripción'}
                    </small>
                  </div>

                  <span>{producto.categoria}</span>

                  <span>
                    {producto.precio.toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      maximumFractionDigits: 0,
                    })}
                  </span>

                  <span
                    className={
                      producto.estado === 'Publicado'
                        ? 'admin-estado publicado'
                        : 'admin-estado borrador'
                    }
                  >
                    {producto.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="admin-footer">
          Entre Hilos · Accesorios artesanales elaborados con diferentes
          técnicas de tejido.
        </footer>
      </main>
    </div>
  );
}

export default Admin;
