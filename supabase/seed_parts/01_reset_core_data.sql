-- Seed part 1 of 4.
-- Run this first. It resets all data and loads psychologists, integrations, and patients.

truncate
  follow_ups,
  booking_requests,
  appointments,
  calendar_events,
  availability_rules,
  integrations,
  patients,
  psychologists
restart identity cascade;

insert into psychologists (
  id,
  email,
  full_name,
  public_slug,
  timezone,
  integration_status,
  google_calendar_connected,
  whatsapp_enabled,
  created_at
)
values
  ('10000000-0000-0000-0000-000000000001', 'ana.ruiz@serene-demo.com', 'Ana Ruiz', 'ana-ruiz', 'America/Bogota', 'connected', true, true, '2026-01-10 09:00:00-05'),
  ('10000000-0000-0000-0000-000000000002', 'mateo.gomez@serene-demo.com', 'Mateo Gomez', 'mateo-gomez', 'America/Bogota', 'connected', true, true, '2026-01-12 10:30:00-05'),
  ('10000000-0000-0000-0000-000000000003', 'valentina.mora@serene-demo.com', 'Valentina Mora', 'valentina-mora', 'America/Bogota', 'connected', true, true, '2026-01-14 08:45:00-05'),
  ('10000000-0000-0000-0000-000000000004', 'santiago.leon@serene-demo.com', 'Santiago Leon', 'santiago-leon', 'America/Bogota', 'connected', true, false, '2026-01-18 14:20:00-05'),
  ('10000000-0000-0000-0000-000000000005', 'camila.torres@serene-demo.com', 'Camila Torres', 'camila-torres', 'America/Bogota', 'connected', true, true, '2026-01-20 09:10:00-05'),
  ('10000000-0000-0000-0000-000000000006', 'laura.mejia@serene-demo.com', 'Laura Mejia', 'laura-mejia', 'America/Bogota', 'connected', true, true, '2026-01-24 11:00:00-05'),
  ('10000000-0000-0000-0000-000000000007', 'daniel.arias@serene-demo.com', 'Daniel Arias', 'daniel-arias', 'America/Bogota', 'pending', false, true, '2026-02-02 13:40:00-05'),
  ('10000000-0000-0000-0000-000000000008', 'mariana.velez@serene-demo.com', 'Mariana Velez', 'mariana-velez', 'America/Bogota', 'connected', true, true, '2026-02-08 15:15:00-05');

insert into integrations (
  id,
  psychologist_id,
  google_calendar_connected,
  whatsapp_connected,
  email_connected,
  twilio_configured,
  last_calendar_sync_at,
  created_at
)
select
  concat('11000000-0000-0000-0000-', lpad(row_number() over (order by id)::text, 12, '0'))::uuid,
  id,
  google_calendar_connected,
  whatsapp_enabled and id <> '10000000-0000-0000-0000-000000000004',
  true,
  whatsapp_enabled,
  case
    when google_calendar_connected then '2026-05-22 18:00:00-05'::timestamptz
    else null
  end,
  created_at
from psychologists;

insert into patients (
  id,
  psychologist_id,
  name,
  email,
  phone,
  notes,
  nps_score,
  created_at
)
select
  concat('20000000-0000-0000-0000-', lpad(gs::text, 12, '0'))::uuid,
  concat('10000000-0000-0000-0000-', lpad((((gs - 1) % 8) + 1)::text, 12, '0'))::uuid,
  (array[
    'Sofia Ramirez',
    'Juan Martinez',
    'Lucia Castro',
    'Nicolas Herrera',
    'Isabella Rojas',
    'Andres Vargas',
    'Manuela Pardo',
    'Felipe Cardenas',
    'Gabriela Salazar',
    'Tomas Restrepo'
  ])[((gs - 1) % 10) + 1] || ' ' || gs,
  'paciente' || gs || '@demo-serene.com',
  '+57' || (3000000000 + gs)::text,
  case
    when gs % 11 = 0 then 'Paciente recurrente con preferencia por sesiones virtuales.'
    when gs % 7 = 0 then 'Requiere seguimiento posterior a la sesion.'
    else 'Paciente creado para analisis academico.'
  end,
  case when gs % 6 = 0 then null else 6 + (gs % 5) end,
  '2026-02-01 08:00:00-05'::timestamptz + (gs * interval '8 hours')
from generate_series(1, 240) as gs;
