// src/models/Libro.ts

/**
 * Clase Libro
 * Representa el modelo de datos de un libro.
 * Responsabilidad única: guardar y exponer la información de un libro,
 * y ofrecer comportamientos propios de esa entidad (no de la lista completa).
 */
export class Libro {
  // Propiedades privadas (modificadores de acceso)
  private _id: number;
  private _titulo: string;
  private _autor: string;
  private _anio: number;

  // Constructor
  constructor(id: number, titulo: string, autor: string, anio: number) {
    this._id = id;
    this._titulo = titulo;
    this._autor = autor;
    this._anio = anio;
  }

  // Getters (acceso controlado a las propiedades)
  get id(): number {
    return this._id;
  }

  get titulo(): string {
    return this._titulo;
  }

  get autor(): string {
    return this._autor;
  }

  get anio(): number {
    return this._anio;
  }

  // Setter (permite modificar el título de forma controlada)
  set titulo(nuevoTitulo: string) {
    this._titulo = nuevoTitulo;
  }

  // Método propio del libro: arma un resumen legible con sus datos
  public obtenerResumen(): string {
    return `"${this._titulo}" de ${this._autor} (${this._anio})`;
  }

  // Método propio del libro: indica si es un libro "antiguo"
  public esAntiguo(): boolean {
    const anioActual = new Date().getFullYear();
    return anioActual - this._anio >= 20;
  }
}
