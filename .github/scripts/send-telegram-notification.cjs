const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;

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
  "💥 Explota de energía positiva",
  "🎨 Hoy creas tu realidad",
  "⚡ Energiza tu día",
  "🌊 Fluye con lo que venga",
  "🔥 Enciende tu pasión",
  "💫 Haz que hoy importe",
  "🌟 Elige ser feliz",
  "✨ Todo empieza en tu mente",
  "🎯 Mantén el rumbo",
  "💪 Eres capaz de más",
  "🚀 Eleva tus estándares",
  "🌈 Crea tu propia suerte",
  "💎 Eres tu mayor inversión",
  "⭐ Destaca hoy",
  "🔑 La clave es la constancia",
  "🌱 Nutre tu mente",
  "💥 Impacta tu entorno",
  "🏆 Hazlo por ti",
  "🎨 Diseña tu día ideal",
  "⚡ Carga tu energía",
  "🌊 Deja fluir",
  "🔥 Mantén viva tu llama",
  "💫 Transforma tu presente",
  "🌟 Ilumina tu camino",
  "✨ Encuentra la magia en lo simple",
  "🎯 Enfoca tu intención",
  "💪 Fortalece tu voluntad",
  "🚀 Despega hacia tus sueños",
  "🌈 Pinta tu día de colores",
  "💎 Pulite cada día",
  "⭐ Sos tu propio héroe",
  "🔑 Abre nuevas puertas",
  "🌱 Germina ideas",
  "💥 Rompe con lo ordinario",
  "🏆 Celebra estar vivo",
  "🎨 Cada día es un lienzo",
  "⚡ Activa tu mejor versión",
  "🌊 Navega con propósito",
  "🔥 Aviva tu espíritu",
  "💫 Reinventa tu día",
  "🌟 Deja huella",
  "✨ Lo especial está en ti",
  "🎯 Define tu norte",
  "💪 Cultiva tu fuerza interior",
  "🚀 Acelera hacia tu meta",
  "🌈 Encuentra tu arcoíris",
  "💎 Refiná tu esencia",
  "⭐ Brilla con autenticidad",
  "🔑 Desbloquea nuevas versiones",
  "🌱 Planta buenas semillas hoy",
  "💥 Sacude la rutina",
  "🏆 Gánale al día",
  "🎨 Expresa tu verdad",
  "⚡ Potencia tu presente",
  "🌊 Surfea las olas de la vida",
  "🔥 Quema dudas",
  "💫 Evoluciona consciente",
  "🌟 Tu luz es única",
  "✨ Crea momentos memorables",
  "🎯 Apunta a lo que te mueve",
  "💪 Desarrolla tu carácter",
  "🚀 Propúlsate al futuro",
  "🌈 Mezcla colores en tu vida",
  "💎 Tu valor no tiene precio",
  "⭐ Conseguí tu estrella",
  "🔑 La respuesta está en vos",
  "🌱 Regá tus proyectos",
  "💥 Hacé ruido positivo",
  "🏆 Todos los días se gana algo",
  "🎨 Creá tu obra maestra",
  "⚡ Tu energía es contagiosa",
  "🌊 Dejá que la vida te sorprenda",
  "🔥 Mantenete encendido",
  "💫 Sos el cambio que buscás",
  "🌟 Tu momento es ahora",
  "✨ La belleza está en el camino",
  "🎯 Perseguí lo que te apasiona",
  "💪 Tu determinación te define",
  "🚀 Vos marcás el ritmo",
  "🌈 Dale color a tu rutina",
  "💎 Invertí en vos",
  "⭐ Hacete protagonista",
  "🔑 Vos tenés las llaves",
  "🌱 Cada día es tierra fértil",
  "💥 Explotá de buena onda",
  "🏆 Competí solo con vos mismo",
  "🎨 Hacé arte de tu vida",
  "⚡ Tu actitud es tu poder",
  "🌊 Fluí con confianza",
  "🔥 No dejes que se apague",
  "💫 El cambio empieza hoy",
  "🌟 Resplandecé",
  "✨ Lo extraordinario es posible",
  "🎯 Mantené la mira en tu objetivo",
  "💪 Tu fuerza viene de adentro",
  "🚀 No hay límites",
  "🌈 La vida es multicolor",
  "💎 Sos una joya en construcción"
];

// 100 frases sobre entrenar (después de 12 PM)
const trainingPhrases = [
  "💪 Vamos, es hora de entrenar",
  "🏋️ Arranca el entrenamiento",
  "⚡ Muévete, el gym te espera",
  "🔥 Dale, que ya es hora",
  "💪 Levántate y entrena",
  "🏋️ Tu cuerpo necesita movimiento",
  "⚡ Hora de sudar",
  "🔥 Actívate, es tu momento",
  "💪 Construye músculo, construye carácter",
  "🏋️ Cada entrenamiento cuenta",
  "⚡ No lo dejes para después",
  "🔥 Entrena ahora, agradece después",
  "💪 Tu mejor versión te espera",
  "🏋️ Hazlo por ti",
  "⚡ El esfuerzo de hoy es tu cuerpo de mañana",
  "🔥 Vamos, que es tarde",
  "💪 Entrena hoy, disfruta mañana",
  "🏋️ Supérate en cada serie",
  "⚡ Es hora de moverte",
  "🔥 Dale con todo hoy",
  "💪 Construye el cuerpo que quieres",
  "🏋️ Haz que el día cuente",
  "⚡ Entrena con propósito",
  "🔥 Tu cuerpo te lo va a agradecer",
  "💪 Cada rep te acerca al objetivo",
  "🏋️ Mueve el cuerpo, despeja la mente",
  "⚡ Hora de activarse",
  "🔥 Entrena, siente, crece",
  "💪 Hoy es el día",
  "🏋️ Dale duro, descansa después",
  "⚡ Actívate antes de que sea tarde",
  "🔥 Tu entrenamiento te espera",
  "💪 Vamos al gym, sin excusas",
  "🏋️ Construye fuerza, construye disciplina",
  "⚡ Hazlo ahora",
  "🔥 Entrena con intención",
  "💪 Es hora de levantar",
  "🏋️ Tu yo futuro te lo agradece",
  "⚡ Dale que es hora",
  "🔥 Muévete ahora",
  "💪 Entrena, no lo pienses tanto",
  "🏋️ Cada día es una oportunidad",
  "⚡ Haz que pase",
  "🔥 Tu cuerpo pide movimiento",
  "💪 Vamos, que ya arrancó la tarde",
  "🏋️ Dedícale tiempo a tu cuerpo",
  "⚡ Entrena, es simple",
  "🔥 Es tu momento del día",
  "💪 Dale, sin pensar",
  "🏋️ Construye el hábito",
  "⚡ Hora de ponerse en marcha",
  "🔥 Actívate ya",
  "💪 Vamos, que después te sientes bien",
  "🏋️ Mueve el cuerpo hoy",
  "⚡ Es la hora",
  "🔥 Entrena para vivir mejor",
  "💪 Dale al hierro",
  "🏋️ Tu cuerpo es tu proyecto",
  "⚡ Hora de sudar un poco",
  "🔥 Vamos que se hace tarde",
  "💪 Entrena con ganas",
  "🏋️ Dale forma a tu cuerpo",
  "⚡ Muévete ahora, relájate después",
  "🔥 Es tiempo de entrenar",
  "💪 Construye, no destruyas",
  "🏋️ Tu salud lo vale",
  "⚡ Dale al gym",
  "🔥 Hora de activar el cuerpo",
  "💪 Entrena, es parte del día",
  "🏋️ Hazlo por tu salud",
  "⚡ Vamos, arranca ya",
  "🔥 Muévete, te va a hacer bien",
  "💪 Dale que ya es hora",
  "🏋️ Invierte en tu cuerpo",
  "⚡ Es hora de sudar",
  "🔥 Entrena, es lo que toca",
  "💪 Vamos al gym ya",
  "🏋️ Mueve el cuerpo antes de que se haga noche",
  "⚡ Actívate ahora",
  "🔥 Dale, no lo pienses",
  "💪 Cada entrenamiento suma",
  "🏋️ Es hora de moverte",
  "⚡ Construye tu mejor versión",
  "🔥 Entrena y vas a estar bien",
  "💪 Dale, después te sentís mejor",
  "🏋️ Tu cuerpo necesita esto",
  "⚡ Vamos que ya es tarde",
  "🔥 Hora de entrenar, simple",
  "💪 Muévete ya",
  "🏋️ Dale al cuerpo lo que necesita",
  "⚡ Es tu hora del gym",
  "🔥 Actívate, no lo dejes",
  "💪 Entrena para vivir mejor",
  "🏋️ Dale, que después descansas",
  "⚡ Hora de ponerse las pilas",
  "🔥 Vamos, que el gym te espera",
  "💪 Muévete antes de que se te pase",
  "🏋️ Es hora, no hay vuelta",
  "⚡ Dale al entrenamiento",
  "🔥 Tu cuerpo lo pide",
  "💪 Movete ahora, descansá después",
  "🏋️ Tu versión fit te espera",
  "⚡ Andá al gym, vale la pena",
  "🔥 Hacelo por vos",
  "💪 El entrenamiento es autocuidado",
  "🏋️ Dale impulso a tu día",
  "⚡ Activá el cuerpo ya",
  "🔥 Es simple: andá y entrená",
  "💪 Tu salud te lo pide",
  "🏋️ Movimiento = bienestar",
  "⚡ Es hora de activarte",
  "🔥 Andá antes de arrepentirte",
  "💪 Cada día suma",
  "🏋️ Dale vida a tu cuerpo",
  "⚡ Vamos que ya pasó el mediodía",
  "🔥 Entrená, es lo mejor que podés hacer ahora",
  "💪 Tu cuerpo te lo va a agradecer",
  "🏋️ Hacé que el día valga la pena",
  "⚡ Movete, te va a hacer sentir bien",
  "🔥 Andá ya, no lo pienses más",
  "💪 Dale forma al día",
  "🏋️ Invertí una hora en vos",
  "⚡ El momento es ahora",
  "🔥 Hacé lo que tenés que hacer",
  "💪 Entrená y listo",
  "🏋️ Tu yo del futuro te agradece",
  "⚡ Ponete en movimiento",
  "🔥 Andá que después te sentís genial",
  "💪 Dale al cuerpo lo que necesita",
  "🏋️ Es hora de cuidarte",
  "⚡ Movete antes que se haga tarde",
  "🔥 Simple: gym ahora",
  "💪 Construí el hábito",
  "🏋️ Dale continuidad",
  "⚡ Ya es hora de ir",
  "🔥 Andá, hacelo por tu salud",
  "💪 Cada entrenamiento te mejora",
  "🏋️ Dale que es fácil: vas, entrenas, listo",
  "⚡ Activá el modo fitness",
  "🔥 Andá al gym sin dudarlo",
  "💪 Hacelo parte de tu día",
  "🏋️ Tu cuerpo lo necesita",
  "⚡ Es tu momento de moverte",
  "🔥 Dale, no busques excusas",
  "💪 Entrená, sentite bien",
  "🏋️ Andá que vale cada minuto",
  "⚡ Ponete las zapatillas y dale",
  "🔥 Ya es tarde, andá ya",
  "💪 Hacé que cuente",
  "🏋️ Tu bienestar lo vale",
  "⚡ Movete, es simple",
  "🔥 Andá y después me contás",
  "💪 Dale al gym con todo",
  "🏋️ Es tu hora de brillar",
  "⚡ Vamos que falta poco",
  "🔥 Hacelo, punto",
  "💪 Andá que te está esperando",
  "🏋️ Dale impulso al día",
  "⚡ Es lo mejor que podés hacer ahora",
  "🔥 Movete ya mismo",
  "💪 Entrená, es parte de cuidarte",
  "🏋️ Dale que es sencillo",
  "⚡ Andá ya, sin vueltas",
  "🔥 Es tiempo de acción",
  "💪 Hacelo por tu futuro",
  "🏋️ Dale cariño a tu cuerpo",
  "⚡ Ya está, andá",
  "🔥 Entrená y listo",
  "💪 Movete antes que se pase",
  "🏋️ Dale energía al cuerpo",
  "⚡ Es simple: gym ahora",
  "🔥 Andá, no lo pienses",
  "💪 Hacelo hábito",
  "🏋️ Tu cuerpo te está llamando",
  "⚡ Dale que ya es hora",
  "🔥 Vamos al gym, ya",
  "💪 Es tu tiempo",
  "🏋️ Andá y sentite increíble",
  "⚡ Movete, es tu hora",
  "🔥 Dale sin dudar",
  "💪 Entrená, es lo que toca",
  "🏋️ Hacelo por vos mismo",
  "⚡ Andá que te hace bien",
  "🔥 Es hora de ser constante",
  "💪 Dale al gym sin excusas",
  "🏋️ Movete ahora mismo",
  "⚡ Es simple: andá, entrená, sentite bien",
  "🔥 Ya no hay tiempo que perder",
  "💪 Hacelo real",
  "🏋️ Andá que te va a gustar",
  "⚡ Dale que es tu momento",
  "🔥 Vamos que ya arrancó la tarde",
  "💪 Entrená con propósito",
  "🏋️ Es tu día, aprovechalo",
  "⚡ Movete y vas a ver",
  "🔥 Dale al gym, es hora"
];

// Obtener fecha actual en Argentina (formato YYYY-MM-DD)
const getTodayDateString = () => {
  const now = new Date();
  const argentinaDate = new Date(now.getTime() - (3 * 60 * 60 * 1000));
  const year = argentinaDate.getFullYear();
  const month = String(argentinaDate.getMonth() + 1).padStart(2, '0');
  const day = String(argentinaDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Obtener hora en Argentina (UTC-3)
const getArgentinaHour = () => {
  const now = new Date();
  const argentinaDate = new Date(now.getTime() - (3 * 60 * 60 * 1000));
  return argentinaDate.getHours();
};

// Consultar Firebase para ver si el día está completado
const checkIfDayCompleted = (dateString) => {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/completedDays/user_default`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const json = JSON.parse(data);
            // Firestore guarda los datos en formato específico
            const days = json.fields?.days?.mapValue?.fields || {};
            const dayData = days[dateString];
            const isCompleted = dayData?.booleanValue === true;
            console.log(`📅 Día ${dateString}: ${isCompleted ? 'COMPLETADO' : 'No completado'}`);
            resolve(isCompleted);
          } else if (res.statusCode === 404) {
            console.log('📭 No hay datos en Firebase, día no completado');
            resolve(false);
          } else {
            console.log(`⚠️ Respuesta inesperada de Firebase: ${res.statusCode}`);
            resolve(false); // En caso de error, asumimos no completado
          }
        } catch (error) {
          console.error('❌ Error parseando respuesta de Firebase:', error);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.error('❌ Error consultando Firebase:', error);
      resolve(false); // En caso de error, asumimos no completado
    });
  });
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
  const now = new Date();
  const argentinaDate = new Date(now.getTime() - (3 * 60 * 60 * 1000));
  const dayOfWeek = argentinaDate.getDay();
  const hour = getArgentinaHour();
  const todayDateString = getTodayDateString();
  
  console.log(`📅 Hoy es: ${todayDateString}`);
  console.log(`🕐 Hora: ${hour}:${String(argentinaDate.getMinutes()).padStart(2, '0')}`);
  console.log(`📆 Día de la semana: ${['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dayOfWeek]}`);
  
  // Si NO es domingo, verificar si el día ya está completado
  if (dayOfWeek !== 0) {
    console.log('🔍 Verificando si el día está completado...');
    const isCompleted = await checkIfDayCompleted(todayDateString);
    
    if (isCompleted) {
      console.log('✅ El día ya está completado. No se envía notificación.');
    return;
    }
    console.log('📝 El día NO está completado, se enviará notificación.');
  } else {
    console.log('🌞 Es domingo, se enviarán frases motivacionales.');
  }

  // Seleccionar tipo de frases
  let phrases;
  
  if (dayOfWeek === 0) {
    // DOMINGOS: siempre frases de vida
    phrases = lifePhrases;
    console.log('💫 Usando frases motivacionales de vida (es domingo)');
  } else if (hour >= 9 && hour < 12) {
    // LUNES A SÁBADO, 9 AM - 12 PM: frases de vida
    phrases = lifePhrases;
    console.log('💫 Usando frases motivacionales de vida (9 AM - 12 PM)');
  } else {
    // LUNES A SÁBADO, después de 12 PM: frases de entrenamiento
    phrases = trainingPhrases;
    console.log('💪 Usando frases de entrenamiento (después de 12 PM)');
  }

  // Seleccionar frase aleatoria
  const randomIndex = Math.floor(Math.random() * phrases.length);
  const randomPhrase = phrases[randomIndex];
  
  console.log(`🎲 Índice seleccionado: ${randomIndex} de ${phrases.length}`);
  console.log(`💬 Frase: "${randomPhrase}"`);
  
  if (!randomPhrase || randomPhrase.trim().length === 0) {
    console.error('❌ Error: La frase seleccionada está vacía');
    process.exit(1);
  }
  
  try {
    await sendMessage(randomPhrase);
    console.log(`✅ Notificación enviada exitosamente`);
  } catch (error) {
    console.error('❌ Error al enviar notificación:', error);
    process.exit(1);
  }
};

main();
