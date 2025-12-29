# Google Authentication Setup Guide

Esta guía documenta el proceso completo para configurar Google Sign-In en una aplicación React Native con Expo.

---

## 1. Instalación

Instalar la dependencia oficial de Google Sign-In para React Native:

```sh
# Documentación oficial: https://react-native-google-signin.github.io
npm i @react-native-google-signin/google-signin@latest
```

---

## 2. Configuración del Plugin en Expo

Agregar el plugin de Google Sign-In en el archivo `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID_HERE"
        }
      ]
    ]
  }
}
```

> **Nota:** El `iosUrlScheme` se obtendrá más adelante en el paso de configuración de iOS.

---

## 3. Build del Proyecto

### 3.1 Ejecutar Prebuild

```sh
npx expo prebuild --clean
```

### 3.2 Configurar Android SDK

Crear o verificar el archivo `android/local.properties` con la ruta del SDK de Android:

```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

> En Windows: `C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk`
> En Linux: `/home/YOUR_USERNAME/Android/Sdk`

### 3.3 Ejecutar la Aplicación

```sh
npx expo run:android && npx expo run:ios
```

---

## 4. Configuración en Google Cloud Console

### 4.1 Crear Cliente OAuth para Web

1. Acceder a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto o seleccionar uno existente
3. Ir a **APIs & Services** > **Credentials**
4. Crear un nuevo **ID de cliente OAuth** de tipo **Web**
5. Copiar el Client ID generado (formato: `XXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com`)

> Este ID será usado como `webClientId` en la configuración de la app.

---

### 4.2 Crear Cliente OAuth para Android

#### Obtener el Package Name

El package name se encuentra en `app.json`:

```json
{
  "android": {
    "package": "com.yourcompany.yourapp"
  }
}
```

#### Obtener el SHA-1 Certificate Fingerprint

Ejecutar el siguiente comando para obtener el SHA-1 del keystore de debug:

```sh
keytool -keystore android/app/debug.keystore -list -v -keypass android
```

Cuando solicite una contraseña, presionar **Enter** (la contraseña por defecto es "android").

Buscar y copiar el valor SHA-1 en la salida:

```
SHA1: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX
```

#### Crear el Cliente OAuth para Android

1. En Google Cloud Console, crear un nuevo **ID de cliente OAuth** de tipo **Android**
2. Ingresar el package name y el SHA-1 obtenidos anteriormente
3. Se generará un Client ID (no es necesario copiarlo para la configuración)

> **Importante:** Para producción, deberás generar otro SHA-1 del keystore de release.

---

### 4.3 Crear Cliente OAuth para iOS

#### Obtener el Bundle Identifier

El bundle identifier se encuentra en `app.json`:

```json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.yourapp"
  }
}
```

#### Crear el Cliente OAuth para iOS

1. En Google Cloud Console, crear un nuevo **ID de cliente OAuth** de tipo **iOS**
2. Ingresar el bundle identifier obtenido anteriormente
3. **Copiar el Client ID generado** (este SÍ es necesario):

```
XXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
```

4. **Copiar también el Esquema de URL de iOS** que aparece en la consola:

```
com.googleusercontent.apps.XXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### Actualizar app.json con el Esquema de URL

Reemplazar el placeholder en `app.json` con el esquema de URL obtenido:

```json
{
  "plugins": [
    [
      "@react-native-google-signin/google-signin",
      {
        "iosUrlScheme": "com.googleusercontent.apps.XXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      }
    ]
  ]
}
```

---

## 5. Implementación en el Código

### 5.1 Crear la Configuración de Google Sign-In

Crear el archivo `config/google-signin.ts`:

```typescript
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const configureGoogleSignin = () => {
  GoogleSignin.configure({
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com", // Client ID de tipo WEB
    offlineAccess: false, // true si necesitas acceder a Google API desde tu servidor
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com", // Client ID de tipo iOS
  });
};
```

### 5.2 Crear el Hook useGoogleAuth

Crear el archivo `hooks/useGoogleAuth.ts`:

```typescript
import { useState, useEffect } from "react";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  type User,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

export const useGoogleAuth = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    checkIsSignedIn();
  }, []);

  const checkIsSignedIn = async () => {
    try {
      const user = GoogleSignin.getCurrentUser();
      if (user) {
        setUserInfo(user);
      }
    } catch (error) {
      console.error("Error checking sign-in status:", error);
    }
  };

  const signIn = async () => {
    try {
      setIsSigningIn(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        setUserInfo(response.data);
        Alert.alert("Success", `Welcome ${response.data.user.name}!`);
      } else {
        Alert.alert("Cancelled", "Sign in was cancelled");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("In Progress", "Sign in is already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Error", "Play Services not available or outdated");
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert("Cancelled", "User cancelled the sign in");
            break;
          default:
            Alert.alert("Error", `Something went wrong: ${error.message}`);
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      Alert.alert("Success", "Signed out successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
      console.error("Sign out error:", error);
    }
  };

  const revokeAccess = async () => {
    try {
      await GoogleSignin.revokeAccess();
      setUserInfo(null);
      Alert.alert("Success", "Access revoked successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to revoke access");
      console.error("Revoke access error:", error);
    }
  };

  const getCurrentUser = () => {
    try {
      const user = GoogleSignin.getCurrentUser();
      Alert.alert("Current User", JSON.stringify(user, null, 2));
    } catch (error) {
      Alert.alert("Error", "No user is currently signed in");
    }
  };

  return {
    userInfo,
    isSigningIn,
    signIn,
    signOut,
    revokeAccess,
    getCurrentUser,
  };
};
```

### 5.3 Usar el Hook en tu Componente

```typescript
import { useEffect } from "react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { configureGoogleSignin } from "@/config/google-signin";

export default function HomeScreen() {
  useEffect(() => {
    configureGoogleSignin();
  }, []);

  const {
    userInfo,
    isSigningIn,
    signIn,
    signOut,
    revokeAccess,
    getCurrentUser,
  } = useGoogleAuth();

  // Usa userInfo, signIn, signOut, etc. en tu UI
}
```

### 5.4 Ejemplo de Componente UI Completo

```typescript
import { Button, StyleSheet, View } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

// En tu JSX
return (
  <View style={styles.container}>
    {!userInfo ? (
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        disabled={isSigningIn}
      />
    ) : (
      <View>
        <Text>Welcome {userInfo.user.name}!</Text>
        <Button title="Sign Out" onPress={signOut} />
        <Button title="Revoke Access" onPress={revokeAccess} />
      </View>
    )}
  </View>
);
```

---

## 6. Estructura de Archivos Recomendada

```
proyecto/
├── app/
│   └── (tabs)/
│       └── index.tsx          # Screen principal
├── components/
│   └── GoogleAuthScreen.tsx   # Componente UI
├── hooks/
│   └── useGoogleAuth.ts       # Lógica de autenticación
├── config/
│   └── google-signin.ts       # Configuración
└── app.json                   # Configuración del plugin
```

---

## 7. Resumen de IDs Generados

| Tipo | Client ID | Uso |
|------|-----------|-----|
| **Web** | `XXXXX-XXXXX.apps.googleusercontent.com` | Configuración `webClientId` (requerido) |
| **Android** | `XXXXX-XXXXX.apps.googleusercontent.com` | Se genera automáticamente (no se usa en código) |
| **iOS** | `XXXXX-XXXXX.apps.googleusercontent.com` | Configuración `iosClientId` (requerido) |

**iOS URL Scheme:** `com.googleusercontent.apps.XXXXX-XXXXX`

---

## 8. Checklist de Configuración

- [ ] Instalar dependencia `@react-native-google-signin/google-signin`
- [ ] Agregar plugin en `app.json`
- [ ] Crear proyecto en Google Cloud Console
- [ ] Crear Client ID para Web
- [ ] Crear Client ID para Android (con SHA-1)
- [ ] Crear Client ID para iOS (con bundle identifier)
- [ ] Actualizar `iosUrlScheme` en `app.json`
- [ ] Actualizar Client IDs en `config/google-signin.ts`
- [ ] Ejecutar `npx expo prebuild --clean`
- [ ] Probar en dispositivo físico o emulador

---

## 9. Troubleshooting

### Error: Play Services not available
- Verificar que Google Play Services esté instalado y actualizado en el dispositivo Android
- Solo aplica para dispositivos Android

### Error: DEVELOPER_ERROR
- Verificar que el SHA-1 del keystore coincida con el configurado en Google Cloud Console
- Verificar que el package name/bundle identifier sean correctos
- Asegurarse de que el proyecto de Google Cloud tenga habilitada la API de Google Sign-In

### Sign-In cancelado inmediatamente
- Verificar que el `iosUrlScheme` esté correctamente configurado en `app.json`
- Ejecutar `npx expo prebuild --clean` después de cambiar la configuración
- Verificar que el `iosClientId` sea correcto

### Error en iOS: "No client ID found"
- Asegurarse de configurar el `iosClientId` en la configuración
- Verificar que el URL Scheme en `app.json` coincida con el generado en Google Cloud Console

### Error: "API key not valid"
- Verificar que las APIs necesarias estén habilitadas en Google Cloud Console
- Ir a **APIs & Services** > **Library** y habilitar "Google Sign-In API"

---

## 10. Referencias

- [Documentación oficial de Google Sign-In](https://react-native-google-signin.github.io)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Expo Plugins](https://docs.expo.dev/guides/config-plugins/)
- [Google Identity Platform](https://developers.google.com/identity)

---

## 11. Notas Adicionales

### Diferencia entre Debug y Release

- **Debug keystore:** Se usa durante el desarrollo (`android/app/debug.keystore`)
- **Release keystore:** Se usa para builds de producción

Para producción, deberás:
1. Generar un keystore de release
2. Obtener el SHA-1 del keystore de release
3. Agregar ese SHA-1 en Google Cloud Console

### Seguridad

- **Nunca** commits los archivos `.keystore` en tu repositorio
- Mantén tus Client IDs seguros
- El `webClientId` puede ser público, pero protege tus keystores
- Para apps de producción, considera usar variables de entorno para los Client IDs

### Características del Hook

El hook `useGoogleAuth` proporciona:
- `userInfo`: Información del usuario autenticado (null si no está autenticado)
- `isSigningIn`: Estado de carga durante el proceso de sign-in
- `signIn()`: Función para iniciar sesión
- `signOut()`: Función para cerrar sesión
- `revokeAccess()`: Función para revocar acceso completamente
- `getCurrentUser()`: Función para obtener información del usuario actual
