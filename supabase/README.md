# Serene en Supabase

Esta carpeta contiene la migracion academica de Serene a Supabase/PostgreSQL para la actividad final de DatAI.

## Que incluye

- `00_schema.sql`: crea el modelo relacional en PostgreSQL.
- `01_seed_data.sql`: carga datos sinteticos de psicologos, pacientes, disponibilidad, citas, solicitudes, eventos y seguimientos.
- `02_business_queries.sql`: contiene consultas de negocio para la entrega.
- `03_validation.sql`: valida conteos y KPIs basicos despues de cargar datos.
- `migrations/`: copias versionadas del esquema y seed para repos conectados con Supabase.
- `seed_parts/`: version dividida del seed para ejecutarlo por partes en el SQL Editor.
- `../informe_proyecto.md`: informe final del proyecto.

## Orden de ejecucion

1. Crear un proyecto nuevo en [Supabase](https://supabase.com).
2. Abrir `SQL Editor`.
3. Ejecutar `00_schema.sql`.
4. Ejecutar `01_seed_data.sql`.
5. Ejecutar `03_validation.sql` para verificar conteos.
6. Ejecutar `02_business_queries.sql` para validar las preguntas de negocio.

Si el `SQL Editor` ejecuta solo una seleccion parcial o da error de `syntax error at end of input`, usa los archivos divididos en este orden:

1. `seed_parts/01_reset_core_data.sql`
2. `seed_parts/02_availability_calendar.sql`
3. `seed_parts/03_appointments.sql`
4. `seed_parts/04_requests_followups.sql`
5. `03_validation.sql`

## Si conectaste el repo con Supabase

Supabase detecta migraciones versionadas dentro de `supabase/migrations/`. Esta carpeta ya contiene:

- `20260523000100_serene_schema.sql`
- `20260523000200_serene_seed_data.sql`

Si el panel no aplica migraciones automaticamente, usa el `SQL Editor` y ejecuta los archivos manuales en el orden indicado arriba. Para la entrega academica, lo importante es que las tablas existan, los datos esten cargados y las consultas se puedan ejecutar durante la revision.

## Plataforma elegida

La plataforma recomendada para la entrega es **Supabase PostgreSQL** porque:

- pertenece al catalogo permitido de la actividad;
- usa PostgreSQL, ideal para datos relacionales;
- permite ejecutar SQL real con joins, agregaciones, CTEs y window functions;
- tiene una interfaz web facil de verificar por el profesor;
- permite exportar capturas y compartir acceso de lectura.

## Datos cargados

El script de datos crea aproximadamente:

- 8 psicologos;
- 240 pacientes;
- 42 reglas de disponibilidad;
- 160 bloques ocupados de Google Calendar;
- 900 citas;
- 320 solicitudes de reserva;
- 180 seguimientos clinicos;
- 8 estados de integracion.

## Acceso para la entrega

Para el informe, agrega aqui los datos reales del proyecto Supabase cuando lo crees:

- URL del proyecto:
- Region:
- Metodo de verificacion: captura del panel, usuario invitado o credenciales de solo lectura.
- Usuario de solo lectura:
- Notas de acceso:

No subas la `service_role key` al repositorio ni al entregable.

## Preguntas de negocio cubiertas

Las consultas incluidas responden, entre otras, estas preguntas:

- Que psicologos tienen mejores tasas de finalizacion y no-show?
- Cuanta ocupacion tiene la agenda semanal de cada profesional?
- Cuales horarios y canales generan mas solicitudes?
- Que pacientes son recurrentes y tienen mejor NPS?
- Que canal convierte mejor solicitudes en citas reales?
- Que profesionales presentan mayor riesgo operativo?
- Existen conflictos entre citas y bloques ocupados del calendario?
- Que seguimientos clinicos estan pendientes?
