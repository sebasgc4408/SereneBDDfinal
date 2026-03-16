Actúa como un Ingeniero de Software Senior y Diseñador UX/UI experto en desarrollo de SaaS premium. 

# Contexto del Producto: "Serene"
Estamos construyendo "Serene", un frontend SaaS para psicólogos independientes. El objetivo es crear una experiencia de agendamiento y coordinación de citas que tenga "cero fricción" técnica, automatizando la recepción de pacientes.

**La directriz creativa es estricta:** La interfaz NO debe sentirse como un dashboard B2B genérico, ni como un CRM corporativo. Debe sentirse como una mezcla entre "consumer-grade calm" y "clinical-grade trust" (similar a la sensación psicológica de Headspace, pero más sobria y profesional). 
- **Paleta:** Off-whites cálidos (`bg-[#FAFAF9]`), blanco puro para tarjetas, textos en gris oscuro/tibio (`#292524`, `#78716C`), y acentos en verde salvia (`#788B80`).
- **Tipografía:** Grotesca/Geométrica limpia, pesos ligeros (`font-light`), mucho interlineado (`leading-relaxed`) y separaciones amplias.
- **Geometría:** Bordes muy redondeados (`rounded-2xl`, `rounded-[24px]`, `rounded-[32px]`), sombras sumamente sutiles y muchísimo espacio negativo (aire) para evitar la carga cognitiva.

# Tech Stack Actual
- **Framework:** Next.js 16 (App Router) con TypeScript.
- **Styling:** Tailwind CSS v4 + Vanilla CSS modules.
- **Animaciones:** Framer Motion (para transiciones suaves, fade-ins y layouts fluidos).
- **Autenticación:** Clerk.
- **Backend & DB:** Convex (Real-time backend, mutaciones, queries, crons y HTTP endpoints).
- **Testing:** Vitest + React Testing Library (TDD approach).

# Estado Actual del Proyecto
Ya hemos implementado el núcleo del sistema con sus respectivos tests:
1. **Flujo B2B:** Pantalla de Bienvenida, Onboarding para conectar Google Calendar, y un Dashboard Operativo (`Dashboard.tsx`) que muestra citas y el estado de la integración en una barra lateral (`IntegrationStatus.tsx`).
2. **Flujo Público (Pacientes):** Una página de agendamiento distraction-free (`BookingPage.tsx`) y un formulario de ingreso (`PatientIntakeForm.tsx`) que guarda las citas en la tabla `appointments` en Convex.
3. **Marketing:** Una página de Pricing con layout asimétrico (Bento Grid) de alta conversión.

# Tu Misión: Integración de WhatsApp como "Asistente Clínico"
Quiero que diseñes e implementes la integración con WhatsApp. El objetivo no es hacer marketing ruidoso, sino crear un "Asistente Clínico Invisible" que envíe confirmaciones, recordatorios para evitar *no-shows*, y permita cancelar sin fricción.

## 1. Arquitectura Backend requerida (Convex + WhatsApp Cloud API de Meta)
- **Salida (Actions):** Crea una Convex Action (`sendWhatsAppMessage`). Cuando la mutación `createAppointment` termine, usa `ctx.scheduler.runAfter` para encolar la confirmación inmediata.
- **Recordatorios (Crons):** Configura un cron en Convex (`convex/crons.ts`) que revise la tabla `appointments` y dispare mensajes para las citas que ocurran en exactamente 24 horas.
- **Entrada (Webhooks):** El mensaje de recordatorio de WhatsApp tendrá botones interactivos (Ej: [Confirmar] o [Cancelar]). Crea un `convex/http.ts` para recibir los webhooks de Meta, identificar si el paciente canceló, y ejecutar una mutación interna que actualice el `status` a `Cancelled` en nuestra base de datos.

## 2. Actualizaciones de UI (Manteniendo la estética Serene)
- **En `PatientIntakeForm.tsx`:** Actualiza el input de "Phone Number" para asegurar que capture obligatoriamente el código de país internacional (necesario para la API de Meta). Añade un checkbox visualmente muy sutil (estilo Serene) que diga: *"Send my booking details and reminders via WhatsApp"*.
- **En `IntegrationStatus.tsx`:** En la columna lateral del Dashboard del psicólogo, añade una nueva tarjeta debajo de la de Google Calendar. Debe mantener exactamente el mismo layout estructurado (ícono a la izquierda, título, status, botón de disconnect) pero enfocado en WhatsApp. El texto de "Permission Clarity" debe decir: *"We handle the reminders. We never send promotional messages, only strict clinical confirmations."*

## Entregables esperados:
1. **Análisis:** Confirma que entiendes el stack y el enfoque visual.
2. **TDD Primero:** Proporciona los tests de Vitest para los cambios en la UI y la nueva lógica de Convex.
3. **Implementación:** Escribe el código de los componentes UI modificados y los archivos de Convex (`schema.ts` si hay cambios, `http.ts`, `crons.ts`, y las nuevas actions).

Por favor, preséntame tu plan de ataque paso a paso para comenzar.