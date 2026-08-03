-- ─── Consultation Patient Columns ───────────────────────────────
-- Run this in the Supabase SQL Editor to persist "Consult This Patient"
-- entries (who consulted + consultation notes) on consultation leads.
--
-- Required before the consult-patient feature works end to end.

ALTER TABLE consultation_leads
  ADD COLUMN IF NOT EXISTS consulted_by VARCHAR(100),
  ADD COLUMN IF NOT EXISTS consult_notes TEXT,
  ADD COLUMN IF NOT EXISTS consulted_at TIMESTAMPTZ;
