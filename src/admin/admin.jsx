import { useState, useEffect } from 'react';
import './admin.css';
import { supabase } from '../lib/supabase';

const categoriasProducto = [
  'Pulseras',
  'Aretes',
  'Llaveros',
  'Bolsos y accesorios',
  'Collares',
  'Regalos y combos',
];

function Admin({ onVolver, productos, setProductos, categorias }) {
  // Pedidos recibidos desde Supabase
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(false);
  const [errorPedidos, setErrorPedidos] = useState('');
  const [mostrarPedidos, setMostrarPedidos] = useState(false);
  // Cargar pedidos cuando se abra la sección
  useEffect(() => {
    if (!mostrarPedidos) return;

    const cargarPedidos = async () => {
      setCargandoPedidos(true);
      setErrorPedidos('');

      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar pedidos:', error.message);
        setErrorPedidos('No pudimos cargar los pedidos. Inténtalo nuevamente.');
        setPedidos([]);
      } else {
        setPedidos(data || []);
      }

      setCargandoPedidos(false);
    };

    cargarPedidos();
  }, [mostrarPedidos]);
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [comprobandoSesion, setComprobandoSesion] = useState(true);

  useEffect(() => {
    let activo = true;

    const comprobarSesion = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!data.session) {
          if (activo) setComprobandoSesion(false);
          return;
        }

        const { data: administrador, error: errorAdmin } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', data.session.user.id)
          .maybeSingle();

        if (errorAdmin || !administrador) {
          await supabase.auth.signOut();

          if (activo) setSesionIniciada(false);
          return;
        }

        const { data: productosDB, error: errorProductos } = await supabase
          .from('productos')
          .select('*')
          .order('created_at', { ascending: false });

        if (errorProductos) throw errorProductos;

        if (activo) {
          setProductos(productosDB || []);
          setSesionIniciada(true);
        }
      } catch (error) {
        console.error('Error al comprobar la sesión:', error.message);
        if (activo) setSesionIniciada(false);
      } finally {
        if (activo) setComprobandoSesion(false);
      }
    };

    comprobarSesion();

    return () => {
      activo = false;
    };
  }, [setProductos]);
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [cargandoLogin, setCargandoLogin] = useState(false);
  const iniciarSesion = async (e) => {
    e.preventDefault();

    setErrorLogin('');
    setCargandoLogin(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: contrasena,
      });

      if (error) {
        throw new Error('El correo o la contraseña son incorrectos.');
      }

      const { data: administrador, error: errorAdmin } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (errorAdmin || !administrador) {
        await supabase.auth.signOut();
        throw new Error('Esta cuenta no tiene permisos de administradora.');
      }

      // Cargar los productos desde Supabase.
      const { data: productosDB, error: errorProductos } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (errorProductos) {
        await supabase.auth.signOut();
        throw new Error('No pudimos cargar los productos. Inténtalo nuevamente.');
      }

      // Actualizar la lista del panel con los datos de la base de datos.
      setProductos(productosDB || []);

      setSesionIniciada(true);
      setContrasena('');
    } catch (error) {
      setErrorLogin(error.message);
    } finally {
      setCargandoLogin(false);
    }
  };

  const cerrarSesion = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error al cerrar sesión:', error.message);
      alert('No pudimos cerrar la sesión. Inténtalo nuevamente.');
      return;
    }

    setSesionIniciada(false);
    onVolver();
  };
  const [productoEditando, setProductoEditando] = useState(null);
  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      categoria: producto.categoria,
      subcategoria: producto.subcategoria || '',
      precio: String(producto.precio),
      descripcion: producto.descripcion,
      estado: producto.estado,
      imagen_url: producto.imagen_url || '',
    });

    setImagenSeleccionada(null);
    setProductoEditando(producto.id);
    setMostrarFormulario(true);
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      '¿Estás segura de que deseas eliminar este producto?'
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProductos((anteriores) =>
        anteriores.filter((producto) => producto.id !== id)
      );

      alert('¡Producto eliminado correctamente! ♡');
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);

      alert(
        'No pudimos eliminar el producto. Inténtalo nuevamente.'
      );
    }
  };

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: 'Pulseras',
    subcategoria: '',
    precio: '',
    descripcion: '',
    estado: 'Borrador',
    imagen_url: '',
  });

  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [seccion, setSeccion] = useState('productos');

  const opciones = [
    { id: 'resumen', icono: '⌂', nombre: 'Resumen' },
    { id: 'productos', icono: '◇', nombre: 'Productos' },
    { id: 'categorias', icono: '▦', nombre: 'Categorías' },
    { id: 'pedidos', icono: '♡', nombre: 'Pedidos' },
    { id: 'configuracion', icono: '⚙', nombre: 'Configuración' },
  ];
  if (comprobandoSesion) {
    return (
      <div className="login-admin">
        <p>Comprobando tu sesión administrativa... ♡</p>
      </div>
    );
  }
  if (!sesionIniciada) {
    return (
      <div className="login-admin">
        <form className="login-admin-formulario" onSubmit={iniciarSesion}>
          <img
            src="/logo-entre-hilos.png"
            alt="Entre Hilos"
            className="login-admin-logo"
          />

          <span className="login-admin-etiqueta">
            ENTRE HILOS · ADMINISTRACIÓN
          </span>

          <h1>¡Hola de nuevo! ♡</h1>

          <p>
            Inicia sesión para gestionar tus creaciones y mantener tu catálogo
            al día.
          </p>

          <label htmlFor="correo-admin">
            Correo electrónico
          </label>

          <input
            id="correo-admin"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Tu correo electrónico"
            autoComplete="username"
            required
          />

          <label htmlFor="contrasena-admin">
            Contraseña
          </label>

          <input
            id="contrasena-admin"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Tu contraseña"
            autoComplete="current-password"
            required
          />

          {errorLogin && (
            <p className="login-admin-error" role="alert">
              {errorLogin}
            </p>
          )}

          <button type="submit" disabled={cargandoLogin}>
            {cargandoLogin ? 'Verificando acceso...' : 'Entrar al panel ♡'}
          </button>

          <button
            type="button"
            className="login-admin-volver"
            onClick={cerrarSesion}
          >
            ← Volver a la tienda
          </button>
        </form>
      </div>
    );
  }
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
        <button
          type="button"
          className="admin-menu-item"
          onClick={() => setMostrarPedidos(true)}
        >
          <span>📦</span>
          <span>Pedidos recibidos</span>
        </button>
        <div className="admin-sidebar-pie">
          <span>Hecho a mano, con cariño ♡</span>

          <button
            className="admin-volver"
            onClick={cerrarSesion}
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

          {mostrarPedidos && (
            <div className="admin-pedidos">
              <h2>Pedidos recibidos ♡</h2>

              <button
                type="button"
                className="admin-boton-principal"
                onClick={() => setMostrarPedidos(false)}
              >
                Volver a productos
              </button>

              {cargandoPedidos ? (
                <p>Cargando pedidos...</p>
              ) : errorPedidos ? (
                <p>{errorPedidos}</p>
              ) : pedidos.length === 0 ? (
                <p>Aún no tienes pedidos registrados. ♡</p>
              ) : (
                pedidos.map((pedido) => (
                  <article key={pedido.id}>
                    <h3>Pedido #{pedido.id}</h3>
                    <p>Cliente: {pedido.nombre}</p>
                    <p>WhatsApp: {pedido.whatsapp}</p>
                    <p>Ciudad: {pedido.ciudad}</p>
                    <p>Estado: {pedido.estado}</p>
                    <p>
                      Total: {Number(pedido.total).toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </article>
                ))
              )}
            </div>
          )}

          {!mostrarPedidos && (
            <>
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
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const boton = e.nativeEvent.submitter;

                    if (boton) {
                      boton.disabled = true;
                    }

                    try {
                      let imagenUrl = nuevoProducto.imagen_url || '';

                      if (imagenSeleccionada) {
                        setSubiendoImagen(true);

                        const nombreArchivo = imagenSeleccionada.name
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-zA-Z0-9._-]/g, '_');

                        const rutaImagen = `${crypto.randomUUID()}-${nombreArchivo}`;

                        const { error: errorSubida } = await supabase.storage
                          .from('productos')
                          .upload(rutaImagen, imagenSeleccionada, {
                            contentType: imagenSeleccionada.type,
                            upsert: false,
                          });

                        if (errorSubida) throw errorSubida;

                        const { data: urlImagen } = supabase.storage
                          .from('productos')
                          .getPublicUrl(rutaImagen);

                        imagenUrl = urlImagen.publicUrl;
                      }

                      const producto = {
                        nombre: nuevoProducto.nombre.trim(),
                        categoria: nuevoProducto.categoria,
                        subcategoria: nuevoProducto.subcategoria,
                        precio: Number(nuevoProducto.precio),
                        descripcion: nuevoProducto.descripcion.trim(),
                        estado: nuevoProducto.estado,
                        imagen_url: imagenUrl,
                      };

                      if (!producto.nombre || !producto.subcategoria) {
                        alert('Completa el nombre y la subcategoría del producto.');
                        return;
                      }

                      if (!Number.isFinite(producto.precio) || producto.precio <= 0) {
                        alert('Ingresa un precio válido mayor que cero.');
                        return;
                      }

                      if (productoEditando !== null) {
                        const { data, error } = await supabase
                          .from('productos')
                          .update(producto)
                          .eq('id', productoEditando)
                          .select()
                          .single();

                        if (error) throw error;

                        setProductos((anteriores) =>
                          anteriores.map((anterior) =>
                            anterior.id === productoEditando ? data : anterior
                          )
                        );

                        alert('¡Producto actualizado correctamente! ♡');
                      } else {
                        const { data, error } = await supabase
                          .from('productos')
                          .insert([producto])
                          .select()
                          .single();

                        if (error) throw error;

                        setProductos((anteriores) => [...anteriores, data]);

                        alert('¡Producto guardado correctamente! ♡');
                      }

                      setNuevoProducto({
                        nombre: '',
                        categoria: 'Pulseras',
                        subcategoria: '',
                        precio: '',
                        descripcion: '',
                        estado: 'Borrador',
                        imagen_url: '',
                      });

                      setImagenSeleccionada(null);
                      setProductoEditando(null);
                      setMostrarFormulario(false);
                    } catch (error) {
                      console.error('Error al guardar el producto:', error.message);
                      alert('No pudimos guardar el producto. Revisa la conexión e inténtalo nuevamente.');
                    }
                    finally {
                      setSubiendoImagen(false);

                      if (boton) {
                        boton.disabled = false;
                      }
                    }
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
                            subcategoria: '',
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
                      Subcategoría
                      <select
                        value={nuevoProducto.subcategoria}
                        onChange={(e) =>
                          setNuevoProducto({
                            ...nuevoProducto,
                            subcategoria: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecciona una subcategoría</option>

                        {(
                          categorias.find(
                            (cat) => cat.nombre === nuevoProducto.categoria
                          )?.subcategorias ?? []
                        ).map((subcategoria) => (
                          <option key={subcategoria.id} value={subcategoria.id}>
                            {subcategoria.nombre}
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
                    <label className="admin-campo-completo">
                      Fotografía del producto
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => {
                          const archivo = e.target.files?.[0];

                          if (!archivo) {
                            setImagenSeleccionada(null);
                            return;
                          }

                          if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) {
                            alert('Selecciona una imagen JPG, PNG o WEBP.');
                            e.target.value = '';
                            setImagenSeleccionada(null);
                            return;
                          }

                          if (archivo.size > 5 * 1024 * 1024) {
                            alert('La imagen debe pesar máximo 5 MB.');
                            e.target.value = '';
                            setImagenSeleccionada(null);
                            return;
                          }

                          setImagenSeleccionada(archivo);
                        }}
                      />

                      <small>Formatos permitidos: JPG, PNG y WEBP. Máximo 5 MB.</small>
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

                    <button
                      type="submit"
                      className="admin-boton-principal"
                      disabled={subiendoImagen}
                    >
                      {subiendoImagen ? 'Subiendo imagen...' : 'Guardar producto'}
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

                      <button
                        type="button"
                        className="admin-boton-editar"
                        onClick={() => editarProducto(producto)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="admin-boton-eliminar"
                        onClick={() => eliminarProducto(producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
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