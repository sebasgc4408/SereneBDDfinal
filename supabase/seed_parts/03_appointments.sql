-- Seed part 3 of 4.
-- Run after 02_availability_calendar.sql. It loads appointments.

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
