# 📚 Mis Libros

Aplicación móvil desarrollada con **React Native + Expo + TypeScript + Supabase** para el curso
Programación II. Aplica **Programación Orientada a Objetos (POO)**, **Separación de
Responsabilidades**, los patrones **Repository** y **Singleton**, y ahora usa
**Supabase** como base de datos persistente y **Supabase Auth** para la autenticación.

## Funcionalidad

- Registrar un usuario, iniciar sesión y cerrar sesión.
- Ver la lista de libros guardados en Supabase.
- Agregar un libro (título, autor, año).
- Eliminar un libro.

## Estructura del proyecto

```
mis-libros/
├── App.tsx
├── .env.example
├── supabase/
│   └── schema.sql
├── capturas/
└── src/
    ├── config/
    │   └── supabase.ts
    ├── models/
    │   └── Libro.ts
    ├── repositories/
    │   └── LibroRepository.ts
    ├── services/
    │   ├── AuthService.ts
    │   └── LibroService.ts
    └── screens/
        ├── LoginScreen.tsx
        ├── RegisterScreen.tsx
        └── HomeScreen.tsx
```

| Archivo | Responsabilidad |
|---|---|
| `App.tsx` | Observa la sesión y decide qué pantalla mostrar. |
| `screens/*` | Interfaz: Login, Registro y Home (lista de libros). |
| `AuthService.ts` | Registro, inicio y cierre de sesión con Supabase Auth. |
| `LibroService.ts` | Lógica de negocio de los libros (validaciones). |
| `LibroRepository.ts` | Acceso a datos: consulta, inserta y elimina en la tabla `libros` de Supabase. Singleton. |
| `Libro.ts` | Modelo (POO) con propiedades privadas, getters/setters y métodos. |
| `config/supabase.ts` | Crea el cliente único de Supabase. |

Flujo de dependencia de los datos:

```
HomeScreen  →  LibroService  →  LibroRepository  →  Supabase (tabla libros)
```

Flujo de la sesión (la navegación depende del estado de la sesión, no hay navegación manual a Home):

```
Sin sesión → Login → Sesión activa → Home → Cerrar sesión → Login
```

`App.tsx` se suscribe a `onAuthStateChange` (a través de `AuthService`). Cuando hay sesión
muestra `HomeScreen`; cuando no la hay, muestra `LoginScreen` / `RegisterScreen`.

## Configuración de Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecutar el contenido de [`supabase/schema.sql`](supabase/schema.sql)
   (crea la tabla `libros`, los `GRANT`, activa RLS y crea las políticas).
3. En **Authentication → Sign In / Providers → Email**, desactivar **Confirm email**
   (solo para desarrollo, así el registro inicia sesión de inmediato).
4. Copiar `.env.example` como `.env` y colocar la **URL** del proyecto y la
   **Publishable key** (Project Settings → API Keys). El archivo `.env` no se sube al repositorio.

```
EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

## Cómo ejecutar el proyecto

```bash
npm install
npx expo start --tunnel -c
```

Escanear el código QR con la app **Expo Go**.

## Autenticación y acceso a los datos (GRANT y RLS)

La autenticación determina **con qué rol** llega cada petición a la base de datos:

- Sin sesión, la app usa solo la llave pública y Supabase la trata como el rol **`anon`**.
- Con sesión iniciada, cada petición lleva el token (JWT) del usuario y Supabase la trata como el rol **`authenticated`**.

Después, dos capas de seguridad deciden qué puede hacer ese rol sobre la tabla `libros`:

- **GRANT (permisos sobre la tabla):** responde *"¿puede este rol ejecutar esta operación?"*.
  Se otorga `SELECT`, `INSERT` y `DELETE` únicamente al rol `authenticated`. El rol `anon` no
  recibe ningún permiso.
- **RLS (Row Level Security, control sobre las filas):** responde *"¿sobre qué filas puede hacerlo?"*.
  Con RLS activado se crearon tres políticas (consultar, agregar y eliminar) para el rol `authenticated`.

Ambas capas deben cumplirse: sin `GRANT` la operación se rechaza antes de revisar las políticas, y
sin una política que la permita, RLS bloquea la operación. Así, **solo un usuario con sesión
activa puede consultar, agregar o eliminar libros**; si no hay sesión, la app muestra el Login y
además la base de datos rechazaría cualquier petición directa.

## Cambios realizados (Tarea: Supabase y Autenticación)

- Se creó la tabla `libros` (`id`, `titulo`, `autor`, `anio`) en Supabase, con `GRANT` y políticas RLS.
- `LibroRepository` (que sigue siendo Singleton) dejó de usar datos mock y ahora obtiene, agrega y
  elimina libros en Supabase.
- `LibroService` y las pantallas ahora trabajan de forma asíncrona.
- Se creó `AuthService` para registro, inicio y cierre de sesión.
- Se crearon las pantallas `LoginScreen`, `RegisterScreen` y `HomeScreen`.
- `App.tsx` controla la navegación según el estado de la sesión.
- La sesión se guarda en `AsyncStorage`, por lo que persiste al cerrar y abrir la app.

## Capturas

**Registro funcionando**

![Registro](capturas/registro.png)

**Login funcionando**

![Login](capturas/login.png)

**Aplicación mostrando los libros almacenados en Supabase**

![Libros](capturas/libros-supabase.png)

**Cierre de sesión**

![Cierre de sesión](capturas/cierre-sesion.png)

## Reflexión (tareas anteriores)

**¿Por qué es conveniente separar la lógica de los libros de `App.tsx`?**

Porque `App.tsx` debería encargarse únicamente de la interfaz y del control general de la app. Si toda la
lógica de agregar, eliminar y validar libros estuviera mezclada ahí, el componente se volvería difícil de
leer, probar y mantener. Separándola en clases independientes, cada parte tiene una única razón para
cambiar (principio de responsabilidad única), lo que facilita el mantenimiento y la reutilización.

**¿Qué responsabilidad tiene `LibroService`?**

Contiene la lógica de negocio relacionada con los libros (por ejemplo, validar los datos) y coordina las
operaciones con el repositorio. Es la capa intermedia entre la interfaz y el acceso a datos: no sabe cómo
se dibuja la pantalla ni dónde se almacenan los datos.

**¿Qué responsabilidad tiene la clase `Libro`?**

Representa a un libro individual: guarda sus datos de forma encapsulada (propiedades privadas con getters
y setters) y ofrece comportamientos propios, como `obtenerResumen()` y `esAntiguo()`. No sabe nada de
listas, servicios ni interfaz.

**¿Por qué separar `LibroRepository` de `LibroService`, y por qué Singleton?**

`LibroService` se encarga de las reglas de negocio y `LibroRepository` únicamente de dónde y cómo se
guardan los datos; por eso al pasar de datos mock a Supabase solo hubo que modificar el repositorio. El
patrón Singleton garantiza una única instancia del repositorio, sin importar cuántas veces se llame a
`LibroRepository.getInstance()`.
