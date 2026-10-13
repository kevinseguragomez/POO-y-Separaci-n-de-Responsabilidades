// App.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Session } from "@supabase/supabase-js";

import { AuthService } from "./src/services/AuthService";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";

// Una sola instancia del servicio de autenticación para toda la app
const authService = new AuthService();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  useEffect(() => {
    // 1) Recuperar la sesión guardada (si el usuario ya había iniciado sesión)
    authService
      .obtenerSesion()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setCargandoSesion(false));

    // 2) Escuchar cambios: login, registro, logout, expiración...
    const cancelarSuscripcion = authService.suscribirCambioSesion(
      (nuevaSesion) => {
        setSession(nuevaSesion);
        setMostrarRegistro(false);
        setCargandoSesion(false);
      }
    );

    return cancelarSuscripcion;
  }, []);

  if (cargandoSesion) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // La pantalla que se muestra DEPENDE del estado de la sesión:
  //   sin sesión -> Login / Registro      con sesión -> Home
  if (!session) {
    return mostrarRegistro ? (
      <RegisterScreen
        authService={authService}
        onIrALogin={() => setMostrarRegistro(false)}
      />
    ) : (
      <LoginScreen
        authService={authService}
        onIrARegistro={() => setMostrarRegistro(true)}
      />
    );
  }

  return <HomeScreen authService={authService} email={session.user.email} />;
}

const styles = StyleSheet.create({
  centrado: { flex: 1, justifyContent: "center", alignItems: "center" },
});
