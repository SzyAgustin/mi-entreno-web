const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Mensajes motivacionales variados
const messages = [
  "💪 ¡Es hora de entrenar! Tu cuerpo te lo agradecerá después.",
  "🔥 ¡No te rindas! Cada día es una oportunidad para mejorar.",
  "⚡ ¡Vamos! El dolor de hoy será la fuerza de mañana.",
  "🏋️ ¡A entrenar! La disciplina es hacer lo que hay que hacer, incluso cuando no quieres.",
  "💯 ¡Tú puedes! Recuerda por qué empezaste.",
  "🚀 ¡Dale duro! Los resultados no llegan de la noche a la mañana, pero llegan.",
  "⭐ ¡No lo dejes para después! El mejor momento es AHORA.",
  "🎯 ¡Enfócate! Un día más cerca de tu objetivo.",
  "💥 ¡Destruye el entrenamiento de hoy! Tú controlas tu progreso.",
  "🔱 ¡A por ello! La única forma de fallar es no intentarlo."
];

// Obtener el día de la semana y el entrenamiento correspondiente
const getDayTraining = () => {
  const days = [
    { day: 'Domingo', training: null },
    { day: 'Lunes', training: 'Pecho y Tríceps', emoji: '💪' },
    { day: 'Martes', training: 'Cardio', emoji: '🏃' },
    { day: 'Miércoles', training: 'Pierna y Hombros', emoji: '🦵' },
    { day: 'Jueves', training: 'Cardio', emoji: '🏃' },
    { day: 'Viernes', training: 'Espalda y Bíceps', emoji: '💪' },
    { day: 'Sábado', training: 'Cardio', emoji: '🏃' }
  ];
  
  // Argentina está en UTC-3
  const argentinaDate = new Date(new Date().getTime() - (3 * 60 * 60 * 1000));
  const dayOfWeek = argentinaDate.getDay();
  
  return days[dayOfWeek];
};

// Enviar mensaje a Telegram
const sendMessage = (message) => {
  const data = JSON.stringify({
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'HTML'
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Mensaje enviado exitosamente');
          resolve(responseData);
        } else {
          console.error('❌ Error al enviar mensaje:', res.statusCode, responseData);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error en la petición:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

// Función principal
const main = async () => {
  const dayInfo = getDayTraining();
  
  if (!dayInfo.training) {
    console.log('Hoy es domingo, día de descanso. No se envía notificación.');
    return;
  }

  // Seleccionar mensaje motivacional aleatorio
  const motivationalMsg = messages[Math.floor(Math.random() * messages.length)];
  
  // Construir el mensaje completo
  const fullMessage = `${dayInfo.emoji} <b>${dayInfo.day}</b> - ${dayInfo.training}\n\n${motivationalMsg}\n\n🔗 <a href="https://szyagustin.github.io/mi-entreno-web/">Abrir Mi Entreno</a>`;
  
  try {
    await sendMessage(fullMessage);
    console.log('Notificación enviada correctamente');
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    process.exit(1);
  }
};

main();

