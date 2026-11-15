import { useState } from 'react';
import './admin.css';

function Admin({ onVolver }) {
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
              <strong>0</strong>
            </div>
          </article>

          <article className="admin-stat">
            <span className="admin-stat-icono">♡</span>
            <div>
              <p>Productos publicados</p>
              <strong>0</strong>
            </div>
          </article>

          <article className="admin-stat">
            <span className="admin-stat-icono">✿</span>
            <div>
              <p>Categorías</p>
              <strong>0</strong>
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
                onClick={() =>
                  alert(
                    '¡Pronto habilitaremos el formulario para registrar productos!'
                  )
                }
              >
                + Nuevo producto
              </button>
            )}
          </div>

          <div className="admin-tabla-encabezado">
            <span>PRODUCTO</span>
            <span>CATEGORÍA</span>
            <span>PRECIO</span>
            <span>ESTADO</span>
          </div>

          <div className="admin-vacio">
            <span className="admin-vacio-icono">♡</span>
            <h3>Tu catálogo comienza aquí</h3>
            <p>
              Cuando conectemos el registro de productos, podrás gestionar
              sus nombres, precios, descripciones, fotografías y publicación
              desde este espacio.
            </p>
          </div>
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
