# 📚 Mis Libros

Aplicación móvil desarrollada con **React Native + Expo + TypeScript** para el curso
Programación II, cuyo objetivo es aplicar los conceptos de **Programación Orientada
a Objetos (POO)** y **Separación de Responsabilidades**.

## Funcionalidad

La aplicación permite:

- Ingresar los datos de un libro (título, autor, año).
- Agregar el libro a la lista.
- Visualizar la lista completa de libros.
- Eliminar un libro de la lista.

## Estructura del proyecto

```
mis-libros/
├── App.tsx
└── src/
    ├── models/
    │   └── Libro.ts
    ├── services/
    │   └── LibroService.ts
    └── repositories/
        └── LibroRepository.ts
```

- **`App.tsx`**: capa de interfaz (React Native). Muestra el formulario y la lista,
  y delega toda la lógica de negocio al `LibroService`. No administra la
  colección de libros directamente.
- **`LibroService.ts`**: capa de servicio. Contiene la lógica de negocio y
  delega la administración de la colección al `LibroRepository`.
- **`LibroRepository.ts`**: capa de acceso a datos (patrón **Repository**).
  Administra la colección de libros (agregar, eliminar, listar) y contiene
  los datos mock iniciales. Implementa el patrón **Singleton**, garantizando
  que exista una única instancia en toda la aplicación.
- **`Libro.ts`**: capa de modelo. Define la clase `Libro` con sus propiedades,
  modificadores de acceso y métodos propios.

Flujo de dependencia:

```
App.tsx  →  LibroService  →  LibroRepository  →  Datos Mock
```

## Cambios realizados (Tarea: Repository y Singleton)

- Se creó la clase **`LibroRepository`** dentro de `src/repositories/`,
  trasladando ahí la responsabilidad de administrar la colección de libros
  (antes estaba en `LibroService`).
- Se aplicó el **patrón Singleton** en `LibroRepository`: el constructor es
  privado y la única forma de obtener la instancia es mediante
  `LibroRepository.getInstance()`, que siempre retorna la misma instancia.
- `LibroService` ahora obtiene el repositorio con
  `LibroRepository.getInstance()` en su constructor, y delega en él todas
  las operaciones (agregar, eliminar, obtener libros).
- `App.tsx` se mantiene sin lógica de administración de datos: solo
  interactúa con `LibroService`.
- Se agregó en `App.tsx` una comprobación en consola que llama dos veces a
  `LibroRepository.getInstance()` y verifica con `===` que ambas llamadas
  retornan la misma instancia, evidenciando el funcionamiento del Singleton.
- El repositorio ahora incluye datos mock iniciales (dos libros de ejemplo),
  que se cargan automáticamente al iniciar la app.

## Cómo ejecutar el proyecto

```bash
npm install
npx expo start
```

Luego escanea el código QR con la app **Expo Go** en tu celular, o presiona
`a` (Android) / `i` (iOS) si tienes un emulador configurado.

## Reflexión

**¿Por qué es conveniente separar la lógica de los libros de `App.tsx`?**

Porque `App.tsx` debería encargarse únicamente de la interfaz: mostrar
formularios, listas y responder a eventos del usuario. Si toda la lógica de
agregar, eliminar y validar libros estuviera mezclada ahí, el componente se
volvería difícil de leer, probar y mantener. Separando esa lógica en clases
independientes, cada parte del código tiene una única razón para cambiar
(principio de responsabilidad única), lo que facilita el mantenimiento, las
pruebas unitarias y la reutilización del código en otras pantallas o incluso
en otros proyectos.

**¿Qué responsabilidad tiene `LibroService`?**

`LibroService` es responsable de administrar la colección de libros: agregar
nuevos libros (generando su id), eliminarlos por id y devolver la lista
actual. Es la capa intermedia entre la interfaz (`App.tsx`) y el modelo
(`Libro`): no sabe nada de React ni de cómo se dibuja la pantalla, solo maneja
las reglas de negocio relacionadas con los libros.

**¿Qué responsabilidad tiene la clase `Libro`?**

La clase `Libro` representa a un libro individual: guarda sus datos (id,
título, autor, año) de forma encapsulada mediante propiedades privadas y
expone esa información a través de getters y setters. Además, incluye
comportamientos propios de un libro, como generar un resumen legible
(`obtenerResumen`) o determinar si es un libro antiguo (`esAntiguo`). No sabe
nada de listas, servicios ni interfaz; solo se ocupa de sí misma como
entidad.

## Reflexión adicional (Repository y Singleton)

**¿Por qué separar el `LibroRepository` del `LibroService`?**

Porque cada uno tiene una responsabilidad distinta: `LibroService` se encarga
de la lógica de negocio (qué reglas aplicar, qué validar), mientras que
`LibroRepository` se encarga únicamente de dónde y cómo se guardan los datos.
Si en el futuro los libros se guardaran en una base de datos real o en una
API en lugar de un arreglo en memoria, solo habría que modificar
`LibroRepository`, sin tocar `LibroService` ni `App.tsx`.

**¿Por qué usar el patrón Singleton en `LibroRepository`?**

Porque la aplicación necesita una única fuente de verdad para los datos de
los libros. Si cada componente pudiera crear su propia instancia del
repositorio, cada uno tendría su propia copia de la lista de libros y los
datos se desincronizarían. El Singleton garantiza que, sin importar cuántas
veces se llame a `LibroRepository.getInstance()`, siempre se trabaje sobre
la misma colección de datos.

## Captura de la aplicación

_Agregar aquí la captura de pantalla de la app funcionando (`captura.png`)._

## Captura de la prueba del Singleton

_Agregar aquí la captura de la consola mostrando el resultado de comparar
las dos instancias de `LibroRepository` (`captura-singleton.png`)._
