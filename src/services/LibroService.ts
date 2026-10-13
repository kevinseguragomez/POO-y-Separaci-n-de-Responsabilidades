// src/services/LibroService.ts

import { Libro } from "../models/Libro";
import { LibroRepository } from "../repositories/LibroRepository";

/**
 * Clase LibroService
 * Responsabilidad: lógica de negocio de los libros (validaciones) y
 * coordinación con el repositorio, que obtiene con getInstance() (Singleton).
 */
export class LibroService {
  private repository: LibroRepository;

  constructor() {
    this.repository = LibroRepository.getInstance();
  }

  public async obtenerLibros(): Promise<Libro[]> {
    return this.repository.obtenerLibros();
  }

  public async agregarLibro(
    titulo: string,
    autor: string,
    anio: number
  ): Promise<Libro> {
    if (!titulo.trim() || !autor.trim()) {
      throw new Error("El título y el autor son obligatorios.");
    }
    if (!Number.isInteger(anio)) {
      throw new Error("El año debe ser un número entero.");
    }
    return this.repository.agregarLibro(titulo.trim(), autor.trim(), anio);
  }

  public async eliminarLibro(id: number): Promise<void> {
    return this.repository.eliminarLibro(id);
  }
}
