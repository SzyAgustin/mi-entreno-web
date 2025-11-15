# 🏋️ Mi Entreno Web

Aplicación web para gestionar y hacer seguimiento de tu rutina de entrenamiento semanal.

## 🚀 Características

- ✅ Calendario interactivo con tus días de entrenamiento
- ✅ Rutinas personalizadas para cada día de la semana
- ✅ Sistema de progresión de peso automático (4 semanas + 1 de descanso)
- ✅ Seguimiento de días completados
- ✅ Sincronización en la nube con Firebase
- ✅ Progreso mensual visual
- ✅ Diseño responsive y moderno

## 🛠️ Tecnologías

- **React** + **Vite** - Framework y tooling
- **Firebase Firestore** - Base de datos en tiempo real
- **GitHub Pages** - Hosting
- **CSS Modules** - Estilos

## 📦 Instalación Local

### Requisitos previos
- Node.js 20+ (o usar nvm para cambiar de versión)
- npm

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/SzyAgustin/mi-entreno-web.git
cd mi-entreno-web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**

Sigue las instrucciones en [FIREBASE_SETUP.md](FIREBASE_SETUP.md) para:
- Crear un proyecto en Firebase
- Configurar Firestore
- Obtener las credenciales

4. **Crear archivo .env**

Crea un archivo `.env` en la raíz con tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

## 🔥 Configurar Secrets de GitHub (para deployment)

Para que GitHub Pages funcione con Firebase, necesitas agregar los secrets:

1. Ve a tu repositorio en GitHub
2. `Settings` → `Secrets and variables` → `Actions`
3. Agrega cada uno de estos secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## 📝 Scripts disponibles

```bash
npm run dev      # Ejecutar en desarrollo
npm run build    # Compilar para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Ejecutar linter
```

## 🎯 Rutinas incluidas

### Lunes - Pecho y Tríceps
- Plano
- Inclinado
- Aperturas plana e inclinada
- Tríceps polea y arriba cabeza

### Martes, Jueves, Sábado - Cardio
- 40 minutos de caminata

### Miércoles - Pierna y Hombros
- Prensa
- Cuádriceps
- Tríceps
- Gemelos
- Laterales
- Militares
- Face pull

### Viernes - Espalda y Bíceps
- Pull ups
- Remo
- Pull con bíceps
- Tirón abajo
- Martillo
- Bíceps prona y sentado

## 📊 Sistema de Progresión

- **Semanas 1-4**: Progresión lineal de peso (+2kg por semana)
- **Semana 5**: Semana de descarga (70% del peso, 70% de reps)
- Después de cada ciclo de 5 semanas, el peso base aumenta en 2kg

## 🌐 URL en Producción

https://szyagustin.github.io/mi-entreno-web/

## 📄 Licencia

MIT

## 👤 Autor

SzyAgustin
