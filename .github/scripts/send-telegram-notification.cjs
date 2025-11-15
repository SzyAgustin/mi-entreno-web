const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// 100 frases sobre la vida en general (9 AM - 12 PM)
const lifePhrases = [
  "💫 Cada día es una nueva oportunidad",
  "🌟 Tu actitud define tu día",
  "⚡ Haz que hoy cuente",
  "🔥 La magia sucede fuera de tu zona de confort",
  "💪 Tú eres más fuerte de lo que crees",
  "🎯 Enfócate en lo que puedes controlar",
  "✨ Pequeños pasos, grandes resultados",
  "🚀 El progreso es progreso, sin importar qué tan pequeño",
  "🌈 Tu energía crea tu realidad",
  "💎 Invierte en ti mismo",
  "⭐ Sé la mejor versión de ti hoy",
  "🔑 La disciplina es libertad",
  "🌱 Crece un poco cada día",
  "💥 Convierte el 'algún día' en hoy",
  "🏆 El éxito es la suma de pequeños esfuerzos",
  "🎨 Crea el día que quieres vivir",
  "⚡ Tu mente es tu mayor herramienta",
  "🌊 Fluye con lo que viene",
  "🔥 La consistencia vence al talento",
  "💫 Hoy es tu lienzo en blanco",
  "🌟 Elige el progreso sobre la perfección",
  "✨ Confía en el proceso",
  "🎯 Una cosa a la vez",
  "💪 La incomodidad es crecimiento",
  "🚀 No esperes el momento perfecto",
  "🌈 Tu vibra atrae tu tribu",
  "💎 Valora tu tiempo",
  "⭐ Sé intencional con tu energía",
  "🔑 La acción cura el miedo",
  "🌱 Avanza aunque sea lento",
  "💥 Haz lo que tu yo futuro te agradecerá",
  "🏆 Eres el promedio de tus hábitos",
  "🎨 Diseña tu vida, no la improvises",
  "⚡ El momentum se construye",
  "🌊 Respira. Enfócate. Actúa",
  "🔥 Lo difícil se vuelve fácil con práctica",
  "💫 Cambia tu historia",
  "🌟 Eres responsable de tu felicidad",
  "✨ La claridad viene con la acción",
  "🎯 Prioriza lo que importa",
  "💪 Tu futuro depende de lo que hagas hoy",
  "🚀 Sueña grande, empieza pequeño",
  "🌈 La energía fluye donde va la atención",
  "💎 Cuida tu paz mental",
  "⭐ Menos excusas, más ejecución",
  "🔑 El cambio empieza en tu mente",
  "🌱 Celebra las pequeñas victorias",
  "💥 Sé audaz, sé valiente",
  "🏆 El esfuerzo nunca miente",
  "🎨 Vive con propósito",
  "⚡ Tu potencial es ilimitado",
  "🌊 Suelta lo que no suma",
  "🔥 Construye, no destruyas",
  "💫 Todo es posible",
  "🌟 Hazlo con intención",
  "✨ La vida premia a los que actúan",
  "🎯 Enfoque = Poder",
  "💪 Levántate más veces de las que caes",
  "🚀 Atrévete a ser diferente",
  "🌈 Tu realidad es tu creación",
  "💎 Protege tu energía",
  "⭐ Avanza con confianza",
  "🔑 Lo simple funciona",
  "🌱 Siembra bien, cosecha bien",
  "💥 Rompe tus límites mentales",
  "🏆 La excelencia es un hábito",
  "🎨 Crea valor cada día",
  "⚡ Actúa como si ya lo hubieras logrado",
  "🌊 Adapta, evoluciona, conquista",
  "🔥 Eres el CEO de tu vida",
  "💫 Hoy > Ayer",
  "🌟 Construye tu legado",
  "✨ Menos pensar, más hacer",
  "🎯 Mantén el foco",
  "💪 La fuerza está en ti",
  "🚀 Despega hacia tus metas",
  "🌈 Irradia positividad",
  "💎 Sé imparable",
  "⭐ Haz que pase",
  "🔑 Tú tienes el control",
  "🌱 Evoluciona constantemente",
  "💥 Impacta tu mundo",
  "🏆 Gana el día",
  "🎨 Vive tu arte",
  "⚡ Energía + Acción = Resultados",
  "🌊 Sé agua, mi amigo",
  "🔥 Enciende tu fuego interior",
  "💫 Transforma tu realidad",
  "🌟 Brilla con luz propia",
  "✨ Lo extraordinario está en lo ordinario",
  "🎯 Apunta alto",
  "💪 Tu único límite eres tú",
  "🚀 Eleva tu estándar",
  "🌈 Elige alegría",
  "💎 Cultiva grandeza",
  "⭐ Sé leyenda",
  "🔑 Desbloquea tu potencial",
  "🌱 Crece en silencio",
  "💥 Explota de energía positiva"
];

// 100 frases sobre entrenar (después de 12 PM)
const trainingPhrases = [
  "💪 Hora de entrenar",
  "🔥 Tu cuerpo te espera",
  "⚡ Vamos al gym",
  "🏋️ Es tu momento",
  "💥 A romperla hoy",
  "🎯 Entrena ahora",
  "✨ Muévete",
  "🚀 Dale al hierro",
  "💎 Construye tu cuerpo",
  "⭐ Entrena como bestia",
  "🔑 El gym te llama",
  "🌟 Suda hoy, brilla mañana",
  "💪 No pain, no gain",
  "🔥 Arde el gym hoy",
  "⚡ Activa modo bestia",
  "🏋️ Las pesas te extrañan",
  "💥 Destroza el entrenamiento",
  "🎯 Enfoca, levanta, repite",
  "✨ Tu mejor serie está por venir",
  "🚀 Despega en el gym",
  "💎 Forja tu físico",
  "⭐ Entrena como campeón",
  "🔑 Abre la puerta del gym",
  "🌟 Gana en el gym hoy",
  "💪 Más fuerte que ayer",
  "🔥 Quema todo en el gym",
  "⚡ Carga, levanta, crece",
  "🏋️ El hierro no miente",
  "💥 Explosión de energía",
  "🎯 Objetivo: supérate",
  "✨ Cada rep cuenta",
  "🚀 Impulsa tu físico",
  "💎 Esculpe tu mejor versión",
  "⭐ Entrena sin piedad",
  "🔑 La clave está en entrenar",
  "🌟 Ilumina el gym",
  "💪 Construye músculo, construye carácter",
  "🔥 Incendia el gym",
  "⚡ Energía máxima",
  "🏋️ Levanta como si importara",
  "💥 Revienta tus límites",
  "🎯 Preciso y potente",
  "✨ Transforma tu cuerpo hoy",
  "🚀 Acelera tu progreso",
  "💎 Forja acero",
  "⭐ Brilla en cada serie",
  "🔑 Entrena smart",
  "🌟 Destaca en el gym",
  "💪 Músculos = dedicación",
  "🔥 Intensidad máxima",
  "⚡ Voltaje total",
  "🏋️ Pesas = progreso",
  "💥 Boom en el gym",
  "🎯 Foco y fuerza",
  "✨ Magia en cada rep",
  "🚀 Eleva tu nivel",
  "💎 Pureza en el esfuerzo",
  "⭐ Estrella del gym",
  "🔑 Desbloquea nuevas marcas",
  "🌟 Radiante de fuerza",
  "💪 Más grande, más fuerte",
  "🔥 Arde de motivación",
  "⚡ Chispa de campeón",
  "🏋️ Hierro y voluntad",
  "💥 Explota tu potencial",
  "🎯 Directo al objetivo",
  "✨ Brillantez atlética",
  "🚀 Despegue físico",
  "💎 Valor en cada rep",
  "⭐ Rendimiento estelar",
  "🔑 Entrena o arrepiéntete",
  "🌟 Luce espectacular",
  "💪 Tu cuerpo es tu obra",
  "🔥 Combustión muscular",
  "⚡ Alta tensión en el gym",
  "🏋️ Metal y determinación",
  "💥 Dinamita pura",
  "🎯 Precisión muscular",
  "✨ Resplandor fitness",
  "🚀 Cohete de progreso",
  "💎 Joya del gym",
  "⭐ Constelación de fuerza",
  "🔑 Abre tu potencial",
  "🌟 Estrellato físico",
  "💪 Poder y pasión",
  "🔥 Llama interior",
  "⚡ Voltaje muscular",
  "🏋️ Barra y gloria",
  "💥 Detonación de poder",
  "🎯 Láser en el objetivo",
  "✨ Fulgor atlético",
  "🚀 Propulsión máxima",
  "💎 Diamante en bruto",
  "⭐ Supernova fitness",
  "🔑 Código: entrenar",
  "🌟 Aura de campeón",
  "💪 Fuerza imparable",
  "🔥 Inferno motivacional",
  "⚡ Rayo de energía",
  "🏋️ Templo de hierro"
];

// Obtener hora en Argentina (UTC-3)
const getArgentinaHour = () => {
  const now = new Date();
  const argentinaDate = new Date(now.getTime() - (3 * 60 * 60 * 1000));
  return argentinaDate.getHours();
};

// Enviar mensaje a Telegram
const sendMessage = (message) => {
  const payload = {
    chat_id: parseInt(CHAT_ID), // Convertir a número
    text: message
  };
  
  const data = JSON.stringify(payload);
  const dataBuffer = Buffer.from(data, 'utf8');
  
  console.log(`📤 Enviando a Telegram...`);
  console.log(`Mensaje: "${message}"`);
  console.log(`Payload:`, payload);
  console.log(`Data: ${data}`);
  console.log(`Buffer length: ${dataBuffer.length} bytes`);

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': dataBuffer.length
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

    req.write(dataBuffer);
    req.end();
  });
};

// Función principal
const main = async () => {
  const hour = getArgentinaHour();
  
  // Verificar si es domingo (día de descanso)
  const now = new Date();
  const argentinaDate = new Date(now.getTime() - (3 * 60 * 60 * 1000));
  const dayOfWeek = argentinaDate.getDay();
  
  if (dayOfWeek === 0) {
    console.log('Hoy es domingo, día de descanso. No se envía notificación.');
    return;
  }

  // Seleccionar frase según la hora
  let phrases;
  if (hour >= 9 && hour < 12) {
    phrases = lifePhrases;
    console.log('Usando frases sobre la vida (9 AM - 12 PM)');
  } else {
    phrases = trainingPhrases;
    console.log('Usando frases de entrenamiento (después de 12 PM)');
  }

  // Seleccionar frase aleatoria
  const randomIndex = Math.floor(Math.random() * phrases.length);
  const randomPhrase = phrases[randomIndex];
  
  console.log(`Índice seleccionado: ${randomIndex}`);
  console.log(`Frase seleccionada: "${randomPhrase}"`);
  console.log(`Tipo de dato: ${typeof randomPhrase}`);
  console.log(`Longitud: ${randomPhrase ? randomPhrase.length : 0}`);
  
  if (!randomPhrase || randomPhrase.trim().length === 0) {
    console.error('Error: La frase seleccionada está vacía');
    process.exit(1);
  }
  
  try {
    await sendMessage(randomPhrase);
    console.log(`✅ Notificación enviada correctamente: ${randomPhrase}`);
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    process.exit(1);
  }
};

main();
