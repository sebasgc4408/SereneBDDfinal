-- Consultas de negocio para la actividad final de DatAI.
-- Ejecutar despues de 00_schema.sql y 01_seed_data.sql.

-- 1. Indicadores ejecutivos por psicologo.
-- Pregunta de negocio: que profesionales tienen mejores indicadores de finalizacion y no-show?
select
  full_name,
  total_appointments,
  completed_appointments,
  cancelled_appointments,
  no_show_appointments,
  completion_rate,
  no_show_rate
from v_psychologist_kpis
order by total_appointments desc, completion_rate desc;

-- 2. Ocupacion semanal por psicologo usando disponibilidad vs minutos reservados.
-- Pregunta de negocio: que porcentaje de la agenda disponible esta siendo utilizado?
with params as (
  select date '2026-05-18' as week_start
),
available_minutes as (
  select
    p.id as psychologist_id,
    p.full_name,
    sum(extract(epoch from (ar.end_time - ar.start_time)) / 60) as available_minutes
  from psychologists p
  join availability_rules ar on ar.psychologist_id = p.id
  where ar.is_active
  group by p.id, p.full_name
),
booked_minutes as (
  select
    a.psychologist_id,
    sum(extract(epoch from (a.end_at - a.start_at)) / 60) as booked_minutes
  from appointments a
  cross join params pr
  where a.start_at >= pr.week_start
    and a.start_at < pr.week_start + interval '7 days'
    and a.status in ('confirmed', 'completed', 'no_show')
  group by a.psychologist_id
)
select
  am.full_name,
  am.available_minutes,
  coalesce(bm.booked_minutes, 0) as booked_minutes,
  round((100.0 * coalesce(bm.booked_minutes, 0) / nullif(am.available_minutes, 0))::numeric, 2) as occupancy_rate
from available_minutes am
left join booked_minutes bm on bm.psychologist_id = am.psychologist_id
order by occupancy_rate desc;

-- 3. Horarios de reserva mas solicitados por canal.
-- Pregunta de negocio: en que horas y canales los pacientes solicitan mas citas?
select
  requested_time,
  channel,
  count(*) as total_requests,
  count(*) filter (where status = 'approved') as approved_requests,
  round((100.0 * count(*) filter (where status = 'approved') / nullif(count(*), 0))::numeric, 2) as approval_rate
from booking_requests
group by requested_time, channel
order by total_requests desc, approval_rate desc
limit 15;

-- 4. Pacientes recurrentes e indicadores de satisfaccion.
-- Pregunta de negocio: que pacientes tienen sesiones recurrentes y mejor NPS?
select
  p.full_name as psychologist_name,
  pa.name as patient_name,
  pa.email,
  pa.nps_score,
  count(a.id) as appointment_count,
  max(a.start_at) as last_session_at
from patients pa
join psychologists p on p.id = pa.psychologist_id
left join appointments a on a.patient_id = pa.id
group by p.full_name, pa.name, pa.email, pa.nps_score
having count(a.id) >= 3
order by appointment_count desc, pa.nps_score desc nulls last
limit 20;

-- 5. Embudo de conversion desde solicitud hasta cita aprobada por canal.
-- Pregunta de negocio: que canal de captacion convierte mejor en citas reales?
with channel_funnel as (
  select
    channel,
    count(*) as total_requests,
    count(*) filter (where status = 'approved') as approved_requests,
    count(*) filter (where appointment_id is not null) as linked_appointments
  from booking_requests
  group by channel
)
select
  channel,
  total_requests,
  approved_requests,
  linked_appointments,
  round((100.0 * approved_requests / nullif(total_requests, 0))::numeric, 2) as approval_rate,
  round((100.0 * linked_appointments / nullif(total_requests, 0))::numeric, 2) as appointment_conversion_rate
from channel_funnel
order by appointment_conversion_rate desc;

-- 6. Ranking de riesgo operativo usando una window function.
-- Pregunta de negocio: que psicologos necesitan apoyo por no-shows o cancelaciones?
with risk_metrics as (
  select
    p.id,
    p.full_name,
    count(a.id) as total_appointments,
    count(*) filter (where a.status = 'cancelled') as cancellations,
    count(*) filter (where a.status = 'no_show' or a.no_show) as no_shows,
    (
      count(*) filter (where a.status = 'cancelled')
      + count(*) filter (where a.status = 'no_show' or a.no_show)
    )::numeric / nullif(count(a.id), 0) as risk_rate
  from psychologists p
  left join appointments a on a.psychologist_id = p.id
  group by p.id, p.full_name
)
select
  dense_rank() over (order by risk_rate desc nulls last) as risk_rank,
  full_name,
  total_appointments,
  cancellations,
  no_shows,
  round((100.0 * risk_rate)::numeric, 2) as risk_rate_percent
from risk_metrics
order by risk_rank, full_name;

-- 7. Posibles conflictos de calendario.
-- Pregunta de negocio: hay citas solapadas con bloques ocupados de Google Calendar?
select
  p.full_name as psychologist_name,
  a.patient_name,
  a.start_at as appointment_start,
  a.end_at as appointment_end,
  ce.title as busy_block_title,
  ce.start_at as busy_start,
  ce.end_at as busy_end
from appointments a
join psychologists p on p.id = a.psychologist_id
join calendar_events ce
  on ce.psychologist_id = a.psychologist_id
 and a.start_at < ce.end_at
 and a.end_at > ce.start_at
where a.status <> 'cancelled'
order by a.start_at
limit 25;

-- 8. Seguimientos pendientes.
-- Pregunta de negocio: que seguimientos estan pendientes y cuanta atencion requieren?
select
  p.full_name as psychologist_name,
  pa.name as patient_name,
  a.status as appointment_status,
  f.follow_up_at,
  f.notes,
  case
    when f.follow_up_at < '2026-06-01'::timestamptz then 'urgent'
    when f.follow_up_at < '2026-06-15'::timestamptz then 'soon'
    else 'scheduled'
  end as priority
from follow_ups f
join psychologists p on p.id = f.psychologist_id
left join patients pa on pa.id = f.patient_id
join appointments a on a.id = f.appointment_id
order by f.follow_up_at asc
limit 30;
