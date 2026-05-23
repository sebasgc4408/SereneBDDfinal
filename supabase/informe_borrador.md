# Actividad Final DatAI

# Serene: base de datos para automatizar reservas en salud mental

**Plataforma elegida:** Supabase PostgreSQL  
**Repositorio:** https://github.com/sebasgc4408/SereneBDDfinal  
**Proyecto en Supabase:** pegar aquí el enlace o captura del panel  
**Integrantes:** pegar aquí los nombres del equipo

## 1. Introducción

Para esta actividad trabajamos sobre **Serene**, una idea de aplicación orientada a psicólogos independientes y pequeños consultorios de salud mental. El objetivo de Serene es reducir la carga administrativa que aparece alrededor de las citas: coordinar horarios, revisar disponibilidad, evitar cruces con el calendario, registrar pacientes, enviar recordatorios y hacer seguimiento después de una sesión.

Aunque la aplicación original tenía una interfaz y un backend basado en Convex, para la entrega final del curso decidimos aterrizar el proyecto en una plataforma del catálogo visto en clase. Por eso montamos una versión relacional de la base de datos en **Supabase PostgreSQL**. La meta fue que la base quedara desplegada, con datos cargados y con consultas capaces de responder preguntas reales del negocio.

En pocas palabras, el proyecto busca mostrar cómo una base de datos puede ayudar a que un psicólogo entienda mejor su agenda: qué tanto se usa su disponibilidad, qué canales generan más reservas, cuántos pacientes no asisten, qué citas requieren seguimiento y qué indicadores operativos se pueden mejorar.

## 2. Problema que resuelve

En una consulta psicológica pequeña, muchas tareas importantes no son clínicas, sino administrativas. Por ejemplo, confirmar citas, revisar si hay espacio disponible, atender solicitudes por diferentes canales, evitar choques con Google Calendar y recordar a los pacientes sus sesiones. Cuando estas tareas se manejan manualmente, es fácil que aparezcan errores, cancelaciones o tiempos muertos en la agenda.

Serene plantea una solución a ese problema. La plataforma centraliza la información de psicólogos, pacientes, disponibilidad, citas, solicitudes de reserva, integraciones y seguimientos. Con esa información organizada en una base de datos, el consultorio puede pasar de solo "guardar citas" a tomar decisiones: detectar horarios con alta demanda, medir la ocupación semanal, revisar no-shows y entender qué canal convierte mejor en citas reales.

Este caso nos pareció adecuado para la actividad porque tiene datos transaccionales claros, relaciones entre entidades y consultas con sentido de negocio. No se trata solo de crear tablas, sino de construir una base viva y consultable.

## 3. Por qué elegimos Supabase

Elegimos **Supabase PostgreSQL** porque Serene es un caso principalmente relacional. Un psicólogo tiene muchos pacientes, muchas citas, varias reglas de disponibilidad y diferentes eventos de calendario. A su vez, una cita puede estar asociada a un paciente, a una solicitud de reserva y a un seguimiento posterior. Este tipo de estructura encaja muy bien con PostgreSQL, porque permite usar llaves primarias, llaves foráneas, restricciones, índices y consultas SQL avanzadas.

Supabase también fue práctico para el alcance de la actividad. Permite crear una base en la nube desde el navegador, ejecutar scripts SQL en el editor, revisar tablas en el panel y tomar capturas fácilmente para la entrega. Además, al estar basado en PostgreSQL, permite hacer consultas con `joins`, agregaciones, CTEs y funciones de ventana.

Comparamos Supabase con otras dos plataformas del catálogo:

- **MongoDB Atlas:** es una buena opción cuando los datos son muy flexibles o documentales. Sin embargo, para Serene era importante conservar relaciones fuertes entre psicólogos, pacientes, citas y solicitudes. Por eso un modelo relacional era más conveniente.
- **BigQuery:** es excelente para analítica sobre grandes volúmenes de datos. Aun así, Serene necesitaba una base transaccional para registrar reservas y disponibilidad, no solo un almacén analítico. Para este caso, BigQuery hubiera sido más grande de lo necesario.

Por esas razones, Supabase fue una opción equilibrada: fácil de desplegar, permitida por el curso, relacional y suficientemente potente para responder las preguntas del proyecto.

## 4. Modelo de datos

El modelo de datos quedó organizado alrededor de ocho tablas principales. La idea fue separar con claridad las partes del negocio: por un lado los psicólogos y pacientes; por otro, la disponibilidad, las citas, las solicitudes de reserva, los eventos de calendario, las integraciones y los seguimientos.

Las tablas principales son:

- `psychologists`: almacena los psicólogos registrados, su correo, nombre, enlace público, zona horaria y estado general de integración.
- `patients`: guarda los pacientes asociados a cada psicólogo. Incluye datos de contacto, notas y un puntaje NPS opcional.
- `appointments`: registra las citas. Esta es una de las tablas centrales, porque permite saber si una cita fue confirmada, completada, cancelada o marcada como no-show.
- `availability_rules`: define los días, horas, duración de sesión, descansos y modalidad de atención de cada psicólogo.
- `calendar_events`: representa bloques ocupados importados desde Google Calendar. Sirve para evitar cruces con citas nuevas.
- `booking_requests`: guarda las solicitudes de reserva antes de convertirse en cita. Permite analizar canales como web, WhatsApp o manual.
- `follow_ups`: registra acciones posteriores a una cita, como seguimientos clínicos o contacto después de una inasistencia.
- `integrations`: resume el estado de conexiones externas, como Google Calendar, WhatsApp, email y Twilio.

El esquema usa llaves primarias tipo `uuid` y llaves foráneas para conectar las entidades. Por ejemplo, `patients`, `appointments`, `availability_rules`, `booking_requests`, `calendar_events`, `follow_ups` e `integrations` se relacionan con `psychologists`. Además, `appointments`, `booking_requests` y `follow_ups` pueden relacionarse con `patients`. Esta estructura hace posible consultar la operación completa de un psicólogo desde varios ángulos.

**Captura del esquema real en Supabase**

Pegar aquí la captura del diagrama del schema generado en Supabase. En esa imagen se deben ver las tablas `psychologists`, `patients`, `appointments`, `availability_rules`, `calendar_events`, `booking_requests`, `follow_ups` e `integrations`, junto con sus relaciones.

El modelo permite responder preguntas tanto operativas como analíticas. Por ejemplo, desde `appointments` se calculan tasas de finalización o no-show; desde `availability_rules` y `appointments` se mide la ocupación semanal; y desde `booking_requests` se analiza la conversión por canal.

## 5. Base desplegada y datos cargados

La base fue creada en Supabase y cargada con datos sintéticos. Usamos datos ficticios porque el tema de salud mental puede involucrar información sensible, y no era necesario usar datos reales para demostrar el modelo.

Los datos cargados fueron:

- 8 psicólogos.
- 240 pacientes.
- 42 reglas de disponibilidad.
- 160 eventos de calendario.
- 900 citas.
- 320 solicitudes de reserva.
- 180 seguimientos.
- 8 registros de integración.

Estos datos permiten simular el funcionamiento de Serene durante varias semanas y ejecutar consultas de negocio con resultados variados.

**Captura sugerida:** pegar aquí la captura del conteo de tablas en Supabase.

## 6. Consultas de negocio

El archivo `02_business_queries.sql` contiene las consultas usadas para analizar la base. A continuación se resumen las más importantes.

### 6.1 KPIs por psicólogo

Esta consulta compara a los psicólogos según total de citas, citas completadas, cancelaciones, no-shows, tasa de finalización y tasa de no-show. Es útil porque permite ver rápidamente qué profesionales tienen una agenda más estable y cuáles pueden necesitar apoyo operativo.

**Interpretación:** si un psicólogo tiene muchas citas pero una tasa alta de no-show, Serene podría reforzar recordatorios o revisar los horarios más conflictivos.

**Captura sugerida:** pegar aquí la captura de la consulta de KPIs.

### 6.2 Ocupación semanal de agenda

Esta consulta compara los minutos disponibles configurados por cada psicólogo contra los minutos efectivamente reservados en una semana. Sirve para medir qué tanto se está usando la capacidad real de atención.

**Interpretación:** una ocupación baja puede indicar que hay demasiados espacios disponibles, poca demanda o problemas de visibilidad del enlace de reserva.

**Captura sugerida:** pegar aquí la captura de ocupación semanal.

### 6.3 Horarios más solicitados por canal

Esta consulta muestra qué horarios tienen más solicitudes y desde qué canal llegan. Esto ayuda a entender los momentos de mayor demanda y a ajustar disponibilidad o comunicación.

**Interpretación:** si ciertos horarios concentran solicitudes aprobadas, el psicólogo podría abrir más espacios en esos bloques.

**Captura sugerida:** pegar aquí la captura de horarios y canales.

### 6.4 Conversión por canal

Esta consulta analiza el embudo desde solicitud hasta cita aprobada, agrupando por canal. Permite comparar web, WhatsApp y canal manual.

**Interpretación:** si un canal tiene alta conversión, vale la pena fortalecerlo. Si otro tiene muchas solicitudes pero pocas citas aprobadas, puede haber fricción en el proceso.

**Captura sugerida:** pegar aquí la captura de conversión por canal.

### 6.5 Ranking de riesgo operativo

Esta consulta usa una función de ventana (`dense_rank`) para ordenar a los psicólogos según una tasa de riesgo basada en cancelaciones y no-shows.

**Interpretación:** el ranking permite priorizar intervenciones. Por ejemplo, mejorar recordatorios, revisar horarios o hacer seguimiento a pacientes que faltan con frecuencia.

**Captura sugerida:** pegar aquí la captura del ranking de riesgo.

### 6.6 Seguimientos pendientes

Esta consulta muestra tareas de seguimiento después de citas completadas o no-shows. Incluye una prioridad calculada para identificar qué acciones requieren atención más pronto.

**Interpretación:** ayuda a que el consultorio no pierda continuidad con los pacientes y mantenga un flujo de atención más ordenado.

**Captura sugerida:** pegar aquí la captura de seguimientos pendientes.

## 7. Qué fue práctico y qué fue difícil

Lo más práctico fue trabajar con Supabase desde el navegador. Crear el proyecto, ejecutar SQL y revisar los resultados fue directo. También ayudó que PostgreSQL tenga una sintaxis conocida y permita construir consultas bastante expresivas sin herramientas adicionales.

La parte más difícil fue traducir el modelo original de la aplicación a un diseño relacional. En Convex, varias entidades estaban pensadas como documentos y funciones. En PostgreSQL fue necesario separar mejor las responsabilidades: pacientes por un lado, citas por otro, disponibilidad, solicitudes e integraciones en tablas independientes. Ese proceso obligó a pensar con más cuidado las relaciones, las restricciones y los tipos de datos.

Otro reto fue preparar datos sintéticos que fueran suficientemente realistas. No bastaba con insertar filas vacías; los datos debían permitir preguntas útiles, como conversión, ocupación y no-show.

## 8. Uso de IA generativa

Se usó IA generativa como apoyo durante el desarrollo del trabajo. La IA ayudó a revisar el repositorio original, identificar las entidades principales, proponer el modelo relacional, escribir los scripts SQL, generar datos sintéticos y redactar una primera versión del informe.

El uso de IA no reemplazó la toma de decisiones del grupo. La elección de Supabase, la validación en la plataforma, las capturas y la interpretación del caso se hicieron de acuerdo con los requisitos de la actividad.

## 9. Conclusiones

Este proyecto muestra cómo una base de datos puede convertirse en una herramienta de gestión para un problema real. En el caso de Serene, la base no solo guarda citas, sino que ayuda a entender la operación de una consulta psicológica: ocupación, demanda, conversión, seguimiento y riesgo operativo.

Supabase PostgreSQL fue una buena elección porque permitió desplegar la base rápidamente y conservar un modelo relacional claro. Además, las consultas SQL permitieron responder preguntas de negocio sin depender de una interfaz gráfica compleja.

Como resultado final, la base quedó desplegada, cargada con datos sintéticos y lista para ser consultada durante la revisión. El ejercicio también ayudó a conectar varios temas del curso: modelado de datos, integridad referencial, consultas analíticas, despliegue en la nube y criterio para elegir una plataforma según el problema.