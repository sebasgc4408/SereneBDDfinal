-- Synthetic but business-realistic data for the Serene Supabase model.
-- Run this after 00_schema.sql.

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

insert into availability_rules (
  id,
  psychologist_id,
  day_of_week,
  start_time,
  end_time,
  slot_duration_minutes,
  break_minutes,
  modality,
  is_active
)
select
  concat('40000000-0000-0000-0000-', lpad(((p * 10) + d)::text, 12, '0'))::uuid,
  concat('10000000-0000-0000-0000-', lpad(p::text, 12, '0'))::uuid,
  d,
  case when p in (2, 5) then '08:00'::time else '09:00'::time end,
  case when p in (3, 6) then '18:00'::time else '17:00'::time end,
  case when p in (1, 4, 8) then 50 else 45 end,
  case when p in (2, 6) then 15 else 10 end,
  case
    when p in (3, 5) then 'hybrid'::session_modality
    when p = 6 then 'presential'::session_modality
    else 'virtual'::session_modality
  end,
  true
from generate_series(1, 8) as p
cross join generate_series(1, 5) as d;

insert into availability_rules (
  id,
  psychologist_id,
  day_of_week,
  start_time,
  end_time,
  slot_duration_minutes,
  break_minutes,
  modality,
  is_active
)
values
  ('40000000-0000-0000-0000-000000000901', '10000000-0000-0000-0000-000000000001', 6, '09:00', '13:00', 50, 10, 'virtual', true),
  ('40000000-0000-0000-0000-000000000902', '10000000-0000-0000-0000-000000000005', 6, '08:00', '12:00', 45, 10, 'hybrid', true);

insert into calendar_events (
  id,
  psychologist_id,
  google_event_id,
  title,
  start_at,
  end_at,
  event_type
)
select
  concat('50000000-0000-0000-0000-', lpad(gs::text, 12, '0'))::uuid,
  concat('10000000-0000-0000-0000-', lpad((((gs - 1) % 8) + 1)::text, 12, '0'))::uuid,
  'gcal_busy_' || gs,
  case when gs % 4 = 0 then 'Bloque administrativo' else 'Busy' end,
  '2026-05-26 08:00:00-05'::timestamptz
    + ((gs % 20) * interval '1 day')
    + (((gs % 7) + 1) * interval '1 hour'),
  '2026-05-26 09:00:00-05'::timestamptz
    + ((gs % 20) * interval '1 day')
    + (((gs % 7) + 1) * interval '1 hour'),
  'busy'
from generate_series(1, 160) as gs;

with generated as (
  select
    gs,
    (((gs - 1) % 8) + 1) as psychologist_number,
    (
      (((gs - 1) % 8) + 1)
      + 8 * ((gs - 1) % 30)
    ) as patient_number,
    '2026-04-01 08:00:00-05'::timestamptz
      + ((gs % 72) * interval '1 day')
      + (((gs % 8) + 1) * interval '1 hour') as start_at
  from generate_series(1, 900) as gs
),
prepared as (
  select
    g.gs,
    concat('10000000-0000-0000-0000-', lpad(g.psychologist_number::text, 12, '0'))::uuid as psychologist_id,
    concat('20000000-0000-0000-0000-', lpad(g.patient_number::text, 12, '0'))::uuid as patient_id,
    g.start_at,
    g.start_at + interval '50 minutes' as end_at,
    case
      when g.gs % 10 = 0 then 'cancelled'::appointment_status
      when g.gs % 13 = 0 then 'no_show'::appointment_status
      when g.start_at < '2026-05-23 00:00:00-05'::timestamptz then 'completed'::appointment_status
      else 'confirmed'::appointment_status
    end as status,
    case
      when g.gs % 5 = 0 then 'whatsapp'::booking_channel
      when g.gs % 7 = 0 then 'manual'::booking_channel
      when g.gs % 11 = 0 then 'email'::booking_channel
      else 'web'::booking_channel
    end as channel
  from generated g
)
insert into appointments (
  id,
  psychologist_id,
  patient_id,
  patient_name,
  patient_email,
  patient_phone,
  start_at,
  end_at,
  status,
  google_event_id,
  whatsapp_opt_in,
  reminder_sent,
  confirmed_via_whatsapp,
  no_show,
  completed_at,
  cancelled_at,
  cancel_reason,
  channel,
  created_at
)
select
  concat('30000000-0000-0000-0000-', lpad(p.gs::text, 12, '0'))::uuid,
  p.psychologist_id,
  p.patient_id,
  pat.name,
  pat.email,
  pat.phone,
  p.start_at,
  p.end_at,
  p.status,
  'gcal_appointment_' || p.gs,
  p.gs % 3 <> 0,
  p.start_at < '2026-05-23 00:00:00-05'::timestamptz and p.gs % 3 <> 0,
  p.gs % 4 = 0,
  p.status = 'no_show',
  case when p.status = 'completed' then p.end_at + interval '5 minutes' else null end,
  case when p.status = 'cancelled' then p.start_at - interval '1 day' else null end,
  case
    when p.status = 'cancelled' and p.gs % 20 = 0 then 'Paciente solicito reprogramar.'
    when p.status = 'cancelled' then 'Cancelacion por agenda personal.'
    else null
  end,
  p.channel,
  p.start_at - interval '9 days'
from prepared p
join patients pat on pat.id = p.patient_id;

with generated as (
  select
    gs,
    (((gs - 1) % 8) + 1) as psychologist_number,
    (
      (((gs - 1) % 8) + 1)
      + 8 * ((gs - 1) % 30)
    ) as patient_number,
    case
      when gs % 7 = 0 then 'rejected'::booking_request_status
      when gs % 11 = 0 then 'expired'::booking_request_status
      when gs % 3 = 0 then 'approved'::booking_request_status
      else 'pending'::booking_request_status
    end as status,
    case
      when gs % 4 = 0 then 'whatsapp'::booking_channel
      when gs % 9 = 0 then 'manual'::booking_channel
      else 'web'::booking_channel
    end as channel
  from generate_series(1, 320) as gs
)
insert into booking_requests (
  id,
  psychologist_id,
  patient_id,
  patient_name,
  patient_email,
  patient_phone,
  requested_date,
  requested_time,
  status,
  channel,
  appointment_id,
  created_at
)
select
  concat('60000000-0000-0000-0000-', lpad(g.gs::text, 12, '0'))::uuid,
  concat('10000000-0000-0000-0000-', lpad(g.psychologist_number::text, 12, '0'))::uuid,
  pat.id,
  pat.name,
  pat.email,
  pat.phone,
  ('2026-05-01'::date + ((g.gs % 45) * interval '1 day'))::date,
  ('08:00'::time + (((g.gs % 9) * 60) * interval '1 minute'))::time,
  g.status,
  g.channel,
  case
    when g.status = 'approved'
      then concat('30000000-0000-0000-0000-', lpad(g.gs::text, 12, '0'))::uuid
    else null
  end,
  '2026-04-20 08:00:00-05'::timestamptz + (g.gs * interval '3 hours')
from generated g
join patients pat
  on pat.id = concat('20000000-0000-0000-0000-', lpad(g.patient_number::text, 12, '0'))::uuid;

with source_appointments as (
  select
    row_number() over (order by start_at, id) as rn,
    id,
    psychologist_id,
    patient_id,
    end_at,
    status
  from appointments
  where status in ('completed', 'no_show')
  order by start_at, id
  limit 180
)
insert into follow_ups (
  id,
  appointment_id,
  psychologist_id,
  patient_id,
  notes,
  follow_up_at,
  created_at
)
select
  concat('70000000-0000-0000-0000-', lpad(rn::text, 12, '0'))::uuid,
  id,
  psychologist_id,
  patient_id,
  case
    when status = 'no_show' then 'Contactar para reagendar despues de inasistencia.'
    else 'Enviar resumen y revisar continuidad terapeutica.'
  end,
  end_at + interval '14 days',
  end_at + interval '1 day'
from source_appointments;
