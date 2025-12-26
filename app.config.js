/**
 * Configuración de Expo
 *
 * Este archivo permite usar variables de entorno dinámicas.
 * En Expo, NO puedes usar process.env directamente en tu código React Native,
 * pero SÍ puedes usarlo aquí para configurar la app.
 *
 * Las variables que definas en "extra" estarán disponibles en tu app
 * a través de expo-constants.
 */

// Detectar el entorno actual
const IS_DEV = process.env.APP_ENV === 'development' || !process.env.APP_ENV;

export default {
  expo: {
    name: "imperiohub-app",
    slug: "imperiohub-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "imperiohubapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.imperiohub.app",
    },

    android: {
      package: "com.imperiohub.app",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "imperiohubapp",
              host: "auth",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          // iOS: Web Client ID de Google Cloud Console
          iosClientId: process.env.GOOGLE_IOS_CLIENT_ID || "",
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    // 🔑 IMPORTANTE: Aquí defines las variables que estarán disponibles en tu app
    // Puedes acceder a ellas con: Constants.expoConfig.extra.apiUrl
    extra: {
      // URL de la API según el entorno
      apiUrl: process.env.API_URL || "http://localhost:3000/api",

      // Credenciales de Google OAuth (Web Client ID)
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID || "",

      // Puedes agregar más variables según necesites
      environment: IS_DEV ? 'development' : 'production',
    },
  },
};
