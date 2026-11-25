-- menface.pro lead retention: delete leads older than 12 months, as the privacy policy promises.
-- Run once in the Supabase SQL editor by the project owner. Needs the pg_cron extension
-- (Dashboard -> Database -> Extensions -> pg_cron, or the line below).
create extension if not exists pg_cron;

-- Daily at 03:15 UTC. Re-running this file replaces the job (same name).
select cron.schedule(
  'menface-leads-retention',
  '15 3 * * *',
  $$delete from public.leads where created_at < now() - interval '12 months'$$
);

-- Check: select jobname, schedule, active from cron.job;
-- History: select status, return_message, start_time from cron.job_run_details order by start_time desc limit 5;
