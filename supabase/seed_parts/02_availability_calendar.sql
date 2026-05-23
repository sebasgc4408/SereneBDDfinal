-- Seed part 2 of 4.
-- Run after 01_reset_core_data.sql. It loads availability rules and calendar busy blocks.

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
