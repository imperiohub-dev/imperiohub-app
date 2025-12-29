# API Service

Servicio centralizado para comunicación con el backend de ImperioHub.

## Estructura

```
service/api/
├── config/
│   ├── axios.config.ts      # Configuración de axios con interceptors
│   └── api.constants.ts     # URLs base y endpoints
├── auth/
│   ├── auth.service.ts      # Servicio de autenticación
│   └── auth.types.ts        # Tipos e interfaces de auth
├── storage/
│   ├── token.storage.ts     # Abstracción de almacenamiento multiplataforma
│   └── storage.types.ts     # Tipos de storage
└── index.ts                 # Barrel export
```

## Características

### 🔐 Autenticación Multiplataforma

- **Mobile (iOS/Android)**: JWT almacenado en `SecureStore` (encriptado)
- **Web**: Cookies httpOnly + localStorage para datos del usuario

### 🔄 Interceptors Automáticos

- **Request**: Agrega automáticamente `Authorization: Bearer <token>` en mobile
- **Response**: Maneja errores 401 y limpia storage automáticamente

### 💾 Almacenamiento Seguro

La clase `TokenStorage` detecta la plataforma y usa:
- `expo-secure-store` para iOS/Android
- `localStorage` para web

## Uso

### Login con Google

```typescript
import { authService } from '@/service/api';

// En tu componente
const { user, token } = await authService.loginWithGoogle(googleUser, idToken);
```

### Obtener usuario actual

```typescript
const user = await authService.getCurrentUser();
```

### Logout

```typescript
await authService.logout(); // Limpia cookies, storage y backend
```

### Verificar autenticación

```typescript
const isAuth = await authService.isAuthenticated();
```

## Hook actualizado: useGoogleAuth

El hook ahora está integrado con el backend:

```typescript
const {
  userInfo,        // Usuario actual
  isSigningIn,     // Estado de login
  isLoading,       // Cargando usuario inicial
  isAuthenticated, // Boolean
  signIn,          // Login con Google
  signOut,         // Logout completo
  revokeAccess,    // Revocar acceso
  getCurrentUser,  // Refrescar desde backend
  refreshUser,     // Revalidar usuario
} = useGoogleAuth();
```

## Flujo de Autenticación

### Mobile (iOS/Android)

1. Usuario presiona botón de Google Sign-In
2. Google SDK retorna `googleUser` y `idToken`
3. Frontend envía `idToken` + datos del usuario a `POST /api/auth/google/mobile`
4. Backend valida el token con Google
5. Backend crea/actualiza usuario en DB
6. Backend retorna `{ token: "jwt...", user: {...} }`
7. Frontend guarda JWT en `SecureStore`
8. Todas las requests posteriores incluyen: `Authorization: Bearer <token>`

### Web

1. Usuario presiona botón de Google Sign-In
2. Google SDK retorna `googleUser` y `idToken`
3. Frontend envía `idToken` + datos del usuario a `POST /api/auth/google/mobile`
4. Backend valida el token con Google
5. Backend crea/actualiza usuario en DB
6. Backend setea cookie httpOnly + retorna `{ user: {...} }`
7. Frontend guarda datos de usuario en localStorage (opcional)
8. Todas las requests posteriores incluyen cookies automáticamente

## Variables de Entorno

Crear archivo `.env` en la raíz:

```env
EXPO_PUBLIC_API_URL=https://tu-backend.com
```

## Pendientes del Backend

El backend necesita implementar:

### 1. Endpoint `POST /api/auth/google/mobile`

**Request:**
```json
{
  "idToken": "string",
  "user": {
    "email": "string",
    "name": "string",
    "picture": "string"
  }
}
```

**Response:**
```json
{
  "token": "jwt_token_aqui",
  "user": {
    "id": "string",
    "email": "string",
    "nombre": "string",
    "picture": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### 2. Agregar campo `picture` al modelo de Usuario

```typescript
// En la DB
picture: string // URL de la foto de Google
googleId: string // ID de Google del usuario
```

### 3. Actualizar `/api/auth/me` para devolver `picture`

```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "id": "string",
    "email": "string",
    "nombre": "string",
    "picture": "string", // ← AGREGAR
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

## Seguridad

### Mobile
✅ JWT almacenado en SecureStore (encriptado a nivel del sistema operativo)
✅ No accesible desde JavaScript directamente
✅ Protegido contra XSS

### Web
✅ JWT en cookie httpOnly (no accesible desde JavaScript)
✅ `sameSite: "none"` en producción (para CORS)
✅ `secure: true` en producción (solo HTTPS)

## Próximos Pasos

1. ✅ Estructura de carpetas creada
2. ✅ Storage multiplataforma implementado
3. ✅ Axios configurado con interceptors
4. ✅ Auth service implementado
5. ✅ Hook actualizado
6. ⏳ Backend: Crear endpoint `/api/auth/google/mobile`
7. ⏳ Backend: Agregar campos `picture` y `googleId` al modelo
8. ⏳ Backend: Actualizar response de `/api/auth/me`
9. ⏳ Configurar variables de entorno
10. ⏳ Probar flujo completo en las 3 plataformas
