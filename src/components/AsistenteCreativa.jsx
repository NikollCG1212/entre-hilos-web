import { useState, useRef, useEffect } from 'react';
import './AsistenteCreativa.css';

function AsistenteCreativa() {
  const [mensajes, setMensajes] = useState([
    {
      tipo: 'asistente',
      texto: '¡Holaaa! ♡ Bienvenida a Entre Hilos. Soy tu asistente creativa y estoy aquí para ayudarte a encontrar ese accesorio especial. ¿Qué tienes en mente?'
    }
  ]);

  const [mensaje, setMensaje] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const finalChat = useRef(null);

  useEffect(() => {
    finalChat.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, escribiendo]);

  function generarRespuesta(texto) {
    const textoNormalizado = texto.toLowerCase();
    const ultimoMensaje = mensajes[mensajes.length - 1]?.texto.toLowerCase() || '';

    if (
      textoNormalizado.includes('hola') ||
      textoNormalizado.includes('buenas') ||
      textoNormalizado.includes('buenos días')
    ) {
      return '¡Holaaa! ♡ Qué alegría tenerte aquí. Cuéntame, ¿buscas un accesorio para ti o quieres sorprender a alguien con un regalo especial?';
    }

    if (
      textoNormalizado.includes('gracias')
    ) {
      return '¡Con muchísimo cariño! ♡ Recuerda que podemos explorar diferentes colores, materiales y estilos para encontrar una opción que te guste.';
    }

    if (
      textoNormalizado.includes('precio') ||
      textoNormalizado.includes('presupuesto') ||
      textoNormalizado.includes('cuesta') ||
      textoNormalizado.includes('20.000') ||
      textoNormalizado.includes('20000')
    ) {
      return '♡ ¡Busquemos una opción para ti! El precio depende del accesorio, los materiales y los detalles que elijas. Cuéntame qué producto tienes en mente y podemos orientarte. Para confirmar precios y disponibilidad, consulta directamente con Entre Hilos.';
    }

    if (
      textoNormalizado.includes('mamá') ||
      textoNormalizado.includes('madre') ||
      textoNormalizado.includes('amiga') ||
      textoNormalizado.includes('cumpleaños') ||
      textoNormalizado.includes('regalo')
    ) {
      return '¡Qué lindo que quieras regalar algo especial! ♡ Podemos explorar una pulsera personalizada, un collar o un llavero artesanal. ¿Qué estilo le gusta a esa persona: delicado y minimalista o colorido y creativo?';
    }

    if (
      textoNormalizado.includes('pulsera') ||
      textoNormalizado.includes('pulseras')
    ) {
      return '¡Las pulseras son una opción preciosa! ♡ Podemos explorar diseños tejidos, combinaciones de mostacillas y colores que reflejen tu estilo. ¿Prefieres algo delicado y sencillo o una pulsera más colorida?';
    }

    if (
      textoNormalizado.includes('llavero') ||
      textoNormalizado.includes('llaveros')
    ) {
      return '¡Un llavero artesanal puede ser un detalle muy especial! ♡ Podemos pensar en colores y diseños que conecten contigo o con la persona que lo recibirá. ¿Lo buscas para ti o para regalar?';
    }

    if (
      textoNormalizado.includes('collar') ||
      textoNormalizado.includes('collares')
    ) {
      return '¡Vamos con los collares! ♡ Podemos explorar combinaciones de materiales y colores según el estilo que te guste. ¿Prefieres algo minimalista o un diseño más llamativo?';
    }

    if (
      textoNormalizado.includes('arete') ||
      textoNormalizado.includes('aretes')
    ) {
      return '¡Me encanta esa idea! ♡ Podemos explorar aretes artesanales que complementen tu estilo. ¿Te gustan más los diseños delicados o los accesorios coloridos que llamen la atención?';
    }

    if (
      textoNormalizado.includes('bolso') ||
      textoNormalizado.includes('bolsos') ||
      textoNormalizado.includes('tarjetero')
    ) {
      return '¡Exploremos esa opción! ♡ En Entre Hilos también contemplamos bolsos y accesorios. Podemos conversar sobre el estilo que buscas y confirmar qué diseños están disponibles.';
    }

    if (
      textoNormalizado.includes('color') ||
      textoNormalizado.includes('minimalista') ||
      textoNormalizado.includes('delicado') ||
      textoNormalizado.includes('colorido')
    ) {
      return '¡Los colores ayudan a darle personalidad a cada creación! ♡ Podemos explorar tonos suaves y delicados o combinaciones más alegres y atrevidas. ¿Hay algún color que te encante o que quieras incluir?';
    }

    if (
      textoNormalizado.includes('no sé') ||
      textoNormalizado.includes('no se') ||
      textoNormalizado.includes('recomienda') ||
      textoNormalizado.includes('recomiéndame') ||
      textoNormalizado.includes('ayuda')
    ) {
      return '¡No te preocupes! ♡ Vamos a descubrirlo juntas. Podemos empezar por una pregunta: ¿quieres un accesorio para usar todos los días, para una ocasión especial o para regalar?';
    }

    if (
      ultimoMensaje.includes('¿buscas un accesorio para ti') ||
      ultimoMensaje.includes('¿qué estilo le gusta') ||
      ultimoMensaje.includes('¿lo buscas para ti')
    ) {
      return '¡Perfecto! ♡ Con lo que me cuentas podemos ir definiendo una idea. ¿Qué accesorio te llama más la atención: pulsera, collar, aretes o llavero?';
    }

    return '¡Cuéntame un poquito más! ♡ Puedo ayudarte a explorar ideas de pulseras, collares, aretes, llaveros y otros accesorios artesanales. ¿Qué te gustaría encontrar o para quién sería?';
  }

  function enviarMensaje(e) {
    e.preventDefault();

    const texto = mensaje.trim();

    if (!texto || escribiendo) return;

    const nuevosMensajes = [
      ...mensajes,
      { tipo: 'usuario', texto }
    ];

    setMensajes(nuevosMensajes);
    setMensaje('');
    setEscribiendo(true);

    setTimeout(() => {
      const respuesta = generarRespuesta(texto);

      setMensajes((actuales) => [
        ...actuales,
        { tipo: 'asistente', texto: respuesta }
      ]);

      setEscribiendo(false);
    }, 600);
  }

  return (
    <div className="asistente-flotante">
      {chatAbierto && (
        <section className="asistente-ventana" id="asistente">
          <div className="chat-encabezado">
            <div className="chat-avatar">♡</div>

            <div>
              <h3>Entre Hilos</h3>
              <span>Tu asistente creativa</span>
            </div>

            <span className="chat-indicador" aria-label="Chat disponible">
              ●
            </span>

            <button
              type="button"
              className="chat-cerrar"
              onClick={() => setChatAbierto(false)}
              aria-label="Cerrar chat"
            >
              ×
            </button>
          </div>

          <div className="chat-mensajes" aria-live="polite">
            {mensajes.map((item, indice) => (
              <div
                key={indice}
                className={`chat-mensaje chat-${item.tipo}`}
              >
                {item.tipo === 'asistente' && (
                  <span className="chat-corazon">♡</span>
                )}

                <p>{item.texto}</p>
              </div>
            ))}

            {escribiendo && (
              <div className="chat-mensaje chat-asistente">
                <p>Estoy pensando en ideas para ti... ♡</p>
              </div>
            )}

            <div ref={finalChat} />
          </div>

          <form className="chat-formulario" onSubmit={enviarMensaje}>
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe tu mensaje..."
              aria-label="Escribe tu mensaje"
              maxLength={500}
              disabled={escribiendo}
              required
            />

            <button
              type="submit"
              aria-label="Enviar mensaje"
              disabled={escribiendo || !mensaje.trim()}
            >
              Enviar ↗
            </button>
          </form>

          <p className="chat-nota">
            Un espacio para inspirarte y descubrir nuevas ideas. ♡
          </p>
        </section>
      )}

      <button
        type="button"
        className="boton-asistente-flotante"
        onClick={() => setChatAbierto((abierto) => !abierto)}
        aria-label={chatAbierto ? 'Cerrar asistente creativa' : 'Abrir asistente creativa'}
        aria-expanded={chatAbierto}
      >
        {chatAbierto ? '×' : '♡'}
      </button>
    </div>
  )};

  export default AsistenteCreativa;