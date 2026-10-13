// src/screens/RegisterScreen.tsx
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
  onIrALogin: () => void;
}

export default function RegisterScreen({ authService, onIrALogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarRegistro = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Datos incompletos", "Ingresa tu correo y una contraseña.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Contraseña débil", "Debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);
      const { requiereConfirmacion } = await authService.registrar(
        email.trim(),
        password
      );

      if (requiereConfirmacion) {
        // Supabase pide confirmar el correo antes de crear la sesión.
        Alert.alert(
          "Cuenta creada",
          "Revisa tu correo para confirmar la cuenta y luego inicia sesión."
        );
        onIrALogin();
      }
      // Si NO requiere confirmación, ya hay sesión activa y App.tsx
      // muestra el Home automáticamente (sin navegación manual).
    } catch (e) {
      Alert.alert("No se pudo registrar", (e as Error).message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>📚 Mis Libros</Text>
      <Text style={styles.subtitulo}>Crear cuenta</Text>

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
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={confirmar}
        onChangeText={setConfirmar}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.boton}
        onPress={manejarRegistro}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBoton}>Registrarme</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onIrALogin}>
        <Text style={styles.enlace}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    backgroundColor: "#1565c0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  textoBoton: { color: "#fff", fontWeight: "bold" },
  enlace: { color: "#1565c0", textAlign: "center", marginTop: 18 },
});
