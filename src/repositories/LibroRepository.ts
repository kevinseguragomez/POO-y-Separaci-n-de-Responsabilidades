// src/repositories/LibroRepository.ts

import { Libro } from "../models/Libro";

/**
 * Clase LibroRepository
 * Responsabilidad única: administrar la colección de libros
 * (fuente de datos). Aplica el patrón Singleton para garantizar
 * que exista una única instancia del repositorio en toda la app.
 */
export class LibroRepository {
  // Única instancia de la clase (patrón Singleton)
  private static instancia: LibroRepository;

  // "Base de datos" en memoria (datos mock)
  private libros: Libro[] = [];
  private contadorId: number = 1;

  // Constructor privado: nadie puede hacer "new LibroRepository()" desde afuera
  private constructor() {
    // Datos mock iniciales, para que la app no arranque vacía
    this.agregarLibro("Cien años de soledad", "Gabriel García Márquez", 1967);
    this.agregarLibro("1984", "George Orwell", 1949);
  }

  // Punto de acceso único a la instancia
  public static getInstance(): LibroRepository {
    if (!LibroRepository.instancia) {
      LibroRepository.instancia = new LibroRepository();
    }
    return LibroRepository.instancia;
  }

  // Devuelve la lista completa de libros
  public obtenerLibros(): Libro[] {
    return [...this.libros];
  }

  // Agrega un nuevo libro a la colección
  public agregarLibro(titulo: string, autor: string, anio: number): Libro {
    const nuevoLibro = new Libro(this.contadorId, titulo, autor, anio);
    this.libros.push(nuevoLibro);
    this.contadorId++;
    return nuevoLibro;
  }

  // Elimina un libro por id
  public eliminarLibro(id: number): void {
    this.libros = this.libros.filter((libro) => libro.id !== id);
  }
}
