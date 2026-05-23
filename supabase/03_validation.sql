-- Quick validation checks after running schema and seed data.

select 'psychologists' as table_name, count(*) as total_rows from psychologists
union all
select 'patients', count(*) from patients
union all
select 'availability_rules', count(*) from availability_rules
union all
select 'calendar_events', count(*) from calendar_events
union all
select 'appointments', count(*) from appointments
union all
select 'booking_requests', count(*) from booking_requests
union all
select 'follow_ups', count(*) from follow_ups
union all
select 'integrations', count(*) from integrations
order by table_name;

select
  full_name,
  total_appointments,
  completion_rate,
  no_show_rate
from v_psychologist_kpis
order by total_appointments desc
limit 5;
