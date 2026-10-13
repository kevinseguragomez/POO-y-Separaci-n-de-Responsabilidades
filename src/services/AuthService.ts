// src/services/AuthService.ts

import { Session } from "@supabase/supabase-js";
import { supabase } from "../config/supabase";

/**
 * Clase AuthService
 * Responsabilidad única: operaciones de autenticación con Supabase Auth
 * (registro, inicio y cierre de sesión, y observación del estado de sesión).
 * Las pantallas NO hablan con Supabase directamente: usan este servicio.
 */
export class AuthService {
  // Registra un usuario. Devuelve si Supabase exige confirmar el correo
  // (en ese caso no se crea la sesión hasta que el usuario confirme).
  public async registrar(
    email: string,
    password: string
  ): Promise<{ requiereConfirmacion: boolean }> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    return { requiereConfirmacion: !data.session };
  }

  public async iniciarSesion(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  }

  public async cerrarSesion(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  public async obtenerSesion(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
  }

  // Avisa cada vez que la sesión cambia (login, logout, registro, refresco).
  // Devuelve una función para cancelar la suscripción.
  public suscribirCambioSesion(
    callback: (session: Session | null) => void
  ): () => void {
    const { data } = supabase.auth.onAuthStateChange((_evento, session) => {
      callback(session);
    });
    return () => data.subscription.unsubscribe();
  }
}
