// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthService } from "../services/AuthService";

interface Props {
  authService: AuthService;
  onIrARegistro: () => void;
}

export default function LoginScreen({ authService, onIrARegistro }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Datos incompletos", "Ingresa tu correo y tu contraseña.");
      return;
    }
    try {
      setCargando(true);
      // No se navega manualmente: al iniciar sesión, App.tsx detecta el
      // cambio de sesión y muestra el Home automáticamente.
      await authService.iniciarSesion(email.trim(), password);
    } catch (e) {
      Alert.alert("No se pudo iniciar sesión", (e as Error).message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>📚 Mis Libros</Text>
      <Text style={styles.subtitulo}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.boton}
        onPress={manejarLogin}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBoton}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onIrARegistro}>
        <Text style={styles.enlace}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  titulo: { fontSize: 30, fontWeight: "bold", textAlign: "center" },
  subtitulo: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    marginTop: 4,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  boton: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  textoBoton: { color: "#fff", fontWeight: "bold" },
  enlace: { color: "#1565c0", textAlign: "center", marginTop: 18 },
});
