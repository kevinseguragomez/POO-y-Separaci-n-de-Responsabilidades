// src/repositories/LibroRepository.ts

import { supabase } from "../config/supabase";
import { Libro } from "../models/Libro";

// Forma de una fila de la tabla "libros" en Supabase
type FilaLibro = {
  id: number;
  titulo: string;
  autor: string;
  anio: number;
};

/**
 * Clase LibroRepository
 * Responsabilidad única: acceso a los datos. Ahora la fuente de datos es la
 * tabla "libros" de Supabase (ya no hay datos mock en memoria).
 * Mantiene el patrón Singleton: existe una única instancia.
 */
export class LibroRepository {
  private static instancia: LibroRepository;

  private constructor() {}

  public static getInstance(): LibroRepository {
    if (!LibroRepository.instancia) {
      LibroRepository.instancia = new LibroRepository();
    }
    return LibroRepository.instancia;
  }

  private convertirALibro(fila: FilaLibro): Libro {
    return new Libro(fila.id, fila.titulo, fila.autor, fila.anio);
  }

  // Obtener libros desde Supabase
  public async obtenerLibros(): Promise<Libro[]> {
    const { data, error } = await supabase
      .from("libros")
      .select("id, titulo, autor, anio")
      .order("id", { ascending: true });

    if (error) throw new Error(error.message);
    return (data as FilaLibro[]).map((fila) => this.convertirALibro(fila));
  }

  // Agregar un libro en Supabase (el id lo genera la base de datos)
  public async agregarLibro(
    titulo: string,
    autor: string,
    anio: number
  ): Promise<Libro> {
    const { data, error } = await supabase
      .from("libros")
      .insert({ titulo, autor, anio })
      .select("id, titulo, autor, anio")
      .single();

    if (error) throw new Error(error.message);
    return this.convertirALibro(data as FilaLibro);
  }

  // Eliminar un libro de Supabase por id
  public async eliminarLibro(id: number): Promise<void> {
    const { error } = await supabase.from("libros").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}
