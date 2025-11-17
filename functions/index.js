const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const https = require('https');

// Definir secrets que se configurarán en Firebase
const telegramBotToken = defineSecret('TELEGRAM_BOT_TOKEN');
const telegramChatId = defineSecret('TELEGRAM_CHAT_ID');

// Frases de felicitaciones
const congratulationsPhrases = [
  "🎉 ¡Genial! Día completado 💪",
  "🏆 ¡Excelente! Un día más cumplido 🔥",
  "⭐ ¡Bien hecho! Seguí así 💪",
  "✨ ¡Increíble! Día completado con éxito 🎯",
  "💪 ¡Sos un crack! Día terminado 🏋️",
  "🔥 ¡Imparable! Otro día completado ⚡",
  "🚀 ¡Brutal! Día completado exitosamente 💯",
  "💎 ¡Leyenda! Seguís sumando 🏆",
  "⚡ ¡Dale que va! Día cumplido 💪",
  "🎯 ¡En la mira! Otro día en la bolsa 🎉",
  "🌟 ¡Espectacular! Día completado 🔥",
  "💥 ¡Boom! Día finalizado con éxito ⭐",
  "🏅 ¡Campeón! Un día más logrado 💪",
  "🎊 ¡Vamos! Día completado perfectamente 🚀",
  "💫 ¡Increíble constancia! Día hecho ✅",
  "🔱 ¡Imparable! Seguís firme 💪",
  "⚡ ¡Energía pura! Día completado 🏋️",
  "🎆 ¡Festejá! Otro día más ✨",
  "💪 ¡Disciplina! Día cumplido con éxito 🎯",
  "🏆 ¡A seguir así! Día completado 🔥"
];

// Función para enviar mensaje a Telegram
const sendTelegramMessage = (message, botToken, chatId) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Mensaje enviado a Telegram:', message);
          resolve(data);
        } else {
          console.error('❌ Error en respuesta de Telegram:', res.statusCode, data);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error en petición a Telegram:', error);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
};

// Formatear fecha en español
const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  const dayName = dayNames[date.getDay()];
  const dayNumber = day;
  const monthName = monthNames[date.getMonth()];
  
  return `${dayName} ${dayNumber} de ${monthName}`;
};

// Cloud Function que se dispara cuando se actualiza completedDays
exports.notifyDayCompleted = onDocumentUpdated({
  document: 'completedDays/{userId}',
  secrets: [telegramBotToken, telegramChatId],
  region: 'us-central1'
}, async (event) => {
  try {
    console.log('🔔 Función disparada por cambio en completedDays');
    
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    
    if (!beforeData || !afterData) {
      console.log('⚠️ No hay datos before/after, saliendo');
      return null;
    }
    
    const beforeDays = beforeData.days || {};
    const afterDays = afterData.days || {};
    
    // Encontrar días que cambiaron de false/undefined a true
    const newlyCompletedDays = [];
    
    for (const dateString in afterDays) {
      const wasBefore = beforeDays[dateString] === true;
      const isNow = afterDays[dateString] === true;
      
      if (!wasBefore && isNow) {
        newlyCompletedDays.push(dateString);
      }
    }
    
    if (newlyCompletedDays.length === 0) {
      console.log('ℹ️ No hay nuevos días completados');
      return null;
    }
    
    console.log(`🎉 ${newlyCompletedDays.length} día(s) completado(s):`, newlyCompletedDays);
    
    // Enviar notificación por cada día completado
    const botToken = telegramBotToken.value();
    const chatId = telegramChatId.value();
    
    for (const dateString of newlyCompletedDays) {
      const randomPhrase = congratulationsPhrases[
        Math.floor(Math.random() * congratulationsPhrases.length)
      ];
      
      const formattedDate = formatDate(dateString);
      const message = `${randomPhrase}\n\n📅 <b>${formattedDate}</b>`;
      
      try {
        await sendTelegramMessage(message, botToken, chatId);
        console.log(`✅ Notificación enviada para ${dateString}`);
      } catch (error) {
        console.error(`❌ Error enviando notificación para ${dateString}:`, error);
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error en notifyDayCompleted:', error);
    return null;
  }
});

