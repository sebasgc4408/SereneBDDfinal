# Actividad Final DatAI

# Serene: base de datos para automatizar reservas en salud mental

**Plataforma elegida:** Supabase PostgreSQL  
**Repositorio:** https://github.com/sebasgc4408/SereneBDDfinal  
**Proyecto en Supabase:** pegar aqui el enlace o captura del panel  
**Integrantes:** pegar aqui los nombres del equipo

## 1. Introduccion

Para esta actividad trabajamos sobre **Serene**, una idea de aplicacion orientada a psicologos independientes y pequenos consultorios de salud mental. El objetivo de Serene es reducir la carga administrativa que aparece alrededor de las citas: coordinar horarios, revisar disponibilidad, evitar cruces con el calendario, registrar pacientes, enviar recordatorios y hacer seguimiento despues de una sesion.

Aunque la aplicacion original tenia una interfaz y un backend basado en Convex, para la entrega final del curso decidimos aterrizar el proyecto en una plataforma del catalogo visto en clase. Por eso montamos una version relacional de la base de datos en **Supabase PostgreSQL**. La meta fue que la base quedara desplegada, con datos cargados y con consultas capaces de responder preguntas reales del negocio.

En pocas palabras, el proyecto busca mostrar como una base de datos puede ayudar a que un psicologo entienda mejor su agenda: que tanto se usa su disponibilidad, que canales generan mas reservas, cuantos pacientes no asisten, que citas requieren seguimiento y que indicadores operativos se pueden mejorar.

## 2. Problema que resuelve

En una consulta psicologica pequena, muchas tareas importantes no son clinicas, sino administrativas. Por ejemplo, confirmar citas, revisar si hay espacio disponible, atender solicitudes por diferentes canales, evitar choques con Google Calendar y recordar a los pacientes sus sesiones. Cuando estas tareas se manejan manualmente, es facil que aparezcan errores, cancelaciones o tiempos muertos en la agenda.

Serene plantea una solucion a ese problema. La plataforma centraliza la informacion de psicologos, pacientes, disponibilidad, citas, solicitudes de reserva, integraciones y seguimientos. Con esa informacion organizada en una base de datos, el consultorio puede pasar de solo "guardar citas" a tomar decisiones: detectar horarios con alta demanda, medir la ocupacion semanal, revisar no-shows y entender que canal convierte mejor en citas reales.

Este caso nos parecio adecuado para la actividad porque tiene datos transaccionales claros, relaciones entre entidades y consultas con sentido de negocio. No se trata solo de crear tablas, sino de construir una base viva y consultable.

## 3. Por que elegimos Supabase

Elegimos **Supabase PostgreSQL** porque Serene es un caso principalmente relacional. Un psicologo tiene muchos pacientes, muchas citas, varias reglas de disponibilidad y diferentes eventos de calendario. A su vez, una cita puede estar asociada a un paciente, a una solicitud de reserva y a un seguimiento posterior. Este tipo de estructura encaja muy bien con PostgreSQL, porque permite usar llaves primarias, llaves foraneas, restricciones, indices y consultas SQL avanzadas.

Supabase tambien fue practico para el alcance de la actividad. Permite crear una base en la nube desde el navegador, ejecutar scripts SQL en el editor, revisar tablas en el panel y tomar capturas facilmente para la entrega. Ademas, al estar basado en PostgreSQL, permite hacer consultas con `joins`, agregaciones, CTEs y funciones de ventana.

Comparamos Supabase con otras dos plataformas del catalogo:

- **MongoDB Atlas:** es una buena opcion cuando los datos son muy flexibles o documentales. Sin embargo, para Serene era importante conservar relaciones fuertes entre psicologos, pacientes, citas y solicitudes. Por eso un modelo relacional era mas conveniente.
- **BigQuery:** es excelente para analitica sobre grandes volumenes de datos. Aun asi, Serene necesitaba una base transaccional para registrar reservas y disponibilidad, no solo un almacen analitico. Para este caso, BigQuery hubiera sido mas grande de lo necesario.

Por esas razones, Supabase fue una opcion equilibrada: facil de desplegar, permitida por el curso, relacional y suficientemente potente para responder las preguntas del proyecto.

## 4. Modelo de datos

El modelo de datos quedo organizado alrededor de ocho tablas principales. La idea fue separar con claridad las partes del negocio: por un lado los psicologos y pacientes; por otro, la disponibilidad, las citas, las solicitudes de reserva, los eventos de calendario, las integraciones y los seguimientos.

Las tablas principales son:

- `psychologists`: almacena los psicologos registrados, su correo, nombre, enlace publico, zona horaria y estado general de integracion.
- `patients`: guarda los pacientes asociados a cada psicologo. Incluye datos de contacto, notas y un puntaje NPS opcional.
- `appointments`: registra las citas. Esta es una de las tablas centrales, porque permite saber si una cita fue confirmada, completada, cancelada o marcada como no-show.
- `availability_rules`: define los dias, horas, duracion de sesion, descansos y modalidad de atencion de cada psicologo.
- `calendar_events`: representa bloques ocupados importados desde Google Calendar. Sirve para evitar cruces con citas nuevas.
- `booking_requests`: guarda las solicitudes de reserva antes de convertirse en cita. Permite analizar canales como web, WhatsApp o manual.
- `follow_ups`: registra acciones posteriores a una cita, como seguimientos clinicos o contacto despues de una inasistencia.
- `integrations`: resume el estado de conexiones externas, como Google Calendar, WhatsApp, email y Twilio.

El esquema usa llaves primarias tipo `uuid` y llaves foraneas para conectar las entidades. Por ejemplo, `patients`, `appointments`, `availability_rules`, `booking_requests`, `calendar_events`, `follow_ups` e `integrations` se relacionan con `psychologists`. Ademas, `appointments`, `booking_requests` y `follow_ups` pueden relacionarse con `patients`. Esta estructura hace posible consultar la operacion completa de un psicologo desde varios angulos.

**Captura del esquema real en Supabase**

Pegar aqui la captura del diagrama del schema generado en Supabase. En esa imagen se deben ver las tablas `psychologists`, `patients`, `appointments`, `availability_rules`, `calendar_events`, `booking_requests`, `follow_ups` e `integrations`, junto con sus relaciones.

El modelo permite responder preguntas tanto operativas como analiticas. Por ejemplo, desde `appointments` se calculan tasas de finalizacion o no-show; desde `availability_rules` y `appointments` se mide la ocupacion semanal; y desde `booking_requests` se analiza la conversion por canal.

## 5. Base desplegada y datos cargados

La base fue creada en Supabase y cargada con datos sinteticos. Usamos datos ficticios porque el tema de salud mental puede involucrar informacion sensible, y no era necesario usar datos reales para demostrar el modelo.

Los datos cargados fueron:

- 8 psicologos.
- 240 pacientes.
- 42 reglas de disponibilidad.
- 160 eventos de calendario.
- 900 citas.
- 320 solicitudes de reserva.
- 180 seguimientos.
- 8 registros de integracion.

Estos datos permiten simular el funcionamiento de Serene durante varias semanas y ejecutar consultas de negocio con resultados variados.

**Captura sugerida:** pegar aqui la captura del conteo de tablas en Supabase.

## 6. Consultas de negocio

El archivo `02_business_queries.sql` contiene las consultas usadas para analizar la base. A continuacion se resumen las mas importantes.

### 6.1 KPIs por psicologo

Esta consulta compara a los psicologos segun total de citas, citas completadas, cancelaciones, no-shows, tasa de finalizacion y tasa de no-show. Es util porque permite ver rapidamente que profesionales tienen una agenda mas estable y cuales pueden necesitar apoyo operativo.

**Interpretacion:** si un psicologo tiene muchas citas pero una tasa alta de no-show, Serene podria reforzar recordatorios o revisar los horarios mas conflictivos.

**Captura sugerida:** pegar aqui la captura de la consulta de KPIs.

### 6.2 Ocupacion semanal de agenda

Esta consulta compara los minutos disponibles configurados por cada psicologo contra los minutos efectivamente reservados en una semana. Sirve para medir que tanto se esta usando la capacidad real de atencion.

**Interpretacion:** una ocupacion baja puede indicar que hay demasiados espacios disponibles, poca demanda o problemas de visibilidad del enlace de reserva.

**Captura sugerida:** pegar aqui la captura de ocupacion semanal.

### 6.3 Horarios mas solicitados por canal

Esta consulta muestra que horarios tienen mas solicitudes y desde que canal llegan. Esto ayuda a entender los momentos de mayor demanda y a ajustar disponibilidad o comunicacion.

**Interpretacion:** si ciertos horarios concentran solicitudes aprobadas, el psicologo podria abrir mas espacios en esos bloques.

**Captura sugerida:** pegar aqui la captura de horarios y canales.

### 6.4 Conversion por canal

Esta consulta analiza el embudo desde solicitud hasta cita aprobada, agrupando por canal. Permite comparar web, WhatsApp y canal manual.

**Interpretacion:** si un canal tiene alta conversion, vale la pena fortalecerlo. Si otro tiene muchas solicitudes pero pocas citas aprobadas, puede haber friccion en el proceso.

**Captura sugerida:** pegar aqui la captura de conversion por canal.

### 6.5 Ranking de riesgo operativo

Esta consulta usa una funcion de ventana (`dense_rank`) para ordenar a los psicologos segun una tasa de riesgo basada en cancelaciones y no-shows.

**Interpretacion:** el ranking permite priorizar intervenciones. Por ejemplo, mejorar recordatorios, revisar horarios o hacer seguimiento a pacientes que faltan con frecuencia.

**Captura sugerida:** pegar aqui la captura del ranking de riesgo.

### 6.6 Seguimientos pendientes

Esta consulta muestra tareas de seguimiento despues de citas completadas o no-shows. Incluye una prioridad calculada para identificar que acciones requieren atencion mas pronto.

**Interpretacion:** ayuda a que el consultorio no pierda continuidad con los pacientes y mantenga un flujo de atencion mas ordenado.

**Captura sugerida:** pegar aqui la captura de seguimientos pendientes.

## 7. Que fue practico y que fue dificil

Lo mas practico fue trabajar con Supabase desde el navegador. Crear el proyecto, ejecutar SQL y revisar los resultados fue directo. Tambien ayudo que PostgreSQL tenga una sintaxis conocida y permita construir consultas bastante expresivas sin herramientas adicionales.

La parte mas dificil fue traducir el modelo original de la aplicacion a un diseno relacional. En Convex, varias entidades estaban pensadas como documentos y funciones. En PostgreSQL fue necesario separar mejor las responsabilidades: pacientes por un lado, citas por otro, disponibilidad, solicitudes e integraciones en tablas independientes. Ese proceso obligo a pensar con mas cuidado las relaciones, las restricciones y los tipos de datos.

Otro reto fue preparar datos sinteticos que fueran suficientemente realistas. No bastaba con insertar filas vacias; los datos debian permitir preguntas utiles, como conversion, ocupacion y no-show.

## 8. Uso de IA generativa

Se uso IA generativa como apoyo durante el desarrollo del trabajo. La IA ayudo a revisar el repositorio original, identificar las entidades principales, proponer el modelo relacional, escribir los scripts SQL, generar datos sinteticos y redactar una primera version del informe.

El uso de IA no reemplazo la toma de decisiones del grupo. La eleccion de Supabase, la validacion en la plataforma, las capturas y la interpretacion del caso se hicieron de acuerdo con los requisitos de la actividad.

## 9. Conclusiones

Este proyecto muestra como una base de datos puede convertirse en una herramienta de gestion para un problema real. En el caso de Serene, la base no solo guarda citas, sino que ayuda a entender la operacion de una consulta psicologica: ocupacion, demanda, conversion, seguimiento y riesgo operativo.

Supabase PostgreSQL fue una buena eleccion porque permitio desplegar la base rapidamente y conservar un modelo relacional claro. Ademas, las consultas SQL permitieron responder preguntas de negocio sin depender de una interfaz grafica compleja.

Como resultado final, la base quedo desplegada, cargada con datos sinteticos y lista para ser consultada durante la revision. El ejercicio tambien ayudo a conectar varios temas del curso: modelado de datos, integridad referencial, consultas analiticas, despliegue en la nube y criterio para elegir una plataforma segun el problema.