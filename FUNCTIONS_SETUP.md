# 🔔 Configuración de Notificaciones con Firebase Functions

Esta guía te explica cómo configurar las notificaciones automáticas de Telegram que se envían cuando completas un día de entrenamiento.

## 📋 Requisitos Previos

- Proyecto de Firebase ya configurado (ver [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
- Firebase CLI instalado
- Bot de Telegram configurado con token y chat ID

## 🚀 Instalación

### 1. Instalar Firebase CLI

Si no lo tienes instalado:

```bash
npm install -g firebase-tools
```

### 2. Login en Firebase

```bash
firebase login
```

### 3. Inicializar Firebase Functions

**⚠️ IMPORTANTE**: Si ya ejecutaste `firebase init` antes, puedes saltearte este paso.

```bash
firebase init
```

Selecciona:
- ✅ Functions: Configure a Cloud Functions directory and its files
- Usa el proyecto que ya creaste
- Lenguaje: JavaScript
- ESLint: No (opcional)
- ¿Instalar dependencias ahora? Sí

### 4. Instalar dependencias de Functions

```bash
cd functions
npm install
cd ..
```

## 🔐 Configurar Secrets

Las Functions necesitan acceso al token del bot de Telegram. Por seguridad, usamos Firebase Secrets:

### Configurar TELEGRAM_BOT_TOKEN

```bash
firebase functions:secrets:set TELEGRAM_BOT_TOKEN
```

Te pedirá que ingreses el token. Pegalo y presiona Enter.

### Configurar TELEGRAM_CHAT_ID

```bash
firebase functions:secrets:set TELEGRAM_CHAT_ID
```

Ingresa tu chat ID de Telegram.

## 📤 Deploy de Functions

Desplegar la función a Firebase:

```bash
firebase deploy --only functions
```

La primera vez puede tardar unos minutos. Verás algo como:

```
✔  functions[notifyDayCompleted(us-central1)] Successful create operation.
```

## ✅ Verificar que funciona

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Entra a tu proyecto
3. Ve a **Functions** en el menú lateral
4. Deberías ver `notifyDayCompleted` listada

Para probar:
1. Entra a tu app: https://szyagustin.github.io/mi-entreno-web/
2. Marca un día como completado
3. En unos segundos deberías recibir una notificación en Telegram 🎉

## 🔍 Ver Logs

Para ver los logs de la función:

```bash
firebase functions:log
```

O desde Firebase Console → Functions → Logs

## 💰 Costos

Firebase tiene un **plan gratuito (Spark)** que incluye:
- 2 millones de invocaciones al mes
- 400,000 GB-segundos de tiempo de cómputo

Con tu uso (marcar ~6 días por semana), esto es más que suficiente y **será 100% gratuito**.

## 🔄 Actualizar la Function

Si haces cambios en `functions/index.js`:

```bash
firebase deploy --only functions
```

## 🛠️ Comandos útiles

```bash
# Ver estado de las functions
firebase functions:list

# Ver logs en tiempo real
firebase functions:log --only notifyDayCompleted

# Eliminar secrets (si necesitas cambiarlos)
firebase functions:secrets:destroy TELEGRAM_BOT_TOKEN
firebase functions:secrets:destroy TELEGRAM_CHAT_ID

# Volver a deployar todo
firebase deploy
```

## 📝 Cómo funciona

1. Cuando marcas un día como completado en la app, se actualiza Firestore
2. La Cloud Function `notifyDayCompleted` detecta el cambio automáticamente
3. Compara el estado anterior con el nuevo
4. Si un día cambió de `false` → `true`, envía una notificación
5. Selecciona una frase random de felicitaciones
6. Envía el mensaje con la fecha formateada a tu Telegram

## 🎨 Personalizar Mensajes

Las frases de felicitaciones están en `functions/index.js` línea 9.

Puedes agregar o modificar frases editando el array `congratulationsPhrases`:

```javascript
const congratulationsPhrases = [
  "🎉 ¡Genial! Día completado 💪",
  "🏆 ¡Excelente! Un día más cumplido 🔥",
  // Agrega las tuyas aquí...
];
```

Después de modificar, vuelve a deployar:

```bash
firebase deploy --only functions
```

## ❓ Troubleshooting

### Error: "Missing required secret"
- Asegúrate de haber configurado los secrets con `firebase functions:secrets:set`

### No llegan notificaciones
- Verifica los logs: `firebase functions:log`
- Revisa que el bot tenga tu chat ID correcto
- Confirma que la función esté desplegada en Firebase Console

### Error de permisos
- Asegúrate de estar en el proyecto correcto: `firebase use --add`
- Verifica que tengas permisos de editor en el proyecto de Firebase

## 🎯 Próximos pasos opcionales

- Agregar notificaciones cuando completes una semana entera
- Enviar estadísticas mensuales
- Notificar cuando rompas una racha

