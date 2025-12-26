# Guía de Configuración: Google Sign-In

Esta guía te ayudará a configurar la autenticación con Google usando `@react-native-google-signin/google-signin`.

## 📋 Índice

1. [Configuración en Google Cloud Console](#1-configuración-en-google-cloud-console)
2. [Configuración del Proyecto](#2-configuración-del-proyecto)
3. [Configuración del Backend](#3-configuración-del-backend)
4. [Probar la Autenticación](#4-probar-la-autenticación)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Configuración en Google Cloud Console

### Paso 1: Crear un Proyecto

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombre sugerido: "ImperioHub"

### Paso 2: Habilitar Google Sign-In API

1. Ve a **APIs & Services > Library**
2. Busca "Google+ API" o "Google Identity"
3. Haz clic en **Enable**

### Paso 3: Crear OAuth Credentials

#### 3.1. Web Client ID (REQUERIDO para Android e iOS)

1. Ve a **APIs & Services > Credentials**
2. Haz clic en **Create Credentials > OAuth client ID**
3. Tipo de aplicación: **Web application**
4. Nombre: "ImperioHub Web Client"
5. **NO agregues ninguna URL de redirección** (no es necesario para Google Sign-In nativo)
6. Haz clic en **Create**
7. **Copia el Client ID** - lo necesitarás para `GOOGLE_WEB_CLIENT_ID`

#### 3.2. iOS Client ID (REQUERIDO solo para iOS)

1. Haz clic en **Create Credentials > OAuth client ID**
2. Tipo de aplicación: **iOS**
3. Nombre: "ImperioHub iOS"
4. Bundle ID: `com.imperiohub.app` (debe coincidir con el de tu [app.config.js](app.config.js:28))
5. Haz clic en **Create**
6. **Copia el Client ID** - lo necesitarás para `GOOGLE_IOS_CLIENT_ID`

#### 3.3. Android Client ID (Automático)

Para Android, Google usa el Web Client ID + SHA-1 del keystore:

**Para Development (Debug Keystore):**

```bash
# Obtener SHA-1 del debug keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Para Production (Release Keystore):**

```bash
# Si ya tienes un release keystore
keytool -list -v -keystore /path/to/your-release-key.keystore -alias your-alias
```

Luego:

1. Ve a **APIs & Services > Credentials**
2. Haz clic en **Create Credentials > OAuth client ID**
3. Tipo de aplicación: **Android**
4. Nombre: "ImperioHub Android (Debug)" o "ImperioHub Android (Release)"
5. Package name: `com.imperiohub.app`
6. Pega el **SHA-1 certificate fingerprint** que obtuviste
7. Haz clic en **Create**

---

## 2. Configuración del Proyecto

### Paso 1: Configurar Variables de Entorno

1. Copia el archivo [.env.example](.env.example) a `.env`:

```bash
cp .env.example .env
```

2. Edita `.env` y agrega tus credenciales:

```env
API_URL=http://localhost:3000/api
GOOGLE_WEB_CLIENT_ID=TU-WEB-CLIENT-ID.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=TU-IOS-CLIENT-ID.apps.googleusercontent.com
```

### Paso 2: Rebuild de la App

Después de configurar las variables de entorno, necesitas hacer un rebuild completo:

```bash
# Limpiar cache de Expo
npx expo start --clear

# O si usas development builds:
# Para Android
npx expo run:android

# Para iOS
npx expo run:ios
```

---

## 3. Configuración del Backend

Tu backend debe implementar el endpoint `POST /auth/google/validate` que:

1. Recibe el `idToken` desde la app
2. Valida el `idToken` con las APIs de Google
3. Crea o actualiza el usuario en la base de datos
4. Retorna un JWT propio

### Ejemplo de Implementación (Node.js + Express)

```javascript
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

app.post('/auth/google/validate', async (req, res) => {
  try {
    const { idToken } = req.body;

    // 1. Verificar el idToken con Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // 2. Crear o actualizar usuario en tu base de datos
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        nombre: name,
        avatar: picture,
      });
    } else {
      // Actualizar datos si cambiaron
      user.nombre = name;
      user.avatar = picture;
      await user.save();
    }

    // 3. Generar tu propio JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Retornar token y usuario
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
      },
    });
  } catch (error) {
    console.error('Error validating Google token:', error);
    res.status(401).json({
      success: false,
      message: 'Token de Google inválido',
    });
  }
});
```

### Instalar Dependencias del Backend

```bash
npm install google-auth-library jsonwebtoken
```

### Endpoint `/auth/me` (Verificar Autenticación)

```javascript
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ authenticated: false });
  }
};

app.get('/auth/me', authenticateJWT, async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    id: user._id,
    email: user.email,
    nombre: user.nombre,
  });
});
```

---

## 4. Probar la Autenticación

### Opción 1: Usar el Botón de Login Existente

Si ya tienes un componente de login (como [LoginButton.tsx](components/LoginButton.tsx)), solo asegúrate de que llame a `loginWithGoogle()` desde [services/auth.ts](services/auth.ts).

### Opción 2: Crear un Botón de Prueba

```tsx
import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <Text>Cargando...</Text>;
  }

  if (user) {
    return (
      <>
        <Text>Hola {user.nombre}</Text>
        <TouchableOpacity onPress={logout}>
          <Text>Cerrar Sesión</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <TouchableOpacity onPress={login}>
      <Text>Iniciar Sesión con Google</Text>
    </TouchableOpacity>
  );
}
```

### Logs a Revisar

Cuando hagas login, deberías ver estos logs en la consola:

```
✅ Google Sign-In configurado correctamente
🚀 Iniciando login con Google...
✅ Google Play Services disponible
📱 Abriendo Google Sign-In nativo...
✅ idToken recibido de Google: eyJhbG...
👤 Usuario de Google: { email: '...', name: '...', ... }
📤 Enviando idToken al backend...
✅ Backend validó el token correctamente
💾 Token guardado en SecureStore
✅ Login exitoso!
```

---

## 5. Troubleshooting

### Error: "DEVELOPER_ERROR" (Android)

**Problema:** El SHA-1 no está configurado correctamente o el package name no coincide.

**Solución:**

1. Verifica que el SHA-1 en Google Cloud Console coincida con el de tu keystore
2. Verifica que el package name sea exactamente `com.imperiohub.app`
3. Espera 5-10 minutos después de agregar el SHA-1 (propagación de cambios)

### Error: "No se recibió idToken de Google"

**Problema:** El `GOOGLE_WEB_CLIENT_ID` no está configurado correctamente.

**Solución:**

1. Verifica que el `.env` tenga el Web Client ID correcto
2. Haz un rebuild completo: `npx expo start --clear`
3. Verifica en los logs que se imprima: `✅ Google Sign-In configurado correctamente`

### Error: "Backend rechazó el token"

**Problema:** El backend no puede validar el `idToken`.

**Solución:**

1. Verifica que el backend use el mismo `GOOGLE_WEB_CLIENT_ID`
2. Verifica que el backend tenga instalado `google-auth-library`
3. Revisa los logs del backend para más detalles

### Error: "Google Play Services no disponible" (Android)

**Problema:** El emulador o dispositivo no tiene Google Play Services.

**Solución:**

1. Si estás en un emulador, usa uno con Google Play (no AOSP)
2. Si estás en un dispositivo físico, actualiza Google Play Services desde Play Store

### El login funciona pero el token no se guarda

**Problema:** El backend no retorna el campo `token` en la respuesta.

**Solución:**

Verifica que la respuesta del backend tenga este formato:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "nombre": "Usuario"
  }
}
```

---

## 📚 Archivos Relevantes

- [services/auth.ts](services/auth.ts) - Lógica de autenticación
- [api/index.ts](api/index.ts) - Cliente de API
- [hooks/useAuth.ts](hooks/useAuth.ts) - Hook de autenticación
- [app.config.js](app.config.js) - Configuración de Expo
- [.env.example](.env.example) - Ejemplo de variables de entorno

---

## 🎯 Flujo Completo de Autenticación

```
┌─────────────┐
│   Usuario   │
│  presiona   │
│   botón     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  GoogleSignin.signIn()  │
│  (Flujo nativo Google)  │
└──────────┬──────────────┘
           │
           ▼
    ┌──────────────┐
    │   idToken    │
    └──────┬───────┘
           │
           ▼
┌────────────────────────────┐
│  POST /auth/google/validate│
│  { idToken: "..." }        │
└──────────┬─────────────────┘
           │
           ▼
    ┌────────────────────┐
    │   Backend valida   │
    │  con Google APIs   │
    └──────┬─────────────┘
           │
           ▼
    ┌────────────────────┐
    │  Crea/actualiza    │
    │   usuario en DB    │
    └──────┬─────────────┘
           │
           ▼
    ┌────────────────────┐
    │  Genera JWT propio │
    └──────┬─────────────┘
           │
           ▼
┌──────────────────────────┐
│  App guarda JWT en       │
│  SecureStore             │
└──────────────────────────┘
```

---

## ✅ Checklist Final

Antes de probar, asegúrate de tener:

- [ ] Web Client ID creado en Google Cloud Console
- [ ] iOS Client ID creado (si vas a probar en iOS)
- [ ] Android Client ID con SHA-1 configurado (si vas a probar en Android)
- [ ] Archivo `.env` con las credenciales correctas
- [ ] Rebuild completo de la app (`npx expo start --clear`)
- [ ] Backend implementado con el endpoint `/auth/google/validate`
- [ ] Backend retornando un JWT válido

---

¡Listo! Ahora deberías poder autenticarte con Google en tu app. 🎉
