// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Libro } from "../models/Libro";
import { LibroService } from "../services/LibroService";
import { AuthService } from "../services/AuthService";

interface Props {
  authService: AuthService;
  email?: string;
}

export default function HomeScreen({ authService, email }: Props) {
  // El servicio se crea una sola vez
  const [libroService] = useState(() => new LibroService());

  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anio, setAnio] = useState("");

  // Carga la lista de libros desde Supabase (vía Service -> Repository)
  const cargarLibros = async () => {
    try {
      setCargando(true);
      setLibros(await libroService.obtenerLibros());
    } catch (e) {
      Alert.alert("Error al cargar los libros", (e as Error).message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const manejarAgregar = async () => {
    if (!titulo.trim() || !autor.trim() || !anio.trim()) {
      Alert.alert("Datos incompletos", "Completa título, autor y año.");
      return;
    }
    const anioNumero = parseInt(anio, 10);
    if (isNaN(anioNumero)) {
      Alert.alert("Año inválido", "El año debe ser un número.");
      return;
    }

    try {
      await libroService.agregarLibro(titulo, autor, anioNumero);
      setTitulo("");
      setAutor("");
      setAnio("");
      await cargarLibros();
    } catch (e) {
      Alert.alert("No se pudo agregar el libro", (e as Error).message);
    }
  };

  const manejarEliminar = async (id: number) => {
    try {
      await libroService.eliminarLibro(id);
      await cargarLibros();
    } catch (e) {
      Alert.alert("No se pudo eliminar el libro", (e as Error).message);
    }
  };

  // Solo se cierra la sesión: App.tsx detecta el cambio y vuelve al Login.
  const manejarCerrarSesion = async () => {
    try {
      await authService.cerrarSesion();
    } catch (e) {
      Alert.alert("No se pudo cerrar sesión", (e as Error).message);
    }
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>📚 Mis Libros</Text>
          {email ? <Text style={styles.correo}>{email}</Text> : null}
        </View>
        <TouchableOpacity
          style={styles.botonSalir}
          onPress={manejarCerrarSesion}
        >
          <Text style={styles.textoBoton}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Autor"
          value={autor}
          onChangeText={setAutor}
        />
        <TextInput
          style={styles.input}
          placeholder="Año"
          value={anio}
          onChangeText={setAnio}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.botonAgregar} onPress={manejarAgregar}>
          <Text style={styles.textoBoton}>Agregar libro</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Lista de libros ({libros.length})</Text>

      {cargando ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={libros}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.vacio}>Aún no hay libros agregados.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTexto}>{item.obtenerResumen()}</Text>
                {item.esAntiguo() && (
                  <Text style={styles.etiquetaAntiguo}>Libro antiguo</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => manejarEliminar(item.id)}
              >
                <Text style={styles.textoBoton}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    paddingTop: 48,
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  titulo: { fontSize: 24, fontWeight: "bold" },
  correo: { fontSize: 12, color: "#666", marginTop: 2 },
  subtitulo: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  formulario: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  botonAgregar: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  botonEliminar: {
    backgroundColor: "#c62828",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  botonSalir: {
    backgroundColor: "#546e7a",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  textoBoton: { color: "#fff", fontWeight: "bold" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTexto: { fontSize: 15 },
  etiquetaAntiguo: { fontSize: 12, color: "#e65100", marginTop: 2 },
  vacio: { textAlign: "center", color: "#888", marginTop: 20 },
});
