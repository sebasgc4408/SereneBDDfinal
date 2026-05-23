-- Seed part 4 of 4.
-- Run after 03_appointments.sql. It loads booking requests and follow-ups.

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
