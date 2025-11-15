# Configuración de Firebase

## Paso 1: Crear proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Haz clic en "Agregar proyecto" o "Add project"
3. Nombre del proyecto: `mi-entreno-web`
4. Desactiva Google Analytics (no lo necesitamos por ahora)
5. Haz clic en "Crear proyecto"

## Paso 2: Configurar Firestore

1. En el menú lateral, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Iniciar en modo de prueba" (puedes cambiarlo después)
4. Elige una ubicación cercana (ej: us-central1)
5. Haz clic en "Habilitar"

## Paso 3: Obtener credenciales

1. Ve a "Configuración del proyecto" (ícono de engranaje)
2. En la pestaña "General", baja hasta "Tus aplicaciones"
3. Haz clic en el ícono web `</>`
4. Nombre de la app: `mi-entreno-web`
5. NO marques "Firebase Hosting"
6. Haz clic en "Registrar app"
7. Copia las credenciales que aparecen

## Paso 4: Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

## Paso 5: Configurar reglas de seguridad

En Firestore Database > Reglas, usa estas reglas por ahora:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /completedDays/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Nota**: Estas reglas permiten acceso a todos. Más adelante implementaremos autenticación.

