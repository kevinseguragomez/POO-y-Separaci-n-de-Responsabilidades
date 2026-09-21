// src/services/LibroService.ts

import { Libro } from "../models/Libro";
import { LibroRepository } from "../repositories/LibroRepository";

/**
 * Clase LibroService
 * Responsabilidad única: contener la lógica de negocio relacionada
 * con los libros. Ya NO administra la colección directamente: delega
 * esa responsabilidad al LibroRepository (patrón Repository),
 * obtenido mediante su instancia única (patrón Singleton).
 */
export class LibroService {
  private repository: LibroRepository;

  constructor() {
    this.repository = LibroRepository.getInstance();
  }

  public agregarLibro(titulo: string, autor: string, anio: number): Libro {
    return this.repository.agregarLibro(titulo, autor, anio);
  }

  public eliminarLibro(id: number): void {
    this.repository.eliminarLibro(id);
  }

  public obtenerLibros(): Libro[] {
    return this.repository.obtenerLibros();
  }

  public contarLibros(): number {
    return this.repository.obtenerLibros().length;
  }
}
