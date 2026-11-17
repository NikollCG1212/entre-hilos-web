import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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

  async function enviarMensaje(e) {
    e.preventDefault();

    const texto = mensaje.trim();

    if (!texto || escribiendo) return;

    const historialAnterior = mensajes
      .filter((item) => item.tipo === 'usuario' || item.tipo === 'asistente')
      .slice(1)
      .slice(-20)
      .map((item) => ({
        role: item.tipo === 'usuario' ? 'user' : 'assistant',
        text: item.texto
      }));

    setMensajes((actuales) => [
      ...actuales,
      { tipo: 'usuario', texto }
    ]);

    setMensaje('');
    setEscribiendo(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        'asistente-creativo',
        {
          body: {
            mensaje: texto,
            historial: historialAnterior
          }
        }
      );

      if (error) {
        throw error;
      }

      if (!data?.respuesta) {
        throw new Error('El asistente no devolvió una respuesta.');
      }

      setMensajes((actuales) => [
        ...actuales,
        {
          tipo: 'asistente',
          texto: data.respuesta
        }
      ]);
    } catch (error) {
      console.error('Error al consultar el asistente:', error);

      setMensajes((actuales) => [
        ...actuales,
        {
          tipo: 'asistente',
          texto: '¡Ay! ♡ No pude conectarme en este momento. ¿Puedes intentarlo de nuevo en unos segundos?'
        }
      ]);
    } finally {
      setEscribiendo(false);
    }
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
        aria-label={
          chatAbierto
            ? 'Cerrar asistente creativa'
            : 'Abrir asistente creativa'
        }
        aria-expanded={chatAbierto}
      >
        {chatAbierto ? '×' : '♡'}
      </button>
    </div>
  );
}

export default AsistenteCreativa;