import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🧪 PANTALLA DE PRUEBA DE LOGIN
 *
 * Esta pantalla te permite probar el login con Google.
 * Para que funcione necesitas:
 *
 * 1. Tu backend corriendo en http://localhost:3000
 * 2. Variables de entorno configuradas en .env
 * 3. Google OAuth configurado en Google Cloud Console
 */
export default function HomeScreen() {
  // Usar el hook de autenticación
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  // Función para hacer login
  const handleLogin = async () => {
    console.log('🔐 Intentando hacer login...');
    const result = await login();

    if (result.success) {
      Alert.alert('✅ Login exitoso', 'Has iniciado sesión correctamente');
    } else {
      Alert.alert('❌ Error', result.error || 'No se pudo iniciar sesión');
    }
  };

  // Función para hacer logout
  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, cerrar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            Alert.alert('👋 Sesión cerrada');
          }
        },
      ]
    );
  };

  // Mostrar spinner mientras carga
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Verificando autenticación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🚀 ImperioHub</Text>
        <Text style={styles.subtitle}>Prueba de Autenticación</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isAuthenticated && user ? (
          // Usuario autenticado
          <>
            <Text style={styles.statusEmoji}>✅</Text>
            <Text style={styles.welcomeText}>¡Hola, {user.nombre}!</Text>
            <Text style={styles.emailText}>{user.email}</Text>
            <Text style={styles.infoText}>ID: {user.id}</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Usuario NO autenticado
          <>
            <Text style={styles.statusEmoji}>🔒</Text>
            <Text style={styles.infoText}>No has iniciado sesión</Text>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>🔐 Iniciar Sesión con Google</Text>
            </TouchableOpacity>

            <View style={styles.helpBox}>
              <Text style={styles.helpTitle}>📋 Checklist antes de probar:</Text>
              <Text style={styles.helpText}>✓ Backend corriendo en localhost:3000</Text>
              <Text style={styles.helpText}>✓ Archivo .env configurado</Text>
              <Text style={styles.helpText}>✓ Google OAuth configurado</Text>
            </View>
          </>
        )}
      </View>

      {/* Footer con info de debugging */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Estado: {isAuthenticated ? '🟢 Autenticado' : '🔴 No autenticado'}
        </Text>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  statusEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 280,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 280,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpBox: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    maxWidth: 320,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});
