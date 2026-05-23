-- Serene academic migration to Supabase/PostgreSQL.
-- Run this file first in the Supabase SQL Editor.
-- It recreates the relational model used for the DatAI final assignment.

create extension if not exists pgcrypto;

drop view if exists v_psychologist_kpis;
drop view if exists v_appointment_details;

drop table if exists follow_ups cascade;
drop table if exists booking_requests cascade;
drop table if exists appointments cascade;
drop table if exists calendar_events cascade;
drop table if exists availability_rules cascade;
drop table if exists integrations cascade;
drop table if exists patients cascade;
drop table if exists psychologists cascade;

drop type if exists appointment_status cascade;
drop type if exists booking_request_status cascade;
drop type if exists booking_channel cascade;
drop type if exists integration_status cascade;
drop type if exists session_modality cascade;

create type integration_status as enum ('pending', 'connected', 'disconnected', 'error');
create type appointment_status as enum ('confirmed', 'completed', 'cancelled', 'no_show');
create type booking_request_status as enum ('pending', 'approved', 'rejected', 'expired');
create type booking_channel as enum ('web', 'whatsapp', 'manual', 'email');
create type session_modality as enum ('virtual', 'presential', 'hybrid');

create table psychologists (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  public_slug text not null unique,
  timezone text not null default 'America/Bogota',
  integration_status integration_status not null default 'pending',
  google_calendar_connected boolean not null default false,
  whatsapp_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table patients (
  id uuid primary key default gen_random_uuid(),
  psychologist_id uuid not null references psychologists(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  notes text,
  nps_score integer check (nps_score between 0 and 10),
  created_at timestamptz not null default now(),
  unique (psychologist_id, email)
);

create table integrations (
  id uuid primary key default gen_random_uuid(),
  psychologist_id uuid not null unique references psychologists(id) on delete cascade,
  google_calendar_connected boolean not null default false,
  whatsapp_connected boolean not null default false,
  email_connected boolean not null default false,
  twilio_configured boolean not null default false,
  last_calendar_sync_at timestamptz,
  created_at timestamptz not null default now()
);

create table availability_rules (
  id uuid primary key default gen_random_uuid(),
  psychologist_id uuid not null references psychologists(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_duration_minutes integer not null default 50 check (slot_duration_minutes > 0),
  break_minutes integer not null default 10 check (break_minutes >= 0),
  modality session_modality not null default 'virtual',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (start_time < end_time),
  unique (psychologist_id, day_of_week, start_time, end_time)
);

create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  psychologist_id uuid not null references psychologists(id) on delete cascade,
  google_event_id text not null,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  event_type text not null default 'busy' check (event_type in ('busy', 'appointment')),
  created_at timestamptz not null default now(),
  check (start_at < end_at),
  unique (psychologist_id, google_event_id)
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  psychologist_id uuid not null references psychologists(id) on delete cascade,
  patient_id uuid references patients(id) on delete set null,
  patient_name text not null,
  patient_email text not null,
  patient_phone text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status appointment_status not null default 'confirmed',
  google_event_id text,
  whatsapp_opt_in boolean not null default false,
  reminder_sent boolean not null default false,
  confirmed_via_whatsapp boolean not null default false,
  no_show boolean not null default false,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  channel booking_channel not null default 'web',
  created_at timestamptz not null default now(),
  check (start_at < end_at)
);

create table booking_requests (
  id uuid primary key default gen_random_uuid(),
  psychologist_id uuid not null references psychologists(id) on delete cascade,
  patient_id uuid references patients(id) on delete set null,
  patient_name text not null,
  patient_email text not null,
  patient_phone text,
  requested_date date not null,
  requested_time time not null,
  status booking_request_status not null default 'pending',
  channel booking_channel not null default 'web',
  appointment_id uuid references appointments(id) on delete set null,
  created_at timestamptz not null default now()
);

create table follow_ups (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  psychologist_id uuid not null references psychologists(id) on delete cascade,
  patient_id uuid references patients(id) on delete set null,
  notes text,
  follow_up_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_patients_psychologist on patients(psychologist_id);
create index idx_availability_psychologist_day on availability_rules(psychologist_id, day_of_week);
create index idx_calendar_events_psychologist_time on calendar_events(psychologist_id, start_at);
create index idx_appointments_psychologist_time on appointments(psychologist_id, start_at);
create index idx_appointments_status_time on appointments(status, start_at);
create index idx_booking_requests_psychologist_status on booking_requests(psychologist_id, status);
create index idx_follow_ups_psychologist_date on follow_ups(psychologist_id, follow_up_at);

create view v_appointment_details as
select
  a.id as appointment_id,
  p.full_name as psychologist_name,
  p.public_slug,
  a.patient_name,
  a.patient_email,
  a.start_at,
  a.end_at,
  a.status,
  a.channel,
  a.whatsapp_opt_in,
  a.reminder_sent,
  a.confirmed_via_whatsapp,
  a.no_show
from appointments a
join psychologists p on p.id = a.psychologist_id;

create view v_psychologist_kpis as
select
  p.id as psychologist_id,
  p.full_name,
  count(a.id) as total_appointments,
  count(*) filter (where a.status = 'completed') as completed_appointments,
  count(*) filter (where a.status = 'cancelled') as cancelled_appointments,
  count(*) filter (where a.status = 'no_show' or a.no_show) as no_show_appointments,
  round(
    (
      100.0 * count(*) filter (where a.status = 'completed')
      / nullif(count(a.id), 0)
    )::numeric,
    2
  ) as completion_rate,
  round(
    (
      100.0 * count(*) filter (where a.status = 'no_show' or a.no_show)
      / nullif(count(a.id), 0)
    )::numeric,
    2
  ) as no_show_rate
from psychologists p
left join appointments a on a.psychologist_id = p.id
group by p.id, p.full_name;
