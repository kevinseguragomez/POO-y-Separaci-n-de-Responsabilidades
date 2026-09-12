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
    └── services/
        └── LibroService.ts
```

- **`App.tsx`**: capa de interfaz (React Native). Muestra el formulario y la lista,
  y delega toda la lógica de negocio al `LibroService`.
- **`LibroService.ts`**: capa de servicio. Administra la colección de libros
  (agregar, eliminar, listar).
- **`Libro.ts`**: capa de modelo. Define la clase `Libro` con sus propiedades,
  modificadores de acceso y métodos propios.

Flujo de dependencia:

```
App.tsx  →  LibroService  →  Libro
```

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
