// App.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";

import { Libro } from "./src/models/Libro";
import { LibroService } from "./src/services/LibroService";
import { LibroRepository } from "./src/repositories/LibroRepository";

export default function App() {
  // La instancia del servicio se crea una sola vez (no en cada render)
  const libroServiceRef = useRef(new LibroService());
  const libroService = libroServiceRef.current;

  // Estado de la interfaz: la lista de libros a mostrar
  const [libros, setLibros] = useState<Libro[]>([]);

  // Prueba del patrón Singleton: dos llamadas a getInstance()
  // deben devolver exactamente la misma instancia de LibroRepository.
  useEffect(() => {
    const instanciaA = LibroRepository.getInstance();
    const instanciaB = LibroRepository.getInstance();
    console.log("Instancia A:", instanciaA);
    console.log("Instancia B:", instanciaB);
    console.log(
      "¿Singleton funciona correctamente? (misma instancia):",
      instanciaA === instanciaB
    );

    // Cargar los libros iniciales (los datos mock del repositorio)
    setLibros(libroService.obtenerLibros());
  }, []);

  // Estados de los campos del formulario
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anio, setAnio] = useState("");

  const actualizarListaDesdeServicio = () => {
    setLibros(libroService.obtenerLibros());
  };

  const manejarAgregar = () => {
    if (!titulo.trim() || !autor.trim() || !anio.trim()) {
      Alert.alert("Datos incompletos", "Por favor completa título, autor y año.");
      return;
    }

    const anioNumero = parseInt(anio, 10);
    if (isNaN(anioNumero)) {
      Alert.alert("Año inválido", "El año debe ser un número.");
      return;
    }

    libroService.agregarLibro(titulo.trim(), autor.trim(), anioNumero);
    actualizarListaDesdeServicio();

    // Limpiar formulario
    setTitulo("");
    setAutor("");
    setAnio("");
  };

  const manejarEliminar = (id: number) => {
    libroService.eliminarLibro(id);
    actualizarListaDesdeServicio();
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <Text style={styles.titulo}>📚 Mis Libros</Text>

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

      <Text style={styles.subtitulo}>
        Lista de libros ({libros.length})
      </Text>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
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
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTexto: {
    fontSize: 15,
  },
  etiquetaAntiguo: {
    fontSize: 12,
    color: "#e65100",
    marginTop: 2,
  },
  vacio: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
