-- supabase/schema.sql
-- Ejecutar en: Supabase -> SQL Editor -> New query -> Run

-- 1) TABLA
create table if not exists public.libros (
  id     bigint generated always as identity primary key,
  titulo text    not null,
  autor  text    not null,
  anio   integer not null
);

-- 2) GRANT: permisos sobre la TABLA (que operaciones puede hacer el rol)
--    Solo el rol "authenticated" (usuarios con sesion). "anon" no recibe nada.
grant select, insert, delete on public.libros to authenticated;

-- 3) RLS: control de acceso a las FILAS (que filas puede tocar el rol)
alter table public.libros enable row level security;

create policy "Autenticados pueden consultar libros"
  on public.libros for select
  to authenticated
  using (true);

create policy "Autenticados pueden agregar libros"
  on public.libros for insert
  to authenticated
  with check (true);

create policy "Autenticados pueden eliminar libros"
  on public.libros for delete
  to authenticated
  using (true);

-- 4) DATOS INICIALES DE EJEMPLO (opcional)
insert into public.libros (titulo, autor, anio) values
  ('Cien años de soledad', 'Gabriel García Márquez', 1967),
  ('1984', 'George Orwell', 1949);
